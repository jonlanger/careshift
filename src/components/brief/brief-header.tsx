"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearDemoSession } from "@/lib/session-client";

export function BriefHeader({ recipientName }: { recipientName: string }) {
  const router = useRouter();

  function signOut() {
    clearDemoSession();
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
      <div className="min-w-0">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink no-underline"
        >
          Careshift
        </Link>
        <p className="truncate text-sm text-ink-muted">Brief for {recipientName}</p>
      </div>
      <button
        type="button"
        onClick={signOut}
        className="touch-target shrink-0 rounded-lg px-3 text-sm font-semibold text-ink-muted hover:text-ink"
      >
        Sign out
      </button>
    </header>
  );
}
