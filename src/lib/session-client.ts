"use client";

import { SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth";

const MAX_AGE_DAYS = 7;

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function createDemoSession() {
  setCookie(SESSION_COOKIE, SESSION_VALUE, MAX_AGE_DAYS * 24 * 60 * 60);
}

export function clearDemoSession() {
  clearCookie(SESSION_COOKIE);
}

export function hasDemoSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${SESSION_COOKIE}=${SESSION_VALUE}`));
}
