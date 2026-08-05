import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

const control =
  "w-full rounded-xl border-2 border-border bg-surface px-4 text-base text-ink placeholder:text-ink-subtle focus-visible:border-focus";

function FieldMessages({ id, hint, error }: FieldProps) {
  if (error) {
    return (
      <p id={`${id}-error`} className="text-sm font-semibold text-alert" role="alert">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="text-sm text-ink-muted">
        {hint}
      </p>
    );
  }
  return null;
}

function describedBy({ id, hint, error }: FieldProps) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        className={[
          "touch-target min-h-[48px]",
          control,
          error ? "border-alert" : "",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy({ id, label, hint, error })}
        {...props}
      />
      <FieldMessages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  className = "",
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={[
            "touch-target min-h-[48px] appearance-none pr-11",
            control,
            error ? "border-alert" : "",
            className,
          ].join(" ")}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy({ id, label, hint, error })}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-ink-muted"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="size-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 7.5 10 12.5 15 7.5" />
          </svg>
        </span>
      </div>
      <FieldMessages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        className={[
          "min-h-28 py-3",
          control,
          error ? "border-alert" : "",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy({ id, label, hint, error })}
        {...props}
      />
      <FieldMessages id={id} label={label} hint={hint} error={error} />
    </div>
  );
}
