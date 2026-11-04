import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, verifyPassword } from "./db";

const COOKIE = "lena_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET || "lena-home-local-session-secret";
const MAX_AGE = 60 * 60 * 12; // 12 цаг

export type AdminSession = { username: string; role: string; exp: number };

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return decodeSession(store.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function loginWithPassword(username: string, password: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username.trim()) as
    | { username: string; password_hash: string; salt: string; role: string }
    | undefined;
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash, row.salt)) return null;
  return { username: row.username, role: row.role, exp: Date.now() + MAX_AGE * 1000 };
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_MAX_AGE = MAX_AGE;

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
