"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageBody, PageHeader } from "@/components/app/app-shell";
import { DeltaList } from "@/components/care/delta-list";
import { DueList } from "@/components/care/due-list";
import { LinkButton } from "@/components/ui/button";
import { Card, StatusPill } from "@/components/ui/primitives";
import { formatDateTime, settingLabel, windowEndLabel } from "@/lib/format";
import { useCareshift } from "@/lib/store";

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const { patients } = useCareshift();
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    return (
      <PageBody>
        <Card className="text-center">
          <h1 className="type-h2 text-ink">Patient not found</h1>
          <p className="mt-2 text-base text-ink-muted">
            This record may have been added in another session.
          </p>
          <div className="mt-5 flex justify-center">
            <LinkButton href="/patients" variant="secondary">
              Back to patients
            </LinkButton>
          </div>
        </Card>
      </PageBody>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`${settingLabel(patient.setting)}${
          patient.roomLabel ? ` · ${patient.roomLabel}` : ""
        }`}
        title={patient.preferredName}
        description={patient.summary}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <LinkButton href={`/brief/${patient.id}`} size="lg">
              Start brief
            </LinkButton>
            <LinkButton href="/shifts" variant="secondary" size="lg">
              Shifts
            </LinkButton>
          </div>
        }
      />

      <PageBody>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={patient.status} />
          <p className="text-sm font-semibold text-ink-muted">
            {patient.lastHandoff
              ? `Last handoff ${formatDateTime(patient.lastHandoff.at)} by ${patient.lastHandoff.by}`
              : "No prior handoff on file"}
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:gap-8">
          <div className="space-y-8">
            <section aria-labelledby="changes" className="space-y-3">
              <h2 id="changes" className="type-h2 text-ink">
                What changed
              </h2>
              {patient.deltas.length > 0 ? (
                <DeltaList deltas={patient.deltas} />
              ) : (
                <Card>
                  <p className="text-base text-ink-muted">
                    Nothing recorded yet. The first brief will start the history.
                  </p>
                </Card>
              )}
            </section>

            <section aria-labelledby="due" className="space-y-3">
              <h2 id="due" className="type-h2 text-ink">
                Due now
              </h2>
              <p className="text-base text-ink-muted">
                Next {patient.dueWindowHours} hours · until{" "}
                {windowEndLabel(patient.shiftStart, patient.dueWindowHours)}
              </p>
              {patient.dueNow.length > 0 ? (
                <DueList items={patient.dueNow} referenceIso={patient.shiftStart} />
              ) : (
                <Card>
                  <p className="text-base text-ink-muted">Nothing scheduled in this window.</p>
                </Card>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section aria-labelledby="team" className="space-y-3">
              <h2 id="team" className="type-h3 text-ink">
                Care team
              </h2>
              {patient.careTeam.length > 0 ? (
                <ul className="space-y-3">
                  {patient.careTeam.map((member) => (
                    <li
                      key={member.id}
                      className="rounded-2xl border border-border bg-surface px-4 py-3"
                    >
                      <p className="font-semibold text-ink">{member.name}</p>
                      <p className="text-sm text-ink-muted">
                        {member.role} · {member.shiftLabel}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Card>
                  <p className="text-base text-ink-muted">No one else assigned yet.</p>
                </Card>
              )}
            </section>

            <section aria-labelledby="preferences" className="space-y-3">
              <h2 id="preferences" className="type-h3 text-ink">
                Care preferences
              </h2>
              {patient.preferences.length > 0 ? (
                <ul className="space-y-2">
                  {patient.preferences.map((preference) => (
                    <li
                      key={preference}
                      className="rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink"
                    >
                      {preference}
                    </li>
                  ))}
                </ul>
              ) : (
                <Card>
                  <p className="text-base text-ink-muted">
                    Add preferences as you learn them — they travel with every handoff.
                  </p>
                </Card>
              )}
            </section>

            <Link href="/patients" className="inline-block text-sm font-semibold text-brand">
              ← All patients
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}
