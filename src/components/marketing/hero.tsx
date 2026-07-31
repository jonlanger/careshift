import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden atmosphere">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-sage-mist/80 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col justify-between px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-18">
        <div className="max-w-xl space-y-5">
          <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Careshift
          </p>
          <h1 className="text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            Know what changed before the shift begins.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">
            In about 90 seconds, scan what changed, see what’s due now, leave one note —
            then you’re ready.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <LinkButton href="/sign-up" fullWidth className="sm:w-auto sm:min-w-44">
              Sign up
            </LinkButton>
            <LinkButton
              href="/sign-in"
              variant="secondary"
              fullWidth
              className="sm:w-auto sm:min-w-44"
            >
              Sign in
            </LinkButton>
          </div>
        </div>

        <div className="relative mt-10 w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Today’s brief
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            Maggie · Home visit
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Needs attention on a near catch in the hall. Watch mobility from the couch.
            Morning meds and fluids due in the next window.
          </p>
        </div>
      </div>
    </section>
  );
}
