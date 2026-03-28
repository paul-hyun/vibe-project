"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { Entry } from "@/src/types/diary";

interface DiaryDetailPageProps {
  params: Promise<{ id: string }>;
}

const formatDateTime = (isoDate: string): string => {
  return new Date(isoDate).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      setError("");
      try {
        const response = await fetch(`/api/diary/${id}`, { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (response.status === 404) {
          setEntry(null);
          return;
        }
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "일기를 불러오지 못했습니다.");
          return;
        }
        const data = (await response.json()) as Entry;
        setEntry(data);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEntry();
  }, [id, router]);

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 일기를 삭제할까요?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/diary/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "일기를 삭제하지 못했습니다.");
      return;
    }
    router.push("/diary");
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 text-sm font-medium text-sequence-muted shadow-sm">
        일기 상세를 불러오는 중...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-100 bg-red-50 p-8 text-sm font-medium text-red-700 shadow-sm">
        {error}
      </section>
    );
  }

  if (!entry) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          일기를 찾을 수 없습니다.
        </h1>
        <Link
          href="/diary"
          className="mt-5 inline-block text-sm font-semibold text-sequence-teal underline-offset-4 hover:underline"
        >
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {entry.title}
      </h1>
      <p className="mt-3 text-sm font-medium text-sequence-muted">
        기분: {entry.mood}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        작성일: {formatDateTime(entry.created_at)}
      </p>

      <article className="mt-6 whitespace-pre-wrap rounded-2xl border border-gray-100 bg-gray-50/80 p-5 leading-7 text-gray-800">
        {entry.content}
      </article>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/diary/${entry.id}/edit`}
          className="inline-flex rounded-lg bg-sequence-mint px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          삭제
        </button>
        <Link
          href="/diary"
          className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
