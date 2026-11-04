import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { nearestFamily, stylesForFamily } from "@/lib/color-science";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return null;
}

function resolveMeta(hex: string | null, family: string | null) {
  const resolvedFamily = family || (hex ? nearestFamily(hex) : null);
  return {
    family: resolvedFamily,
    styleTags: JSON.stringify(stylesForFamily(resolvedFamily)),
  };
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const materialId = Number(body?.materialId);
  const code = String(body?.code ?? "").trim();
  if (!materialId || !code) {
    return NextResponse.json({ error: "Материал ба код шаардлагатай." }, { status: 400 });
  }
  const hex = body.hex ? String(body.hex).trim() : null;
  const swatch = body.swatchImage ? String(body.swatchImage) : null;
  const meta = resolveMeta(hex, body.family ? String(body.family) : null);

  const db = getDb();
  const material = db.prepare("SELECT availability FROM materials WHERE id = ?").get(materialId) as
    | { availability: string }
    | undefined;
  if (!material) return NextResponse.json({ error: "Материал олдсонгүй." }, { status: 404 });

  try {
    const res = db
      .prepare(
        `INSERT INTO colors (material_id, code, name, hex, hex_source, family, style_tags, swatch_image, availability, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        materialId,
        code,
        body.name ? String(body.name) : null,
        hex,
        swatch ? "swatch" : hex ? "manual" : "none",
        meta.family,
        meta.styleTags,
        swatch,
        material.availability,
        Number(body.sortOrder) || 0,
      );
    return NextResponse.json({ ok: true, id: Number(res.lastInsertRowid) });
  } catch {
    return NextResponse.json(
      { error: "Код хадгалагдсангүй. Энэ код тухайн материалд аль хэдийн бүртгэгдсэн байна." },
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

  if (body.code != null) set("code", String(body.code).trim());
  if (body.name !== undefined) set("name", body.name ? String(body.name) : null);
  if (body.hex !== undefined) set("hex", body.hex ? String(body.hex) : null);
  if (body.swatchImage !== undefined) set("swatch_image", body.swatchImage || null);
  if (body.family !== undefined) set("family", body.family ? String(body.family) : null);
  if (body.availability != null) set("availability", String(body.availability));
  if (body.sortOrder != null) set("sort_order", Number(body.sortOrder));

  if (body.hex !== undefined || body.family !== undefined) {
    const current = db.prepare("SELECT hex, family FROM colors WHERE id = ?").get(id) as
      | { hex: string | null; family: string | null }
      | undefined;
    const hex = body.hex !== undefined ? (body.hex ? String(body.hex) : null) : (current?.hex ?? null);
    const family =
      body.family !== undefined ? (body.family ? String(body.family) : null) : (current?.family ?? null);
    const meta = resolveMeta(hex, family);
    set("family", meta.family);
    set("style_tags", meta.styleTags);
    if (body.hex !== undefined) {
      set("hex_source", body.swatchImage ? "swatch" : hex ? "manual" : "none");
    }
  }

  if (fields.length === 0) return NextResponse.json({ ok: true, unchanged: true });
  values.push(id);
  try {
    db.prepare(`UPDATE colors SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  } catch {
    return NextResponse.json({ error: "Код хадгалагдсангүй." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID шаардлагатай." }, { status: 400 });
  getDb().prepare("DELETE FROM colors WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
