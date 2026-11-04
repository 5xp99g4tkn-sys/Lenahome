import { NextResponse } from "next/server";
import { listRequests, setRequestStatus } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "measured", "quoted", "won", "closed"];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return NextResponse.json({ requests: listRequests() });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  const status = String(body?.status ?? "");
  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "ID эсвэл төлөв буруу байна." }, { status: 400 });
  }
  setRequestStatus(id, status, body.note ? String(body.note) : undefined);
  return NextResponse.json({ ok: true });
}
