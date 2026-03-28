import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import { MOODS, type Mood } from "@/src/types/diary";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const isValidMood = (value: string): value is Mood => {
  return MOODS.includes(value as Mood);
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "일기를 불러오지 못했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "일기를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
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
      .update({
        title: normalizedTitle,
        content: normalizedContent,
        mood: normalizedMood,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "일기를 수정하지 못했습니다." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "일기를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "요청을 처리할 수 없습니다." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "일기를 삭제하지 못했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "일기를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
