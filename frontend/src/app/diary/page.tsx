"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Mood } from "@/src/types/diary";

const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

interface DiaryListItem {
  id: string;
  title: string;
  mood: Mood;
  created_at: string;
}

export default function DiaryListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      setError("");
      try {
        const response = await fetch("/api/diary", { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "일기 목록을 불러오지 못했습니다.");
          return;
        }
        const data = (await response.json()) as { entries: DiaryListItem[] };
        setEntries(data.entries ?? []);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEntries();
  }, [router]);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">일기 목록</h1>
        <Link
          href="/diary/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          새 일기 작성
        </Link>
      </div>

      {isLoading ? (
        <p className="rounded-md bg-zinc-100 px-4 py-6 text-center text-zinc-600">
          일기 목록을 불러오는 중...
        </p>
      ) : error ? (
        <p className="rounded-md bg-red-50 px-4 py-6 text-center text-red-700">{error}</p>
      ) : entries.length === 0 ? (
        <p className="rounded-md bg-zinc-100 px-4 py-6 text-center text-zinc-600">
          아직 작성된 일기가 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/diary/${entry.id}`}
                className="block rounded-lg border border-zinc-200 px-4 py-3 hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="font-semibold text-zinc-900">{entry.title}</p>
                <p className="mt-1 text-sm text-zinc-600">기분: {entry.mood}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  작성일: {formatDate(entry.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
