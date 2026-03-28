"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MOODS, type Mood } from "@/src/types/diary";

export default function DiaryNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("보통");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 본문을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood,
        }),
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "일기를 저장하지 못했습니다.");
        return;
      }

      router.push("/diary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        새 일기 작성
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
            placeholder="오늘 하루를 한 줄로 요약해 보세요"
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
            placeholder="오늘 있었던 일을 자유롭게 적어 보세요"
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
            onClick={() => router.back()}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
