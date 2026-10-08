// Server-only admin session handling (replaces Supabase Auth).
// A signed, httpOnly cookie holds the admin email + expiry.
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { query } from "./db";

const COOKIE = "dg_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  // SESSION_SECRET is optional; falls back to the DB URL so only one env var is required.
  return (
    process.env["SESSION_SECRET"] ||
    process.env["DATABASE_URL"] ||
    process.env["TIDB_DATABASE_URL"] ||
    ""
  );
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array {
  const s = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("deco-galleria-admin:" + secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(new Uint8Array(sig));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signIn(email: string, password: string): Promise<{ email: string }> {
  const rows = await query<{ email: string; password_hash: string }>(
    "SELECT email, password_hash FROM admin_users WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [email.trim()],
  );
  const user = rows[0];
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!user || !ok) throw new Error("Invalid login credentials");

  const payload = b64url(
    new TextEncoder().encode(
      JSON.stringify({ email: user.email, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS }),
    ),
  );
  const token = `${payload}.${await hmac(payload)}`;
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return { email: user.email };
}

export function signOut() {
  deleteCookie(COOKIE, { path: "/" });
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeEqual(sig, await hmac(payload))) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (typeof data.exp !== "number" || data.exp < Date.now() / 1000) return null;
    return { email: String(data.email) };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) throw new Error("Not authorized. Please sign in again.");
  return session;
}
