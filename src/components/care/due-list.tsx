import { formatRelativeTo, formatTime } from "@/lib/format";
import type { DueItem } from "@/lib/types";

export function DueList({
  items,
  referenceIso,
}: {
  items: DueItem[];
  referenceIso: string;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5"
        >
          <div>
            <p className="type-eyebrow text-ink-subtle">
              {item.type === "med" ? "Medication" : "Task"}
            </p>
            <p className="mt-1.5 text-base font-semibold leading-snug text-ink sm:text-lg">
              {item.label}
            </p>
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-base font-bold text-ink">
              {formatTime(item.dueAt)}
            </span>
            <span
              className={`block text-sm font-semibold ${
                item.status === "due" ? "text-alert" : "text-ink-muted"
              }`}
            >
              {formatRelativeTo(item.dueAt, referenceIso)}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
