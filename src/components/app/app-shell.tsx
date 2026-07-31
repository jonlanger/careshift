"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCareshift } from "@/lib/store";
import { clearDemoSession } from "@/lib/session-client";

const navItems = [
  { href: "/today", label: "Today", glyph: "◧" },
  { href: "/patients", label: "Patients", glyph: "☰" },
  { href: "/shifts", label: "Shifts", glyph: "◔" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { caregiverName } = useCareshift();

  function signOut() {
    clearDemoSession();
    router.push("/");
  }

  return (
    <div className="min-h-svh md:flex">
      <a
        href="#app-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-md md:hidden">
        <Link href="/today" className="font-display text-xl font-semibold text-ink no-underline">
          Careshift
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="touch-target rounded-lg px-3 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          Sign out
        </button>
      </header>

      {/* Desktop sidebar — pinned to the viewport so only main scrolls */}
      <aside className="hidden shrink-0 border-r border-border bg-surface md:sticky md:top-0 md:flex md:h-svh md:w-60 md:flex-col md:self-start md:overflow-y-auto lg:w-68">
        <div className="border-b border-border px-5 py-5">
          <Link href="/today" className="font-display text-2xl font-semibold text-ink no-underline">
            Careshift
          </Link>
          <p className="mt-1 text-sm text-ink-muted">{caregiverName}</p>
        </div>
        <nav aria-label="Main" className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "touch-target flex items-center gap-3 rounded-xl px-3 text-base font-semibold no-underline transition",
                      active
                        ? "bg-brand text-on-brand"
                        : "text-ink-muted hover:bg-linen-deep hover:text-ink",
                    ].join(" ")}
                  >
                    <span aria-hidden="true" className="text-lg">
                      {item.glyph}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border px-3 py-4">
          <button
            type="button"
            onClick={signOut}
            className="touch-target flex w-full items-center gap-3 rounded-xl px-3 text-base font-semibold text-ink-muted hover:bg-linen-deep hover:text-ink"
          >
            <span aria-hidden="true" className="text-lg">
              ⏏
            </span>
            Sign out
          </button>
        </div>
      </aside>

      <main id="app-main" className="min-w-0 flex-1 pb-14 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs font-bold no-underline",
                    active ? "text-brand" : "text-ink-muted",
                  ].join(" ")}
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    {item.glyph}
                  </span>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={[
                      "mt-0.5 h-0.5 w-6 rounded-full",
                      active ? "bg-brand" : "bg-transparent",
                    ].join(" ")}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? <p className="type-eyebrow text-ink-muted">{eyebrow}</p> : null}
          <h1 className="type-h1 mt-1.5 text-ink">{title}</h1>
          {description ? (
            <p className="type-lead mt-2 max-w-2xl text-ink-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 pb-12 pt-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}
