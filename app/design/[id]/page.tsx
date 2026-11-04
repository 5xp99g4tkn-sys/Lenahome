import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { getDesign } from "@/lib/db";
import { formatMnt } from "@/lib/quote";
import { styleByKey } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Хадгалсан дизайн",
  description: "LENA HOME 3D студид хадгалсан хөшигний дизайны хураангуй.",
  robots: { index: false },
};

type DesignRow = {
  public_id: string;
  customer_name: string | null;
  room_type: string | null;
  curtain_style: string | null;
  material_name: string | null;
  color_code: string | null;
  color_name: string | null;
  measurements: string | null;
  estimated_price: number | null;
  preview_path: string | null;
  lighting: string | null;
};

export default async function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getDesign(id) as DesignRow | null;
  if (!row) notFound();

  let measurements: Record<string, unknown> = {};
  try {
    measurements = row.measurements ? JSON.parse(row.measurements) : {};
  } catch {
    measurements = {};
  }
  const m = measurements as {
    widthCm?: number;
    heightCm?: number;
    ceilingCm?: number;
    windows?: number;
    panels?: number;
    fullness?: number;
    totalMeters?: number;
    style?: string;
    length?: string;
  };

  const styleLabel = row.curtain_style ?? (m.style ? styleByKey(m.style).label : "—");

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <Link href="/studio" className="hover:text-charcoal">3D студи</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">Дизайн {row.public_id}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="relative overflow-hidden border border-charcoal/12 bg-porcelain">
            {row.preview_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.preview_path} alt="3D дизайны урьдчилсан харагдац" className="w-full" />
            ) : (
              <div className="flex h-[320px] items-center justify-center">
                <p className="text-[12px] text-charcoal/50">3D зураг хадгалагдаагүй</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/studio?material=${(row.material_name ?? "").toLowerCase()}&code=${row.color_code ?? ""}&style=${m.style ?? "wave"}`}
              className="btn btn-primary"
            >
              3D-д үргэлжлүүлэх
            </Link>
            <Link href="/collections" className="btn btn-outline">
              Ижил төстэй өнгө
            </Link>
          </div>

          <div className="mt-10">
            <p className="eyebrow">Дизайны хураангуй</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 text-[12.5px] sm:grid-cols-3">
              {[
                ["Өрөө", row.room_type ?? "—"],
                ["Загвар", styleLabel],
                ["Материал", row.material_name ?? "—"],
                ["Өнгөний код", row.color_code ?? "—"],
                ["Өнгөний нэр", row.color_name ?? "—"],
                ["Гэрэлтүүлэг", row.lighting ?? "—"],
                ["Цонхны өргөн", m.widthCm ? `${m.widthCm} см` : "—"],
                ["Цонхны өндөр", m.heightCm ? `${m.heightCm} см` : "—"],
                ["Тааз", m.ceilingCm ? `${m.ceilingCm} см` : "—"],
                ["Цонхны тоо", m.windows ?? "—"],
                ["Хөшигний тоо", m.panels ?? "—"],
                ["Дүүргэлт", m.fullness ? `${m.fullness}x` : "—"],
                ["Даавууны зарцуулалт", m.totalMeters ? `${m.totalMeters} м` : "—"],
                ["Урьдчилсан үнэ", row.estimated_price ? formatMnt(row.estimated_price) : "—"],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">{k}</dt>
                  <dd className="mt-1 text-charcoal">{String(v)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-l-2 border-champagne bg-porcelain px-4 py-3 text-[11px] leading-relaxed text-charcoal/55">
              Энэ бол урьдчилсан тооцоо. Мэргэжлийн хэмжилт хийсний дараа эцсийн хэмжээ, үнэ
              баталгаажна. Хувийн мэдээллийг энэ хуудсанд харуулахгүй.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ConsultationForm
            designPublicId={row.public_id}
            contextLabel={`${row.material_name ?? ""} · ${row.color_code ?? ""} · ${styleLabel}`}
          />
        </div>
      </div>
    </div>
  );
}
