import type { Patient } from "@/lib/types";

export const CAREGIVER_NAME = "Alex Rivera";

export const patients: Patient[] = [
  {
    id: "maggie",
    firstName: "Margaret",
    lastName: "Ellison",
    preferredName: "Maggie",
    setting: "home",
    summary: "Post-hip surgery recovery. Lives alone with daily morning visits.",
    status: "attention",
    shiftStart: "2026-07-31T09:00:00",
    dueWindowHours: 3,
    lastHandoff: { at: "2026-07-30T18:15:00", by: "Jordan Lee" },
    briefStale: false,
    deltas: [
      {
        id: "maggie-d1",
        category: "incident",
        summary: "Caught foot on hall rug once — no fall. Rug moved out of the path.",
        severity: "attention",
        detail:
          "Happened around 7:40pm walking from the living room to the bathroom. She steadied herself on the doorframe and sat down for a few minutes. No pain, no bruising, full weight bearing afterwards.",
        comparison: {
          before:
            "Hall runner was down in the path between the living room and bathroom. No trips or stumbles reported this week.",
          after:
            "Runner is rolled up in the hall closet. One caught foot last night, no fall and no injury.",
        },
        observedAt: "2026-07-30T19:40:00",
        reportedBy: "Jordan Lee",
        notes: [
          {
            id: "maggie-d1-n1",
            body: "Told her daughter by phone. She's fine with the rug staying up.",
            author: "Jordan Lee",
            at: "2026-07-30T20:05:00",
          },
        ],
      },
      {
        id: "maggie-d2",
        category: "mobility",
        summary: "Needed two-hand support standing from the couch three times last evening.",
        severity: "watch",
        detail:
          "Once she was up her walking was steady. Worth watching whether this is fatigue at the end of the day or a real change.",
        comparison: {
          before:
            "One hand on the armrest was enough to stand from the couch earlier in the week.",
          after:
            "Needed two-hand support three times last evening, all after 6pm.",
        },
        observedAt: "2026-07-30T18:30:00",
        reportedBy: "Jordan Lee",
        notes: [],
      },
      {
        id: "maggie-d3",
        category: "appetite",
        summary: "Ate about half of dinner; finished a yogurt. Drinking less after 7pm.",
        severity: "note",
        detail:
          "She says she's cutting back on liquids in the evening so she doesn't have to get up at night. Offer fluids earlier in the day instead of pushing them after dinner.",
        comparison: {
          before: "Finishing most of dinner and taking fluids through the evening.",
          after:
            "About half of dinner plus a yogurt, and nothing to drink after 7pm by her own choice.",
        },
        observedAt: "2026-07-30T18:00:00",
        reportedBy: "Jordan Lee",
        notes: [],
      },
      {
        id: "maggie-d4",
        category: "mood",
        summary: "More tired and confused with the TV on after 8pm. Lamp lighting helped.",
        severity: "note",
        detail:
          "Turning off the overhead light and switching on the corner lamp settled her within about ten minutes. She asked twice what day it was, then tracked the conversation fine.",
        comparison: {
          before: "Evenings with the TV on and the overhead light were settled.",
          after:
            "Tired and briefly confused with the TV on after 8pm. Corner lamp only was noticeably better.",
        },
        observedAt: "2026-07-30T20:15:00",
        reportedBy: "Jordan Lee",
        notes: [],
      },
    ],
    dueNow: [
      {
        id: "maggie-t1",
        type: "med",
        label: "Morning blood pressure med with breakfast",
        dueAt: "2026-07-31T09:30:00",
        status: "due",
      },
      {
        id: "maggie-t2",
        type: "task",
        label: "Assist with morning wash and dressing",
        dueAt: "2026-07-31T10:00:00",
        status: "upcoming",
      },
      {
        id: "maggie-t3",
        type: "task",
        label: "Encourage fluids — aim for 16 oz by noon",
        dueAt: "2026-07-31T11:30:00",
        status: "upcoming",
      },
    ],
    careTeam: [
      { id: "maggie-c1", name: "Jordan Lee", role: "Evening caregiver", shiftLabel: "4–10pm" },
      { id: "maggie-c2", name: "Priya Raman", role: "Supervising nurse", shiftLabel: "On call" },
    ],
    preferences: [
      "Prefers lamp lighting over overhead after 8pm",
      "Likes coffee before any personal care",
      "Hard of hearing on the left side",
    ],
  },
  {
    id: "helen",
    firstName: "Helen",
    lastName: "Whitfield",
    preferredName: "Helen",
    setting: "facility",
    roomLabel: "Room 214",
    summary: "Long-term memory care resident. Post-fall monitoring in place.",
    status: "attention",
    shiftStart: "2026-07-31T07:00:00",
    dueWindowHours: 3,
    lastHandoff: { at: "2026-07-31T06:40:00", by: "Sam Okonkwo (night)" },
    briefStale: false,
    deltas: [
      {
        id: "helen-d1",
        category: "incident",
        summary: "Near-fall at 02:10 reaching for blanket. No injury. Post-fall checks done.",
        severity: "attention",
        detail:
          "Found sitting on the edge of the bed leaning far over the side rail. Neuro and vitals were normal at 02:20 and again at 04:20. Repeat observations are due this morning.",
        comparison: {
          before:
            "Bed at standard height with one blanket. No overnight incidents the previous two nights.",
          after:
            "Bed lowered and a second blanket left within reach after the 02:10 near-fall. Post-fall checks all normal.",
        },
        observedAt: "2026-07-31T02:10:00",
        reportedBy: "Sam Okonkwo",
        notes: [
          {
            id: "helen-d1-n1",
            body: "Floor nurse notified at 02:15. Incident form started, needs a day-shift signature.",
            author: "Sam Okonkwo",
            at: "2026-07-31T02:25:00",
          },
        ],
      },
      {
        id: "helen-d2",
        category: "sleep",
        summary: "Restless until 03:30, then slept in short stretches.",
        severity: "watch",
        detail:
          "Up four times before 03:30, mostly rearranging the bedding. Settled after a warm drink. Expect her to be tired and slower to follow instructions this morning.",
        comparison: {
          before: "Usually settles by 22:30 and sleeps through with one wake.",
          after: "Restless until 03:30, then short stretches of sleep until morning.",
        },
        observedAt: "2026-07-31T03:30:00",
        reportedBy: "Sam Okonkwo",
        notes: [],
      },
      {
        id: "helen-d3",
        category: "appetite",
        summary: "Refused evening snack. Accepted water with prompting.",
        severity: "note",
        detail:
          "Second evening in a row she's turned down the snack. She took about 200ml of water when it was handed to her rather than left on the table.",
        comparison: {
          before:
            "Took the evening snack most nights and drank water left on the bedside table.",
          after:
            "Refused the snack two evenings running. Drinks water only when it is handed to her.",
        },
        observedAt: "2026-07-30T20:45:00",
        reportedBy: "Sam Okonkwo",
        notes: [],
      },
    ],
    dueNow: [
      {
        id: "helen-t1",
        type: "task",
        label: "Repeat observations — post-fall follow-up",
        dueAt: "2026-07-31T08:00:00",
        status: "due",
      },
      {
        id: "helen-t2",
        type: "med",
        label: "Morning meds with breakfast tray",
        dueAt: "2026-07-31T08:15:00",
        status: "due",
      },
      {
        id: "helen-t3",
        type: "task",
        label: "Dressing check — look for leak-through",
        dueAt: "2026-07-31T09:00:00",
        status: "upcoming",
      },
    ],
    careTeam: [
      { id: "helen-c1", name: "Sam Okonkwo", role: "Night aide", shiftLabel: "7pm–7am" },
      { id: "helen-c2", name: "Dana Cruz", role: "Floor nurse", shiftLabel: "7am–3pm" },
    ],
    preferences: [
      "Responds best to slow, single-step instructions",
      "Keeps a photo of her sister on the nightstand — do not move",
    ],
  },
  {
    id: "arthur",
    firstName: "Arthur",
    lastName: "Boyd",
    preferredName: "Art",
    setting: "home",
    summary: "COPD management. Afternoon visits, four days a week.",
    status: "needs-brief",
    shiftStart: "2026-07-31T13:00:00",
    dueWindowHours: 3,
    lastHandoff: { at: "2026-07-29T16:30:00", by: "Marcus Hill" },
    briefStale: false,
    deltas: [
      {
        id: "arthur-d1",
        category: "mobility",
        summary: "Needed one rest walking bedroom to kitchen. Short of breath at the halfway point.",
        severity: "watch",
        detail:
          "He recovered after about a minute sitting on the hall chair and finished the walk on his own.",
        comparison: {
          before: "Made the bedroom-to-kitchen walk without stopping last weekend.",
          after:
            "Needed one seated rest at the halfway point, short of breath, then finished unaided.",
        },
        observedAt: "2026-07-29T15:50:00",
        reportedBy: "Marcus Hill",
        notes: [],
      },
      {
        id: "arthur-d2",
        category: "medication",
        summary: "Nurse reviewed inhaler technique. Keep tracking blood pressure daily.",
        severity: "note",
        detail:
          "Priya watched him use the inhaler and corrected the timing of the breath. He does better when someone counts the hold out loud with him.",
        comparison: {
          before: "Self-managing the inhaler with no review since the last plan change.",
          after:
            "Breath timing corrected by the nurse. Count the hold out loud with him and log blood pressure daily.",
        },
        observedAt: "2026-07-29T16:10:00",
        reportedBy: "Priya Raman",
        notes: [],
      },
    ],
    dueNow: [
      {
        id: "arthur-t1",
        type: "med",
        label: "Afternoon inhaler — confirm technique",
        dueAt: "2026-07-31T13:30:00",
        status: "due",
      },
      {
        id: "arthur-t2",
        type: "task",
        label: "Light meal prep and dishes",
        dueAt: "2026-07-31T14:30:00",
        status: "upcoming",
      },
    ],
    careTeam: [
      { id: "arthur-c1", name: "Marcus Hill", role: "Weekend caregiver", shiftLabel: "Sat–Sun" },
      { id: "arthur-c2", name: "Priya Raman", role: "Supervising nurse", shiftLabel: "On call" },
    ],
    preferences: ["Prefers windows open during visits", "Does his own medication reminders"],
  },
  {
    id: "rosa",
    firstName: "Rosa",
    lastName: "Delgado",
    preferredName: "Rosa",
    setting: "facility",
    roomLabel: "Room 108",
    summary: "Rehab stay after knee replacement. Discharge planning underway.",
    status: "briefed",
    shiftStart: "2026-07-31T07:00:00",
    dueWindowHours: 3,
    lastHandoff: { at: "2026-07-31T06:55:00", by: "Sam Okonkwo (night)" },
    briefStale: false,
    deltas: [
      {
        id: "rosa-d1",
        category: "mood",
        summary: "Bright and talkative. Asked about going home this weekend.",
        severity: "note",
        detail:
          "Discharge planning is still in progress, so nothing has been promised to her. If she asks again, say the team is working on it rather than giving a date.",
        comparison: {
          before: "Quiet and focused on rehab sessions, hadn't raised going home.",
          after: "Bright and talkative, asking directly about leaving this weekend.",
        },
        observedAt: "2026-07-31T06:30:00",
        reportedBy: "Sam Okonkwo",
        notes: [],
      },
      {
        id: "rosa-d2",
        category: "sleep",
        summary: "Slept through the night without pain medication.",
        severity: "note",
        detail:
          "First full night since the knee replacement without asking for anything overnight.",
        comparison: {
          before: "Asking for pain medication overnight most nights since surgery.",
          after: "Slept through with nothing needed overnight.",
        },
        observedAt: "2026-07-31T06:00:00",
        reportedBy: "Sam Okonkwo",
        notes: [],
      },
    ],
    dueNow: [
      {
        id: "rosa-t1",
        type: "task",
        label: "Walk to the day room with walker",
        dueAt: "2026-07-31T09:30:00",
        status: "upcoming",
      },
    ],
    careTeam: [
      { id: "rosa-c1", name: "Dana Cruz", role: "Floor nurse", shiftLabel: "7am–3pm" },
      { id: "rosa-c2", name: "Theo Park", role: "Physical therapy", shiftLabel: "Mon/Wed/Fri" },
    ],
    preferences: ["Uses walker for all transfers", "Prefers Spanish for medical explanations"],
  },
  {
    id: "walter",
    firstName: "Walter",
    lastName: "Nguyen",
    preferredName: "Walt",
    setting: "home",
    summary: "New client. First visit — no handoff on file yet.",
    status: "needs-brief",
    shiftStart: "2026-07-31T15:00:00",
    dueWindowHours: 3,
    lastHandoff: null,
    briefStale: true,
    deltas: [],
    dueNow: [
      {
        id: "walter-t1",
        type: "task",
        label: "Review care plan binder on arrival",
        dueAt: "2026-07-31T15:15:00",
        status: "due",
      },
      {
        id: "walter-t2",
        type: "med",
        label: "Evening medication reminder",
        dueAt: "2026-07-31T17:00:00",
        status: "upcoming",
      },
    ],
    careTeam: [
      { id: "walter-c1", name: "Priya Raman", role: "Supervising nurse", shiftLabel: "On call" },
    ],
    preferences: ["Daughter Linh is primary family contact"],
  },
];

export function findPatient(list: Patient[], id: string | undefined) {
  return list.find((patient) => patient.id === id);
}
