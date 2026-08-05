import type { ScheduleEvent } from "@/lib/types";

/**
 * Seed calendar. Meds/tasks with dueRelevant feed Due now; appointments and
 * visits show on the schedule and can still create What-changed deltas when moved.
 */
export const scheduleEvents: ScheduleEvent[] = [
  // Maggie — morning visit window
  {
    id: "sch-maggie-med",
    patientId: "maggie",
    type: "med",
    title: "Morning blood pressure med with breakfast",
    startsAt: "2026-07-31T09:30:00",
    dueRelevant: true,
  },
  {
    id: "sch-maggie-wash",
    patientId: "maggie",
    type: "task",
    title: "Assist with morning wash and dressing",
    startsAt: "2026-07-31T10:00:00",
    dueRelevant: true,
  },
  {
    id: "sch-maggie-fluids",
    patientId: "maggie",
    type: "task",
    title: "Encourage fluids — aim for 16 oz by noon",
    startsAt: "2026-07-31T11:30:00",
    dueRelevant: true,
  },
  {
    id: "sch-maggie-visit",
    patientId: "maggie",
    type: "visit",
    title: "Morning home visit",
    startsAt: "2026-07-31T09:00:00",
    endsAt: "2026-07-31T13:00:00",
    dueRelevant: false,
  },

  // Helen — day shift
  {
    id: "sch-helen-obs",
    patientId: "helen",
    type: "task",
    title: "Repeat observations — post-fall follow-up",
    startsAt: "2026-07-31T08:00:00",
    dueRelevant: true,
  },
  {
    id: "sch-helen-meds",
    patientId: "helen",
    type: "med",
    title: "Morning meds with breakfast tray",
    startsAt: "2026-07-31T08:15:00",
    dueRelevant: true,
  },
  {
    id: "sch-helen-dressing",
    patientId: "helen",
    type: "task",
    title: "Dressing check — look for leak-through",
    startsAt: "2026-07-31T09:00:00",
    dueRelevant: true,
  },
  {
    id: "sch-helen-pt",
    patientId: "helen",
    type: "appointment",
    title: "Physio — seated balance work",
    startsAt: "2026-07-31T11:00:00",
    endsAt: "2026-07-31T11:45:00",
    dueRelevant: true,
    notes: "Keep the walker within reach the whole time.",
  },

  // Arthur
  {
    id: "sch-arthur-inhaler",
    patientId: "arthur",
    type: "med",
    title: "Afternoon inhaler — confirm technique",
    startsAt: "2026-07-31T13:30:00",
    dueRelevant: true,
  },
  {
    id: "sch-arthur-meal",
    patientId: "arthur",
    type: "task",
    title: "Light meal prep and dishes",
    startsAt: "2026-07-31T14:30:00",
    dueRelevant: true,
  },
  {
    id: "sch-arthur-visit",
    patientId: "arthur",
    type: "visit",
    title: "Afternoon visit",
    startsAt: "2026-07-31T13:00:00",
    endsAt: "2026-07-31T17:00:00",
    dueRelevant: false,
  },

  // Rosa
  {
    id: "sch-rosa-walk",
    patientId: "rosa",
    type: "task",
    title: "Walk to the day room with walker",
    startsAt: "2026-07-31T09:30:00",
    dueRelevant: true,
  },
  {
    id: "sch-rosa-pt",
    patientId: "rosa",
    type: "appointment",
    title: "PT — knee flexion session",
    startsAt: "2026-07-31T14:00:00",
    endsAt: "2026-07-31T14:45:00",
    dueRelevant: true,
  },

  // Walter
  {
    id: "sch-walter-binder",
    patientId: "walter",
    type: "task",
    title: "Review care plan binder on arrival",
    startsAt: "2026-07-31T15:15:00",
    dueRelevant: true,
  },
  {
    id: "sch-walter-med",
    patientId: "walter",
    type: "med",
    title: "Evening medication reminder",
    startsAt: "2026-07-31T17:00:00",
    dueRelevant: true,
  },
  {
    id: "sch-walter-visit",
    patientId: "walter",
    type: "visit",
    title: "First visit",
    startsAt: "2026-07-31T15:00:00",
    endsAt: "2026-07-31T19:00:00",
    dueRelevant: false,
  },

  // Tomorrow — so the week view isn't empty
  {
    id: "sch-maggie-sat",
    patientId: "maggie",
    type: "visit",
    title: "Morning home visit",
    startsAt: "2026-08-01T09:00:00",
    endsAt: "2026-08-01T13:00:00",
    dueRelevant: false,
  },
  {
    id: "sch-helen-sat-meds",
    patientId: "helen",
    type: "med",
    title: "Morning meds with breakfast tray",
    startsAt: "2026-08-01T08:15:00",
    dueRelevant: true,
  },
];
