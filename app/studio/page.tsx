import type { Metadata } from "next";
import Link from "next/link";
import StudioShell from "@/components/studio/StudioShell";
import { getPricingSettings, listColors, listMaterials } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "3D Хөшигний студи",
  description:
    "LENA HOME 3D Хөшигний студи — 8 бодит өрөөний орчинд хөшигний өнгө, материал, загвар, дүүргэлтийг шууд өөрчилж, өдөр/шөнийн гэрэлтүүлэгт харьцуулж үзээрэй.",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const materials = listMaterials();
  const colors = listColors();
  const settings = getPricingSettings();

  return (
    <div>
      <div className="border-b border-charcoal/10 bg-ivory">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <nav aria-label="Замын чиглэл" className="text-[10px] uppercase tracking-[0.16em] text-charcoal/40">
              <Link href="/" className="hover:text-charcoal">Нүүр</Link>
              <span className="mx-2">/</span>
              <span className="text-charcoal/70">3D Хөшигний студи</span>
            </nav>
            <h1 className="mt-1.5 font-display text-[22px] leading-tight sm:text-[26px]">
              LENA HOME 3D Хөшигний студи
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-charcoal/55">
            <span className="border border-charcoal/15 px-2.5 py-1">
              {materials.length} материал · {colors.length} өнгө
            </span>
            <Link href="/collections" className="border border-charcoal/15 px-2.5 py-1 hover:border-charcoal">
              Каталог
            </Link>
            <Link href="/services#measure" className="border border-charcoal/15 px-2.5 py-1 hover:border-charcoal">
              Хэмжилтийн тооцоолуур
            </Link>
          </div>
        </div>
      </div>

      <StudioShell
        materials={materials}
        colors={colors}
        settings={settings}
        initial={{
          material: one("material"),
          code: one("code"),
          style: one("style"),
          room: one("room"),
          w: one("w"),
          h: one("h"),
          windows: one("windows"),
          panels: one("panels"),
          fullness: one("fullness"),
        }}
      />
    </div>
  );
}
