"use client";

import { Plus } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogCloseButton } from "@/components/ui/dialog";
import { SelectField, TextAreaField, TextField } from "@/components/ui/input";
import { formatCategory, formatSeverity } from "@/lib/format";
import { useCareshift } from "@/lib/store";
import type { DeltaCategory, DeltaSeverity } from "@/lib/types";

const categories: DeltaCategory[] = [
  "mood",
  "sleep",
  "appetite",
  "incident",
  "mobility",
  "medication",
  "schedule",
];

const severities: DeltaSeverity[] = ["attention", "watch", "note"];

const maxSummary = 140;
const maxDetail = 400;
const maxRecommendation = 200;

export function LogObservationDialog({ patientId }: { patientId: string }) {
  const { addDelta } = useCareshift();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<DeltaCategory>("mobility");
  const [severity, setSeverity] = useState<DeltaSeverity>("watch");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const titleId = useId();
  const actionable = severity !== "note";

  function reset() {
    setCategory("mobility");
    setSeverity("watch");
    setSummary("");
    setDetail("");
    setRecommendation("");
  }

  function close() {
    setOpen(false);
    reset();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!summary.trim()) return;
    addDelta({
      patientId,
      category,
      severity,
      summary,
      detail: detail || undefined,
      recommendation: recommendation || undefined,
    });
    close();
  }

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        <Plus className="size-4.5" aria-hidden="true" />
        Log observation
      </Button>

      <Dialog open={open} onClose={close} labelledBy={titleId}>
        <form onSubmit={submit} className="flex max-h-[85svh] flex-col">
          <div className="flex items-start gap-3 border-b border-border px-4 py-4 sm:px-6">
            <h2 id={titleId} className="type-h3 flex-1 text-ink">
              Log an observation
            </h2>
            <DialogCloseButton onClick={close} />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="obs-category"
                label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value as DeltaCategory)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {formatCategory(item)}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="obs-severity"
                label="Severity"
                value={severity}
                onChange={(event) => setSeverity(event.target.value as DeltaSeverity)}
                hint="How the next caregiver should treat this"
              >
                {severities.map((item) => (
                  <option key={item} value={item}>
                    {formatSeverity(item)}
                  </option>
                ))}
              </SelectField>
            </div>

            <TextField
              id="obs-summary"
              label="What happened"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              maxLength={maxSummary}
              placeholder="e.g. Refused breakfast, said stomach hurt"
            />

            <TextAreaField
              id="obs-detail"
              label="More detail (optional)"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              maxLength={maxDetail}
              hint={`${detail.length} / ${maxDetail} characters`}
              placeholder="Anything the next caregiver should know."
            />

            <TextField
              id="obs-recommendation"
              label={actionable ? "Recommended action" : "Recommended action (optional)"}
              value={recommendation}
              onChange={(event) => setRecommendation(event.target.value)}
              maxLength={maxRecommendation}
              hint={
                actionable
                  ? "What should the next caregiver do about this?"
                  : "Only if there's something to act on."
              }
              placeholder="e.g. Keep the hallway clear; check in before her evening walk."
            />
          </div>

          <div className="border-t border-border px-4 py-4 sm:px-6">
            <Button type="submit" fullWidth disabled={!summary.trim()}>
              Log observation
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
