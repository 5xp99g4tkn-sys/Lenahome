"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Нүүр" },
  { href: "/collections", label: "Хөшигний коллекц" },
  { href: "/materials", label: "Материал" },
  { href: "/studio", label: "3D Хөшигний студи" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/services", label: "Үйлчилгээ" },
  { href: "/contact", label: "Холбоо барих" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
        scrolled
          ? "border-charcoal/10 bg-ivory/95 backdrop-blur-md"
          : "border-charcoal/5 bg-ivory"
      }`}
    >
      <div className="container-luxe flex h-[74px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2.5" aria-label="LENA HOME нүүр">
          <span className="font-display text-[22px] leading-none tracking-[0.22em] text-charcoal">
            LENA
          </span>
          <span className="font-display text-[22px] leading-none tracking-[0.32em] text-taupe">
            HOME
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Үндсэн цэс">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[12.5px] tracking-[0.04em] transition-colors ${
                  active ? "text-charcoal" : "text-charcoal/65 hover:text-charcoal"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-charcoal transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+97677477788"
            className="hidden text-[12.5px] tracking-[0.06em] text-charcoal/70 transition-colors hover:text-charcoal xl:block"
          >
            7747 7788
          </a>
          <Link href="/studio" className="btn btn-primary hidden sm:inline-flex">
            3D Дизайн турших
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Цэс нээх"
            className="flex h-10 w-10 items-center justify-center border border-charcoal/15 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-full bg-charcoal transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-full bg-charcoal transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-charcoal transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-charcoal/10 bg-ivory transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-[520px]" : "max-h-0"
        }`}
      >
        <nav className="container-luxe flex flex-col py-4" aria-label="Мобайл цэс">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-charcoal/8 py-3 text-[14px] text-charcoal/80"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/studio" className="btn btn-primary w-full">
              3D Дизайн турших
            </Link>
            <a href="tel:+97677477788" className="btn btn-outline w-full">
              Залгах — 7747 7788
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
