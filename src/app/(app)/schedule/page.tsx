"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/input";
import { Card } from "@/components/ui/primitives";
import {
  addDaysKey,
  dayKey,
  eventsOnDay,
  scheduleTypeLabel,
} from "@/lib/schedule";
import { formatTime } from "@/lib/format";
import { useCareshift } from "@/lib/store";
import type { ScheduleEventType } from "@/lib/types";

const DEMO_DAY = "2026-07-31";

function localIsoFromInput(value: string) {
  return `${value}:00`;
}

function dayLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${key}T12:00:00`));
}

export default function SchedulePage() {
  const { patients, schedule, addScheduleEvent, rescheduleEvent } = useCareshift();
  const [day, setDay] = useState(DEMO_DAY);
  const [showForm, setShowForm] = useState(false);
  const [patientFilter, setPatientFilter] = useState<string | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const [type, setType] = useState<ScheduleEventType>("task");
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState(`${DEMO_DAY}T09:00`);
  const [dueRelevant, setDueRelevant] = useState(true);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDaysKey(DEMO_DAY, index - 1)),
    [],
  );

  const allDayEvents = eventsOnDay(schedule, day);

  const patientsToday = useMemo(() => {
    const ids = new Set(allDayEvents.map((event) => event.patientId));
    return patients.filter((patient) => ids.has(patient.id));
  }, [allDayEvents, patients]);

  const dayEvents =
    patientFilter === "all"
      ? allDayEvents
      : allDayEvents.filter((event) => event.patientId === patientFilter);

  function changeDay(next: string) {
    setDay(next);
    setPatientFilter("all");
    setExpandedId(null);
  }

  function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !patientId) return;

    addScheduleEvent({
      patientId,
      type,
      title,
      startsAt: localIsoFromInput(startsAt),
      dueRelevant,
    });

    setTitle("");
    setShowForm(false);
    setDay(dayKey(localIsoFromInput(startsAt)));
  }

  function nudge(eventId: string, minutes: number) {
    const target = schedule.find((item) => item.id === eventId);
    if (!target) return;
    const next = new Date(target.startsAt);
    next.setMinutes(next.getMinutes() + minutes);
    const pad = (n: number) => String(n).padStart(2, "0");
    const iso = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(next.getHours())}:${pad(next.getMinutes())}:00`;
    rescheduleEvent(eventId, iso);
    setDay(dayKey(iso));
  }

  return (
    <>
      <PageHeader
        eyebrow="Care calendar"
        title="Schedule"
        description="Plan meds, tasks, and visits. Anything due-relevant in a shift window shows up in Due now — and edits write into What changed."
        action={
          <Button type="button" onClick={() => setShowForm((open) => !open)}>
            <Plus className="size-4.5" aria-hidden="true" />
            {showForm ? "Close" : "Add to schedule"}
          </Button>
        }
      />

      <PageBody>
        {showForm ? (
          <Card className="mb-8">
            <form onSubmit={onAdd} className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="sch-patient"
                label="Patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.preferredName}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="sch-type"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as ScheduleEventType)}
              >
                <option value="med">Medication</option>
                <option value="task">Task</option>
                <option value="appointment">Appointment</option>
                <option value="visit">Visit</option>
              </SelectField>

              <div className="sm:col-span-2">
                <TextField
                  id="sch-title"
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Afternoon inhaler — confirm technique"
                />
              </div>

              <TextField
                id="sch-when"
                label="When"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink">Due now</span>
                <label className="touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-surface px-4 text-base text-ink">
                  <input
                    type="checkbox"
                    checked={dueRelevant}
                    onChange={(e) => setDueRelevant(e.target.checked)}
                    className="size-4 accent-[var(--brand)]"
                  />
                  Show in Due now during the shift window
                </label>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" disabled={!title.trim()}>
                  Add to calendar
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => changeDay(addDaysKey(day, -1))}
            className="touch-target inline-flex items-center gap-1 rounded-xl px-3 text-sm font-semibold text-ink-muted hover:bg-linen-deep hover:text-ink"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Prev
          </button>
          <p className="font-display text-xl font-semibold text-ink">{dayLabel(day)}</p>
          <button
            type="button"
            onClick={() => changeDay(addDaysKey(day, 1))}
            className="touch-target inline-flex items-center gap-1 rounded-xl px-3 text-sm font-semibold text-ink-muted hover:bg-linen-deep hover:text-ink"
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Week"
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          {weekDays.map((weekDay) => {
            const selected = weekDay === day;
            const count = eventsOnDay(schedule, weekDay).length;
            return (
              <button
                key={weekDay}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => changeDay(weekDay)}
                className={[
                  "min-w-20 shrink-0 rounded-xl border px-3 py-2.5 text-left transition",
                  selected
                    ? "border-brand/30 bg-brand-soft text-brand"
                    : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
                ].join(" ")}
              >
                <span className="block text-xs font-bold uppercase tracking-wide">
                  {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
                    new Date(`${weekDay}T12:00:00`),
                  )}
                </span>
                <span className="mt-0.5 block text-lg font-semibold">
                  {new Date(`${weekDay}T12:00:00`).getDate()}
                </span>
                <span className="block text-xs font-semibold opacity-80">
                  {count} item{count === 1 ? "" : "s"}
                </span>
              </button>
            );
          })}
        </div>

        <section aria-labelledby="day-events" className="mt-8 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="day-events" className="type-h2 text-ink">
              {dayLabel(day)}
            </h2>
            {dayEvents.length > 0 ? (
              <p className="text-sm font-semibold text-ink-muted" aria-live="polite">
                Showing {dayEvents.length} of {allDayEvents.length}
              </p>
            ) : null}
          </div>

          {patientsToday.length > 1 ? (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter this day by patient"
            >
              <button
                type="button"
                aria-pressed={patientFilter === "all"}
                onClick={() => setPatientFilter("all")}
                className={[
                  "touch-target rounded-full border-2 px-4 text-sm font-bold transition",
                  patientFilter === "all"
                    ? "border-brand bg-brand text-on-brand"
                    : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
                ].join(" ")}
              >
                All
              </button>
              {patientsToday.map((patient) => {
                const active = patientFilter === patient.id;
                return (
                  <button
                    key={patient.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPatientFilter(patient.id)}
                    className={[
                      "touch-target rounded-full border-2 px-4 text-sm font-bold transition",
                      active
                        ? "border-brand bg-brand text-on-brand"
                        : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
                    ].join(" ")}
                  >
                    {patient.preferredName}
                  </button>
                );
              })}
            </div>
          ) : null}

          {dayEvents.length === 0 ? (
            <Card>
              <p className="text-base text-ink-muted">
                Nothing scheduled this day. Add a med, task, or visit to feed Due now.
              </p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {dayEvents.map((event) => {
                const patient = patients.find((p) => p.id === event.patientId);
                const expanded = expandedId === event.id;
                return (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="type-eyebrow text-ink-subtle">
                          {scheduleTypeLabel(event.type)}
                          {event.dueRelevant ? " · Due now" : ""}
                        </p>
                        <p className="mt-1.5 font-display text-xl font-semibold text-ink">
                          {event.title}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {patient ? (
                            <Link
                              href={`/patients/${patient.id}`}
                              className="font-semibold text-brand no-underline"
                            >
                              {patient.preferredName}
                            </Link>
                          ) : (
                            "Unknown patient"
                          )}
                          {" · "}
                          {formatTime(event.startsAt)}
                          {event.endsAt ? `–${formatTime(event.endsAt)}` : ""}
                        </p>
                        {event.notes ? (
                          <p className="mt-2 text-sm text-ink-muted">{event.notes}</p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpandedId(expanded ? null : event.id)}
                        className="touch-target inline-flex shrink-0 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-ink-muted transition hover:bg-linen-deep hover:text-ink"
                      >
                        Reschedule
                        <ChevronDown
                          className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    {expanded ? (
                      <div className="mt-3 border-t border-border pt-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => nudge(event.id, -30)}
                          >
                            −30 min
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => nudge(event.id, 30)}
                          >
                            +30 min
                          </Button>
                        </div>
                        <p className="mt-3 text-xs font-semibold text-ink-subtle">
                          Moving this writes a What changed entry for the next brief.
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </PageBody>
    </>
  );
}
