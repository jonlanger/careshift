import type { ReactNode } from "react";
import { formatPatientStatus, formatShiftStatus } from "@/lib/format";
import type { PatientStatus, ShiftStatus } from "@/lib/types";

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <Tag
      className={[
        "rounded-2xl border border-border bg-surface p-4 sm:p-5",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="type-eyebrow text-ink-muted">{eyebrow}</p>
        ) : null}
        <h2 className="type-h2 mt-1 text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/**
 * Status is encoded three ways: glyph, text label, and weight — color is the
 * last layer, never the only one.
 */
const patientStatusStyles: Record<PatientStatus, { glyph: string; tone: string }> = {
  attention: { glyph: "!", tone: "border-alert/40 bg-alert-soft text-alert" },
  "needs-brief": { glyph: "○", tone: "border-border-strong bg-linen-deep text-ink-muted" },
  briefed: { glyph: "✓", tone: "border-brand/40 bg-brand-soft text-brand" },
};

export function StatusPill({ status }: { status: PatientStatus }) {
  const { glyph, tone } = patientStatusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      <span aria-hidden="true">{glyph}</span>
      {formatPatientStatus(status)}
    </span>
  );
}

const shiftStatusStyles: Record<ShiftStatus, { glyph: string; tone: string }> = {
  covered: { glyph: "✓", tone: "border-brand/40 bg-brand-soft text-brand" },
  open: { glyph: "!", tone: "border-alert/40 bg-alert-soft text-alert" },
  "swap-requested": {
    glyph: "⇄",
    tone: "border-border-strong bg-linen-deep text-ink-muted",
  },
};

export function ShiftStatusPill({ status }: { status: ShiftStatus }) {
  const { glyph, tone } = shiftStatusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      <span aria-hidden="true">{glyph}</span>
      {formatShiftStatus(status)}
    </span>
  );
}

export function Avatar({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linen-deep text-base font-bold text-ink"
    >
      {label}
    </span>
  );
}
