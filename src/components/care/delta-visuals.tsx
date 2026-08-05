import {
  CalendarDays,
  Check,
  Footprints,
  Moon,
  Pill,
  Smile,
  TriangleAlert,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { Delta, DeltaCategory, DeltaSeverity } from "@/lib/types";

const categoryIcons: Record<DeltaCategory, LucideIcon> = {
  mood: Smile,
  sleep: Moon,
  appetite: Utensils,
  incident: TriangleAlert,
  mobility: Footprints,
  medication: Pill,
  schedule: CalendarDays,
};

/**
 * One alert accent for safety, neutral ink for everything else. Severity is
 * carried by the icon tile, the written label, and weight so color is never
 * load-bearing on its own.
 */
export const severityStyles: Record<
  DeltaSeverity,
  { tile: string; label: string; card: string }
> = {
  attention: {
    tile: "border-alert/30 bg-alert-soft text-alert",
    label: "text-alert",
    card: "border-alert/35",
  },
  watch: {
    tile: "border-border-strong bg-linen-deep text-ink",
    label: "text-ink-muted",
    card: "border-border",
  },
  note: {
    tile: "border-border bg-linen text-ink-subtle",
    label: "text-ink-subtle",
    card: "border-border",
  },
};

const severityOrder: DeltaSeverity[] = ["attention", "watch", "note"];

export function sortDeltas(deltas: Delta[]): Delta[] {
  return [...deltas].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  );
}

export function isAcknowledged(delta: Delta): boolean {
  return Boolean(delta.acknowledgedAt);
}

export function noteCount(delta: Delta): number {
  return delta.notes?.length ?? 0;
}

const tileSizes = {
  sm: { box: "size-10 rounded-lg", icon: "size-4.5", check: "size-4" },
  md: { box: "size-12 rounded-xl", icon: "size-5.5", check: "size-4.5" },
  lg: { box: "size-14 rounded-xl", icon: "size-6.5", check: "size-5" },
} as const;

export function DeltaIcon({
  delta,
  size = "md",
}: {
  delta: Delta;
  size?: keyof typeof tileSizes;
}) {
  const Icon = categoryIcons[delta.category];
  const sizing = tileSizes[size];
  const acknowledged = isAcknowledged(delta);

  return (
    <span aria-hidden="true" className="relative shrink-0">
      <span
        className={`grid place-items-center border ${sizing.box} ${
          acknowledged
            ? "border-border bg-linen text-ink-subtle"
            : severityStyles[delta.severity].tile
        }`}
      >
        <Icon className={sizing.icon} strokeWidth={2} />
      </span>
      {acknowledged ? (
        <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-surface bg-brand text-on-brand">
          <Check className="size-3" strokeWidth={3.5} />
        </span>
      ) : null}
    </span>
  );
}
