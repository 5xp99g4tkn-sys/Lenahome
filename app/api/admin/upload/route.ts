import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл сонгоно уу." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Зөвхөн PNG, JPG, WEBP, AVIF зураг оруулна." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файлын хэмжээ 6MB-аас бага байх ёстой." }, { status: 400 });
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

  return NextResponse.json({ ok: true, path: `/api/uploads/${name}` });
}
