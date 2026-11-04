"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-porcelain">
      <div className="container-luxe py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[22px] tracking-[0.22em]">LENA</span>
              <span className="font-display text-[22px] tracking-[0.32em] text-taupe">HOME</span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-charcoal/65">
              Захиалгат хөшиг үйлдвэрлэл, мэргэжлийн хэмжилт, даавууны зөвлөгөө,
              интерьерийн өнгөний шийдэл.
            </p>
            <p className="mt-6 text-[11px] tracking-[0.18em] text-taupe uppercase">
              Улаанбаатар • Монгол
            </p>
          </div>

          <div>
            <p className="eyebrow">Цэс</p>
            <ul className="mt-5 space-y-2.5 text-[13px] text-charcoal/70">
              <li><Link href="/collections" className="hover:text-charcoal">Хөшигний коллекц</Link></li>
              <li><Link href="/materials" className="hover:text-charcoal">Материал</Link></li>
              <li><Link href="/studio" className="hover:text-charcoal">3D Хөшигний студи</Link></li>
              <li><Link href="/ai-match" className="hover:text-charcoal">AI өнгө тааруулагч</Link></li>
              <li><Link href="/services" className="hover:text-charcoal">Үйлчилгээ</Link></li>
              <li><Link href="/about" className="hover:text-charcoal">Бидний тухай</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Үйлчилгээ</p>
            <ul className="mt-5 space-y-2.5 text-[13px] text-charcoal/70">
              <li>Цонхны хэмжилт</li>
              <li>Захиалгат хөшиг үйлдвэрлэл</li>
              <li>Материалын зөвлөгөө</li>
              <li>Хөшиг угсралт</li>
              <li>Интерьерийн өнгөний зөвлөгөө</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Холбоо барих</p>
            <ul className="mt-5 space-y-3 text-[13px] text-charcoal/70">
              <li className="leading-relaxed">
                Хүннү гудамж, 26-р хороо,
                <br />
                Баянзүрх дүүрэг, Улаанбаатар,
                <br />
                Төв 31546
              </li>
              <li>
                <a href="tel:+97677477788" className="text-charcoal hover:text-taupe">
                  7747 7788
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1EocESec85/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-charcoal hover:text-taupe"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-charcoal/25 text-[10px]">
                    f
                  </span>
                  Facebook хуудас
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14" />
        <div className="flex flex-col items-start justify-between gap-4 pt-7 text-[11px] text-charcoal/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} LENA HOME. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-5">
            <Link href="/studio" className="hover:text-charcoal">3D студи</Link>
            <Link href="/contact" className="hover:text-charcoal">Зөвлөгөө</Link>
            <Link href="/admin" className="hover:text-charcoal">Админ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
