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
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <h1 className="text-2xl font-bold">새 일기 작성</h1>

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
            placeholder="오늘 하루를 한 줄로 요약해 보세요"
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
            placeholder="오늘 있었던 일을 자유롭게 적어 보세요"
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
            onClick={() => router.back()}
            className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
