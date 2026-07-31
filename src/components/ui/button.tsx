import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "touch-target inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-brand shadow-sm hover:brightness-115 active:brightness-95",
  secondary:
    "bg-surface text-ink border-2 border-border-strong hover:border-ink hover:bg-linen-deep",
  ghost: "bg-transparent text-ink-muted underline-offset-4 hover:text-ink hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-[48px] px-5 text-base",
  lg: "min-h-[56px] px-6 text-lg",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[base, variants[variant], sizes[size], fullWidth ? "w-full" : "", className].join(
        " ",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={[
        base,
        "no-underline",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
