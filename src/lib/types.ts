export type CareSetting = "home" | "facility";

export type DeltaCategory =
  | "mood"
  | "sleep"
  | "appetite"
  | "incident"
  | "mobility"
  | "medication"
  | "schedule";

/** Three levels only — encoded with label + rail + weight, never color alone. */
export type DeltaSeverity = "attention" | "watch" | "note";

export type DueType = "med" | "task";

export type ScheduleEventType = "med" | "task" | "appointment" | "visit";

export type BriefStep = "covering" | "changes" | "due" | "note";

export type PatientStatus = "attention" | "needs-brief" | "briefed";

export type ShiftStatus = "covered" | "open" | "swap-requested";

export interface DeltaNote {
  id: string;
  body: string;
  author: string;
  at: string;
}

/** Paired so a change never shows one side of the comparison without the other. */
export interface DeltaComparison {
  before: string;
  after: string;
}

export interface Delta {
  id: string;
  category: DeltaCategory;
  summary: string;
  severity: DeltaSeverity;
  /** Longer context shown when the change is opened. */
  detail?: string;
  /** What the next caregiver should do about this — the SBAR "Recommendation". */
  recommendation?: string;
  comparison?: DeltaComparison;
  observedAt?: string;
  reportedBy?: string;
  acknowledgedAt?: string | null;
  acknowledgedBy?: string | null;
  notes?: DeltaNote[];
  /** When set, this change was produced by a schedule edit. */
  scheduleEventId?: string;
}

export interface DueItem {
  id: string;
  type: DueType;
  label: string;
  dueAt: string;
  status: "upcoming" | "due";
  scheduleEventId?: string;
}

/**
 * Calendar source of truth. Meds and tasks in the shift window become Due now;
 * edits can also write a What-changed delta.
 */
export interface ScheduleEvent {
  id: string;
  patientId: string;
  type: ScheduleEventType;
  title: string;
  startsAt: string;
  endsAt?: string;
  /** When true, surfaces in Due now during the patient's due window. */
  dueRelevant: boolean;
  notes?: string;
}

export interface NewScheduleEventInput {
  patientId: string;
  type: ScheduleEventType;
  title: string;
  startsAt: string;
  endsAt?: string;
  dueRelevant?: boolean;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shiftLabel: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  setting: CareSetting;
  roomLabel?: string;
  summary: string;
  status: PatientStatus;
  shiftStart: string;
  dueWindowHours: number;
  lastHandoff: { at: string; by: string } | null;
  briefStale: boolean;
  deltas: Delta[];
  dueNow: DueItem[];
  careTeam: TeamMember[];
  preferences: string[];
}

export interface ShiftSlot {
  id: string;
  patientId: string;
  caregiverName: string | null;
  start: string;
  end: string;
  label: string;
  status: ShiftStatus;
}

export interface NewDeltaInput {
  patientId: string;
  category: DeltaCategory;
  severity: DeltaSeverity;
  summary: string;
  detail?: string;
  recommendation?: string;
}

export interface NewPatientInput {
  firstName: string;
  lastName: string;
  preferredName: string;
  setting: CareSetting;
  roomLabel?: string;
  summary: string;
}
