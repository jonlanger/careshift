"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { createDemoSession } from "@/lib/session-client";

type Mode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("next") ?? "/today";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  function enter() {
    createDemoSession();
    router.push(destination);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (isSignUp && !name.trim()) {
      setError("Enter your name to create an account.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }

    enter();
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 py-8">
      <div>
        <h1 className="type-h1 text-ink">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="type-lead mt-3 text-ink-muted">
          {isSignUp
            ? "Start your first shift brief in under a minute."
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
          <p className="text-sm font-semibold text-alert" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth>
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
      </form>

      <div className="space-y-3 border-t border-border pt-6">
        <Button type="button" variant="secondary" size="lg" fullWidth onClick={enter}>
          Continue as demo
        </Button>
        <p className="text-center text-base text-ink-muted">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-brand">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/sign-up" className="font-semibold text-brand">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
