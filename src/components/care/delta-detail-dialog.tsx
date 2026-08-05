"use client";

import { CircleCheckBig, Undo2 } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { DeltaIcon, isAcknowledged, severityStyles } from "@/components/care/delta-visuals";
import { Button } from "@/components/ui/button";
import { Dialog, DialogCloseButton } from "@/components/ui/dialog";
import { TextAreaField } from "@/components/ui/input";
import { formatCategory, formatDateTime, formatSeverity } from "@/lib/format";
import { useCareshift } from "@/lib/store";
import type { Delta, DeltaComparison } from "@/lib/types";

export function DeltaDetailDialog({
  patientId,
  delta,
  onClose,
}: {
  patientId: string;
  delta: Delta | null;
  onClose: () => void;
}) {
  const titleId = useId();

  return (
    <Dialog open={Boolean(delta)} onClose={onClose} labelledBy={titleId}>
      {delta ? (
        <DeltaDetailPanel
          key={delta.id}
          patientId={patientId}
          delta={delta}
          titleId={titleId}
          onClose={onClose}
        />
      ) : null}
    </Dialog>
  );
}

function DeltaDetailPanel({
  patientId,
  delta,
  titleId,
  onClose,
}: {
  patientId: string;
  delta: Delta;
  titleId: string;
  onClose: () => void;
}) {
  const { setDeltaAcknowledged, addDeltaNote } = useCareshift();
  const [draft, setDraft] = useState("");
  const noteFieldId = useId();
  const maxNote = 280;

  const acknowledged = isAcknowledged(delta);
  const notes = delta.notes ?? [];

  function submitNote(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    addDeltaNote(patientId, delta.id, draft);
    setDraft("");
  }

  return (
    <div className="flex max-h-[85svh] flex-col">
      <div className="flex items-start gap-3.5 border-b border-border px-4 py-4 sm:px-6">
        <DeltaIcon delta={delta} size="lg" />
        <div className="min-w-0 flex-1">
          <p className={`type-eyebrow ${severityStyles[delta.severity].label}`}>
            {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
          </p>
          <h2 id={titleId} className="type-h3 mt-1.5 text-ink">
            {delta.summary}
          </h2>
        </div>
        <DialogCloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {delta.detail ? (
          <p className="text-base leading-relaxed text-ink-muted">{delta.detail}</p>
        ) : (
          <p className="text-base leading-relaxed text-ink-subtle">
            No extra detail was recorded with this change.
          </p>
        )}

        {delta.recommendation ? (
          <div className="mt-4 rounded-xl border border-brand/25 bg-brand-soft/60 px-4 py-3.5">
            <p className="type-eyebrow text-brand">Recommended</p>
            <p className="mt-1 text-base leading-relaxed text-ink">{delta.recommendation}</p>
          </div>
        ) : null}

        {delta.comparison ? (
          <ComparisonTabs comparison={delta.comparison} idBase={titleId} />
        ) : null}

        <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <dt className="type-eyebrow text-ink-subtle">Observed</dt>
            <dd className="mt-1 text-base text-ink">
              {delta.observedAt ? formatDateTime(delta.observedAt) : "Not recorded"}
            </dd>
          </div>
          <div>
            <dt className="type-eyebrow text-ink-subtle">Reported by</dt>
            <dd className="mt-1 text-base text-ink">{delta.reportedBy ?? "Not recorded"}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-linen/70 px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-ink">
              {acknowledged ? "Reviewed" : "Not reviewed yet"}
            </p>
            <p className="text-sm text-ink-muted">
              {acknowledged && delta.acknowledgedAt
                ? `${delta.acknowledgedBy ?? "Someone"} · ${formatDateTime(delta.acknowledgedAt)}`
                : "Confirm once you have read this and acted on it."}
            </p>
          </div>
          <Button
            type="button"
            variant={acknowledged ? "secondary" : "primary"}
            onClick={() => setDeltaAcknowledged(patientId, delta.id, !acknowledged)}
          >
            {acknowledged ? (
              <>
                <Undo2 className="size-4.5" aria-hidden="true" />
                Undo
              </>
            ) : (
              <>
                <CircleCheckBig className="size-4.5" aria-hidden="true" />
                Mark reviewed
              </>
            )}
          </Button>
        </div>

        <section aria-labelledby={`${titleId}-notes`} className="mt-6">
          <h3 id={`${titleId}-notes`} className="type-h3 text-ink">
            Notes
            {notes.length > 0 ? (
              <span className="ml-2 text-base font-semibold text-ink-subtle">
                {notes.length}
              </span>
            ) : null}
          </h3>

          {notes.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {notes.map((note) => (
                <li key={note.id} className="rounded-xl border border-border bg-linen/70 px-4 py-3">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-xs font-bold">
                    <span className="text-ink-muted">{note.author}</span>
                    <span className="text-ink-subtle">{formatDateTime(note.at)}</span>
                  </p>
                  <p className="mt-1 text-base leading-relaxed text-ink">{note.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-base text-ink-muted">
              Nothing added yet. Notes stay with this change and travel to the next shift.
            </p>
          )}

          <form onSubmit={submitNote} className="mt-4 space-y-3">
            <TextAreaField
              id={noteFieldId}
              label="Add a note"
              value={draft}
              maxLength={maxNote}
              onChange={(event) => setDraft(event.target.value)}
              hint={`${draft.length} / ${maxNote} characters`}
              placeholder="e.g. Checked the hall again this morning — rug is still put away."
            />
            <Button type="submit" disabled={!draft.trim()}>
              Add note
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

const comparisonTabs = [
  { id: "before", label: "Before", caption: "How it was" },
  { id: "after", label: "After", caption: "How it is now" },
] as const;

type ComparisonTabId = (typeof comparisonTabs)[number]["id"];

/**
 * Before and after share one panel so a phone screen shows a full sentence of
 * either side rather than two truncated columns.
 */
function ComparisonTabs({
  comparison,
  idBase,
}: {
  comparison: DeltaComparison;
  idBase: string;
}) {
  const [active, setActive] = useState<ComparisonTabId>("after");
  const tabRefs = useRef(new Map<ComparisonTabId, HTMLButtonElement | null>());

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const current = comparisonTabs.findIndex((tab) => tab.id === active);
    const next = comparisonTabs[(current + step + comparisonTabs.length) % comparisonTabs.length];
    setActive(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  return (
    <section
      aria-labelledby={`${idBase}-comparison`}
      className="mt-5 overflow-hidden rounded-xl border border-border"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-linen/70 px-3 py-2.5">
        <h3 id={`${idBase}-comparison`} className="type-eyebrow text-ink-subtle">
          Comparison
        </h3>
        <div
          role="tablist"
          aria-label="Compare before and after"
          className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1"
        >
          {comparisonTabs.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current.set(tab.id, node);
                }}
                type="button"
                role="tab"
                id={`${idBase}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${idBase}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={handleKeyDown}
                className={[
                  "touch-target inline-flex items-center justify-center rounded-lg px-3.5 text-sm font-semibold transition",
                  selected
                    ? "bg-brand text-on-brand"
                    : "text-ink-muted hover:bg-linen-deep hover:text-ink",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {comparisonTabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${idBase}-panel-${tab.id}`}
          aria-labelledby={`${idBase}-tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          /** Holds two lines so flipping tabs doesn't shift the panel below. */
          className="min-h-26 px-4 py-3.5"
        >
          <p className="type-eyebrow text-ink-subtle">{tab.caption}</p>
          <p className="mt-1.5 text-base leading-relaxed text-ink">
            {tab.id === "before" ? comparison.before : comparison.after}
          </p>
        </div>
      ))}
    </section>
  );
}
