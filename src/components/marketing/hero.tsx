import { LinkButton } from "@/components/ui/button";

const previewDeltas = [
  {
    rail: "bg-alert",
    glyph: "!",
    label: "text-alert",
    eyebrow: "Needs attention · Incident",
    body: "Caught foot on hall rug once — no fall. Rug moved out of the path.",
  },
  {
    rail: "bg-ink",
    glyph: "▲",
    label: "text-ink-muted",
    eyebrow: "Watch · Mobility",
    body: "Two-hand support standing from the couch three times last evening.",
  },
  {
    rail: "bg-border-strong",
    glyph: "•",
    label: "text-ink-subtle",
    eyebrow: "Note · Appetite",
    body: "Ate about half of dinner. Drinking less after 7pm.",
  },
];

export function Hero() {
  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-ink-muted">Careshift</p>
          <h1 className="type-display mt-3 text-ink">
            Know what changed before you begin.
          </h1>
          <p className="type-lead mt-5 max-w-xl text-ink-muted">
            A 90-second brief for caregivers — what changed, what’s due now, then ready.
            Manage your caseload and keep shifts covered in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LinkButton href="/sign-up" size="lg" fullWidth className="sm:w-auto sm:min-w-48">
              Sign up
            </LinkButton>
            <LinkButton
              href="/sign-in"
              variant="secondary"
              size="lg"
              fullWidth
              className="sm:w-auto sm:min-w-48"
            >
              Sign in
            </LinkButton>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="type-eyebrow text-ink-subtle">Brief in</dt>
              <dd className="font-display text-2xl font-semibold text-ink">90 sec</dd>
            </div>
            <div>
              <dt className="type-eyebrow text-ink-subtle">Changes</dt>
              <dd className="font-display text-2xl font-semibold text-ink">3–5 max</dd>
            </div>
            <div>
              <dt className="type-eyebrow text-ink-subtle">Settings</dt>
              <dd className="font-display text-2xl font-semibold text-ink">Home + facility</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(15,26,23,0.35)]">
            <div className="border-b border-border px-5 py-4">
              <p className="type-eyebrow text-ink-muted">Step 2 of 4 · What changed</p>
              <p className="font-display text-2xl font-semibold text-ink">
                Maggie · Home visit
              </p>
              <div className="mt-3 flex gap-1.5" aria-hidden="true">
                <span className="h-1.5 flex-1 rounded-full bg-brand" />
                <span className="h-1.5 flex-1 rounded-full bg-brand" />
                <span className="h-1.5 flex-1 rounded-full bg-border" />
                <span className="h-1.5 flex-1 rounded-full bg-border" />
              </div>
            </div>

            <ul className="space-y-3 p-5">
              {previewDeltas.map((item) => (
                <li
                  key={item.eyebrow}
                  className="flex overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <span className={`w-1.5 shrink-0 ${item.rail}`} aria-hidden="true" />
                  <div className="px-4 py-3">
                    <p className={`type-eyebrow flex items-center gap-1.5 ${item.label}`}>
                      <span aria-hidden="true">{item.glyph}</span>
                      {item.eyebrow}
                    </p>
                    <p className="mt-1.5 text-base leading-snug text-ink">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <p className="flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-5 text-base font-semibold text-on-brand">
                See what’s due
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
