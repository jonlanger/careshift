"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageBody, PageHeader } from "@/components/app/app-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/input";
import { useCareshift } from "@/lib/store";
import type { CareSetting } from "@/lib/types";

export default function NewPatientPage() {
  const router = useRouter();
  const { addPatient } = useCareshift();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [setting, setSetting] = useState<CareSetting>("home");
  const [roomLabel, setRoomLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter a first and last name.");
      return;
    }

    const patient = addPatient({
      firstName,
      lastName,
      preferredName,
      setting,
      roomLabel,
      summary,
    });

    router.push(`/patients/${patient.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Caseload"
        title="Add a patient"
        description="Create a record so the next caregiver has somewhere to hand off to."
      />

      <PageBody>
        <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="firstName"
              label="First name"
              value={firstName}
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              id="lastName"
              label="Last name"
              value={lastName}
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <TextField
            id="preferredName"
            label="Preferred name"
            value={preferredName}
            hint="What they'd like to be called. Defaults to first name."
            onChange={(e) => setPreferredName(e.target.value)}
          />

          <div
            className={
              setting === "facility" ? "grid gap-5 sm:grid-cols-2" : undefined
            }
          >
            <SelectField
              id="setting"
              label="Care setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value as CareSetting)}
            >
              <option value="home">Home visit</option>
              <option value="facility">Facility</option>
            </SelectField>

            {setting === "facility" ? (
              <TextField
                id="roomLabel"
                label="Room"
                value={roomLabel}
                placeholder="Room 214"
                onChange={(e) => setRoomLabel(e.target.value)}
              />
            ) : null}
          </div>

          <TextAreaField
            id="summary"
            label="One-line context"
            value={summary}
            maxLength={160}
            hint={`${summary.length} / 160 characters`}
            placeholder="Post-surgery recovery. Morning visits four days a week."
            onChange={(e) => setSummary(e.target.value)}
          />

          {error ? (
            <p className="text-sm font-semibold text-alert" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="sm:min-w-44">
              Add patient
            </Button>
            <LinkButton href="/patients" variant="secondary" className="sm:min-w-44">
              Cancel
            </LinkButton>
          </div>
        </form>
      </PageBody>
    </>
  );
}
