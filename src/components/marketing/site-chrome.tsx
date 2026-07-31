import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-linen/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink no-underline"
        >
          Careshift
        </Link>
        <nav aria-label="Account" className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="touch-target inline-flex items-center px-3 text-sm font-semibold text-ink no-underline"
          >
            Sign in
          </Link>
          <LinkButton href="/sign-up" className="hidden sm:inline-flex px-4 text-sm">
            Sign up
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-linen-deep/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-ink-muted sm:px-6">
        <p className="font-display text-base font-semibold text-ink">Careshift</p>
        <p>A 90-second shift brief for caregivers. Portfolio prototype — fictional data only.</p>
      </div>
    </footer>
  );
}
