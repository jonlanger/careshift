"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native <dialog> so focus trapping, Esc, and inertness come from the platform
 * instead of a JS implementation we would have to keep honest.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-xl overflow-hidden rounded-2xl border border-border bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/45 sm:w-[calc(100%-4rem)]"
    >
      {open ? children : null}
    </dialog>
  );
}

export function DialogCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="touch-target -mr-2 grid shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-linen-deep hover:text-ink"
    >
      <X className="size-5" aria-hidden="true" />
      <span className="sr-only">Close</span>
    </button>
  );
}
