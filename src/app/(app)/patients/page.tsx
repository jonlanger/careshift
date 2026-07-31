"use client";

import { useMemo, useState } from "react";
import { PageBody, PageHeader } from "@/components/app/app-shell";
import { PatientCard } from "@/components/care/patient-card";
import { LinkButton } from "@/components/ui/button";
import { useCareshift } from "@/lib/store";
import type { CareSetting } from "@/lib/types";

type Filter = "all" | CareSetting | "needs-brief";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-brief", label: "Needs brief" },
  { id: "home", label: "Home" },
  { id: "facility", label: "Facility" },
];

export default function PatientsPage() {
  const { patients } = useCareshift();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return patients;
    if (filter === "needs-brief") return patients.filter((p) => p.status !== "briefed");
    return patients.filter((p) => p.setting === filter);
  }, [filter, patients]);

  return (
    <>
      <PageHeader
        eyebrow="Caseload"
        title="Patients"
        description="Everyone you're covering, with what changed and what's due at a glance."
        action={<LinkButton href="/patients/new">Add patient</LinkButton>}
      />

      <PageBody>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter patients">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={[
                  "touch-target rounded-full border-2 px-4 text-sm font-bold transition",
                  active
                    ? "border-brand bg-brand text-on-brand"
                    : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-semibold text-ink-muted" aria-live="polite">
          Showing {visible.length} of {patients.length}
        </p>

        <ul className="mt-3 grid gap-3 sm:gap-4 lg:grid-cols-2">
          {visible.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </ul>

        {visible.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="type-h3 text-ink">No patients in this view</p>
            <p className="mt-2 text-base text-ink-muted">
              Try another filter, or add someone to your caseload.
            </p>
          </div>
        ) : null}
      </PageBody>
    </>
  );
}
