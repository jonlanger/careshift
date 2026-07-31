"use client";

import Link from "next/link";
import { PageBody, PageHeader } from "@/components/app/app-shell";
import { DeltaSection } from "@/components/care/delta-list";
import { DueList } from "@/components/care/due-list";
import { LinkButton } from "@/components/ui/button";
import { Card, SectionHeading, ShiftStatusPill } from "@/components/ui/primitives";
import { formatDateTime, formatTime, settingLabel } from "@/lib/format";
import { useCareshift } from "@/lib/store";

export default function TodayPage() {
  const { caregiverName, patients, shifts } = useCareshift();

  const needsBrief = patients.filter((p) => p.status !== "briefed");
  const next = needsBrief[0] ?? patients[0];
  const myShifts = shifts.filter((slot) => slot.caregiverName === caregiverName);
  const openShifts = shifts.filter((slot) => slot.status !== "covered");

  return (
    <>
      <PageHeader
        eyebrow="Friday, July 31"
        title={`Good morning, ${caregiverName.split(" ")[0]}`}
        description={`${needsBrief.length} of ${patients.length} people still need a brief today.`}
        action={
          next ? (
            <LinkButton href={`/brief/${next.id}`} size="lg">
              Start brief · {next.preferredName}
            </LinkButton>
          ) : null
        }
      />

      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:gap-8">
          <section aria-labelledby="next-brief" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="type-eyebrow text-ink-muted">Up next</p>
                <h2 id="next-brief" className="type-h2 mt-1 text-ink">
                  {next.preferredName} · {settingLabel(next.setting)}
                </h2>
              </div>
              <LinkButton href={`/patients/${next.id}`} variant="secondary">
                Open record
              </LinkButton>
            </div>

            <Card>
              <p className="text-base text-ink-muted">
                Shift starts {formatDateTime(next.shiftStart)}
                {next.lastHandoff
                  ? ` · last handoff by ${next.lastHandoff.by}`
                  : " · no prior handoff on file"}
              </p>
            </Card>

            {next.deltas.length > 0 ? (
              <DeltaSection
                patientId={next.id}
                deltas={next.deltas.slice(0, 3)}
                title="What changed"
                titleLevel={3}
                action={
                  next.deltas.length > 3 ? (
                    <Link
                      href={`/patients/${next.id}`}
                      className="text-sm font-semibold text-brand"
                    >
                      All {next.deltas.length}
                    </Link>
                  ) : null
                }
              />
            ) : null}

            {next.dueNow.length > 0 ? (
              <div className="space-y-3">
                <h3 className="type-h3 text-ink">Due now</h3>
                <DueList items={next.dueNow.slice(0, 3)} referenceIso={next.shiftStart} />
              </div>
            ) : null}
          </section>

          <div className="space-y-6">
            <section aria-labelledby="my-shifts" className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <h2 id="my-shifts" className="type-h3 text-ink">
                  Your shifts today
                </h2>
                <Link href="/shifts" className="text-sm font-semibold text-brand">
                  All shifts
                </Link>
              </div>
              <ul className="space-y-3">
                {myShifts.map((slot) => {
                  const patient = patients.find((p) => p.id === slot.patientId);
                  return (
                    <li
                      key={slot.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">
                          {patient?.preferredName ?? "Unassigned"}
                        </p>
                        <p className="text-sm text-ink-muted">
                          {slot.label} · {formatTime(slot.start)}–{formatTime(slot.end)}
                        </p>
                      </div>
                      <ShiftStatusPill status={slot.status} />
                    </li>
                  );
                })}
              </ul>
            </section>

            {openShifts.length > 0 ? (
              <section aria-labelledby="coordination" className="space-y-3">
                <h2 id="coordination" className="type-h3 text-ink">
                  Needs coordination
                </h2>
                <Card className="space-y-3">
                  <p className="text-base text-ink-muted">
                    {openShifts.length} shift{openShifts.length === 1 ? "" : "s"} still need a
                    caregiver or a swap partner.
                  </p>
                  <LinkButton href="/shifts" variant="secondary" fullWidth>
                    Coordinate shifts
                  </LinkButton>
                </Card>
              </section>
            ) : null}
          </div>
        </div>

        <section aria-labelledby="roster" className="mt-10 space-y-4">
          <SectionHeading
            eyebrow="Your caseload"
            title="Everyone you cover"
            action={
              <LinkButton href="/patients" variant="secondary">
                Manage patients
              </LinkButton>
            }
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {patients.slice(0, 4).map((patient) => (
              <li
                key={patient.id}
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <Link
                  href={`/patients/${patient.id}`}
                  className="font-semibold text-ink no-underline"
                >
                  {patient.preferredName}
                </Link>
                <p className="text-sm text-ink-muted">
                  {settingLabel(patient.setting)} · {patient.dueNow.length} due
                </p>
              </li>
            ))}
          </ul>
        </section>
      </PageBody>
    </>
  );
}
