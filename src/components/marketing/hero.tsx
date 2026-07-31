import { ChevronRight, Circle, MessageSquare } from "lucide-react";
import { DeltaIcon, severityStyles, sortDeltas } from "@/components/care/delta-visuals";
import { LinkButton } from "@/components/ui/button";
import { patients } from "@/data/patients";
import { formatCategory, formatSeverity, formatTime, settingLabel } from "@/lib/format";
import type { Delta } from "@/lib/types";

/** Real seed data so the marketing preview can't drift from the live cards. */
const previewPatient = patients[0];
const previewDeltas = sortDeltas(previewPatient.deltas).slice(0, 3);

export function Hero() {
  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-ink-muted">Careshift</p>
          <h1 className="type-display mt-3 text-ink">
            Know what changed before you begin.
          </h1>
          <p className="type-lead mt-5 max-w-xl text-ink-muted">
            A 90-second brief for caregivers — what changed, what’s due now, then ready.
            Manage your caseload and keep shifts covered in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LinkButton href="/sign-up" size="lg" fullWidth className="sm:w-auto sm:min-w-48">
              Sign up
            </LinkButton>
            <LinkButton
              href="/sign-in"
              variant="secondary"
              size="lg"
              fullWidth
              className="sm:w-auto sm:min-w-48"
            >
              Sign in
            </LinkButton>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="type-eyebrow text-ink-subtle">Brief in</dt>
              <dd className="font-display text-2xl font-semibold text-ink">90 sec</dd>
            </div>
            <div>
              <dt className="type-eyebrow text-ink-subtle">Changes</dt>
              <dd className="font-display text-2xl font-semibold text-ink">3–5 max</dd>
            </div>
            <div>
              <dt className="type-eyebrow text-ink-subtle">Settings</dt>
              <dd className="font-display text-2xl font-semibold text-ink">Home + facility</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(15,26,23,0.35)]">
            <div className="border-b border-border px-5 py-4">
              <p className="type-eyebrow text-ink-muted">Step 2 of 4 · What changed</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {previewPatient.preferredName} · {settingLabel(previewPatient.setting)}
              </p>
              <div className="mt-3 flex gap-1.5" aria-hidden="true">
                <span className="h-1.5 flex-1 rounded-full bg-brand" />
                <span className="h-1.5 flex-1 rounded-full bg-brand" />
                <span className="h-1.5 flex-1 rounded-full bg-border" />
                <span className="h-1.5 flex-1 rounded-full bg-border" />
              </div>
            </div>

            <div className="space-y-3 p-5">
              <p className="text-sm font-semibold text-ink-subtle">
                0 of {previewDeltas.length} reviewed
              </p>
              <ul className="space-y-3">
                {previewDeltas.map((delta) => (
                  <PreviewCard key={delta.id} delta={delta} />
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-5 py-4">
              <p className="flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-5 text-base font-semibold text-on-brand">
                See what’s due
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mirrors the live change card, minus the interactive controls. */
function PreviewCard({ delta }: { delta: Delta }) {
  const notes = delta.notes?.length ?? 0;
  const meta = [delta.observedAt ? formatTime(delta.observedAt) : null, delta.reportedBy]
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-2xl border bg-surface ${
        severityStyles[delta.severity].card
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <DeltaIcon delta={delta} size="sm" />
        <div className="min-w-0 flex-1">
          <p className={`type-eyebrow ${severityStyles[delta.severity].label}`}>
            {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
          </p>
          <p className="mt-1.5 text-base font-semibold leading-snug text-ink">
            {delta.summary}
          </p>
          {meta ? <p className="mt-2 text-xs font-bold text-ink-subtle">{meta}</p> : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-linen/60 px-3 py-2 text-sm font-semibold text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <Circle className="size-4" aria-hidden="true" strokeWidth={2.25} />
          Mark reviewed
        </span>
        <span className="inline-flex items-center gap-1.5">
          {notes > 0 ? (
            <>
              <MessageSquare className="size-4" aria-hidden="true" />
              {`${notes} ${notes === 1 ? "note" : "notes"}`}
            </>
          ) : (
            "Details"
          )}
          <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </li>
  );
}
