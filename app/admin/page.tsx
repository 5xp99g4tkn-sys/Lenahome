import Link from "next/link";
import { adminStats, listColors, listDesigns, listRequests, listMaterials } from "@/lib/db";
import { formatMnt } from "@/lib/quote";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  new: "Шинэ",
  contacted: "Холбогдсон",
  measured: "Хэмжсэн",
  quoted: "Үнэ өгсөн",
  won: "Баталгаажсан",
  closed: "Хаагдсан",
};

export default function AdminDashboard() {
  const stats = adminStats();
  const colors = listColors();
  const materials = listMaterials();
  const requests = listRequests(6) as Record<string, unknown>[];
  const designs = listDesigns(6) as Record<string, unknown>[];
  const missingSwatch = colors.filter((c) => !c.hex && !c.swatch_image).length;
  const unpriced = materials.filter((m) => !m.price_per_meter).length;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Хяналтын самбар</p>
          <h1 className="mt-2 font-display text-[28px]">LENA HOME удирдлага</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/materials" className="btn btn-outline">Материал нэмэх</Link>
          <Link href="/admin/requests" className="btn btn-primary">Хүсэлтүүд</Link>
        </div>
      </header>

      <div className="mt-8 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Материал", value: stats.materials, href: "/admin/materials" },
          { label: "Өнгөний код", value: stats.colors, href: "/admin/materials" },
          { label: "Зөвлөгөөний хүсэлт", value: stats.requests, href: "/admin/requests" },
          { label: "Шинэ хүсэлт", value: stats.newRequests, href: "/admin/requests" },
          { label: "Хадгалсан дизайн", value: stats.designs, href: "/admin/designs" },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="bg-ivory p-5 transition-colors hover:bg-white">
            <p className="font-display text-[30px] leading-none">{card.value}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-taupe">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="border border-charcoal/12 bg-ivory p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Анхаарал шаардсан</p>
          <ul className="mt-3 space-y-2 text-[12px]">
            <li className="flex items-center justify-between gap-3 border-b border-charcoal/10 pb-2">
              <span className="text-charcoal/70">Swatch зураггүй өнгө</span>
              <span className="font-medium">{missingSwatch}</span>
            </li>
            <li className="flex items-center justify-between gap-3 border-b border-charcoal/10 pb-2">
              <span className="text-charcoal/70">Үнэ тохируулаагүй материал</span>
              <span className="font-medium">{unpriced}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-charcoal/70">Шинэ хүсэлт</span>
              <span className="font-medium">{stats.newRequests}</span>
            </li>
          </ul>
          <p className="mt-4 text-[10.5px] leading-relaxed text-charcoal/45">
            Swatch зураг оруулснаар каталог дахь “Swatch шаардлагатай” тэмдэглэгээ
            автоматаар солигдоно. Бид зохиомол өнгө үүсгэдэггүй.
          </p>
        </div>

        <div className="border border-charcoal/12 bg-ivory p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Сүүлийн хүсэлт</p>
            <Link href="/admin/requests" className="text-[10px] uppercase tracking-[0.12em] text-charcoal/50 hover:text-charcoal">
              Бүгд →
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {requests.length === 0 && (
              <li className="py-6 text-center text-[11.5px] text-charcoal/40">Хүсэлт байхгүй</li>
            )}
            {requests.map((r) => (
              <li key={String(r.id)} className="flex items-center justify-between gap-3 border-b border-charcoal/8 pb-1.5 text-[11.5px]">
                <div className="min-w-0">
                  <p className="truncate">{String(r.customer_name)}</p>
                  <p className="text-[10px] text-charcoal/40">{String(r.phone_number)}</p>
                </div>
                <span className="shrink-0 text-[9.5px] uppercase tracking-[0.1em] text-charcoal/50">
                  {STATUS_LABEL[String(r.status)] ?? String(r.status)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border border-charcoal/12 bg-ivory p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Сүүлийн дизайн</p>
          <Link href="/admin/designs" className="text-[10px] uppercase tracking-[0.12em] text-charcoal/50 hover:text-charcoal">
            Бүгд →
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-charcoal/15 text-[9.5px] uppercase tracking-[0.12em] text-charcoal/45">
                <th className="py-2">Дугаар</th>
                <th className="py-2">Өрөө</th>
                <th className="py-2">Материал</th>
                <th className="py-2">Код</th>
                <th className="py-2">Үнэ</th>
                <th className="py-2">Огноо</th>
              </tr>
            </thead>
            <tbody>
              {designs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-charcoal/40">
                    Дизайн хараахан хадгалагдаагүй
                  </td>
                </tr>
              )}
              {designs.map((d) => (
                <tr key={String(d.id)} className="border-b border-charcoal/8">
                  <td className="py-2">
                    <Link href={`/design/${String(d.public_id)}`} className="underline decoration-charcoal/20">
                      {String(d.public_id)}
                    </Link>
                  </td>
                  <td className="py-2">{String(d.room_type ?? "—")}</td>
                  <td className="py-2">{String(d.material_name ?? "—")}</td>
                  <td className="py-2">{String(d.color_code ?? "—")}</td>
                  <td className="py-2 tabular-nums">
                    {d.estimated_price ? formatMnt(Number(d.estimated_price)) : "—"}
                  </td>
                  <td className="py-2 text-charcoal/50">{String(d.created_at ?? "").slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
