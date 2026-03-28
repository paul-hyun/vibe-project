import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    const normalizedPassword = password?.trim() ?? "";

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }
    if (normalizedPassword.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (error) {
      const message = error.message.toLowerCase();
      const duplicateHints =
        message.includes("already") ||
        message.includes("registered") ||
        message.includes("exists") ||
        message.includes("duplicate");
      if (duplicateHints) {
        return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
      }
      if (process.env.NODE_ENV === "development") {
        console.error("[signup] Supabase auth.signUp:", error.message, error);
      }
      return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[signup] request handling error:", err);
    }
    return NextResponse.json({ error: "요청을 처리할 수 없습니다." }, { status: 400 });
  }
}
