"use client";

import { useRouter } from "next/navigation";
import { FormEvent, use, useEffect, useState } from "react";
import { MOODS, type Entry, type Mood } from "@/src/types/diary";

interface DiaryEditPageProps {
  params: Promise<{ id: string }>;
}

export default function DiaryEditPage({ params }: DiaryEditPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [entry, setEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("보통");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setTitle(data.title);
        setContent(data.content);
        setMood(data.mood);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEntry();
  }, [id, router]);

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 text-sm font-medium text-sequence-muted shadow-sm">
        수정할 일기를 불러오는 중...
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
          수정할 일기를 찾을 수 없습니다.
        </h1>
        <button
          type="button"
          onClick={() => router.push("/diary")}
          className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          목록으로 이동
        </button>
      </section>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 본문을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/diary/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "일기를 수정하지 못했습니다.");
        return;
      }

      router.push(`/diary/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        일기 수정
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sequence-muted"
          >
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sequence-muted"
          >
            본문
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-sequence-muted">
            기분
          </legend>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  mood === item
                    ? "border-sequence-teal bg-emerald-50/80 text-sequence-teal shadow-sm"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-sequence-mint px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/diary/${id}`)}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
