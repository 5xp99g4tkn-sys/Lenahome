import type { Metadata } from "next";
import Link from "next/link";
import FabricBrowser from "@/components/collections/FabricBrowser";
import { listColors, listMaterials } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Хөшигний коллекц — даавуу, өнгө, код",
  description:
    "LENA HOME-ийн бүх даавуу болон үйлдвэрлэгчийн өнгөний кодууд. Кодоор хайх, өнгө, материал, үнэ, интерьерийн хэв маягаар шүүх.",
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; material?: string; style?: string; family?: string }>;
}) {
  const params = await searchParams;
  const colors = listColors();
  const materials = listMaterials();
  const priced = materials.filter((m) => m.price_per_meter).length;

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">Хөшигний коллекц</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-charcoal/12 pb-8">
        <div>
          <p className="eyebrow">Даавууны каталог</p>
          <h1 className="mt-3 font-display text-[34px] leading-tight sm:text-[44px]">
            Хөшигний коллекц
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-charcoal/60">
            {materials.length} материал, {colors.length} өнгөний код. Үйлдвэрлэгчийн кодыг
            яг хэвээр нь хадгалсан — кодоор шууд хайж болно.
          </p>
        </div>
        <div className="flex items-end gap-8 text-[11px]">
          <div>
            <p className="font-display text-[22px]">{colors.length}</p>
            <p className="uppercase tracking-[0.14em] text-taupe">Өнгөний код</p>
          </div>
          <div>
            <p className="font-display text-[22px]">{materials.length}</p>
            <p className="uppercase tracking-[0.14em] text-taupe">Материал</p>
          </div>
          <div>
            <p className="font-display text-[22px]">{priced}</p>
            <p className="uppercase tracking-[0.14em] text-taupe">Үнэтэй</p>
          </div>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-charcoal/10 pb-4">
        <Link href="/ai-match" className="btn btn-outline py-2">
          AI өнгө тааруулагч
        </Link>
        <p className="text-[11px] text-charcoal/45">
          Өрөөний зургаас тохирох өнгө санал болгох
        </p>
      </div>

      <div className="mt-10">
        <FabricBrowser
          colors={colors}
          materials={materials}
          initial={{ q: params.q, material: params.material, style: params.style, family: params.family }}
        />
      </div>
    </div>
  );
}
