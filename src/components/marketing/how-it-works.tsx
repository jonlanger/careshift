import { LinkButton } from "@/components/ui/button";

const steps = [
  {
    title: "See who you’re covering",
    body: "Open to the person, setting, and when the last handoff happened.",
  },
  {
    title: "Scan what changed",
    body: "Three to five deltas — mood, sleep, appetite, incidents — nothing more.",
  },
  {
    title: "Check what’s due now",
    body: "Meds and tasks in the next window, with clear times.",
  },
  {
    title: "Optional note, then done",
    body: "Leave one short note for the next person and confirm brief complete.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border/70 bg-surface" id="how-it-works">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          A ritual, not a platform
        </h2>
        <p className="mt-3 max-w-xl text-lg text-ink-muted">
          Built for phone-in-hand caregivers with limited time and interrupted attention —
          home visits or facility floors.
        </p>

        <ol className="mt-10 space-y-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cta text-sm font-bold text-cta-text"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/sign-up" fullWidth className="sm:w-auto">
            Start free
          </LinkButton>
          <LinkButton href="/sign-in" variant="secondary" fullWidth className="sm:w-auto">
            Continue as demo
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
