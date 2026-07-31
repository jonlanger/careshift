import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="atmosphere flex min-h-svh flex-col">
      <header className="px-4 py-5 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink no-underline sm:text-2xl"
        >
          Careshift
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-12 sm:px-6">
        {children}
      </main>
    </div>
  );
}
