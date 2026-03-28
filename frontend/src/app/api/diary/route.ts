import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import { MOODS, type Mood } from "@/src/types/diary";

const isValidMood = (value: string): value is Mood => {
  return MOODS.includes(value as Mood);
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("entries")
    .select("id,title,mood,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
