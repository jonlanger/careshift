export type CareSetting = "home" | "facility";

export type DeltaCategory =
  | "mood"
  | "sleep"
  | "appetite"
  | "incident"
  | "mobility"
  | "medication";

/** Three levels only — encoded with label + rail + weight, never color alone. */
export type DeltaSeverity = "attention" | "watch" | "note";

export type DueType = "med" | "task";

export type BriefStep = "covering" | "changes" | "due" | "note";

export type PatientStatus = "attention" | "needs-brief" | "briefed";

export type ShiftStatus = "covered" | "open" | "swap-requested";

export interface Delta {
  id: string;
  category: DeltaCategory;
  summary: string;
  severity: DeltaSeverity;
}

export interface DueItem {
  id: string;
  type: DueType;
  label: string;
  dueAt: string;
  status: "upcoming" | "due";
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

export interface NewPatientInput {
  firstName: string;
  lastName: string;
  preferredName: string;
  setting: CareSetting;
  roomLabel?: string;
  summary: string;
}
