"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { createDemoSession } from "@/lib/session-client";

type Mode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignUp = mode === "sign-up";

  function continueDemo() {
    createDemoSession();
    router.push("/brief");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }
    if (isSignUp && !name.trim()) {
      setError("Enter your name to create an account.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }

    setPending(true);
    createDemoSession();
    router.push("/brief");
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 py-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-base text-ink-muted">
          {isSignUp
            ? "Start your shift brief in under a minute."
            : "Sign in to open today’s brief."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {isSignUp ? (
          <TextField
            id="name"
            label="Name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Demo only — nothing is stored on a server."
        />

        {error ? (
          <p className="text-sm font-medium text-urgent" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={pending}>
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
      </form>

      <div className="space-y-3 border-t border-border pt-6">
        <Button type="button" variant="secondary" fullWidth onClick={continueDemo}>
          Continue as demo
        </Button>
        <p className="text-center text-sm text-ink-muted">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-ink">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/sign-up" className="font-semibold text-ink">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
