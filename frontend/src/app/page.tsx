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
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(#004d4d,#004d4d),repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.04)_10px,rgba(255,255,255,0.04)_20px)] px-8 py-14 text-center shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        오늘의 감정을 기록해 보세요
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
        간단한 목업 플로우로 일기 작성부터 수정/삭제까지 확인할 수 있어요.
      </p>

      {isLoading ? (
        <p className="mt-10 text-sm font-medium text-white/70">
          인증 상태를 확인하는 중...
        </p>
      ) : isLoggedIn ? (
        <Link
          href="/diary"
          className="mt-10 inline-flex rounded-lg bg-sequence-mint px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark"
        >
          내 일기 보러 가기
        </Link>
      ) : (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-sequence-mint px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="inline-flex rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            회원가입
          </Link>
        </div>
      )}
    </section>
  );
}
