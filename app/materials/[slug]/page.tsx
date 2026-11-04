import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraperyArt } from "@/components/art/DraperyArt";
import Swatch from "@/components/site/Swatch";
import { getMaterialBySlug, listColors, listMaterials } from "@/lib/db";
import { formatMnt } from "@/lib/quote";
import { FAMILY_LABELS } from "@/lib/color-science";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) return { title: "Материал олдсонгүй" };
  return {
    title: `${material.name} — ${material.color_count} өнгө`,
    description: `${material.name} хөшигний даавуу. Үнэ ${material.price_per_meter ? formatMnt(material.price_per_meter) + " / метр" : "тохируулагдаагүй"}, өргөн ${material.fabric_width} см, ${material.color_count} өнгөний код.`,
  };
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) notFound();

  const colors = listColors({ material: slug });
  const others = listMaterials().filter((m) => m.slug !== slug);
  const withHex = colors.filter((c) => c.hex);
  const hero = withHex[0]?.hex ?? "#D9C9B4";

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <Link href="/materials" className="hover:text-charcoal">Материал</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">{material.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative h-[320px] overflow-hidden border border-charcoal/10 sm:h-[420px]">
          <DraperyArt color={hero} folds={10} sheen={material.sheen} className="absolute inset-0 h-full w-full" />
          <div className="absolute bottom-4 left-4 bg-ivory/85 px-3 py-2 backdrop-blur">
            <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal/50">Даавууны бүтэц</p>
            <p className="text-[12px] text-charcoal">{material.weight}</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">Материал</p>
          <h1 className="mt-3 font-display text-[34px] leading-tight sm:text-[42px]">{material.name}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-taupe">
            {material.name_en} · {material.color_count} өнгө
          </p>
          <p className="mt-5 text-[13.5px] leading-[1.85] text-charcoal/65">{material.description}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-charcoal/12 pt-6 text-[12px]">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">Үнэ / метр</dt>
              <dd className="mt-1 text-[15px]">
                {material.price_per_meter ? formatMnt(material.price_per_meter) : "Тохируулаагүй"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">Даавууны өргөн</dt>
              <dd className="mt-1 text-[15px]">{material.fabric_width} см</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">Гэрэл хаалт</dt>
              <dd className="mt-1 text-[15px]">{Math.round(material.opacity * 100)}%</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">Гялбаа</dt>
              <dd className="mt-1 text-[15px]">{Math.round(material.sheen * 100)}%</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/studio?material=${material.slug}`} className="btn btn-primary">
              3D-д турших
            </Link>
            <Link href={`/collections?material=${material.slug}`} className="btn btn-outline">
              Каталогт шүүх
            </Link>
          </div>

          {!material.price_per_meter && (
            <p className="mt-4 border-l-2 border-champagne bg-porcelain px-4 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              Энэ материалын үнийг администратор тохируулаагүй байна. Үнийн тооцоололд
              даавууны өртөг орохгүй бөгөөд зөвлөгөөний үеэр үнэ баталгаажна.
            </p>
          )}
        </div>
      </div>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/12 pb-4">
          <h2 className="font-display text-[24px]">Өнгөний код ({colors.length})</h2>
          <p className="text-[10.5px] text-charcoal/45">
            Код дээр дарж 3D студид шууд нээнэ
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {colors.map((c) => (
            <Link
              key={c.id}
              href={`/studio?material=${material.slug}&code=${encodeURIComponent(c.code)}`}
              className="group"
            >
              <Swatch
                hex={c.hex}
                image={c.swatch_image}
                code={c.code}
                name={c.name}
                fabric={c.fabric}
                size="md"
                showLabel={false}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <p className="mt-2 truncate text-[11px] font-medium">{c.code}</p>
              <p className="truncate text-[10px] text-charcoal/45">
                {c.name ?? (c.family ? (FAMILY_LABELS[c.family] ?? c.family) : "Swatch шаардлагатай")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-taupe">Бусад материал</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((m) => (
            <Link
              key={m.slug}
              href={`/materials/${m.slug}`}
              className="border border-charcoal/15 px-4 py-2 text-[11.5px] text-charcoal/70 hover:border-charcoal hover:text-charcoal"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
