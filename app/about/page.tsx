import type { Metadata } from "next";
import Link from "next/link";
import { DraperyArt } from "@/components/art/DraperyArt";
import { BUSINESS, PROCESS_STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description:
    "LENA HOME — захиалгат хөшиг үйлдвэрлэл, мэргэжлийн хэмжилт, даавууны чанар, хувь хүнд зориулсан үйлчилгээ.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-luxe py-12 lg:py-16">
        <nav aria-label="Замын чиглэл" className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal/40">
          <Link href="/" className="hover:text-charcoal">Нүүр</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal/70">Бидний тухай</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="eyebrow">LENA HOME</p>
            <h1 className="mt-4 font-display text-[36px] leading-[1.1] sm:text-[48px]">
              Хэмжээс бүр дээр
              <br />
              гар аргаар бодож
              <br />
              <span className="italic text-taupe">оёдог студи.</span>
            </h1>
            <div className="mt-8 space-y-5 text-[14px] leading-[1.9] text-charcoal/70">
              <p>{BUSINESS.description}</p>
              <p>
                Бид бэлэн хөшиг зардаггүй. Цонх бүрийг тухайн байранд нь хэмжиж, гэрлийн
                чиглэл, тавилгын өнгө, өрөөний ашиглалтыг харгалзан даавуу сонгож, атирааны
                хэлбэрийг тодорхойлж, дараа нь оёж, угсарч өгдөг. Ингэснээр хөшиг нь зөвхөн
                гоёл чимэглэл биш, өрөөний архитектурын нэг хэсэг болдог.
              </p>
              <p>
                Улаанбаатарын орон сууцны ихэнх цонх стандарт бус хэмжээстэй, гэрлийн
                чиглэл өөр, таазны өндөр харилцан адилгүй байдаг. Тиймээс бид тооцоолол
                бүрийг таны байрны бодит хэмжээсээр хийдэг — 3D студи ч мөн адил.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/studio" className="btn btn-primary">3D Дизайн турших</Link>
              <a href="tel:+97677477788" className="btn btn-outline">Залгах — 7747 7788</a>
            </div>
          </div>

          <div className="relative h-[380px] overflow-hidden border border-charcoal/10 lg:h-auto">
            <div className="absolute inset-0 grid grid-cols-2">
              <DraperyArt color="#C9B393" folds={6} sheen={0.6} />
              <DraperyArt color="#8A7C6D" folds={5} sheen={0.25} />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-6 pt-16">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/60">Шоурум</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ivory/90">
                Хүннү гудамж, 26-р хороо,
                <br />
                Баянзүрх дүүрэг, Улаанбаатар
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-porcelain py-16 lg:py-20">
        <div className="container-luxe">
          <p className="eyebrow">Бидний зарчим</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Хэмжээсээр эхэлдэг",
                d: "Дизайн биш, хэмжилтээр эхэлнэ. Цонхны өргөн, өндөр, тааз, шалан дээрх зай бүгд шийдвэрт нөлөөлнө.",
              },
              {
                t: "Даавууны чанар",
                d: "Нэг өнгө өөр материал дээр өөрөөр харагдана. Бид бүтэц, нягт, гэрэл хаах чанарыг тэнцүүлж сонгоно.",
              },
              {
                t: "Ил тод үнэ",
                d: "Даавуу, оёдол, дагалдах хэрэгсэл, зам, угсралт, хүргэлтийг тусад нь харуулна. Далд төлбөр байхгүй.",
              },
              {
                t: "Хариуцлагатай угсралт",
                d: "Зам, бэхэлгээ, тааруулга — бүгдийг манай баг хийнэ. Ажлын дараа засварт хүлээн авна.",
              },
            ].map((v) => (
              <div key={v.t} className="border-t border-charcoal/15 pt-5">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em]">{v.t}</h2>
                <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/60">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-16 lg:py-20">
        <p className="eyebrow">Үйлдвэрлэлийн үйл явц</p>
        <h2 className="mt-4 max-w-2xl font-display text-[30px] leading-tight sm:text-[38px]">
          Таван алхам — эхнээс нь эцэс хүртэл нэг баг
        </h2>
        <ol className="mt-10 space-y-px bg-charcoal/10">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="grid gap-3 bg-ivory p-5 sm:grid-cols-[80px_200px_1fr] sm:items-baseline">
              <span className="font-display text-[26px] text-champagne">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em]">{step.title}</span>
              <span className="text-[12.5px] leading-relaxed text-charcoal/60">{step.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-luxe pb-16">
        <div className="grid gap-8 border border-charcoal/12 bg-white/70 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Байгууллага", v: BUSINESS.name },
            { k: "Утас", v: BUSINESS.phone },
            { k: "Хаяг", v: "Хүннү гудамж, 26-р хороо, Баянзүрх" },
            { k: "Facebook", v: "LENA HOME хуудас" },
          ].map((item) => (
            <div key={item.k}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">{item.k}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/75">{item.v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
