import type { Metadata } from "next";
import Link from "next/link";
import { DraperyArt } from "@/components/art/DraperyArt";
import { listColors, listMaterials } from "@/lib/db";
import { formatMnt } from "@/lib/quote";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Материал — хөшигний даавууны төрөл",
  description:
    "LENA HOME-ийн 10 төрлийн хөшигний даавуу: New Drappe, Dokufon, Venezia, Blackout, Petek Kadife зэрэг. Үнэ, өргөн, бүтэц, өнгөний тоо.",
};

const FABRIC_LABEL: Record<string, string> = {
  drape: "Хүнд даавуу",
  jacquard: "Жаккард нэхмэл",
  velvet: "Кадифе",
  blackout: "Гэрэл хаагч",
  sheer: "Тюль",
  linen: "Торгон холимог",
  blind: "Туузан хөшиг",
};

export default function MaterialsPage() {
  const materials = listMaterials();
  const colors = listColors();

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">Материал</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="eyebrow">Материал</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight sm:text-[44px]">
          Даавууны бүтэц ба уналт
        </h1>
        <p className="mt-4 text-[13.5px] leading-relaxed text-charcoal/60">
          Нэг өнгө өөр өөр материал дээр өөрөөр харагдана. Кадифе гэрлийг шингээж, торгомсог
          гадаргуу гэрлийг тусгадаг. Материал бүрийн бүтэц, нягт, гэрэл хаах чанарыг харьцуулна уу.
        </p>
      </header>

      <div className="mt-12 space-y-px bg-charcoal/10">
        {materials.map((m, index) => {
          const sample = colors.filter((c) => c.material_id === m.id);
          const withHex = sample.filter((c) => c.hex);
          return (
            <article
              key={m.id}
              className="grid gap-6 bg-ivory p-5 sm:p-7 lg:grid-cols-[240px_1fr_auto] lg:items-center"
            >
              <div className="relative h-[150px] overflow-hidden border border-charcoal/10">
                <DraperyArt
                  color={withHex[0]?.hex ?? "#D9C9B4"}
                  folds={8}
                  sheen={m.sheen}
                  className="absolute inset-0 h-full w-full"
                />
                <span className="absolute left-2 top-2 bg-ivory/85 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-charcoal/70">
                  {FABRIC_LABEL[m.fabric] ?? m.fabric}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-[15px] font-semibold tracking-[0.1em]">{m.name}</h2>
                  <span className="text-[10.5px] uppercase tracking-[0.14em] text-taupe">
                    {m.color_count} өнгө
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-charcoal/60">
                  {m.description}
                </p>
                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[11px]">
                  <div>
                    <dt className="text-charcoal/40">Өргөн</dt>
                    <dd className="text-charcoal">{m.fabric_width} см</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/40">Нягт</dt>
                    <dd className="text-charcoal">{m.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/40">Гэрэл хаалт</dt>
                    <dd className="text-charcoal">{Math.round(m.opacity * 100)}%</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-1">
                  {sample.slice(0, 14).map((c) => (
                    <span
                      key={c.id}
                      title={c.code}
                      className="h-5 w-5 border border-charcoal/10"
                      style={{ backgroundColor: c.hex ?? "#E6DDCE" }}
                    />
                  ))}
                  {sample.length > 14 && (
                    <span className="flex h-5 items-center px-1 text-[10px] text-charcoal/40">
                      +{sample.length - 14}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="text-right">
                  <p className="font-display text-[20px]">
                    {m.price_per_meter ? formatMnt(m.price_per_meter) : "—"}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-taupe">1 метр</p>
                </div>
                <Link href={`/materials/${m.slug}`} className="btn btn-outline">
                  Дэлгэрэнгүй
                </Link>
              </div>
              <p className="text-[10px] text-charcoal/30 lg:col-span-3">
                №{String(index + 1).padStart(2, "0")} · {m.name_en}
              </p>
            </article>
          );
        })}
      </div>

      <section className="mt-16 border border-charcoal/12 bg-porcelain p-8">
        <p className="eyebrow">Тэмдэглэл</p>
        <p className="mt-3 max-w-3xl text-[12.5px] leading-relaxed text-charcoal/60">
          Өнгөний код бүр үйлдвэрлэгчийн жагсаалтаас шууд орсон. Код дотор өнгөний нэр
          бичигдсэн тохиолдолд (жишээ нь <span className="text-charcoal">VR-10338-KIREMIT</span>) бид
          ойролцоо тон харуулж, “~” тэмдгээр ялгасан. Бусад кодуудад бодит swatch зураг
          шаардлагатай бөгөөд администратор каталогт оруулна. Бид зохиомол өнгө үүсгэдэггүй.
        </p>
      </section>
    </div>
  );
}
