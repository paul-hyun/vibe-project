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
      <section className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        인증 상태를 확인하는 중...
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <nav className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex gap-2 text-sm">
          <Link
            href="/diary"
            className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100"
          >
            목록
          </Link>
          <Link
            href="/diary/new"
            className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100"
          >
            새 일기 작성
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-900"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </nav>
      {children}
    </div>
  );
}
