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
      <section className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
        수정할 일기를 불러오는 중...
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
        <h1 className="text-xl font-bold">수정할 일기를 찾을 수 없습니다.</h1>
        <button
          type="button"
          onClick={() => router.push("/diary")}
          className="mt-4 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
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
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <h1 className="text-2xl font-bold">일기 수정</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium">
            본문
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">기분</legend>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  mood === item
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-zinc-300 hover:bg-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/diary/${id}`)}
            className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
