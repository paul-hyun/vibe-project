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
      <section className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
        일기 상세를 불러오는 중...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </section>
    );
  }

  if (!entry) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-bold">일기를 찾을 수 없습니다.</h1>
        <Link href="/diary" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <h1 className="text-2xl font-bold">{entry.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">기분: {entry.mood}</p>
      <p className="mt-1 text-xs text-zinc-500">작성일: {formatDateTime(entry.created_at)}</p>

      <article className="mt-5 whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 leading-7 text-zinc-800">
        {entry.content}
      </article>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/diary/${entry.id}/edit`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          삭제
        </button>
        <Link
          href="/diary"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
