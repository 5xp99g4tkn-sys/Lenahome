import Link from "next/link";
import { listDesigns } from "@/lib/db";
import { formatMnt } from "@/lib/quote";

export const dynamic = "force-dynamic";

type DesignRow = {
  id: number;
  public_id: string;
  customer_name: string | null;
  phone: string | null;
  room_type: string | null;
  curtain_style: string | null;
  material_name: string | null;
  color_code: string | null;
  color_name: string | null;
  measurements: string | null;
  estimated_price: number | null;
  preview_path: string | null;
  lighting: string | null;
  created_at: string;
};

export default function AdminDesignsPage() {
  const designs = listDesigns() as unknown as DesignRow[];

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Хадгалсан дизайн</p>
          <h1 className="mt-2 font-display text-[26px]">Хэрэглэгчийн 3D дизайн</h1>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-charcoal/55">
            3D студид хадгалсан дизайнууд. Хүсэлтэй холбогдсон дизайныг зөвлөгөөний
            хуудаснаас харна.
          </p>
        </div>
        <p className="text-[11px] text-charcoal/45">Нийт {designs.length}</p>
      </header>

      {designs.length === 0 ? (
        <p className="border border-dashed border-charcoal/20 bg-ivory p-10 text-center text-[12px] text-charcoal/45">
          Хараахан дизайн хадгалагдаагүй. Хэрэглэгч 3D студид “Дизайн хадгалах” дарж
          эхлэхэд энд харагдана.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((d) => {
            let meters: number | null = null;
            try {
              const parsed = d.measurements ? JSON.parse(d.measurements) : null;
              meters = parsed?.totalMeters ?? null;
            } catch {
              meters = null;
            }
            return (
              <article key={d.id} className="border border-charcoal/12 bg-ivory">
                <div className="relative h-36 overflow-hidden bg-porcelain">
                  {d.preview_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.preview_path} alt={`Дизайн ${d.public_id}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10.5px] text-charcoal/40">
                      3D зураггүй
                    </div>
                  )}
                  <span className="absolute right-2 top-2 bg-ivory/90 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em]">
                    {d.lighting ?? "day"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/design/${d.public_id}`} className="text-[12px] font-medium underline decoration-charcoal/20">
                      {d.public_id}
                    </Link>
                    <span className="text-[10px] text-charcoal/40">{d.created_at.slice(0, 10)}</span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-charcoal/60">{d.room_type ?? "—"}</p>
                  <p className="text-[11px] text-charcoal/45">
                    {d.material_name ?? "—"} · {d.color_code ?? "—"}
                  </p>
                  <p className="mt-1 text-[11px] text-charcoal/45">{d.curtain_style ?? "—"}</p>
                  <div className="mt-3 flex items-baseline justify-between border-t border-charcoal/10 pt-2">
                    <span className="text-[10.5px] text-charcoal/45">{meters ? `${meters} м даавуу` : "—"}</span>
                    <span className="text-[12px] tabular-nums">
                      {d.estimated_price ? formatMnt(d.estimated_price) : "—"}
                    </span>
                  </div>
                  {(d.customer_name || d.phone) && (
                    <p className="mt-2 text-[10.5px] text-charcoal/50">
                      {d.customer_name ?? ""} {d.phone ? `· ${d.phone}` : ""}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
