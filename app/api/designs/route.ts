import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { createDesign, listDesigns, UPLOAD_DIR } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PREVIEW_CHARS = 3_500_000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Өгөгдөл буруу байна." }, { status: 400 });
  }

  let previewPath: string | null = null;
  const preview = typeof body.preview === "string" ? body.preview : null;
  if (preview && preview.startsWith("data:image/") && preview.length < MAX_PREVIEW_CHARS) {
    try {
      const base64 = preview.split(",")[1] ?? "";
      const buffer = Buffer.from(base64, "base64");
      const name = `design-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);
      previewPath = `/api/uploads/${name}`;
    } catch {
      previewPath = null;
    }
  }

  const publicId = createDesign({
    customerName: body.customerName ? String(body.customerName).slice(0, 120) : null,
    phone: body.phone ? String(body.phone).slice(0, 40) : null,
    roomType: body.roomType ? String(body.roomType) : null,
    curtainStyle: body.curtainStyle ? String(body.curtainStyle) : null,
    materialId: body.materialId ? Number(body.materialId) : null,
    materialName: body.materialName ? String(body.materialName) : null,
    colorCode: body.colorCode ? String(body.colorCode) : null,
    colorName: body.colorName ? String(body.colorName) : null,
    measurements: body.measurements ?? null,
    estimatedPrice: body.estimatedPrice != null ? Math.round(Number(body.estimatedPrice)) : null,
    previewPath,
    lighting: body.lighting ? String(body.lighting) : null,
  });

  return NextResponse.json({ ok: true, publicId, previewPath });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return NextResponse.json({ designs: listDesigns() });
}
