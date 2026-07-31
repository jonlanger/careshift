export const SESSION_COOKIE = "careshift_session";
export const SESSION_VALUE = "demo";

export function isSessionCookie(value: string | undefined | null): boolean {
  return value === SESSION_VALUE;
}
