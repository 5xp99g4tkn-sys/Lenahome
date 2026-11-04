import type { Metadata } from "next";
import Link from "next/link";
import ColorMatchStudio from "@/components/ai/ColorMatchStudio";

export const metadata: Metadata = {
  title: "AI COLOR MATCH — өрөөндөө тохирох хөшиг",
  description:
    "Өрөөнийхөө зургийг оруулаад, LENA HOME-ийн бодит даавууны каталогаас таны хана, шал, тавилгын өнгөнд тохирох хөшгийг санал болгоно.",
};

export default function AiMatchPage() {
  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">AI COLOR MATCH</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-charcoal/12 pb-7">
        <div>
          <p className="eyebrow">AI COLOR MATCH</p>
          <h1 className="mt-3 font-display text-[32px] leading-tight sm:text-[42px]">
            Өрөөндөө тохирох
            <br />
            хөшгийг олоорой
          </h1>
        </div>
        <p className="max-w-sm text-[12.5px] leading-relaxed text-charcoal/55">
          Зөвлөмж нь зөвхөн каталогт бүртгэлтэй, боломжтой өнгөнүүдээс гарна. Бид
          зохиомол код эсвэл swatch үүсгэдэггүй.
        </p>
      </header>

      <div className="mt-8">
        <ColorMatchStudio />
      </div>

      <div className="mt-12 border-l-2 border-champagne bg-porcelain px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Тохиргоо (админ)</p>
        <p className="mt-2 max-w-3xl text-[11.5px] leading-relaxed text-charcoal/60">
          Зургийг харах AI шинжилгээ идэвхжүүлэхийн тулд серверийн орчинд{" "}
          <code className="bg-ivory px-1 py-0.5">OPENAI_API_KEY</code> тохируулна. Түлхүүр
          байхгүй үед систем зургийн өнгөний палитраар ажиллаж, бодит каталогийн өнгөнүүдтэй
          ΔE-ээр харьцуулна — энэ нь хуурамч дүгнэлт биш, бодит тооцоо юм.
        </p>
      </div>
    </div>
  );
}
