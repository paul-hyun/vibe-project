import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-sequence-teal"
        >
          나만의 일기장
        </Link>
      </div>
    </header>
  );
}
