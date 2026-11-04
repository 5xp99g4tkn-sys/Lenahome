import Link from "next/link";
import { DraperyArt, HeroScene } from "@/components/art/DraperyArt";
import Swatch from "@/components/site/Swatch";
import { listColors, listMaterials, countColors } from "@/lib/db";
import { FAMILY_LABELS, STYLE_CATEGORIES } from "@/lib/color-science";
import { CURTAIN_STYLES } from "@/lib/catalog";
import { formatMnt } from "@/lib/quote";
import { SERVICES, PROCESS_STEPS, TESTIMONIALS } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const materials = listMaterials();
  const colors = listColors();
  const totalCodes = countColors();
  const featured = materials.slice(0, 4);
  const heroColors = colors.filter((c) => c.hex).slice(0, 18);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "LENA HOME",
    image: "/og.jpg",
    telephone: "+976 7747 7788",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Хүннү гудамж, 26-р хороо",
      addressLocality: "Улаанбаатар",
      addressRegion: "Баянзүрх дүүрэг",
      postalCode: "31546",
      addressCountry: "MN",
    },
    sameAs: ["https://www.facebook.com/share/1EocESec85/?mibextid=wwXIfr"],
    description:
      "Lena Home нь захиалгат хөшиг үйлдвэрлэл, мэргэжлийн цонхны хэмжилт, даавууны сонголт, интерьерийн өнгөний зөвлөгөө үзүүлдэг компани.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative border-b border-charcoal/10">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:py-24 lg:pr-16 lg:pl-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]">
            <p className="eyebrow fade-up">Улаанбаатар • Захиалгат хөшиг</p>
            <h1 className="fade-up mt-6 max-w-xl font-display text-[38px] leading-[1.08] tracking-[-0.01em] text-charcoal sm:text-[52px] lg:text-[58px]">
              Таны орон зай.
              <br />
              Таны хэмжээс.
              <br />
              <span className="italic text-taupe">Танд зориулсан хөшиг.</span>
            </h1>
            <p className="fade-up mt-7 max-w-md text-[14.5px] leading-relaxed text-charcoal/65">
              Бид бэлэн хөшиг зардаггүй. Таны өрөөний хэмжээс, гэрлийн чиглэл, интерьерийн
              өнгөнд тохируулан даавуу сонгож, хэмжиж, оёж, угсарч өгдөг.
            </p>
            <div className="fade-up mt-9 flex flex-wrap items-center gap-3">
              <Link href="/studio" className="btn btn-primary">
                3D Дизайн турших
              </Link>
              <Link href="/collections" className="btn btn-outline">
                Коллекц үзэх
              </Link>
            </div>

            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-charcoal/10 pt-7">
              <div>
                <p className="font-display text-[26px] text-charcoal">{materials.length}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-taupe">Материал</p>
              </div>
              <div>
                <p className="font-display text-[26px] text-charcoal">{totalCodes}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-taupe">Өнгөний код</p>
              </div>
              <div>
                <p className="font-display text-[26px] text-charcoal">8</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-taupe">3D өрөө</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[380px] border-t border-charcoal/10 lg:min-h-[640px] lg:border-l lg:border-t-0">
            <HeroScene />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="border border-white/40 bg-white/70 px-3 py-2 backdrop-blur-md">
                <p className="text-[9px] uppercase tracking-[0.18em] text-charcoal/60">
                  Зочны өрөө • Долгионт хөшиг
                </p>
                <p className="mt-0.5 text-[11px] text-charcoal">
                  NEW DRAPPE <span className="text-charcoal/45">/</span> 14959
                </p>
              </div>
              <Link
                href="/studio"
                className="hidden shrink-0 border border-white/40 bg-charcoal/85 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-ivory backdrop-blur-md sm:block"
              >
                Энэ өрөөг турших →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SWATCH STRIP ---------------- */}
      <section className="overflow-hidden border-b border-charcoal/10 bg-porcelain py-4">
        <div className="flex w-max marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex">
              {heroColors.map((c) => (
                <div key={`${dup}-${c.id}`} className="flex items-center gap-3 px-4">
                  <span
                    className="h-6 w-6 border border-charcoal/10"
                    style={{ backgroundColor: c.hex ?? "#E6DDCE" }}
                  />
                  <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                    {c.material_name} · {c.code}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- BRAND INTRO ---------------- */}
      <section className="container-luxe py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Бидний тухай</p>
            <h2 className="mt-5 font-display text-[32px] leading-[1.16] text-charcoal sm:text-[40px]">
              Даавуунаас эхэлж,
              <br />
              өрөөний тэнцвэрээр
              <br />
              дуусдаг ажил.
            </h2>
          </div>
          <div className="space-y-6 text-[14.5px] leading-[1.85] text-charcoal/70">
            <p>
              LENA HOME нь захиалгат хөшиг үйлдвэрлэл, мэргэжлийн цонхны хэмжилт,
              дээд зэргийн даавууны сонголт, захиалгат үйлдвэрлэлээр мэргэшсэн компани.
              Бид үйлчлүүлэгч бүрийн хувийн сонголт, өрөөний хэмжээс, интерьерийн хэв маягт
              тохируулан хөшиг урладаг.
            </p>
            <p>
              Манай зорилго нь гоо зүй, функциональ байдал, гар урлалын чанарыг хослуулсан
              өндөр чанартай, хувь хүнд зориулсан хөшигний шийдлийг санал болгох юм.
            </p>
            <div className="grid gap-5 pt-2 sm:grid-cols-3">
              {[
                { t: "Хэмжилт", d: "Цонх бүрийг тухайн байранд нь хэмжиж, шалан дээрх зай, таазны өндрийг тооцно." },
                { t: "Даавуу", d: `${countColors()} өнгөний код, ${listMaterials().length} материалын сонголт. Гэрлийн тусгал, уналтыг туршад үзээрэй.` },
                { t: "Оёдол", d: "Атирааны хэмжээ, дүүргэлтийг оёдол бүрт тооцож, хөшиг өөрийнхөө хэлбэрийг хадгална." },
              ].map((item) => (
                <div key={item.t}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-taupe">{item.t}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/60">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED COLLECTIONS ---------------- */}
      <section className="border-y border-charcoal/10 bg-white/60 py-20 lg:py-24">
        <div className="container-luxe">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Онцлох коллекц</p>
              <h2 className="mt-4 font-display text-[30px] text-charcoal sm:text-[38px]">
                Даавууны үндсэн цуврал
              </h2>
            </div>
            <Link href="/materials" className="btn btn-outline">
              Бүх материал
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((m) => {
              const sample = colors.filter((c) => c.material_id === m.id).slice(0, 5);
              return (
                <Link
                  key={m.id}
                  href={`/materials/${m.slug}`}
                  className="group flex flex-col bg-ivory p-6 transition-colors hover:bg-porcelain"
                >
                  <div className="relative h-40 overflow-hidden border border-charcoal/10">
                    {sample[0]?.hex ? (
                      <DraperyArt
                        color={sample[0].hex}
                        folds={7}
                        sheen={m.sheen}
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#E6DDCE]">
                        <DraperyArt
                          color="#CFC2AE"
                          folds={7}
                          sheen={m.sheen}
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-ivory/85 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-charcoal/70">
                      {m.color_count} өнгө
                    </span>
                  </div>
                  <h3 className="mt-5 text-[13px] font-semibold tracking-[0.1em] text-charcoal">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-charcoal/45">{m.weight}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[12px] text-charcoal/70">
                      {m.price_per_meter ? `${formatMnt(m.price_per_meter)} / м` : "Үнэ тохируулаагүй"}
                    </p>
                    <span className="flex gap-1">
                      {sample.slice(0, 4).map((c) => (
                        <span
                          key={c.id}
                          className="h-3 w-3 border border-charcoal/10"
                          style={{ backgroundColor: c.hex ?? "#E6DDCE" }}
                        />
                      ))}
                    </span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-taupe transition-transform group-hover:translate-x-1">
                    Дэлгэрэнгүй →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- COLOUR / STYLE COLLECTIONS ---------------- */}
      <section className="container-luxe py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Өнгөний коллекц</p>
            <h2 className="mt-4 font-display text-[30px] leading-tight text-charcoal sm:text-[38px]">
              Интерьерийн хэв маягаар
              <br />
              эрэмбэлсэн өнгө
            </h2>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-charcoal/60">
              Өнгө бүр мэргэжлийн интерьерийн категорид хамаарна. Нэг өнгө хэд хэдэн
              категорид багтах боломжтой.
            </p>
            <Link href="/collections" className="btn btn-outline mt-8">
              Өнгөний каталог
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2">
            {STYLE_CATEGORIES.map((cat) => {
              const sample = colors.filter((c) => c.style_tags.includes(cat.key) && c.hex).slice(0, 6);
              return (
                <Link
                  key={cat.key}
                  href={`/collections?style=${cat.key}`}
                  className="group bg-ivory p-5 transition-colors hover:bg-porcelain"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 rounded-full border border-charcoal/10"
                      style={{ backgroundColor: cat.swatch }}
                    />
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                      {cat.label}
                    </h3>
                  </div>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-charcoal/55">{cat.desc}</p>
                  <div className="mt-4 flex gap-1">
                    {sample.length > 0 ? (
                      sample.map((c) => (
                        <span
                          key={c.id}
                          className="h-4 flex-1 border border-charcoal/8"
                          style={{ backgroundColor: c.hex as string }}
                        />
                      ))
                    ) : (
                      <span className="text-[10px] text-charcoal/35">Swatch нэмэгдээгүй</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-[24px] text-charcoal">Хөшигний загвар</h3>
            <Link href="/studio" className="text-[11px] uppercase tracking-[0.16em] text-taupe hover:text-charcoal">
              3D-д турших →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {CURTAIN_STYLES.map((s) => (
              <Link
                key={s.key}
                href={`/studio?style=${s.key}`}
                className="border border-charcoal/15 px-4 py-2 text-[11.5px] tracking-[0.04em] text-charcoal/75 transition-colors hover:border-charcoal hover:text-charcoal"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- AI COLOR MATCH ---------------- */}
      <section className="container-luxe pb-20 lg:pb-24">
        <div className="grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-porcelain p-7 sm:p-9">
            <p className="eyebrow">AI COLOR MATCH</p>
            <h2 className="mt-4 font-display text-[28px] leading-tight sm:text-[34px]">
              Өрөөндөө тохирох
              <br />
              хөшгийг олоорой
            </h2>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-charcoal/60">
              Өрөөнийхөө зургийг оруулахад хана, шал, тавилгын өнгөнд тохирох даавууг
              бодит каталогаас сонгож, кодыг нь тайлбартай харуулна.
            </p>
            <Link href="/ai-match" className="btn btn-primary mt-6">
              Зураг оруулах
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-px bg-charcoal/10">
            {["#EDE4D4", "#D9C3A0", "#B7AFA3", "#8A7C6D", "#6E1F2B", "#4A6FA5", "#3E5232", "#1F2A44"].map(
              (hex) => (
                <div key={hex} className="relative aspect-square bg-porcelain">
                  <div className="absolute inset-0" style={{ backgroundColor: hex }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15" />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 3D STUDIO ---------------- */}
      <section className="border-y border-charcoal/10 bg-charcoal text-ivory">
        <div className="container-luxe grid gap-14 py-20 lg:grid-cols-[1fr_0.85fr] lg:py-28">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-champagne">
              LENA HOME 3D Хөшигний студи
            </p>
            <h2 className="mt-5 font-display text-[32px] leading-[1.14] sm:text-[44px]">
              Өрөөндөө орохын өмнө
              <br />
              хөшгөө хараарай.
            </h2>
            <p className="mt-6 max-w-md text-[14px] leading-[1.85] text-ivory/65">
              Бодит гэрэлтүүлэг, даавууны бүтэц, атирааны хэлбэрийг 3D орчинд шууд
              өөрчилнө. Өглөө, өдөр, орой, шөнийн гэрэлд хөшиг хэрхэн харагдахыг
              тэнцүүлж үзээрэй.
            </p>
            <ul className="mt-8 grid gap-3 text-[12.5px] text-ivory/70 sm:grid-cols-2">
              {[
                "8 бодит өрөөний орчин",
                "9 хөшигний загвар",
                "Долгион, атираа, люверс",
                "Материал ба өнгө солих",
                "Өдөр/шөнийн гэрэлтүүлэг",
                "Хэмжээс ба үнийн тооцоо",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/studio" className="btn btn-light">
                3D Дизайн турших
              </Link>
              <Link
                href="/services#measure"
                className="btn border border-ivory/25 text-ivory hover:border-ivory/60"
              >
                Хэмжилтийн тооцоолуур
              </Link>
            </div>
          </div>

          <div className="relative border border-ivory/15">
            <div className="absolute inset-0 grid grid-cols-3">
              {["#D9C3A0", "#8A7C6D", "#3C3F43"].map((c, i) => (
                <DraperyArt key={c} color={c} folds={4 + i} sheen={0.4 + i * 0.15} className="h-full w-full" />
              ))}
            </div>
            <div className="relative flex h-full min-h-[300px] flex-col justify-end bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">
                Нэг даавуунд гурван өнгө
              </p>
              <p className="mt-2 font-display text-[20px]">Материал солиход бүтэц нь өөрчлөгдөнө</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="container-luxe py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Үйлдвэрлэлийн үйл явц</p>
          <h2 className="mt-4 font-display text-[32px] leading-tight sm:text-[40px]">
            Хэмжилтээс угсралт хүртэл — нэг хариуцлагатай баг
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.title} className="bg-ivory p-6">
              <p className="font-display text-[28px] text-champagne">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 text-[12px] leading-relaxed text-charcoal/55">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="border-y border-charcoal/10 bg-porcelain py-20 lg:py-24">
        <div className="container-luxe">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Үйлчилгээ</p>
              <h2 className="mt-4 font-display text-[30px] sm:text-[38px]">Бид юу хийдэг вэ</h2>
            </div>
            <Link href="/services" className="btn btn-outline">
              Дэлгэрэнгүй
            </Link>
          </div>
          <div className="mt-12 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-porcelain p-7">
                <h3 className="text-[13px] font-semibold tracking-[0.06em] text-charcoal">{s.title}</h3>
                <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/55">{s.desc}</p>
              </div>
            ))}
            <Link
              href="/contact"
              className="group flex flex-col justify-between bg-charcoal p-7 text-ivory"
            >
              <p className="text-[13px] font-semibold tracking-[0.06em]">Зөвлөгөө захиалах</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ivory/60">
                Хэмжилт, даавууны сонголт, үнийн саналыг үнэ төлбөргүй зөвлөнө.
              </p>
              <span className="mt-6 text-[10px] uppercase tracking-[0.2em] text-champagne transition-transform group-hover:translate-x-1">
                Холбоо барих →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="container-luxe py-20 lg:py-24">
        <p className="eyebrow">Үйлчлүүлэгчдийн сэтгэгдэл</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.author} className="border-t border-charcoal/15 pt-6">
              <blockquote className="font-display text-[19px] leading-[1.5] text-charcoal/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[11px] uppercase tracking-[0.16em] text-taupe">
                {t.author} · {t.district}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section className="border-t border-charcoal/10 bg-white/70 py-20 lg:py-24">
        <div className="container-luxe grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Холбоо барих</p>
            <h2 className="mt-4 font-display text-[32px] leading-tight sm:text-[40px]">
              Орон зайгаа хамтдаа
              <br />
              бүтээе.
            </h2>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-charcoal/60">
              Хүннү гудамж, 26-р хороо, Баянзүрх дүүрэг, Улаанбаатар, Төв 31546.
              Цаг товлож, шоурумд ирж даавууг биечлэн үзээрэй.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+97677477788" className="btn btn-primary">
                Залгах — 7747 7788
              </a>
              <a
                href="https://www.facebook.com/share/1EocESec85/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline"
              >
                Facebook
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-charcoal/10 pt-6 text-[12px]">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Утас</dt>
                <dd className="mt-1.5 text-charcoal">7747 7788</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Хаяг</dt>
                <dd className="mt-1.5 leading-relaxed text-charcoal">
                  Хүннү гудамж, 26-р хороо
                  <br />
                  Баянзүрх дүүрэг
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative overflow-hidden border border-charcoal/10">
            <iframe
              title="LENA HOME байршил"
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.90%2C47.90%2C107.00%2C47.96&layer=mapnik&marker=47.9285%2C106.9486"
              className="h-[360px] w-full grayscale-[35%]"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-charcoal/10 bg-ivory/95 px-4 py-3 backdrop-blur">
              <p className="text-[11px] text-charcoal/70">Баянзүрх дүүрэг, 26-р хороо</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hunnu+Street+26+khoroo+Bayanzurkh+Ulaanbaatar"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[10px] uppercase tracking-[0.16em] text-taupe hover:text-charcoal"
              >
                Зам харах →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- BRING YOUR DESIGN TO LIFE ---------------- */}
      <section className="container-luxe py-20">
        <div className="relative overflow-hidden border border-charcoal/10">
          <div className="absolute inset-0 opacity-90">
            <div className="grid h-full grid-cols-4">
              {["#E9DFCF", "#D9C3A0", "#B7AFA3", "#7C7469"].map((c, i) => (
                <DraperyArt key={c} color={c} folds={6 + i} sheen={0.3 + i * 0.1} className="h-full w-full" />
              ))}
            </div>
          </div>
          <div className="relative bg-gradient-to-r from-ivory via-ivory/92 to-ivory/25 px-6 py-16 sm:px-12 lg:py-20">
            <p className="eyebrow">BRING YOUR DESIGN TO LIFE</p>
            <h2 className="mt-4 max-w-lg font-display text-[30px] leading-tight sm:text-[40px]">
              Таны орон зай. Таны хэмжээс.
              <br />
              Танд зориулсан хөшиг.
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-charcoal/60">
              3D студид дизайнаа хадгалж, мэргэжлийн хэмжилт болон үнийн санал хүсээрэй.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studio" className="btn btn-primary">
                Зөвлөгөө авах
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Холбоо барих
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe pb-8">
        <div className="hairline" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
          <p>Ойролцоо өнгөний тон ({heroColors.length} дээж) нь зөвхөн чиглүүлэх зориулалттай</p>
          <p>Swatch зураг шаардлагатай өнгөнүүд каталогт тэмдэглэгдсэн</p>
        </div>
      </section>
    </>
  );
}
