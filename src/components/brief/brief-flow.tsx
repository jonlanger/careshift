"use client";

import Link from "next/link";
import { useState } from "react";
import { DeltaSection } from "@/components/care/delta-list";
import { isAcknowledged } from "@/components/care/delta-visuals";
import { DueList } from "@/components/care/due-list";
import { Button, LinkButton } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/input";
import { Card } from "@/components/ui/primitives";
import { formatDateTime, settingLabel, windowEndLabel } from "@/lib/format";
import { useCareshift } from "@/lib/store";
import type { BriefStep, Patient } from "@/lib/types";

const steps: BriefStep[] = ["covering", "changes", "due", "note"];

const stepTitles: Record<BriefStep, string> = {
  covering: "Who you’re covering",
  changes: "What changed",
  due: "Due now",
  note: "Note & done",
};

const nextLabels: Record<BriefStep, string> = {
  covering: "See what changed",
  changes: "See what’s due",
  due: "Continue to note",
  note: "Confirm brief complete",
};

export function BriefFlow({ patient }: { patient: Patient }) {
  const { markBriefed } = useCareshift();
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState("");
  const [complete, setComplete] = useState(false);
  const [emptyAcknowledged, setEmptyAcknowledged] = useState(false);

  const step = steps[stepIndex];
  const hasNoHandoff = !patient.lastHandoff || patient.briefStale;
  const showEmpty = step === "changes" && hasNoHandoff && !emptyAcknowledged;

  const unreviewedAttention = patient.deltas.filter(
    (delta) => delta.severity === "attention" && !isAcknowledged(delta),
  );
  const blocked = step === "changes" && unreviewedAttention.length > 0;

  function goNext() {
    if (blocked) return;
    if (step === "note") {
      markBriefed(patient.id);
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
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border bg-surface px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-baseline justify-between gap-3">
            <p className="type-eyebrow text-ink-muted">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <Link
              href={`/patients/${patient.id}`}
              className="text-sm font-semibold text-brand"
            >
              Full record
            </Link>
          </div>
          <p className="type-h3 mt-1 text-ink" aria-live="polite">
            {stepTitles[step]}
          </p>
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
                  i <= stepIndex ? "bg-brand" : "bg-border",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-2xl">
          {complete ? (
            <ReadyState patient={patient} note={note} onBack={goBack} />
          ) : showEmpty ? (
            <EmptyState
              onContinue={() => {
                setEmptyAcknowledged(true);
                setStepIndex(steps.indexOf("due"));
              }}
            />
          ) : (
            <>
              {step === "covering" ? <CoveringStep patient={patient} /> : null}
              {step === "changes" ? (
                <DeltaSection
                  patientId={patient.id}
                  deltas={patient.deltas}
                  description={
                    <p className="type-lead">
                      Changes since the last handoff. Safety items come first.
                    </p>
                  }
                />
              ) : null}
              {step === "due" ? (
                <div className="space-y-4">
                  <p className="type-lead text-ink-muted">
                    Due in the next {patient.dueWindowHours} hours · until{" "}
                    {windowEndLabel(patient.shiftStart, patient.dueWindowHours)}
                  </p>
                  <DueList items={patient.dueNow} referenceIso={patient.shiftStart} />
                </div>
              ) : null}
              {step === "note" ? <NoteStep note={note} setNote={setNote} /> : null}
            </>
          )}
        </div>
      </div>

      {!complete && !showEmpty ? (
        <div className="sticky bottom-14 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-md sm:px-6 md:bottom-0 lg:px-10">
          <div className="mx-auto max-w-2xl">
            {blocked ? (
              <p className="mb-2 text-sm font-semibold text-alert" aria-live="polite">
                Review {unreviewedAttention.length === 1 ? "the needs-attention item" : `all ${unreviewedAttention.length} needs-attention items`} to continue.
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
              <Button
                type="button"
                size="lg"
                fullWidth
                onClick={goNext}
                disabled={blocked}
                aria-disabled={blocked}
                className="sm:flex-1"
              >
                {nextLabels[step]}
              </Button>
              {stepIndex > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={goBack}
                  className="sm:w-auto sm:px-6"
                >
                  Back
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CoveringStep({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="type-display text-ink">{patient.preferredName}</p>
        <p className="type-lead mt-2 text-ink-muted">
          {settingLabel(patient.setting)}
          {patient.roomLabel ? ` · ${patient.roomLabel}` : ""}
        </p>
      </div>

      <Card className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="type-eyebrow text-ink-subtle">You’re covering</p>
          <p className="mt-1 text-base text-ink">
            {patient.firstName} {patient.lastName}
            {patient.preferredName !== patient.firstName
              ? ` (“${patient.preferredName}”)`
              : ""}
          </p>
        </div>
        <div>
          <p className="type-eyebrow text-ink-subtle">Shift starts</p>
          <p className="mt-1 text-base text-ink">{formatDateTime(patient.shiftStart)}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="type-eyebrow text-ink-subtle">Last handoff</p>
          {patient.lastHandoff ? (
            <p className="mt-1 text-base text-ink">
              {formatDateTime(patient.lastHandoff.at)}
              <span className="block text-ink-muted">by {patient.lastHandoff.by}</span>
            </p>
          ) : (
            <p className="mt-1 text-base text-ink">No prior handoff on file</p>
          )}
        </div>
      </Card>

      <p className="text-base leading-relaxed text-ink-muted">
        {patient.summary}
      </p>
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
      <p className="type-lead text-ink-muted">
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
    <div className="space-y-6">
      <div className="flex overflow-hidden rounded-2xl border border-border bg-surface">
        <span className="w-1.5 shrink-0 bg-ink" aria-hidden="true" />
        <div className="px-5 py-5">
          <p className="type-eyebrow text-ink-muted">No prior handoff</p>
          <h2 className="type-h2 mt-2 text-ink">Start a fresh brief</h2>
          <p className="type-lead mt-2 text-ink-muted">
            There’s no recent handoff on file. Continue to what’s due now, then leave a note so
            the next person isn’t starting cold.
          </p>
        </div>
      </div>
      <Button type="button" size="lg" onClick={onContinue} className="w-full sm:w-auto">
        Continue to due now
      </Button>
    </div>
  );
}

function ReadyState({
  patient,
  note,
  onBack,
}: {
  patient: Patient;
  note: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-2xl font-bold text-brand"
      >
        ✓
      </span>
      <div>
        <h2 className="type-h1 text-ink">Brief complete</h2>
        <p className="type-lead mt-2 text-ink-muted">
          You’re ready for {patient.preferredName}.
        </p>
      </div>

      {note.trim() ? (
        <Card className="text-left">
          <p className="type-eyebrow text-ink-subtle">Your note</p>
          <p className="mt-1.5 text-base text-ink">{note}</p>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LinkButton href="/today" className="sm:min-w-44">
          Back to today
        </LinkButton>
        <Button variant="secondary" onClick={onBack} className="sm:min-w-44">
          Review brief
        </Button>
      </div>
    </div>
  );
}
