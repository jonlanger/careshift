"use client";

import {
  ChevronRight,
  Circle,
  CircleCheckBig,
  LayoutGrid,
  MessageSquare,
  Rows3,
} from "lucide-react";
import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { DeltaDetailDialog } from "@/components/care/delta-detail-dialog";
import {
  DeltaIcon,
  isAcknowledged,
  noteCount,
  severityStyles,
  sortDeltas,
} from "@/components/care/delta-visuals";
import { Card } from "@/components/ui/primitives";
import { formatCategory, formatSeverity, formatTime } from "@/lib/format";
import { useCareshift } from "@/lib/store";
import type { Delta } from "@/lib/types";

export { sortDeltas };

type DeltaView = "card" | "list";

const VIEW_STORAGE_KEY = "careshift:changes-view";
const VIEW_CHANGE_EVENT = "careshift:changes-view-change";

function subscribeToView(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(VIEW_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(VIEW_CHANGE_EVENT, onChange);
  };
}

function readStoredView() {
  const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
  return stored === "card" || stored === "list" ? stored : null;
}

/** Layout choice is a browser preference, so it lives in storage, not the store. */
function useDeltaView(defaultView: DeltaView) {
  const stored = useSyncExternalStore(subscribeToView, readStoredView, () => null);

  const choose = useCallback((next: DeltaView) => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
  }, []);

  return [stored ?? defaultView, choose] as const;
}

/**
 * Heading, layout switch, review progress, and the list itself — kept together
 * so every surface that shows changes behaves the same way.
 */
export function DeltaSection({
  patientId,
  deltas,
  title,
  titleId,
  titleLevel = 2,
  titleClassName = "type-h3",
  description,
  action,
  defaultView = "card",
  emptyMessage = "Nothing recorded yet. The first brief will start the history.",
}: {
  patientId: string;
  deltas: Delta[];
  title?: string;
  titleId?: string;
  titleLevel?: 2 | 3;
  titleClassName?: string;
  description?: ReactNode;
  action?: ReactNode;
  defaultView?: DeltaView;
  emptyMessage?: string;
}) {
  const [view, setView] = useDeltaView(defaultView);
  const [openId, setOpenId] = useState<string | null>(null);
  const Heading = titleLevel === 3 ? "h3" : "h2";

  const reviewed = deltas.filter(isAcknowledged).length;
  const activeDelta = deltas.find((delta) => delta.id === openId) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          {title ? (
            <Heading id={titleId} className={`${titleClassName} text-ink`}>
              {title}
            </Heading>
          ) : null}
          {description ? (
            <div className="mt-1 text-ink-muted">{description}</div>
          ) : null}
          {deltas.length > 0 ? (
            <p className="mt-1 text-sm font-semibold text-ink-subtle" aria-live="polite">
              {reviewed} of {deltas.length} reviewed
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {action}
          {deltas.length > 0 ? <ViewToggle value={view} onChange={setView} /> : null}
        </div>
      </div>

      {deltas.length > 0 ? (
        <DeltaList
          patientId={patientId}
          deltas={deltas}
          view={view}
          onOpen={setOpenId}
        />
      ) : (
        <Card>
          <p className="text-base text-ink-muted">{emptyMessage}</p>
        </Card>
      )}

      <DeltaDetailDialog
        patientId={patientId}
        delta={activeDelta}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}

export function DeltaList({
  patientId,
  deltas,
  view = "card",
  onOpen,
}: {
  patientId: string;
  deltas: Delta[];
  view?: DeltaView;
  onOpen: (deltaId: string) => void;
}) {
  const { setDeltaAcknowledged } = useCareshift();
  const sorted = sortDeltas(deltas);

  const toggle = (delta: Delta) =>
    setDeltaAcknowledged(patientId, delta.id, !isAcknowledged(delta));

  if (view === "list") {
    return (
      <ul className="space-y-2">
        {sorted.map((delta) => (
          <DeltaRow
            key={delta.id}
            delta={delta}
            onOpen={() => onOpen(delta.id)}
            onToggle={() => toggle(delta)}
          />
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {sorted.map((delta) => (
        <DeltaCard
          key={delta.id}
          delta={delta}
          onOpen={() => onOpen(delta.id)}
          onToggle={() => toggle(delta)}
        />
      ))}
    </ul>
  );
}

function DeltaCard({
  delta,
  onOpen,
  onToggle,
}: {
  delta: Delta;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const acknowledged = isAcknowledged(delta);
  const notes = noteCount(delta);

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-2xl border bg-surface transition ${
        acknowledged ? "border-border" : severityStyles[delta.severity].card
      }`}
    >
      <div className="flex flex-1 items-start gap-3.5 p-4 sm:p-5">
        <DeltaIcon delta={delta} />
        <div className="min-w-0 flex-1">
          <p className={`type-eyebrow ${severityStyles[delta.severity].label}`}>
            {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
          </p>
          <p
            className={`mt-1.5 text-base font-semibold leading-snug sm:text-lg ${
              acknowledged ? "text-ink-muted" : "text-ink"
            }`}
          >
            {delta.summary}
          </p>
          {delta.detail ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
              {delta.detail}
            </p>
          ) : null}
          {delta.recommendation ? (
            <p className="mt-2 rounded-lg border border-brand/25 bg-brand-soft/60 px-3 py-2 text-sm leading-snug text-ink">
              <span className="font-bold text-brand">Recommended: </span>
              {delta.recommendation}
            </p>
          ) : null}
          <Meta delta={delta} className="mt-2.5" />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-linen/60 px-2.5 py-2">
        <AcknowledgeButton delta={delta} onToggle={onToggle} />
        <button
          type="button"
          onClick={onOpen}
          className="touch-target ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-muted transition hover:bg-linen-deep hover:text-ink"
        >
          {notes > 0 ? (
            <>
              <MessageSquare className="size-4" aria-hidden="true" />
              {`${notes} ${notes === 1 ? "note" : "notes"}`}
            </>
          ) : (
            "Details"
          )}
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="sr-only">for {delta.summary}</span>
        </button>
      </div>
    </li>
  );
}

function DeltaRow({
  delta,
  onOpen,
  onToggle,
}: {
  delta: Delta;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const acknowledged = isAcknowledged(delta);
  const notes = noteCount(delta);

  return (
    <li
      className={`relative flex items-center gap-3 rounded-xl border bg-surface pl-3 pr-1.5 transition ${
        acknowledged ? "border-border" : severityStyles[delta.severity].card
      }`}
    >
      <DeltaIcon delta={delta} size="sm" />
      <div className="min-w-0 flex-1 py-2.5">
        <p
          className={`type-eyebrow text-xs ${severityStyles[delta.severity].label}`}
        >
          {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
        </p>
        <p
          className={`mt-1 truncate text-base font-semibold ${
            acknowledged ? "text-ink-muted" : "text-ink"
          }`}
        >
          {delta.summary}
        </p>
      </div>

      {notes > 0 ? (
        <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-ink-subtle sm:inline-flex">
          <MessageSquare className="size-4" aria-hidden="true" />
          {notes}
          <span className="sr-only">{notes === 1 ? "note" : "notes"}</span>
        </span>
      ) : null}

      <div className="relative z-10">
        <AcknowledgeButton delta={delta} onToggle={onToggle} compact />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="touch-target grid shrink-0 place-items-center rounded-xl text-ink-muted transition after:absolute after:inset-0 after:rounded-xl hover:text-ink"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
        <span className="sr-only">Open details for {delta.summary}</span>
      </button>
    </li>
  );
}

function Meta({ delta, className = "" }: { delta: Delta; className?: string }) {
  const acknowledged = isAcknowledged(delta);

  if (acknowledged && delta.acknowledgedAt) {
    return (
      <p className={`text-xs font-bold text-brand ${className}`}>
        Reviewed by {delta.acknowledgedBy ?? "someone"} ·{" "}
        {formatTime(delta.acknowledgedAt)}
      </p>
    );
  }

  if (!delta.observedAt && !delta.reportedBy) return null;

  return (
    <p className={`text-xs font-bold text-ink-subtle ${className}`}>
      {delta.observedAt ? formatTime(delta.observedAt) : null}
      {delta.observedAt && delta.reportedBy ? " · " : null}
      {delta.reportedBy}
    </p>
  );
}

function AcknowledgeButton({
  delta,
  onToggle,
  compact = false,
}: {
  delta: Delta;
  onToggle: () => void;
  compact?: boolean;
}) {
  const acknowledged = isAcknowledged(delta);
  const Icon = acknowledged ? CircleCheckBig : Circle;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={acknowledged}
      className={[
        "touch-target inline-flex items-center gap-2 rounded-xl border-2 font-semibold transition",
        compact ? "justify-center px-0" : "px-3 text-sm",
        acknowledged
          ? "border-brand/40 bg-brand-soft text-brand hover:border-brand"
          : "border-transparent text-ink-muted hover:border-border-strong hover:text-ink",
      ].join(" ")}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" strokeWidth={2.25} />
      <span className={compact ? "sr-only" : ""}>
        {acknowledged ? "Reviewed" : "Mark reviewed"}
      </span>
      {compact ? <span className="sr-only">· {delta.summary}</span> : null}
    </button>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: DeltaView;
  onChange: (next: DeltaView) => void;
}) {
  const options = [
    { id: "card" as const, label: "Cards", icon: LayoutGrid },
    { id: "list" as const, label: "List", icon: Rows3 },
  ];

  return (
    <div
      role="group"
      aria-label="Change layout"
      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-border bg-surface p-1"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={[
              "touch-target inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold transition sm:px-3",
              active
                ? "bg-brand text-on-brand"
                : "text-ink-muted hover:bg-linen-deep hover:text-ink",
            ].join(" ")}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
