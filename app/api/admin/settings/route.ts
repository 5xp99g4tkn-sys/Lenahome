import { NextResponse } from "next/server";
import { getPricingSettings, setPricingSetting } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { DEFAULT_PRICING } from "@/lib/quote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return NextResponse.json({ settings: getPricingSettings() });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Өгөгдөл буруу байна." }, { status: 400 });
  }

  const keys = Object.keys(DEFAULT_PRICING);
  const updated: string[] = [];
  for (const [key, raw] of Object.entries(body as Record<string, unknown>)) {
    if (!keys.includes(key)) continue;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) {
      return NextResponse.json({ error: `${key} утга буруу байна.` }, { status: 400 });
    }
    setPricingSetting(key, String(Math.round(value)));
    updated.push(key);
  }
  return NextResponse.json({ ok: true, updated });
}
