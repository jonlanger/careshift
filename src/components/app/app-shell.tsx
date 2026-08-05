"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Users,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useCareshift } from "@/lib/store";
import { clearDemoSession } from "@/lib/session-client";

const navItems = [
  { href: "/today", label: "Today", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/shifts", label: "Shifts", icon: Clock3 },
];

const SIDEBAR_KEY = "careshift:sidebar-collapsed";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCollapsedState(window.localStorage.getItem(SIDEBAR_KEY) === "1");
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
    setCollapsedState(next);
  }, []);

  return [collapsed, setCollapsed] as const;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { caregiverName } = useCareshift();
  const [collapsed, setCollapsed] = useSidebarCollapsed();

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

      {/* Desktop sidebar — pinned; collapses to icons */}
      <aside
        className={[
          "hidden shrink-0 border-r border-border bg-surface md:sticky md:top-0 md:flex md:h-svh md:flex-col md:self-start md:overflow-y-auto md:overflow-x-hidden",
          "transition-[width] duration-200 ease-out",
          collapsed ? "md:w-[4.5rem]" : "md:w-60 lg:w-68",
        ].join(" ")}
      >
        <div
          className={[
            "flex border-b border-border",
            collapsed ? "flex-col items-center gap-3 px-2 py-4" : "items-start justify-between gap-2 px-4 py-5",
          ].join(" ")}
        >
          <div className={collapsed ? "text-center" : "min-w-0"}>
            <Link
              href="/today"
              className={[
                "font-display font-semibold text-ink no-underline",
                collapsed ? "text-lg" : "text-2xl",
              ].join(" ")}
              title="Careshift"
            >
              {collapsed ? "Cs" : "Careshift"}
            </Link>
            {!collapsed ? (
              <p className="mt-1 truncate text-sm text-ink-muted">{caregiverName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar-nav"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="touch-target grid size-10 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-linen-deep hover:text-ink"
          >
            {collapsed ? (
              <ChevronRight className="size-5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </button>
        </div>

        <nav id="app-sidebar-nav" aria-label="Main" className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                    className={[
                      "touch-target flex items-center rounded-xl text-base font-semibold no-underline transition",
                      collapsed ? "justify-center px-0" : "gap-3 px-3",
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-ink-muted hover:bg-linen-deep hover:text-ink",
                    ].join(" ")}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" strokeWidth={2} />
                    <span className={collapsed ? "sr-only" : ""}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border px-2 py-4">
          <button
            type="button"
            onClick={signOut}
            title="Sign out"
            className={[
              "touch-target flex w-full items-center rounded-xl text-base font-semibold text-ink-muted transition hover:bg-linen-deep hover:text-ink",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
            ].join(" ")}
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" strokeWidth={2} />
            <span className={collapsed ? "sr-only" : ""}>Sign out</span>
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
        <ul className="mx-auto flex max-w-lg">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.65rem] font-bold no-underline sm:text-xs",
                    active ? "text-brand" : "text-ink-muted",
                  ].join(" ")}
                >
                  <Icon className="size-5" aria-hidden="true" strokeWidth={2} />
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
