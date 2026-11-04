import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminNav from "@/components/admin/AdminNav";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Удирдлага",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-porcelain">
      <header className="border-b border-charcoal/12 bg-ivory">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="font-display text-[16px] tracking-[0.2em]">LENA</span>
              <span className="font-display text-[16px] tracking-[0.28em] text-taupe">HOME</span>
            </Link>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-charcoal/40 sm:block">
              Удирдлагын систем
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-charcoal/55">
            <span className="hidden sm:inline">
              {session.username} · {session.role}
            </span>
            <Link href="/" className="border border-charcoal/15 px-2.5 py-1 hover:border-charcoal">
              Сайт
            </Link>
          </div>
        </div>
        <AdminNav />
      </header>

      <div className="container-luxe py-8">{children}</div>
    </div>
  );
}
