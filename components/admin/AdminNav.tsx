"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Хяналт" },
  { href: "/admin/materials", label: "Материал ба өнгө" },
  { href: "/admin/pricing", label: "Үнэ, тохиргоо" },
  { href: "/admin/requests", label: "Зөвлөгөөний хүсэлт" },
  { href: "/admin/designs", label: "Хэрэглэгчийн дизайн" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="border-t border-charcoal/10 bg-porcelain">
      <div className="container-luxe flex items-center justify-between gap-3 overflow-x-auto">
        <nav className="flex gap-1 overflow-x-auto py-1">
          {ITEMS.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "border-charcoal text-charcoal"
                    : "border-transparent text-charcoal/50 hover:text-charcoal"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="my-1 shrink-0 border border-charcoal/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-charcoal/60 hover:border-charcoal"
        >
          Гарах
        </button>
      </div>
    </div>
  );
}
