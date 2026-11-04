import { NextResponse } from "next/server";
import { getDb, listMaterials } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FABRICS = ["drape", "jacquard", "velvet", "blackout", "sheer", "linen", "blind"];
const AVAILABILITY = ["available", "order", "unconfigured"];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9а-яөүё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function guard() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ materials: listMaterials() });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "Материалын нэр шаардлагатай." }, { status: 400 });

  const db = getDb();
  const slug = body.slug ? slugify(String(body.slug)) : slugify(String(body.name));
  try {
    const res = db
      .prepare(
        `INSERT INTO materials (slug, name, name_en, price_per_meter, fabric_width, description, fabric, weight, opacity, sheen, availability, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        slug,
        String(body.name).trim(),
        body.nameEn ? String(body.nameEn) : null,
        body.pricePerMeter === "" || body.pricePerMeter == null ? null : Number(body.pricePerMeter),
        Number(body.fabricWidth) || 280,
        body.description ? String(body.description) : null,
        FABRICS.includes(body.fabric) ? body.fabric : "drape",
        body.weight ? String(body.weight) : null,
        Number(body.opacity) || 0.9,
        Number(body.sheen) || 0.2,
        AVAILABILITY.includes(body.availability) ? body.availability : "available",
        Number(body.sortOrder) || 0,
      );
    return NextResponse.json({ ok: true, id: Number(res.lastInsertRowid), slug });
  } catch (err) {
    return NextResponse.json(
      { error: "Материал хадгалагдсангүй. Slug давхцсан байж магадгүй.", detail: String(err) },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "ID шаардлагатай." }, { status: 400 });

  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  const set = (column: string, value: unknown) => {
    fields.push(`${column} = ?`);
    values.push(value);
  };

  if (body.name != null) set("name", String(body.name).trim());
  if (body.nameEn != null) set("name_en", String(body.nameEn) || null);
  if (body.pricePerMeter !== undefined)
    set(
      "price_per_meter",
      body.pricePerMeter === "" || body.pricePerMeter == null ? null : Number(body.pricePerMeter),
    );
  if (body.fabricWidth != null) set("fabric_width", Number(body.fabricWidth) || 280);
  if (body.description != null) set("description", String(body.description) || null);
  if (body.fabric != null && FABRICS.includes(body.fabric)) set("fabric", body.fabric);
  if (body.weight != null) set("weight", String(body.weight) || null);
  if (body.opacity != null) set("opacity", Number(body.opacity));
  if (body.sheen != null) set("sheen", Number(body.sheen));
  if (body.availability != null) set("availability", body.availability);
  if (body.textureImage !== undefined) set("texture_image", body.textureImage || null);
  if (body.sortOrder != null) set("sort_order", Number(body.sortOrder));

  if (fields.length === 0) return NextResponse.json({ ok: true, unchanged: true });
  values.push(id);
  db.prepare(`UPDATE materials SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  if (body.availability) {
    db.prepare("UPDATE colors SET availability = ? WHERE material_id = ?").run(body.availability, id);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID шаардлагатай." }, { status: 400 });
  const db = getDb();
  db.prepare("DELETE FROM colors WHERE material_id = ?").run(id);
  db.prepare("DELETE FROM materials WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
