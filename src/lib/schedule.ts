import { formatTime } from "@/lib/format";
import type {
  Delta,
  DeltaCategory,
  DueItem,
  Patient,
  ScheduleEvent,
  ScheduleEventType,
} from "@/lib/types";

const dueTypes = new Set<ScheduleEventType>(["med", "task"]);

export function scheduleTypeLabel(type: ScheduleEventType): string {
  switch (type) {
    case "med":
      return "Medication";
    case "task":
      return "Task";
    case "appointment":
      return "Appointment";
    case "visit":
      return "Visit";
  }
}

function windowBounds(patient: Patient) {
  const start = new Date(patient.shiftStart).getTime();
  const end = start + patient.dueWindowHours * 60 * 60 * 1000;
  return { start, end };
}

/** Due now = due-relevant schedule events that fall inside the patient's window. */
export function deriveDueNow(
  patient: Patient,
  events: ScheduleEvent[],
): DueItem[] {
  const { start, end } = windowBounds(patient);

  return events
    .filter((event) => event.patientId === patient.id && event.dueRelevant)
    .filter((event) => {
      const at = new Date(event.startsAt).getTime();
      return at >= start && at <= end;
    })
    .map((event) => {
      const at = new Date(event.startsAt).getTime();
      const type: DueItem["type"] = dueTypes.has(event.type) ? event.type as "med" | "task" : "task";
      return {
        id: event.id,
        type,
        label: event.title,
        dueAt: event.startsAt,
        status: at <= start + 45 * 60 * 1000 ? "due" : "upcoming",
        scheduleEventId: event.id,
      } satisfies DueItem;
    })
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function withDerivedDue(
  patients: Patient[],
  events: ScheduleEvent[],
): Patient[] {
  return patients.map((patient) => ({
    ...patient,
    dueNow: deriveDueNow(patient, events),
  }));
}

export function deltaCategoryForSchedule(type: ScheduleEventType): DeltaCategory {
  return type === "med" ? "medication" : "schedule";
}

/** Build a What-changed entry when the calendar moves or adds care work. */
export function deltaFromScheduleChange({
  event,
  previousStartsAt,
  author,
  kind,
}: {
  event: ScheduleEvent;
  previousStartsAt?: string;
  author: string;
  kind: "added" | "rescheduled";
}): Delta {
  const after = `${scheduleTypeLabel(event.type)} at ${formatTime(event.startsAt)}`;
  const before =
    kind === "rescheduled" && previousStartsAt
      ? `Was scheduled for ${formatTime(previousStartsAt)}`
      : "Not on the schedule";

  return {
    id: `delta-${event.id}-${Math.random().toString(36).slice(2, 7)}`,
    category: deltaCategoryForSchedule(event.type),
    summary:
      kind === "added"
        ? `Scheduled: ${event.title}`
        : `Rescheduled: ${event.title}`,
    severity: event.type === "med" ? "watch" : "note",
    detail:
      kind === "added"
        ? `${event.title} was added to the care schedule.`
        : `${event.title} moved on the care schedule.`,
    comparison: { before, after },
    observedAt: new Date().toISOString(),
    reportedBy: author,
    notes: [],
    scheduleEventId: event.id,
  };
}

export function dayKey(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDaysKey(key: string, days: number): string {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dayKey(date.toISOString());
}

export function isSameDay(a: string, b: string): boolean {
  return dayKey(a) === dayKey(b);
}

export function eventsOnDay(events: ScheduleEvent[], day: string): ScheduleEvent[] {
  const key = day.includes("T") ? dayKey(day) : day;
  return events
    .filter((event) => dayKey(event.startsAt) === key)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
