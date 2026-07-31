import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-cta text-cta-text hover:brightness-110 active:brightness-95 shadow-sm",
  secondary:
    "bg-surface text-ink border-2 border-ink/80 hover:bg-linen-deep active:bg-linen-deep",
  ghost: "bg-transparent text-ink underline-offset-4 hover:underline",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "touch-target inline-flex items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  fullWidth,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={[
        "touch-target inline-flex items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition no-underline",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
