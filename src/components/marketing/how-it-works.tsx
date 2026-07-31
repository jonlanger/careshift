import { LinkButton } from "@/components/ui/button";

const steps = [
  {
    title: "See who you’re covering",
    body: "Open to the person, setting, and when the last handoff happened.",
  },
  {
    title: "Scan what changed",
    body: "Three to five changes — mood, sleep, appetite, incidents. Safety first.",
  },
  {
    title: "Check what’s due now",
    body: "Meds and tasks in the next window, with absolute and relative times.",
  },
  {
    title: "Leave a note, then done",
    body: "One short note for the next person, then confirm brief complete.",
  },
];

const capabilities = [
  {
    title: "Your whole caseload",
    body: "Every person you cover in one list, sorted by who still needs a brief.",
  },
  {
    title: "Add and manage people",
    body: "Create a record with setting, room, care team, and preferences that travel with each handoff.",
  },
  {
    title: "Coordinate shifts",
    body: "See who has which shift, claim what’s open, and flag a swap before anything goes uncovered.",
  },
  {
    title: "Home or facility",
    body: "The same ritual adapts its language — visits at home, shifts on a floor.",
  },
];

export function HowItWorks() {
  return (
    <section id="ritual" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-ink-muted">The ritual</p>
          <h2 className="type-h1 mt-3 text-ink">A ritual, not a platform</h2>
          <p className="type-lead mt-4 text-ink-muted">
            Built for phone-in-hand caregivers with limited time and interrupted attention —
            and it scales up to the desk when you’re planning the day.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 lg:flex-col">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="type-h3 text-ink">{step.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Capabilities() {
  return (
    <section id="coordinate" className="border-t border-border bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-ink-muted">Beyond the brief</p>
          <h2 className="type-h1 mt-3 text-ink">Everything the shift needs</h2>
          <p className="type-lead mt-4 text-ink-muted">
            The brief is the ritual. Around it sits just enough product to run a real caseload.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {capabilities.map((item) => (
            <li key={item.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="type-h3 text-ink">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/sign-up" size="lg" fullWidth className="sm:w-auto sm:min-w-48">
            Start free
          </LinkButton>
          <LinkButton
            href="/sign-in"
            variant="secondary"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-48"
          >
            Continue as demo
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
