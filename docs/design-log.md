# Careshift design log

A running record of interaction-design decisions: the problem, what we chose, why, and what we chose not to do. Newest entries first. This is the raw material for the portfolio case study — write entries so they hold up read out of order, months later, by someone who wasn't in the conversation.

Entry format: **Problem → Decision → Why → Trade-off considered.** Add **Evidence** when a decision leans on outside research rather than judgment alone.

---

## 2026-08-05 — Add a Recommendation field to Delta (close the SBAR loop)

**Problem:** SBAR's fourth step — Recommendation, "what should happen next" — had no home in the data model. Attention/watch deltas carried a narrative (`detail`) and free-text `notes`, but nothing structured for the one thing a busy incoming caregiver most needs from a flagged item: what to actually do about it. Flagged as a gap in the research entry below rather than invented fresh.

**Decision:** Added an optional `recommendation` field to `Delta`. Surfaced it in three places: the Log Observation form (label reads "Recommended action" and drops "(optional)" whenever severity isn't `note`, since that's when it matters most), the delta card in list/card views, and the delta detail dialog — each time as a visually distinct callout, not blended into the narrative detail text. Backfilled two seed deltas (the hall-rug incident, the couch-support watch item) so the feature has real content on first load instead of an empty state.

**Why:** Keeping it optional rather than required matches the same call made on the review gate — don't add friction to logging, since research also says caregivers already under-document. Nudging via label copy instead of validation gets the behavior we want without a hard block.

**Trade-off considered:** Did not add the recommendation field to the compact List row view — that view is deliberately dense, and a recommendation is exactly the kind of content that deserves room rather than a truncated line. It shows in Cards view and the full detail dialog, which is enough exposure without undermining why List view exists.

---

## 2026-08-05 — Ground the roadmap in real handoff research

**Problem:** Every UX decision so far had been judgment calls about a domain (home health/facility caregiving) neither of us works in day to day. Before building more, worth checking whether the product's structure matches how real shift handoffs actually work and fail.

**Findings:**
- SBAR (Situation, Background, Assessment, Recommendation) is the standard clinical handoff framework. Careshift's 4-step brief (*covering → changes → due → note*) already maps onto it closely — validates the existing structure rather than suggesting a rebuild.
- Shift documentation is expected at **both ends** of a shift — an outgoing report as well as an incoming brief. Careshift only had the incoming half; there was no way for a caregiver to log a new observation anywhere in the app. This became the next build (see below).
- Documented handoff failure modes include omitted care tasks (~10% of protocol failures) and missing contingency/next-step guidance (~31%) — supports keeping the review gate we'd already shipped (see 2026-08-05 entry below) and flags "what should the next person do about this" as a real, evidence-backed gap in the Delta model, not just a nice-to-have. Not built yet — logged here so it isn't lost.
- Home care specifically (vs. hospital) suffers from "lost in transition" and lack of shared documentation among informal caregivers — this is Careshift's problem statement, independently confirmed rather than assumed.

**Evidence:**
- [SBAR: Handoff Communication Technique for Nurses](https://scholarworks.waldenu.edu/cgi/viewcontent.cgi?article=19869&context=dissertations)
- [Daily Checklist for Caregivers — FirstVisit Software](https://firstvisitsoftware.com/blog/checklist-for-caregivers/)
- [Home caregiver shift report template — Sagebeam](https://www.mysagebeam.com/resources/home-caregiver-shift-report-template)
- [AHRQ TeamSTEPPS — Handoff tool](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html)
- [Awareness and handoffs in home care: coordination among informal caregivers](https://www.researchgate.net/publication/321323665_Awareness_and_handoffs_in_home_care_coordination_among_informal_caregivers)
- [Healthcare handoffs among lay caregivers — PubMed](https://pubmed.ncbi.nlm.nih.gov/33459787/)

**Deferred, not built:** a structured "recommended action" field on attention/watch deltas (the missing SBAR "R"), and a vitals/pain delta category. Both are evidence-backed candidates for a future entry — held back to keep this round scoped to the authoring-flow gap.

---

## 2026-08-05 — Log an observation (new authoring flow)

**Problem:** Careshift could only ever *display* changes — they arrived from seed data or as a side effect of editing the schedule. A caregiver noticing something worth flagging (a fall, a mood change, appetite drop) had no way to record it. Confirmed by the research above: shift documentation is supposed to happen at both ends of a shift, not just at brief time.

**Decision:** Added `addDelta` to the store and a "Log observation" entry point on the patient detail page. Caregiver picks category + severity, writes a short summary and optional detail; the record author and timestamp are captured automatically.

**Why:** This is the smallest change that closes the authoring gap without duplicating the brief flow's structure. Reusing the existing `Delta` model (rather than inventing a parallel "report" type) means a manually logged observation behaves identically everywhere a delta already appears — Today, the brief flow's review gate, the patient record.

**Trade-off considered:** Did not add a before/after comparison field to the quick-add form, even though `Delta` supports one. Comparison pairs are precise but slower to fill in one-handed on a phone mid-shift; the existing schedule-edit path already produces comparisons where structure is available for free. Manual entries stay narrative-only to keep the form fast.

---

## 2026-08-05 — Gate the brief flow on unreviewed "needs attention" items

**Problem:** The "What changed" step showed a review counter ("0 of 4 reviewed") but never enforced it — a caregiver could advance past a `NEEDS ATTENTION` fall incident without opening it. Confirmed live in the browser, not just in code: clicked through with zero items reviewed and the app let it through.

**Decision:** Disable the step's continue button while any `attention`-severity delta is unacknowledged; show the reason inline. `watch` and `note` severity items stay skippable.

**Why:** The counter existing at all signals intent — the product wants review to matter — but it wasn't wired to anything. Gating only on the highest severity keeps the fix targeted at the safety-critical case instead of adding friction to routine shifts where most deltas are low-stakes.

**Trade-off considered:** Could have required all deltas reviewed, not just `attention` ones. Decided against it — that would make every brief slower in proportion to how much gets logged, which cuts against wanting caregivers to log more (see the authoring-flow entry above). Flagged as a judgment call worth revisiting if it turns out `watch` items get skipped in practice.

---

## 2026-08-05 — Schedule: patient filter, reveal-on-interact reschedule controls, drop repeated caption

**Problem:** Walked the Schedule page with seed data and found a single day already had 16 items in one flat, ungrouped list mixing five patients' meds/tasks/visits — hard to prep "everything for one person" at a glance. Every card also permanently exposed live reschedule buttons (each one writes a delta) and repeated the same explanatory caption 16 times.

**Decision:** Added a patient filter chip row (reusing the filter pattern already on the Patients page); collapsed the ±30 min reschedule controls behind a per-card "Reschedule" toggle; moved the "this writes a What changed entry" caption inside that same reveal, so it only shows when relevant instead of on every row.

**Why:** All three problems had the same root cause — a card pattern built for a 3-4 item demo caseload that doesn't hold up once the list is realistically long. Filtering and collapsing controls are both about the same thing: don't make the caregiver's eye do work that a click can do instead.

**Trade-off considered:** Grouping by patient (visual sections) vs. filtering (chip row, one patient's items at a time). Chose filtering — grouping keeps everyone's view of the day, but a caregiver mid-shift usually cares about one patient's schedule at a time, and the filter chips already existed as a pattern elsewhere in the app, so reusing it kept the change small.
