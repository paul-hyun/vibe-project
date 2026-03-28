"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DiaryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as { isLoggedIn?: boolean };
        if (!data.isLoggedIn) {
          router.replace("/login");
          return;
        }
        setIsLoggedIn(true);
      } finally {
        setIsChecking(false);
      }
    };

    void checkSession();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (isChecking || !isLoggedIn) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 text-sm font-medium text-sequence-muted shadow-sm">
        인증 상태를 확인하는 중...
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/diary"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            목록
          </Link>
          <Link
            href="/diary/new"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            새 일기 작성
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-lg bg-sequence-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sequence-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </nav>
      {children}
    </div>
  );
}
