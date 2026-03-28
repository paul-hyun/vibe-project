"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return entries;
    }
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) || entry.mood.toLowerCase().includes(q),
    );
  }, [entries, searchQuery]);

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
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          일기 목록
        </h1>
        <Link
          href="/diary/new"
          className="inline-flex rounded-lg bg-sequence-mint px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark"
        >
          새 일기 작성
        </Link>
      </div>

      {isLoading ? (
        <p className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center text-sm font-medium text-sequence-muted">
          일기 목록을 불러오는 중...
        </p>
      ) : error ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center text-sm font-medium text-red-700">
          {error}
        </p>
      ) : entries.length === 0 ? (
        <p className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center text-sm font-medium text-sequence-muted">
          아직 작성된 일기가 없습니다.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <label
              htmlFor="diary-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              제목 또는 기분 검색
            </label>
            <input
              id="diary-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="예: 행복, 회의…"
              autoComplete="off"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sequence-mint focus:bg-white focus:outline-none focus:ring-2 focus:ring-sequence-mint/30"
            />
          </div>
          {filteredEntries.length === 0 ? (
            <p className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center text-sm font-medium text-sequence-muted">
              검색 결과가 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredEntries.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/diary/${entry.id}`}
                    className="block rounded-2xl border border-gray-100 px-5 py-4 transition hover:border-sequence-mint/50 hover:bg-emerald-50/40"
                  >
                    <p className="font-semibold text-gray-900">{entry.title}</p>
                    <p className="mt-1.5 text-sm text-sequence-muted">
                      기분: {entry.mood}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      작성일: {formatDate(entry.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
