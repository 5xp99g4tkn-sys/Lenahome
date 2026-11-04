"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUSES: [string, string][] = [
  ["new", "Шинэ"],
  ["contacted", "Холбогдсон"],
  ["measured", "Хэмжсэн"],
  ["quoted", "Үнэ өгсөн"],
  ["won", "Баталгаажсан"],
  ["closed", "Хаагдсан"],
];

export type RequestRow = {
  id: number;
  public_id: string;
  customer_name: string;
  phone_number: string;
  address: string | null;
  preferred_date: string | null;
  request_details: string | null;
  design_public_id: string | null;
  type: string;
  status: string;
  admin_note: string | null;
  created_at: string;
};

export default function RequestTable({ requests }: { requests: RequestRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const rows = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  async function update(id: number, status: string, note?: string) {
    setBusy(id);
    await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, note }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`border px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.1em] ${
            filter === "all" ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/15"
          }`}
        >
          Бүгд ({requests.length})
        </button>
        {STATUSES.map(([key, label]) => {
          const count = requests.filter((r) => r.status === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`border px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.1em] ${
                filter === key ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/15"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-px bg-charcoal/10">
        {rows.length === 0 && (
          <p className="bg-ivory p-8 text-center text-[12px] text-charcoal/45">Хүсэлт байхгүй</p>
        )}
        {rows.map((r) => (
          <div key={r.id} className="bg-ivory p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-medium">{r.customer_name}</p>
                  <span className="border border-charcoal/15 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-charcoal/50">
                    {STATUSES.find(([k]) => k === r.status)?.[1] ?? r.status}
                  </span>
                  {r.type === "quotation" && (
                    <span className="bg-champagne/40 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em]">
                      Үнийн санал
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11.5px] text-charcoal/60">
                  <a href={`tel:${r.phone_number.replace(/\s/g, "")}`} className="hover:text-charcoal">
                    {r.phone_number}
                  </a>
                  {r.address ? ` · ${r.address}` : ""}
                </p>
                <p className="mt-0.5 text-[10px] text-charcoal/40">
                  {new Date(r.created_at).toLocaleString("mn-MN")}
                  {r.preferred_date ? ` · Хүссэн огноо: ${r.preferred_date}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {r.design_public_id && (
                  <Link
                    href={`/design/${r.design_public_id}`}
                    className="border border-charcoal/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] hover:border-charcoal"
                  >
                    Дизайн
                  </Link>
                )}
                <select
                  value={r.status}
                  disabled={busy === r.id}
                  onChange={(e) => update(r.id, e.target.value)}
                  className="border border-charcoal/15 bg-white px-2 py-1 text-[11px]"
                >
                  {STATUSES.map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === r.id ? null : r.id)}
                  className="border border-charcoal/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] hover:border-charcoal"
                >
                  {openId === r.id ? "Хаах" : "Дэлгэрэнгүй"}
                </button>
              </div>
            </div>

            {openId === r.id && (
              <div className="mt-3 border-t border-charcoal/10 pt-3 text-[11.5px]">
                <p className="text-charcoal/60">
                  <span className="text-charcoal/40">Нэмэлт мэдээлэл: </span>
                  {r.request_details || "—"}
                </p>
                <p className="mt-1 text-charcoal/40">
                  Хүсэлтийн дугаар: {r.public_id}
                  {r.design_public_id ? ` · Дизайн: ${r.design_public_id}` : ""}
                </p>
                <NoteEditor
                  initial={r.admin_note ?? ""}
                  onSave={(note) => update(r.id, r.status, note)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteEditor({ initial, onSave }: { initial: string; onSave: (note: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mt-3">
      <label className="label">Дотоод тэмдэглэл</label>
      <div className="flex gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} className="field py-2" />
        <button type="button" onClick={() => onSave(value)} className="btn btn-outline py-2">
          Хадгалах
        </button>
      </div>
    </div>
  );
}
