import type { DeltaCategory, DeltaSeverity } from "@/lib/types";

const categoryLabels: Record<DeltaCategory, string> = {
  mood: "Mood",
  sleep: "Sleep",
  appetite: "Appetite",
  incident: "Incident",
  mobility: "Mobility",
};

const severityLabels: Record<DeltaSeverity, string> = {
  info: "FYI",
  watch: "Watch",
  urgent: "Needs attention",
};

export function formatCategory(category: DeltaCategory): string {
  return categoryLabels[category];
}

export function formatSeverity(severity: DeltaSeverity): string {
  return severityLabels[severity];
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeTo(iso: string, nowIso: string): string {
  const due = new Date(iso).getTime();
  const now = new Date(nowIso).getTime();
  const minutes = Math.round((due - now) / 60000);

  if (minutes <= 0) return "Due now";
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `In ${hours} hr`;
  return `In ${hours} hr ${rem} min`;
}

export function windowEndLabel(shiftStart: string, hours: number): string {
  const end = new Date(new Date(shiftStart).getTime() + hours * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(end);
}
