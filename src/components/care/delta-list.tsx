import { formatCategory, formatSeverity } from "@/lib/format";
import type { Delta, DeltaSeverity } from "@/lib/types";

/**
 * One alert accent for safety, neutral ink for everything else. Severity is
 * carried by rail weight, glyph, and label so color is never load-bearing.
 */
const severityStyles: Record<
  DeltaSeverity,
  { rail: string; glyph: string; label: string }
> = {
  attention: { rail: "bg-alert", glyph: "!", label: "text-alert" },
  watch: { rail: "bg-ink", glyph: "▲", label: "text-ink-muted" },
  note: { rail: "bg-border-strong", glyph: "•", label: "text-ink-subtle" },
};

const severityOrder: DeltaSeverity[] = ["attention", "watch", "note"];

export function sortDeltas(deltas: Delta[]): Delta[] {
  return [...deltas].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  );
}

export function DeltaList({ deltas }: { deltas: Delta[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {sortDeltas(deltas).map((delta) => {
        const style = severityStyles[delta.severity];
        return (
          <li
            key={delta.id}
            className="flex overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <span className={`w-1.5 shrink-0 ${style.rail}`} aria-hidden="true" />
            <div className="px-4 py-3.5">
              <p className={`type-eyebrow flex items-center gap-1.5 ${style.label}`}>
                <span aria-hidden="true">{style.glyph}</span>
                {formatSeverity(delta.severity)} · {formatCategory(delta.category)}
              </p>
              <p className="mt-1.5 text-base leading-snug text-ink sm:text-lg">
                {delta.summary}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
