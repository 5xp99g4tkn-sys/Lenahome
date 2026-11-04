import type { Metadata } from "next";
import Link from "next/link";
import MeasurementCalculator from "@/components/pricing/MeasurementCalculator";
import { FAQ, SERVICES } from "@/lib/content";
import { listMaterials, getPricingSettings } from "@/lib/db";
import { formatMnt } from "@/lib/quote";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Үйлчилгээ ба хэмжилтийн тооцоолуур",
  description:
    "Цонхны хэмжилт, захиалгат хөшиг үйлдвэрлэл, материалын зөвлөгөө, хөшиг угсралт, интерьерийн өнгөний зөвлөгөө. Даавууны зарцуулалт ба үнийн тооцоолуур.",
};

export default function ServicesPage() {
  const materials = listMaterials();
  const settings = getPricingSettings();

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">Үйлчилгээ</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="eyebrow">Үйлчилгээ</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight sm:text-[44px]">
          Хэмжилтээс угсралт хүртэл
        </h1>
        <p className="mt-4 text-[13.5px] leading-relaxed text-charcoal/60">
          Таван үйлчилгээ нэг дор. Аль ч үе шатад зөвлөгөө үнэ төлбөргүй.
        </p>
      </header>

      <div className="mt-10 space-y-px bg-charcoal/10">
        {SERVICES.map((s, i) => (
          <article key={s.title} className="grid gap-5 bg-ivory p-6 sm:p-8 lg:grid-cols-[64px_1.1fr_1fr]">
            <span className="font-display text-[28px] text-champagne">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-[0.06em]">{s.title}</h2>
              <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-charcoal/60">{s.desc}</p>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <ul className="space-y-1.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[11.5px] text-charcoal/65">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-taupe" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-taupe">
                {s.price}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* -------- calculator -------- */}
      <section id="measure" className="mt-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/12 pb-5">
          <div>
            <p className="eyebrow">Ухаалаг хэмжилт</p>
            <h2 className="mt-3 font-display text-[30px] leading-tight sm:text-[38px]">
              Даавууны зарцуулалт ба үнийн тооцоолуур
            </h2>
          </div>
          <p className="max-w-sm text-[11.5px] leading-relaxed text-charcoal/50">
            Цонхны хэмжээс, дүүргэлт, загварыг оруулахад даавууны зарцуулалт, оёдол,
            дагалдах хэрэгсэл, зам, угсралт, хүргэлтийг тусад нь тооцно.
          </p>
        </div>

        <div className="mt-7">
          <MeasurementCalculator materials={materials} settings={settings} />
        </div>

        <div className="mt-6 grid gap-4 border border-charcoal/12 bg-white/70 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Оёдлын тариф", v: `${formatMnt(settings.sewingPerMeter)} / м` },
            { k: "Дагалдах хэрэгсэл", v: `${formatMnt(settings.accessoriesPerMeter)} / м` },
            { k: "Хөшигний зам", v: `${formatMnt(settings.trackPerMeter)} / м` },
            { k: "Угсралт", v: `${formatMnt(settings.installationPerWindow)} / цонх` },
          ].map((row) => (
            <div key={row.k}>
              <p className="text-[10px] uppercase tracking-[0.14em] text-taupe">{row.k}</p>
              <p className="mt-1.5 text-[13px]">{row.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------- FAQ -------- */}
      <section className="mt-20">
        <p className="eyebrow">Түгээмэл асуулт</p>
        <div className="mt-6 border-t border-charcoal/12">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-charcoal/12 py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[13px] font-medium text-charcoal">
                {item.q}
                <span className="text-[16px] text-taupe transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-[12.5px] leading-relaxed text-charcoal/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-wrap items-center justify-between gap-4 border border-charcoal/12 bg-charcoal p-8 text-ivory">
        <div>
          <h2 className="font-display text-[26px]">Хэмжилт цаг товлох</h2>
          <p className="mt-1 text-[12px] text-ivory/60">Улаанбаатар хот дотор үнэ төлбөргүй.</p>
        </div>
        <div className="flex gap-2">
          <a href="tel:+97677477788" className="btn btn-light">7747 7788</a>
          <Link href="/contact" className="btn border border-ivory/25 text-ivory hover:border-ivory">
            Хүсэлт илгээх
          </Link>
        </div>
      </section>
    </div>
  );
}
