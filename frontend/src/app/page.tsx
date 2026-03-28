"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionPayload {
  isLoggedIn: boolean;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as SessionPayload;
        setIsLoggedIn(Boolean(data.isLoggedIn));
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();
  }, []);

  return (
    <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center">
      <h1 className="text-3xl font-bold">오늘의 감정을 기록해 보세요</h1>
      <p className="mt-3 text-zinc-600">
        간단한 목업 플로우로 일기 작성부터 수정/삭제까지 확인할 수 있어요.
      </p>

      {isLoading ? (
        <p className="mt-8 text-sm text-zinc-500">인증 상태를 확인하는 중...</p>
      ) : isLoggedIn ? (
        <Link
          href="/diary"
          className="mt-8 rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          내 일기 보러 가기
        </Link>
      ) : (
        <div className="mt-8 flex gap-3">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            회원가입
          </Link>
        </div>
      )}
    </section>
  );
}
