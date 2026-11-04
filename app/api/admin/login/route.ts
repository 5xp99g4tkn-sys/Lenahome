import { NextResponse } from "next/server";
import { encodeSession, loginWithPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Өгөгдөл буруу байна." }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!username || !password) {
    return NextResponse.json({ error: "Нэр, нууц үгээ оруулна уу." }, { status: 400 });
  }

  const session = await loginWithPassword(username, password);
  if (!session) {
    return NextResponse.json(
      { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." },
      { status: 401 },
    );
  }

  await setSessionCookie(encodeSession(session));
  return NextResponse.json({ ok: true, username: session.username, role: session.role });
}
