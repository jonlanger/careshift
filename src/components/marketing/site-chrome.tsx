import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-linen/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink no-underline sm:text-2xl"
        >
          Careshift
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
            <Link href="#ritual" className="text-base font-semibold text-ink-muted no-underline hover:text-ink">
              The ritual
            </Link>
            <Link href="#coordinate" className="text-base font-semibold text-ink-muted no-underline hover:text-ink">
              Coordination
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="touch-target inline-flex items-center px-3 text-sm font-semibold text-ink no-underline sm:text-base"
            >
              Sign in
            </Link>
            <LinkButton href="/sign-up" className="px-4 text-sm sm:text-base">
              Sign up
            </LinkButton>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-linen-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Careshift</p>
          <p className="mt-1 max-w-md text-base text-ink-muted">
            Know what changed before you begin. A 90-second brief for caregivers.
          </p>
        </div>
        <p className="text-sm text-ink-muted">
          Portfolio prototype — fictional data, no real clinical records.
        </p>
      </div>
    </footer>
  );
}
