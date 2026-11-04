import type { Metadata } from "next";
import Link from "next/link";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { BUSINESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Холбоо барих — хаяг, утас, зөвлөгөө",
  description:
    "LENA HOME — Хүннү гудамж, 26-р хороо, Баянзүрх дүүрэг, Улаанбаатар. Утас 7747 7788. Хэмжилт, зөвлөгөөний хүсэлт.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const code = one("code");
  const material = one("material");
  const width = one("w");
  const height = one("h");
  const windows = one("windows");
  const panels = one("panels");
  const fullness = one("fullness");
  const style = one("style");

  const contextLabel =
    code || material || width
      ? [
          material ? `Материал: ${material}` : null,
          code ? `Код: ${code}` : null,
          width && height ? `Хэмжээ: ${width}×${height} см` : null,
          windows ? `Цонх: ${windows}` : null,
          panels ? `Хөшиг: ${panels}` : null,
          fullness ? `Дүүргэлт: ${fullness}x` : null,
          style ? `Загвар: ${style}` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : undefined;

  return (
    <div className="container-luxe py-12 lg:py-16">
      <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
        <Link href="/" className="hover:text-charcoal">Нүүр</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">Холбоо барих</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="eyebrow">Холбоо барих</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight sm:text-[44px]">
          Хэмжилт, зөвлөгөө, үнийн санал
        </h1>
        <p className="mt-4 text-[13.5px] leading-relaxed text-charcoal/60">
          Манай зөвлөх хүсэлтийг хүлээн авч, ажлын цагийн дотор холбогдоно. Шоурумд ирж
          даавууг биечлэн үзэх боломжтой.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="border border-charcoal/12 bg-white/70 p-6">
            <dl className="space-y-5">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Хаяг</dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-charcoal/80">
                  {BUSINESS.addressLines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Утас</dt>
                <dd className="mt-1.5">
                  <a href={BUSINESS.phoneHref} className="text-[16px] text-charcoal hover:text-taupe">
                    {BUSINESS.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Facebook</dt>
                <dd className="mt-1.5">
                  <a
                    href={BUSINESS.facebook}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-[13px] text-charcoal hover:text-taupe"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-charcoal/25 text-[10px]">
                      f
                    </span>
                    LENA HOME хуудас
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a href={BUSINESS.phoneHref} className="btn btn-primary flex-1">Залгах</a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hunnu+Street+26+khoroo+Bayanzurkh+Ulaanbaatar"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline flex-1"
              >
                Зам харах
              </a>
            </div>
          </div>

          <div className="mt-6 overflow-hidden border border-charcoal/12">
            <iframe
              title="LENA HOME байршил — Баянзүрх дүүрэг"
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.90%2C47.90%2C107.00%2C47.96&layer=mapnik&marker=47.9285%2C106.9486"
              className="h-[320px] w-full grayscale-[35%]"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 bg-ivory px-4 py-3">
              <p className="text-[11px] text-charcoal/60">Хүннү гудамж, 26-р хороо, Баянзүрх</p>
              <span className="text-[10px] uppercase tracking-[0.14em] text-taupe">OpenStreetMap</span>
            </div>
          </div>

          <div className="mt-6 border border-charcoal/12 bg-porcelain p-6">
            <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Компанийн танилцуулга</p>
            <p className="mt-2 text-[12.5px] leading-[1.85] text-charcoal/65">{BUSINESS.description}</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ConsultationForm contextLabel={contextLabel} />
        </div>
      </div>
    </div>
  );
}
