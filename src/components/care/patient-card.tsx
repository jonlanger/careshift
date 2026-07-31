import Link from "next/link";
import { Avatar, StatusPill } from "@/components/ui/primitives";
import { formatDateTime, initials, settingLabel } from "@/lib/format";
import type { Patient } from "@/lib/types";

export function PatientCard({ patient }: { patient: Patient }) {
  const attentionCount = patient.deltas.filter((d) => d.severity === "attention").length;
  const dueCount = patient.dueNow.length;

  return (
    <li className="rounded-2xl border border-border bg-surface transition hover:border-border-strong">
      <Link
        href={`/patients/${patient.id}`}
        className="flex flex-col gap-4 p-4 no-underline sm:p-5"
      >
        <div className="flex items-start gap-3">
          <Avatar label={initials(patient.firstName, patient.lastName)} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {patient.preferredName}
            </p>
            <p className="text-sm text-ink-muted">
              {settingLabel(patient.setting)}
              {patient.roomLabel ? ` · ${patient.roomLabel}` : ""}
            </p>
          </div>
          <StatusPill status={patient.status} />
        </div>

        <p className="text-base leading-snug text-ink-muted">{patient.summary}</p>

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="type-eyebrow text-ink-subtle">Changes</dt>
            <dd className="mt-0.5 font-semibold text-ink">
              {patient.deltas.length}
              {attentionCount > 0 ? ` · ${attentionCount} need attention` : ""}
            </dd>
          </div>
          <div>
            <dt className="type-eyebrow text-ink-subtle">Due now</dt>
            <dd className="mt-0.5 font-semibold text-ink">{dueCount} items</dd>
          </div>
          <div>
            <dt className="type-eyebrow text-ink-subtle">Last handoff</dt>
            <dd className="mt-0.5 font-semibold text-ink">
              {patient.lastHandoff ? formatDateTime(patient.lastHandoff.at) : "None on file"}
            </dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
