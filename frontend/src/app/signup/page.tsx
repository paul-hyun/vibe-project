"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "회원가입에 실패했습니다.");
        return;
      }

      router.push("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">회원가입</h1>
      <p className="mt-2 text-sm leading-relaxed text-sequence-muted">
        목업 단계에서는 가입 완료 후 로그인 페이지로 이동합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sequence-muted"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sequence-muted"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-sequence-teal focus:ring-2 focus:ring-sequence-mint/25"
            placeholder="8자 이상"
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-sequence-mint px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-sequence-mint-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-sm text-sequence-muted">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="font-semibold text-sequence-teal underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </section>
  );
}
