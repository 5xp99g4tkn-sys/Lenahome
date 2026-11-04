import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/db";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(file)) {
    return NextResponse.json({ error: "Буруу файлын нэр" }, { status: 400 });
  }
  const full = path.join(UPLOAD_DIR, file);
  if (!full.startsWith(UPLOAD_DIR) || !fs.existsSync(full)) {
    return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 404 });
  }
  const ext = path.extname(file).toLowerCase();
  const buffer = fs.readFileSync(full);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
