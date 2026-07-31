import type { BriefFixture } from "@/lib/types";

/** Home visit — happy path with 4 deltas and due items. */
export const homeBrief: BriefFixture = {
  id: "home-margaret",
  caregiver: { name: "Alex Rivera" },
  recipient: {
    firstName: "Margaret",
    preferredName: "Maggie",
    setting: "home",
  },
  shiftStart: "2026-07-31T09:00:00",
  lastHandoff: {
    at: "2026-07-30T18:15:00",
    by: "Jordan Lee",
  },
  briefStale: false,
  dueWindowHours: 3,
  deltas: [
    {
      id: "d1",
      category: "mobility",
      summary: "Needed two-hand support standing from the couch three times last evening.",
      severity: "watch",
    },
    {
      id: "d2",
      category: "appetite",
      summary: "Ate about half of dinner; finished a yogurt. Drinking less after 7pm.",
      severity: "info",
    },
    {
      id: "d3",
      category: "mood",
      summary: "More tired and confused with the TV on after 8pm. Lamp lighting helped.",
      severity: "info",
    },
    {
      id: "d4",
      category: "incident",
      summary: "Caught foot on hall rug once — no fall. Rug was moved out of the path.",
      severity: "urgent",
    },
  ],
  dueNow: [
    {
      id: "t1",
      type: "med",
      label: "Morning blood pressure med with breakfast",
      dueAt: "2026-07-31T09:30:00",
      status: "due",
    },
    {
      id: "t2",
      type: "task",
      label: "Assist with morning wash and dressing",
      dueAt: "2026-07-31T10:00:00",
      status: "upcoming",
    },
    {
      id: "t3",
      type: "task",
      label: "Encourage fluids — aim for 16 oz by noon",
      dueAt: "2026-07-31T11:30:00",
      status: "upcoming",
    },
  ],
};

/** Facility shift — same ritual, facility copy cues. */
export const facilityBrief: BriefFixture = {
  id: "facility-helen",
  caregiver: { name: "Alex Rivera" },
  recipient: {
    firstName: "Helen",
    preferredName: "Helen",
    setting: "facility",
    roomLabel: "Room 214",
  },
  shiftStart: "2026-07-31T07:00:00",
  lastHandoff: {
    at: "2026-07-31T06:40:00",
    by: "Night → day (Sam Okonkwo)",
  },
  briefStale: false,
  dueWindowHours: 3,
  deltas: [
    {
      id: "f1",
      category: "incident",
      summary: "Near-fall at 02:10 reaching for blanket. No injury. Post-fall checks done.",
      severity: "urgent",
    },
    {
      id: "f2",
      category: "sleep",
      summary: "Restless until 03:30; slept in short stretches after that.",
      severity: "watch",
    },
    {
      id: "f3",
      category: "appetite",
      summary: "Refused evening snack. Accepted water with prompting.",
      severity: "info",
    },
  ],
  dueNow: [
    {
      id: "ft1",
      type: "task",
      label: "Repeat observations (post-fall follow-up)",
      dueAt: "2026-07-31T08:00:00",
      status: "due",
    },
    {
      id: "ft2",
      type: "med",
      label: "Morning meds with breakfast tray",
      dueAt: "2026-07-31T08:15:00",
      status: "due",
    },
    {
      id: "ft3",
      type: "task",
      label: "Dressing check — look for leak-through",
      dueAt: "2026-07-31T09:00:00",
      status: "upcoming",
    },
  ],
};

/** Empty / no prior handoff path. */
export const emptyBrief: BriefFixture = {
  id: "home-empty",
  caregiver: { name: "Alex Rivera" },
  recipient: {
    firstName: "Margaret",
    preferredName: "Maggie",
    setting: "home",
  },
  shiftStart: "2026-07-31T09:00:00",
  lastHandoff: null,
  briefStale: true,
  dueWindowHours: 3,
  deltas: [],
  dueNow: [
    {
      id: "e1",
      type: "task",
      label: "Review care plan binder on arrival",
      dueAt: "2026-07-31T09:15:00",
      status: "due",
    },
    {
      id: "e2",
      type: "med",
      label: "Morning blood pressure med with breakfast",
      dueAt: "2026-07-31T09:30:00",
      status: "due",
    },
  ],
};

export const fixtures = {
  home: homeBrief,
  facility: facilityBrief,
  empty: emptyBrief,
} as const;

export type FixtureKey = keyof typeof fixtures;

export function getFixture(key: string | null | undefined): BriefFixture {
  if (key && key in fixtures) {
    return fixtures[key as FixtureKey];
  }
  return homeBrief;
}
