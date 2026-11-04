"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Swatch from "@/components/site/Swatch";
import { formatMnt } from "@/lib/quote";
import { hexToLab, deltaE, FAMILY_LABELS } from "@/lib/color-science";

type Recommendation = {
  colorId: number;
  code: string;
  name: string | null;
  hex: string | null;
  swatchImage: string | null;
  hexSource: string;
  family: string | null;
  materialName: string;
  materialSlug: string;
  pricePerMeter: number | null;
  fabric: string;
  deltaE: number;
  reason: string;
};

type Result = {
  mode: "vision" | "palette";
  palette: string[];
  analysis: {
    style: string | null;
    lighting: string | null;
    wallTone: string | null;
    floorTone: string | null;
    summary: string;
  };
  recommendations: Recommendation[];
  note: string;
  disclaimer: string;
};

const STYLE_MN: Record<string, string> = {
  modern: "Модерн",
  classic: "Классик",
  minimal: "Минималист",
  scandi: "Скандинав",
  luxury: "Тансаг",
  warm: "Дулаан & тухтай",
  bright: "Гэрэлтэй",
  soft: "Зөөлөн",
  dim: "Бүдэг",
  cool: "Хүйтэн",
};

export default function ColorMatchStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Зөвхөн зураг оруулна уу (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Зургийн хэмжээ 12MB-аас бага байх ёстой.");
      return;
    }

    try {
      const dataUrl = await readFile(file);
      setImage(dataUrl);
      const { palette: extracted, scaled } = await analyse(dataUrl);
      setPalette(extracted);
      setState("loading");
      const res = await fetch("/api/ai/color-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palette: extracted, image: scaled }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Шинжилж чадсангүй");
      setResult(json as Result);
      setState("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      setState("error");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className="relative flex min-h-[300px] flex-col items-center justify-center border border-dashed border-charcoal/25 bg-white/60 p-6 text-center"
        >
          {image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Таны өрөө" className="max-h-[280px] w-full object-contain" />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn btn-outline mt-4 py-2"
              >
                Өөр зураг сонгох
              </button>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-charcoal/20">
                <span className="text-[18px]">＋</span>
              </div>
              <p className="mt-4 font-display text-[20px]">Өрөөнийхөө зургийг оруулна уу</p>
              <p className="mt-2 max-w-xs text-[12px] leading-relaxed text-charcoal/55">
                Байгалийн гэрэлтэй, өрөөний ханыг бүтнээр харуулсан зураг илүү нарийвчлалтай
                зөвлөмж өгнө.
              </p>
              <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-primary mt-5">
                Зураг сонгох
              </button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {palette.length > 0 && (
          <div className="mt-4 border border-charcoal/12 bg-white/70 p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">
              Зургаас гаргасан өнгөнүүд
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {palette.map((hex) => (
                <div key={hex} className="text-center">
                  <span className="block h-9 w-9 border border-charcoal/10" style={{ backgroundColor: hex }} />
                  <span className="mt-1 block text-[8.5px] text-charcoal/45">{hex.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-charcoal/45">
              Өнгөнүүд нь зургийн пикселээс шууд гаргасан. Гэрлийн нөлөөгөөр бодит өнгө
              зөрүүтэй харагдаж болно.
            </p>
          </div>
        )}

        <div className="mt-4 border border-charcoal/12 bg-porcelain p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Хэрхэн ажилладаг</p>
          <ol className="mt-2 space-y-1.5 text-[11.5px] leading-relaxed text-charcoal/60">
            <li>1. Зургийн давамгай өнгөнүүдийг пикселээс ялгана.</li>
            <li>2. Каталогт бүртгэлтэй, боломжтой өнгөнүүдтэй ΔE (өнгөний зөрүү) -ээр харьцуулна.</li>
            <li>3. Зөвхөн бодит код, үнэ, swatch бүхий материалуудыг санал болгоно.</li>
            <li>4. OPENAI_API_KEY тохируулсан бол зургийг харах AI нэмэлт шинжилгээ хийнэ.</li>
          </ol>
        </div>
      </div>

      <div>
        {state === "loading" && (
          <div className="flex h-[320px] flex-col items-center justify-center border border-charcoal/12 bg-white/60">
            <div className="h-9 w-9 animate-spin rounded-full border border-charcoal/20 border-t-charcoal" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
              Өнгө шинжилж байна
            </p>
          </div>
        )}

        {error && (
          <p className="border border-[#9B3B2E]/30 bg-[#9B3B2E]/5 px-4 py-3 text-[11.5px] text-[#9B3B2E]">
            {error}
          </p>
        )}

        {!result && state !== "loading" && (
          <div className="border border-charcoal/12 bg-white/60 p-6">
            <p className="eyebrow">Зөвлөмж</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/55">
              Зураг оруулсны дараа таны өрөөний өнгөнд тохирох материалууд энд харагдана.
              Зөвлөмж бүр дээр материал, код, swatch, нэг метрийн үнэ, тохирлын тайлбар
              харагдана.
            </p>
          </div>
        )}

        {result && (
          <div>
            <div className="border border-charcoal/12 bg-ivory p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Шинжилгээ</p>
                <span className="border border-charcoal/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-charcoal/55">
                  {result.mode === "vision" ? "AI Vision" : "Өнгөний шинжилгээ"}
                </span>
              </div>
              <p className="mt-2 font-display text-[18px] leading-snug">{result.analysis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                {result.analysis.style && (
                  <span className="border border-charcoal/15 px-2 py-0.5">
                    Хэв маяг: {STYLE_MN[result.analysis.style] ?? result.analysis.style}
                  </span>
                )}
                {result.analysis.lighting && (
                  <span className="border border-charcoal/15 px-2 py-0.5">
                    Гэрэл: {STYLE_MN[result.analysis.lighting] ?? result.analysis.lighting}
                  </span>
                )}
                {result.analysis.wallTone && (
                  <span className="border border-charcoal/15 px-2 py-0.5">
                    Хана: {result.analysis.wallTone}
                  </span>
                )}
                {result.analysis.floorTone && (
                  <span className="border border-charcoal/15 px-2 py-0.5">
                    Шал: {result.analysis.floorTone}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-charcoal/45">{result.note}</p>
            </div>

            <div className="mt-4 space-y-px bg-charcoal/10">
              {result.recommendations.map((rec) => (
                <article key={rec.colorId} className="bg-ivory p-4">
                  <div className="flex gap-4">
                    <Swatch
                      hex={rec.hex}
                      image={rec.swatchImage}
                      code={rec.code}
                      fabric={rec.fabric}
                      size="sm"
                      showLabel={false}
                      className="w-16 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[12.5px] font-medium">
                          {rec.materialName} · {rec.code}
                        </p>
                        <p className="text-[11px] text-charcoal/60">
                          {rec.pricePerMeter ? `${formatMnt(rec.pricePerMeter)}/м` : "Үнэ тохируулаагүй"}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[10.5px] text-charcoal/45">
                        {rec.name ?? (rec.family ? FAMILY_LABELS[rec.family] ?? rec.family : "Өнгө тодорхойгүй")}
                        {" · "}ΔE {rec.deltaE}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-charcoal/60">{rec.reason}</p>
                      <div className="mt-2 flex gap-2">
                        <Link
                          href={`/studio?material=${rec.materialSlug}&code=${encodeURIComponent(rec.code)}`}
                          className="border border-charcoal px-2.5 py-1 text-[9.5px] uppercase tracking-[0.12em] hover:bg-charcoal hover:text-ivory"
                        >
                          3D-д турших
                        </Link>
                        <Link
                          href={`/materials/${rec.materialSlug}`}
                          className="border border-charcoal/20 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.12em] hover:border-charcoal"
                        >
                          Материал
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-charcoal/40">{result.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Зургийг уншиж чадсангүй"));
    reader.readAsDataURL(file);
  });
}

async function analyse(dataUrl: string): Promise<{ palette: string[]; scaled: string }> {
  const img = document.createElement("img");
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Зургийг уншиж чадсангүй"));
    img.src = dataUrl;
  });

  const size = 96;
  const canvas = document.createElement("canvas");
  const ratio = img.width / img.height;
  canvas.width = ratio >= 1 ? size : Math.round(size * ratio);
  canvas.height = ratio >= 1 ? Math.round(size / ratio) : size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas дэмжигдэхгүй");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 200) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`;
    const entry = buckets.get(key);
    if (entry) {
      entry.r += r;
      entry.g += g;
      entry.b += b;
      entry.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  const sorted = Array.from(buckets.values())
    .map((v) => ({
      r: v.r / v.count,
      g: v.g / v.count,
      b: v.b / v.count,
      count: v.count,
    }))
    .sort((a, b) => b.count - a.count);

  const hexOf = (c: { r: number; g: number; b: number }) =>
    "#" +
    [c.r, c.g, c.b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("");

  const palette: string[] = [];
  for (const c of sorted) {
    if (palette.length >= 7) break;
    const hex = hexOf(c);
    const lab = hexToLab(hex);
    if (palette.some((p) => deltaE(hexToLab(p), lab) < 9)) continue;
    palette.push(hex);
  }

  // AI vision-д зориулсан жижиг хувилбар
  const bigCanvas = document.createElement("canvas");
  const maxW = 768;
  const scale = Math.min(1, maxW / img.width);
  bigCanvas.width = Math.round(img.width * scale);
  bigCanvas.height = Math.round(img.height * scale);
  bigCanvas.getContext("2d")?.drawImage(img, 0, 0, bigCanvas.width, bigCanvas.height);
  const scaled = bigCanvas.toDataURL("image/jpeg", 0.8);

  return { palette, scaled };
}
