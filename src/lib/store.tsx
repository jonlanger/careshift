"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CAREGIVER_NAME, patients as seedPatients } from "@/data/patients";
import { scheduleEvents as seedSchedule } from "@/data/schedule";
import { shiftSlots as seedShifts } from "@/data/shifts";
import {
  deltaFromScheduleChange,
  withDerivedDue,
} from "@/lib/schedule";
import type {
  Delta,
  NewDeltaInput,
  NewPatientInput,
  NewScheduleEventInput,
  Patient,
  ScheduleEvent,
  ShiftSlot,
} from "@/lib/types";

type Store = {
  caregiverName: string;
  patients: Patient[];
  shifts: ShiftSlot[];
  schedule: ScheduleEvent[];
  addPatient: (input: NewPatientInput) => Patient;
  markBriefed: (patientId: string) => void;
  setDeltaAcknowledged: (
    patientId: string,
    deltaId: string,
    acknowledged: boolean,
  ) => void;
  addDeltaNote: (patientId: string, deltaId: string, body: string) => void;
  addDelta: (input: NewDeltaInput) => Delta;
  claimShift: (shiftId: string) => void;
  requestSwap: (shiftId: string) => void;
  addScheduleEvent: (input: NewScheduleEventInput) => ScheduleEvent;
  rescheduleEvent: (eventId: string, startsAt: string, endsAt?: string) => void;
};

const CareshiftContext = createContext<Store | null>(null);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CareshiftProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(seedPatients);
  const [shifts, setShifts] = useState<ShiftSlot[]>(seedShifts);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(seedSchedule);

  const addPatient = useCallback((input: NewPatientInput) => {
    const preferred = input.preferredName.trim() || input.firstName.trim();
    const base = slugify(`${preferred}-${input.lastName}`) || "patient";
    const id = `${base}-${Math.random().toString(36).slice(2, 6)}`;

    const patient: Patient = {
      id,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      preferredName: preferred,
      setting: input.setting,
      roomLabel: input.setting === "facility" ? input.roomLabel?.trim() : undefined,
      summary: input.summary.trim() || "New record — no history yet.",
      status: "needs-brief",
      shiftStart: new Date().toISOString(),
      dueWindowHours: 3,
      lastHandoff: null,
      briefStale: true,
      deltas: [],
      dueNow: [],
      careTeam: [],
      preferences: [],
    };

    setPatients((current) => [patient, ...current]);
    return patient;
  }, []);

  const markBriefed = useCallback((patientId: string) => {
    setPatients((current) =>
      current.map((patient) =>
        patient.id === patientId ? { ...patient, status: "briefed" } : patient,
      ),
    );
  }, []);

  const updateDelta = useCallback(
    (patientId: string, deltaId: string, change: (delta: Delta) => Delta) => {
      setPatients((current) =>
        current.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                deltas: patient.deltas.map((delta) =>
                  delta.id === deltaId ? change(delta) : delta,
                ),
              }
            : patient,
        ),
      );
    },
    [],
  );

  const pushDelta = useCallback((patientId: string, delta: Delta) => {
    setPatients((current) =>
      current.map((patient) =>
        patient.id === patientId
          ? { ...patient, deltas: [delta, ...patient.deltas] }
          : patient,
      ),
    );
  }, []);

  const setDeltaAcknowledged = useCallback(
    (patientId: string, deltaId: string, acknowledged: boolean) => {
      updateDelta(patientId, deltaId, (delta) => ({
        ...delta,
        acknowledgedAt: acknowledged ? new Date().toISOString() : null,
        acknowledgedBy: acknowledged ? CAREGIVER_NAME : null,
      }));
    },
    [updateDelta],
  );

  const addDeltaNote = useCallback(
    (patientId: string, deltaId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;

      updateDelta(patientId, deltaId, (delta) => ({
        ...delta,
        notes: [
          ...(delta.notes ?? []),
          {
            id: `${deltaId}-n-${Math.random().toString(36).slice(2, 8)}`,
            body: trimmed,
            author: CAREGIVER_NAME,
            at: new Date().toISOString(),
          },
        ],
      }));
    },
    [updateDelta],
  );

  const addDelta = useCallback(
    (input: NewDeltaInput) => {
      const delta: Delta = {
        id: `delta-${Math.random().toString(36).slice(2, 8)}`,
        category: input.category,
        severity: input.severity,
        summary: input.summary.trim(),
        detail: input.detail?.trim() || undefined,
        recommendation: input.recommendation?.trim() || undefined,
        observedAt: new Date().toISOString(),
        reportedBy: CAREGIVER_NAME,
      };
      pushDelta(input.patientId, delta);
      return delta;
    },
    [pushDelta],
  );

  const claimShift = useCallback((shiftId: string) => {
    setShifts((current) =>
      current.map((slot) =>
        slot.id === shiftId
          ? { ...slot, caregiverName: CAREGIVER_NAME, status: "covered" }
          : slot,
      ),
    );
  }, []);

  const requestSwap = useCallback((shiftId: string) => {
    setShifts((current) =>
      current.map((slot) =>
        slot.id === shiftId ? { ...slot, status: "swap-requested" } : slot,
      ),
    );
  }, []);

  const addScheduleEvent = useCallback(
    (input: NewScheduleEventInput) => {
      const event: ScheduleEvent = {
        id: `sch-${Math.random().toString(36).slice(2, 9)}`,
        patientId: input.patientId,
        type: input.type,
        title: input.title.trim(),
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        dueRelevant: input.dueRelevant ?? true,
        notes: input.notes?.trim() || undefined,
      };

      setSchedule((current) =>
        [...current, event].sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        ),
      );

      pushDelta(
        event.patientId,
        deltaFromScheduleChange({
          event,
          author: CAREGIVER_NAME,
          kind: "added",
        }),
      );

      return event;
    },
    [pushDelta],
  );

  const rescheduleEvent = useCallback(
    (eventId: string, startsAt: string, endsAt?: string) => {
      const previous = schedule.find((event) => event.id === eventId);
      if (!previous || previous.startsAt === startsAt) return;

      const updated: ScheduleEvent = {
        ...previous,
        startsAt,
        endsAt: endsAt ?? previous.endsAt,
      };

      setSchedule((current) =>
        current
          .map((event) => (event.id === eventId ? updated : event))
          .sort(
            (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          ),
      );

      pushDelta(
        previous.patientId,
        deltaFromScheduleChange({
          event: updated,
          previousStartsAt: previous.startsAt,
          author: CAREGIVER_NAME,
          kind: "rescheduled",
        }),
      );
    },
    [schedule, pushDelta],
  );

  const patientsWithDue = useMemo(
    () => withDerivedDue(patients, schedule),
    [patients, schedule],
  );

  const value = useMemo<Store>(
    () => ({
      caregiverName: CAREGIVER_NAME,
      patients: patientsWithDue,
      shifts,
      schedule,
      addPatient,
      markBriefed,
      setDeltaAcknowledged,
      addDeltaNote,
      addDelta,
      claimShift,
      requestSwap,
      addScheduleEvent,
      rescheduleEvent,
    }),
    [
      patientsWithDue,
      shifts,
      schedule,
      addPatient,
      markBriefed,
      setDeltaAcknowledged,
      addDeltaNote,
      addDelta,
      claimShift,
      requestSwap,
      addScheduleEvent,
      rescheduleEvent,
    ],
  );

  return <CareshiftContext.Provider value={value}>{children}</CareshiftContext.Provider>;
}

export function useCareshift() {
  const context = useContext(CareshiftContext);
  if (!context) {
    throw new Error("useCareshift must be used inside CareshiftProvider");
  }
  return context;
}
