import { NextResponse } from "next/server";
import { listColors } from "@/lib/db";
import { deltaE, hexToLab, FAMILY_LABELS, nearestFamily } from "@/lib/color-science";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Palette = string[];

function validHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function toneWords(hex: string) {
  const family = nearestFamily(hex);
  return FAMILY_LABELS[family] ?? family;
}

/**
 * Зургийн өнгөний шинжилгээ.
 *
 * AI Vision горим: OPENAI_API_KEY тохируулсан бол зургийг харах чадвартай модель
 * дуудагдана (интерьерийн хэв маяг, гэрлийн чиглэл, хана/шал/тавилгын өнгө).
 * Түлхүүр байхгүй бол зөвхөн пикселээс гаргасан өнгөний палитраар ажиллана —
 * энэ нь хуурамч AI дүгнэлт биш, бодит өнгөний тооцоо юм.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const palette: Palette = Array.isArray(body?.palette) ? body.palette.filter(validHex).slice(0, 10) : [];
  if (palette.length === 0) {
    return NextResponse.json(
      { error: "Зургийн өнгөний палитра олдсонгүй. Өөр зураг оруулна уу." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const image = typeof body?.image === "string" && body.image.startsWith("data:image/") ? body.image : null;

  let analysis: {
    style: string | null;
    lighting: string | null;
    wallTone: string | null;
    floorTone: string | null;
    summary: string;
  } = {
    style: null,
    lighting: null,
    wallTone: null,
    floorTone: null,
    summary: "Зургийн давамгай өнгөнүүдэд тулгуурлан тохирох даавууг санал болголоо.",
  };
  let mode: "vision" | "palette" = "palette";
  let visionError: string | null = null;

  if (apiKey && image) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
          max_tokens: 400,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You analyse interior photographs for a curtain company. Return strict JSON with keys: style (one of modern, classic, minimal, scandi, luxury, warm, or null), lighting (bright|soft|dim|warm|cool or null), wallTone (english colour name or null), floorTone (english colour name or null), summary (2 short Mongolian sentences about the room's colour balance and what curtain tone would work). Never invent manufacturer colour codes.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyse this room photo for curtain colour advice." },
                { type: "image_url", image_url: { url: image } },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) throw new Error(`vision ${res.status}`);
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content ?? "{}");
      analysis = {
        style: typeof parsed.style === "string" ? parsed.style : null,
        lighting: typeof parsed.lighting === "string" ? parsed.lighting : null,
        wallTone: typeof parsed.wallTone === "string" ? parsed.wallTone : null,
        floorTone: typeof parsed.floorTone === "string" ? parsed.floorTone : null,
        summary:
          typeof parsed.summary === "string" && parsed.summary.length > 0
            ? parsed.summary
            : analysis.summary,
      };
      mode = "vision";
    } catch (err) {
      visionError = err instanceof Error ? err.message : "vision failed";
    }
  }

  const paletteLab = palette.map((hex) => ({ hex, lab: hexToLab(hex) }));
  const colors = listColors().filter(
    (c) => c.availability !== "unconfigured" && (c.swatch_image || c.hex),
  );

  const scored = colors
    .map((c) => {
      const hex = c.hex as string;
      const lab = hexToLab(hex);
      let best = Infinity;
      let bestHex = palette[0];
      for (const p of paletteLab) {
        const d = deltaE(lab, p.lab);
        if (d < best) {
          best = d;
          bestHex = p.hex;
        }
      }
      return { color: c, distance: best, nearest: bestHex };
    })
    .sort((a, b) => a.distance - b.distance);

  // Нэг материал тутмын хамгийн ойрыг авч, олон янз байдлыг хангана
  const usedMaterial = new Set<number>();
  const picks: typeof scored = [];
  for (const item of scored) {
    if (picks.length >= 6) break;
    if (usedMaterial.has(item.color.material_id)) continue;
    usedMaterial.add(item.color.material_id);
    picks.push(item);
  }
  for (const item of scored) {
    if (picks.length >= 6) break;
    if (!picks.some((p) => p.color.id === item.color.id)) picks.push(item);
  }

  const recommendations = picks.map((item) => {
    const d = Math.round(item.distance * 10) / 10;
    let harmony: string;
    if (d < 6) harmony = "Зургийн өнгөтэй бараг ижил — уусан, нэгдсэн харагдац";
    else if (d < 14) harmony = "Зургийн өнгөтэй ойролцоо — зөөлөн зохицол";
    else if (d < 26) harmony = "Дунд зэргийн ялгаа — өрөөнд тодорхой акцент";
    else harmony = "Өндөр контраст — тод акцент болно";

    const reason = [
      `${harmony} (ΔE ${d}).`,
      `Ойролцоо тон: ${toneWords(item.nearest)}.`,
      analysis.style ? `Өрөөний хэв маяг: ${analysis.style}.` : null,
      item.color.fabric === "blackout" ? "Гэрэл хаах чанар өндөр." : null,
      item.color.fabric === "velvet" ? "Кадифе бүтэц гэрлийг шингээнэ." : null,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      colorId: item.color.id,
      code: item.color.code,
      name: item.color.name,
      hex: item.color.hex,
      swatchImage: item.color.swatch_image,
      hexSource: item.color.hex_source,
      family: item.color.family,
      materialName: item.color.material_name,
      materialSlug: item.color.material_slug,
      pricePerMeter: item.color.price_per_meter,
      fabric: item.color.fabric,
      deltaE: d,
      reason,
    };
  });

  return NextResponse.json({
    mode,
    visionError,
    palette,
    analysis,
    recommendations,
    note:
      mode === "vision"
        ? "AI Vision идэвхтэй: өрөөний хэв маяг, гэрэл, тон зургаас шинжилсэн."
        : "Өнгөний шинжилгээ: зургийн давамгай өнгөнүүдийг пикселээс гаргаж, каталогийн бодит кодтой харьцуулсан.",
    disclaimer:
      "Зөвлөмж нь зөвхөн каталогт байгаа, боломжтой өнгөнүүдээс гарна. Бодит өнгийг swatch дээжээр батална.",
  });
}
