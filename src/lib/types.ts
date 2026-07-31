export type CareSetting = "home" | "facility";

export type DeltaCategory = "mood" | "sleep" | "appetite" | "incident" | "mobility";

export type DeltaSeverity = "info" | "watch" | "urgent";

export type DueType = "med" | "task";

export type BriefStep = "covering" | "changes" | "due" | "note";

export interface Caregiver {
  name: string;
}

export interface Recipient {
  firstName: string;
  preferredName: string;
  setting: CareSetting;
  roomLabel?: string;
}

export interface LastHandoff {
  at: string;
  by: string;
}

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

export interface BriefFixture {
  id: string;
  caregiver: Caregiver;
  recipient: Recipient;
  shiftStart: string;
  lastHandoff: LastHandoff | null;
  briefStale: boolean;
  deltas: Delta[];
  dueNow: DueItem[];
  dueWindowHours: number;
}
