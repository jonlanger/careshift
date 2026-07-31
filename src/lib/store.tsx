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
import { shiftSlots as seedShifts } from "@/data/shifts";
import type { Delta, NewPatientInput, Patient, ShiftSlot } from "@/lib/types";

type Store = {
  caregiverName: string;
  patients: Patient[];
  shifts: ShiftSlot[];
  addPatient: (input: NewPatientInput) => Patient;
  markBriefed: (patientId: string) => void;
  setDeltaAcknowledged: (
    patientId: string,
    deltaId: string,
    acknowledged: boolean,
  ) => void;
  addDeltaNote: (patientId: string, deltaId: string, body: string) => void;
  claimShift: (shiftId: string) => void;
  requestSwap: (shiftId: string) => void;
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

  const claimShift = useCallback(
    (shiftId: string) => {
      setShifts((current) =>
        current.map((slot) =>
          slot.id === shiftId
            ? { ...slot, caregiverName: CAREGIVER_NAME, status: "covered" }
            : slot,
        ),
      );
    },
    [],
  );

  const requestSwap = useCallback((shiftId: string) => {
    setShifts((current) =>
      current.map((slot) =>
        slot.id === shiftId ? { ...slot, status: "swap-requested" } : slot,
      ),
    );
  }, []);

  const value = useMemo<Store>(
    () => ({
      caregiverName: CAREGIVER_NAME,
      patients,
      shifts,
      addPatient,
      markBriefed,
      setDeltaAcknowledged,
      addDeltaNote,
      claimShift,
      requestSwap,
    }),
    [
      patients,
      shifts,
      addPatient,
      markBriefed,
      setDeltaAcknowledged,
      addDeltaNote,
      claimShift,
      requestSwap,
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
