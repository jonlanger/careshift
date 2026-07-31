"use client";

import { useMemo, useState } from "react";
import { BriefHeader } from "@/components/brief/brief-header";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/input";
import {
  formatCategory,
  formatDateTime,
  formatRelativeTo,
  formatSeverity,
  formatTime,
  windowEndLabel,
} from "@/lib/format";
import type { BriefFixture, BriefStep, DeltaSeverity } from "@/lib/types";

const steps: BriefStep[] = ["covering", "changes", "due", "note"];

const stepTitles: Record<BriefStep, string> = {
  covering: "Who you’re covering",
  changes: "What changed",
  due: "Due now",
  note: "Note & done",
};

const severityStyles: Record<DeltaSeverity, string> = {
  urgent: "bg-urgent-bg text-urgent border-urgent/30",
  watch: "bg-watch-bg text-watch border-watch/30",
  info: "bg-info-bg text-info border-info/30",
};

function sortDeltas(fixture: BriefFixture) {
  const order: DeltaSeverity[] = ["urgent", "watch", "info"];
  return [...fixture.deltas].sort(
    (a, b) => order.indexOf(a.severity) - order.indexOf(b.severity),
  );
}

export function BriefFlow({ fixture }: { fixture: BriefFixture }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState("");
  const [complete, setComplete] = useState(false);
  const [skipEmptyAck, setSkipEmptyAck] = useState(false);

  const step = steps[stepIndex];
  const deltas = useMemo(() => sortDeltas(fixture), [fixture]);
  const hasNoHandoff = !fixture.lastHandoff || fixture.briefStale;
  const showEmpty = step === "changes" && hasNoHandoff && !skipEmptyAck;

  const windowLabel = windowEndLabel(fixture.shiftStart, fixture.dueWindowHours);
  const settingLabel =
    fixture.recipient.setting === "home" ? "Home visit" : "Facility";

  function goNext() {
    if (step === "note") {
      setComplete(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    if (complete) {
      setComplete(false);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-linen shadow-sm md:my-6 md:min-h-[calc(100svh-3rem)] md:overflow-hidden md:rounded-2xl md:border md:border-border">
      <BriefHeader recipientName={fixture.recipient.preferredName} />

      <div className="border-b border-border bg-surface px-4 py-3" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <p className="text-base font-semibold text-ink">{stepTitles[step]}</p>
        <div
          className="mt-3 flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-label="Brief progress"
        >
          {steps.map((s, i) => (
            <span
              key={s}
              className={[
                "h-1.5 flex-1 rounded-full",
                i <= stepIndex ? "bg-cta" : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-5">
        {complete ? (
          <ReadyState
            name={fixture.recipient.preferredName}
            note={note}
            onBack={goBack}
          />
        ) : showEmpty ? (
          <EmptyState
            onContinue={() => {
              setSkipEmptyAck(true);
              goNext();
            }}
          />
        ) : (
          <>
            {step === "covering" ? (
              <CoveringStep
                fixture={fixture}
                settingLabel={settingLabel}
              />
            ) : null}
            {step === "changes" ? <ChangesStep deltas={deltas} /> : null}
            {step === "due" ? (
              <DueStep
                fixture={fixture}
                windowLabel={windowLabel}
              />
            ) : null}
            {step === "note" ? (
              <NoteStep note={note} setNote={setNote} />
            ) : null}
          </>
        )}
      </div>

      {!complete && !showEmpty ? (
        <div className="sticky bottom-0 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <Button type="button" fullWidth onClick={goNext}>
              {step === "note"
                ? "Confirm brief complete"
                : step === "covering"
                  ? "See what changed"
                  : step === "changes"
                    ? "See what’s due"
                    : "Continue to note"}
            </Button>
            {stepIndex > 0 ? (
              <Button type="button" variant="ghost" fullWidth onClick={goBack}>
                Back
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CoveringStep({
  fixture,
  settingLabel,
}: {
  fixture: BriefFixture;
  settingLabel: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-3xl font-semibold tracking-tight text-ink">
          {fixture.recipient.preferredName}
        </p>
        <p className="mt-1 text-lg text-ink-muted">
          {settingLabel}
          {fixture.recipient.roomLabel ? ` · ${fixture.recipient.roomLabel}` : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-ink-muted">You’re covering</p>
        <p className="mt-1 text-base text-ink">
          {fixture.recipient.firstName}
          {fixture.recipient.preferredName !== fixture.recipient.firstName
            ? ` (“${fixture.recipient.preferredName}”)`
            : ""}
        </p>
        <p className="mt-4 text-sm font-semibold text-ink-muted">Shift starts</p>
        <p className="mt-1 text-base text-ink">
          {formatDateTime(fixture.shiftStart)}
        </p>
        <p className="mt-4 text-sm font-semibold text-ink-muted">Last handoff</p>
        {fixture.lastHandoff ? (
          <p className="mt-1 text-base text-ink">
            {formatDateTime(fixture.lastHandoff.at)}
            <span className="block text-ink-muted">by {fixture.lastHandoff.by}</span>
          </p>
        ) : (
          <p className="mt-1 text-base text-ink">No prior handoff on file</p>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink-muted">
        Caregiver: {fixture.caregiver.name}. This brief is for the next few minutes —
        then you’re ready to begin.
      </p>
    </div>
  );
}

function ChangesStep({
  deltas,
}: {
  deltas: BriefFixture["deltas"];
}) {
  return (
    <div className="space-y-4">
      <p className="text-base text-ink-muted">
        Scan these changes since the last handoff. Safety items appear first.
      </p>
      <ul className="space-y-3">
        {deltas.map((delta) => (
          <li
            key={delta.id}
            className={`rounded-xl border px-4 py-3 ${severityStyles[delta.severity]}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide">
              {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
            </p>
            <p className="mt-1 text-base leading-snug text-ink">{delta.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DueStep({
  fixture,
  windowLabel,
}: {
  fixture: BriefFixture;
  windowLabel: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-base text-ink-muted">
        Due in the next {fixture.dueWindowHours} hours · until {windowLabel}
      </p>
      <ul className="space-y-3">
        {fixture.dueNow.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  {item.type === "med" ? "Medication" : "Task"}
                </p>
                <p className="mt-1 text-base font-semibold leading-snug text-ink">
                  {item.label}
                </p>
              </div>
              <p className="shrink-0 text-right text-sm font-semibold text-ink">
                {formatTime(item.dueAt)}
                <span className="block font-medium text-ink-muted">
                  {formatRelativeTo(item.dueAt, fixture.shiftStart)}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoteStep({
  note,
  setNote,
}: {
  note: string;
  setNote: (value: string) => void;
}) {
  const max = 280;
  return (
    <div className="space-y-4">
      <p className="text-base text-ink-muted">
        Optional — one short note for the next person. You can skip this.
      </p>
      <TextAreaField
        id="handoff-note"
        label="Note for next caregiver"
        value={note}
        maxLength={max}
        onChange={(e) => setNote(e.target.value)}
        hint={`${note.length} / ${max} characters`}
        placeholder="e.g. Prefers lamp lighting after 8pm."
      />
    </div>
  );
}

function EmptyState({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="rounded-xl border border-watch/40 bg-watch-bg px-4 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-watch">
          No prior handoff
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
          Start a fresh brief
        </h2>
        <p className="mt-2 text-base leading-relaxed text-ink-muted">
          There’s no recent handoff on file. Continue to see what’s due now, then leave a
          note so the next person isn’t starting cold.
        </p>
      </div>
      <Button type="button" fullWidth onClick={onContinue}>
        Continue to due now
      </Button>
    </div>
  );
}

function ReadyState({
  name,
  note,
  onBack,
}: {
  name: string;
  note: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success">
        <span className="text-2xl font-bold" aria-hidden="true">
          ✓
        </span>
      </div>
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Brief complete
        </h2>
        <p className="mt-2 text-lg text-ink-muted">
          You’re ready for {name}.
        </p>
      </div>
      {note.trim() ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
            Your note
          </p>
          <p className="mt-1 text-base text-ink">{note}</p>
        </div>
      ) : null}
      <Button type="button" variant="secondary" fullWidth onClick={onBack}>
        Review brief
      </Button>
    </div>
  );
}
