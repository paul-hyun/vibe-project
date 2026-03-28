import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          나만의 일기장
        </Link>
      </div>
    </header>
  );
}
