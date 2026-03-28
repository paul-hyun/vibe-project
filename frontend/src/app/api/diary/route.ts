import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import { MOODS, type Mood } from "@/src/types/diary";

const isValidMood = (value: string): value is Mood => {
  return MOODS.includes(value as Mood);
};

const MAX_SEARCH_LEN = 200;

/**
 * 검색어 길이를 제한하고, Unicode 글자·숫자·공백만 남긴다.
 * PostgREST `.or()` 구문(쉼표·점·괄호 등)과 ILIKE 와일드카드(% _)를 건드릴 수 있는 문자는 제거한다.
 */
function sanitizeSearchTerm(raw: string): string {
  let s = raw.trim().slice(0, MAX_SEARCH_LEN);
  s = s.replace(/[^\p{L}\p{N}\s]/gu, " ");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * PostgREST 필터 값에 예약 문자가 포함될 수 있을 때 큰따옴표로 감싼다.
 * @see https://postgrest.org/en/stable/references/api/url_grammar.html#reserved-characters
 */
function quotePostgrestFilterValue(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const url = new URL(request.url);
  const term = sanitizeSearchTerm(url.searchParams.get("q") ?? "");

  let query = supabase
    .from("entries")
    .select("id,title,mood,created_at")
    .eq("user_id", user.id);

  if (term.length > 0) {
    const pattern = `%${term}%`;
    const quoted = quotePostgrestFilterValue(pattern);
    query = query.or(
      `title.ilike.${quoted},content.ilike.${quoted},mood.ilike.${quoted}`,
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "일기 목록을 불러오지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const { title, content, mood } = (await request.json()) as {
      title?: string;
      content?: string;
      mood?: string;
    };

    const normalizedTitle = title?.trim() ?? "";
    const normalizedContent = content?.trim() ?? "";
    const normalizedMood = mood?.trim() ?? "";

    if (!normalizedTitle || !normalizedContent || !isValidMood(normalizedMood)) {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        title: normalizedTitle,
        content: normalizedContent,
        mood: normalizedMood,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "일기를 저장하지 못했습니다." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "요청을 처리할 수 없습니다." }, { status: 400 });
  }
}
