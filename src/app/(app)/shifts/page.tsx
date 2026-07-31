"use client";

import { PageBody, PageHeader } from "@/components/app/app-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, ShiftStatusPill } from "@/components/ui/primitives";
import { formatTime, settingLabel } from "@/lib/format";
import { useCareshift } from "@/lib/store";

export default function ShiftsPage() {
  const { caregiverName, patients, shifts, claimShift, requestSwap } = useCareshift();

  const mine = shifts.filter((slot) => slot.caregiverName === caregiverName);
  const others = shifts.filter((slot) => slot.caregiverName !== caregiverName);

  function patientFor(patientId: string) {
    return patients.find((p) => p.id === patientId);
  }

  return (
    <>
      <PageHeader
        eyebrow="Friday, July 31"
        title="Coordinate shifts"
        description="See who has which shift, claim what's open, and flag a swap so nothing goes uncovered."
      />

      <PageBody>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <p className="type-eyebrow text-ink-subtle">Your shifts</p>
            <p className="type-h2 mt-1 text-ink">{mine.length}</p>
          </Card>
          <Card>
            <p className="type-eyebrow text-ink-subtle">Open</p>
            <p className="type-h2 mt-1 text-ink">
              {shifts.filter((s) => s.status === "open").length}
            </p>
          </Card>
          <Card>
            <p className="type-eyebrow text-ink-subtle">Swaps requested</p>
            <p className="type-h2 mt-1 text-ink">
              {shifts.filter((s) => s.status === "swap-requested").length}
            </p>
          </Card>
        </div>

        <section aria-labelledby="your-shifts" className="mt-10 space-y-3">
          <h2 id="your-shifts" className="type-h2 text-ink">
            Your shifts
          </h2>
          <ul className="grid gap-3 lg:grid-cols-2">
            {mine.map((slot) => {
              const patient = patientFor(slot.patientId);
              return (
                <li
                  key={slot.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl font-semibold text-ink">
                        {patient?.preferredName ?? "Unassigned"}
                      </p>
                      <p className="text-sm text-ink-muted">
                        {patient ? settingLabel(patient.setting) : "—"} · {slot.label}
                      </p>
                    </div>
                    <ShiftStatusPill status={slot.status} />
                  </div>
                  <p className="text-base font-semibold text-ink">
                    {formatTime(slot.start)} – {formatTime(slot.end)}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {patient ? (
                      <LinkButton href={`/brief/${patient.id}`} className="sm:flex-1">
                        Start brief
                      </LinkButton>
                    ) : null}
                    {slot.status !== "swap-requested" ? (
                      <Button
                        variant="secondary"
                        className="sm:flex-1"
                        onClick={() => requestSwap(slot.id)}
                      >
                        Request swap
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="team-shifts" className="mt-10 space-y-3">
          <h2 id="team-shifts" className="type-h2 text-ink">
            Team &amp; open shifts
          </h2>
          <ul className="grid gap-3 lg:grid-cols-2">
            {others.map((slot) => {
              const patient = patientFor(slot.patientId);
              return (
                <li
                  key={slot.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl font-semibold text-ink">
                        {patient?.preferredName ?? "Unassigned"}
                      </p>
                      <p className="text-sm text-ink-muted">
                        {slot.caregiverName ?? "No caregiver assigned"} · {slot.label}
                      </p>
                    </div>
                    <ShiftStatusPill status={slot.status} />
                  </div>
                  <p className="text-base font-semibold text-ink">
                    {formatTime(slot.start)} – {formatTime(slot.end)}
                  </p>
                  {slot.status !== "covered" ? (
                    <Button variant="secondary" onClick={() => claimShift(slot.id)}>
                      {slot.status === "open" ? "Claim this shift" : "Cover this swap"}
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </PageBody>
    </>
  );
}
