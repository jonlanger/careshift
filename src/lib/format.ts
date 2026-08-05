import type {
  DeltaCategory,
  DeltaSeverity,
  PatientStatus,
  ShiftStatus,
} from "@/lib/types";

const categoryLabels: Record<DeltaCategory, string> = {
  mood: "Mood",
  sleep: "Sleep",
  appetite: "Appetite",
  incident: "Incident",
  mobility: "Mobility",
  medication: "Medication",
  schedule: "Schedule",
};

const severityLabels: Record<DeltaSeverity, string> = {
  attention: "Needs attention",
  watch: "Watch",
  note: "Note",
};

const statusLabels: Record<PatientStatus, string> = {
  attention: "Needs attention",
  "needs-brief": "Brief not started",
  briefed: "Brief complete",
};

const shiftStatusLabels: Record<ShiftStatus, string> = {
  covered: "Covered",
  open: "Open shift",
  "swap-requested": "Swap requested",
};

export function formatCategory(category: DeltaCategory): string {
  return categoryLabels[category];
}

export function formatSeverity(severity: DeltaSeverity): string {
  return severityLabels[severity];
}

export function formatPatientStatus(status: PatientStatus): string {
  return statusLabels[status];
}

export function formatShiftStatus(status: ShiftStatus): string {
  return shiftStatusLabels[status];
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
  const minutes = Math.round(
    (new Date(iso).getTime() - new Date(nowIso).getTime()) / 60000,
  );

  if (minutes <= 0) return "Due now";
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `In ${hours} hr` : `In ${hours} hr ${rem} min`;
}

export function windowEndLabel(shiftStart: string, hours: number): string {
  const end = new Date(new Date(shiftStart).getTime() + hours * 60 * 60 * 1000);
  return formatTime(end.toISOString());
}

export function settingLabel(setting: "home" | "facility"): string {
  return setting === "home" ? "Home visit" : "Facility";
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
