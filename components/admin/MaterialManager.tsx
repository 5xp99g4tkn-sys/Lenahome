"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DbColor, DbMaterial } from "@/lib/db";
import { FAMILY_LABELS } from "@/lib/color-science";

const FABRICS = [
  ["drape", "Хүнд даавуу"],
  ["jacquard", "Жаккард"],
  ["velvet", "Кадифе"],
  ["blackout", "Гэрэл хаагч"],
  ["sheer", "Тюль"],
  ["linen", "Торгон холимог"],
  ["blind", "Туузан хөшиг"],
];

const AVAILABILITY = [
  ["available", "Бэлэн"],
  ["order", "Захиалгаар"],
  ["unconfigured", "Тодорхойгүй"],
];

export default function MaterialManager({
  materials,
  colors,
}: {
  materials: DbMaterial[];
  colors: DbColor[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<number>(materials[0]?.id ?? 0);
  const selected = materials.find((m) => m.id === selectedId) ?? materials[0];
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const materialColors = useMemo(
    () => colors.filter((c) => c.material_id === selectedId),
    [colors, selectedId],
  );

  const [query, setQuery] = useState("");
  const filteredColors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return materialColors;
    return materialColors.filter(
      (c) => c.code.toLowerCase().includes(q) || (c.name ?? "").toLowerCase().includes(q),
    );
  }, [materialColors, query]);

  const [editingColor, setEditingColor] = useState<DbColor | null>(null);

  async function api(url: string, method: string, body?: unknown) {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Алдаа гарлаа");
      startTransition(() => router.refresh());
      return json;
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Алдаа гарлаа");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function saveMaterial(form: FormData) {
    const payload = {
      id: selected.id,
      name: String(form.get("name") ?? ""),
      nameEn: String(form.get("name_en") ?? ""),
      pricePerMeter: form.get("price") === "" ? null : Number(form.get("price")),
      fabricWidth: Number(form.get("width")),
      fabric: String(form.get("fabric")),
      weight: String(form.get("weight") ?? ""),
      opacity: Number(form.get("opacity")),
      sheen: Number(form.get("sheen")),
      availability: String(form.get("availability")),
      description: String(form.get("description") ?? ""),
    };
    const ok = await api("/api/admin/materials", "PATCH", payload);
    if (ok) setStatus("Материал хадгалагдлаа.");
  }

  async function createMaterial(form: FormData) {
    const payload = {
      name: String(form.get("new_name") ?? ""),
      pricePerMeter: form.get("new_price") === "" ? null : Number(form.get("new_price")),
      fabricWidth: Number(form.get("new_width")) || 280,
      fabric: String(form.get("new_fabric")),
      description: String(form.get("new_description") ?? ""),
      availability: "available",
    };
    if (!payload.name) {
      setStatus("Материалын нэр оруулна уу.");
      return;
    }
    const ok = await api("/api/admin/materials", "POST", payload);
    if (ok) setStatus("Шинэ материал нэмэгдлээ.");
  }

  async function saveColor(form: FormData) {
    if (!editingColor) return;
    const payload: Record<string, unknown> = {
      id: editingColor.id,
      code: String(form.get("code") ?? "").trim(),
      name: String(form.get("name") ?? ""),
      hex: String(form.get("hex") ?? "").trim() || null,
      family: String(form.get("family") ?? ""),
      availability: String(form.get("availability")),
      swatchImage: editingColor.swatch_image,
    };
    const ok = await api("/api/admin/colors", "PATCH", payload);
    if (ok) {
      setStatus("Өнгө хадгалагдлаа.");
      setEditingColor(null);
    }
  }

  async function addColor(form: FormData) {
    const code = String(form.get("new_code") ?? "").trim();
    if (!code) {
      setStatus("Код оруулна уу.");
      return;
    }
    const ok = await api("/api/admin/colors", "POST", {
      materialId: selectedId,
      code,
      name: String(form.get("new_color_name") ?? ""),
      hex: String(form.get("new_hex") ?? "").trim() || null,
      family: String(form.get("new_family") ?? ""),
    });
    if (ok) setStatus(`${code} нэмэгдлээ.`);
  }

  async function uploadSwatch(file: File) {
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Зураг хуулагдсангүй");
      if (editingColor) {
        setEditingColor({ ...editingColor, swatch_image: json.path });
        await api("/api/admin/colors", "PATCH", { id: editingColor.id, swatchImage: json.path });
      } else {
        setStatus(`Зураг хадгалагдлаа: ${json.path}`);
      }
      setStatus("Swatch зураг хадгалагдлаа.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Алдаа");
    } finally {
      setBusy(false);
    }
  }

  if (!selected) {
    return <p className="text-[12px] text-charcoal/50">Материал байхгүй байна.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <div className="border border-charcoal/12 bg-ivory">
          {materials.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedId(m.id);
                setEditingColor(null);
                setStatus(null);
              }}
              className={`flex w-full items-center justify-between gap-2 border-b border-charcoal/8 px-3 py-2.5 text-left text-[11.5px] last:border-0 ${
                m.id === selectedId ? "bg-charcoal text-ivory" : "hover:bg-porcelain"
              }`}
            >
              <span className="truncate">{m.name}</span>
              <span className="shrink-0 text-[9.5px] opacity-60">{m.color_count}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMaterial(new FormData(e.currentTarget));
          }}
          className="mt-4 border border-charcoal/12 bg-white p-4"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Шинэ материал</p>
          <div className="mt-3 space-y-2">
            <input name="new_name" className="field py-2 text-[12px]" placeholder="Материалын нэр" />
            <input name="new_price" type="number" className="field py-2 text-[12px]" placeholder="Үнэ / метр" />
            <input name="new_width" type="number" className="field py-2 text-[12px]" placeholder="Өргөн (см)" defaultValue={280} />
            <select name="new_fabric" className="field py-2 text-[12px]">
              {FABRICS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <textarea name="new_description" rows={2} className="field py-2 text-[12px]" placeholder="Тайлбар" />
          </div>
          <button type="submit" disabled={busy} className="btn btn-primary mt-3 w-full py-2">
            Нэмэх
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            if (confirm(`“${selected.name}” материалыг бүх өнгөний хамт устгах уу?`)) {
              api(`/api/admin/materials?id=${selected.id}`, "DELETE");
            }
          }}
          className="mt-3 w-full border border-[#9B3B2E]/30 py-2 text-[10px] uppercase tracking-[0.14em] text-[#9B3B2E] hover:bg-[#9B3B2E]/5"
        >
          Материал устгах
        </button>
      </div>

      <div className="space-y-6">
        {status && (
          <p className="border border-charcoal/15 bg-white px-3 py-2 text-[11px] text-charcoal/70">{status}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMaterial(new FormData(e.currentTarget));
          }}
          className="border border-charcoal/12 bg-ivory p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Материалын мэдээлэл</p>
            <span className="text-[10px] text-charcoal/40">
              {selected.slug} · {selected.color_count} өнгө
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Нэр</label>
              <input name="name" defaultValue={selected.name} className="field" />
            </div>
            <div>
              <label className="label">Англи нэр</label>
              <input name="name_en" defaultValue={selected.name_en ?? ""} className="field" />
            </div>
            <div>
              <label className="label">Үнэ / метр (₮)</label>
              <input
                name="price"
                type="number"
                defaultValue={selected.price_per_meter ?? ""}
                className="field"
                placeholder="Тохируулаагүй"
              />
            </div>
            <div>
              <label className="label">Даавууны өргөн (см)</label>
              <input name="width" type="number" defaultValue={selected.fabric_width} className="field" />
            </div>
            <div>
              <label className="label">Бүтэц</label>
              <select name="fabric" defaultValue={selected.fabric} className="field">
                {FABRICS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Боломж</label>
              <select name="availability" defaultValue={selected.availability} className="field">
                {AVAILABILITY.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Нягт / жин</label>
              <input name="weight" defaultValue={selected.weight ?? ""} className="field" />
            </div>
            <div>
              <label className="label">Гэрэл хаалт (0–1)</label>
              <input name="opacity" type="number" step="0.01" min={0} max={1} defaultValue={selected.opacity} className="field" />
            </div>
            <div>
              <label className="label">Гялбаа (0–1)</label>
              <input name="sheen" type="number" step="0.01" min={0} max={1} defaultValue={selected.sheen} className="field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Тайлбар</label>
              <textarea name="description" rows={3} defaultValue={selected.description ?? ""} className="field" />
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn btn-primary mt-4">
            Хадгалах
          </button>
        </form>

        <div className="border border-charcoal/12 bg-ivory p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">
              Өнгөний код ({materialColors.length})
            </p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="field max-w-[200px] py-1.5 text-[11.5px]"
              placeholder="Кодоор хайх…"
            />
          </div>

          <div className="mt-4 grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
            {filteredColors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setEditingColor(c)}
                className={`border p-1.5 text-left ${
                  editingColor?.id === c.id ? "border-charcoal ring-1 ring-charcoal" : "border-charcoal/10"
                }`}
              >
                <span
                  className="block h-10 w-full border border-charcoal/10"
                  style={{ backgroundColor: c.hex ?? "#E6DDCE" }}
                >
                  {c.swatch_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.swatch_image} alt={c.code} className="h-full w-full object-cover" />
                  )}
                </span>
                <span className="mt-1 block truncate text-[9.5px]">{c.code}</span>
                <span className="block truncate text-[9px] text-charcoal/40">
                  {c.hex ?? "swatch дутуу"}
                </span>
              </button>
            ))}
            {filteredColors.length === 0 && (
              <p className="col-span-5 py-6 text-center text-[11px] text-charcoal/40">Код олдсонгүй</p>
            )}
          </div>
        </div>

        {editingColor && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveColor(new FormData(e.currentTarget));
            }}
            className="border border-charcoal/20 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">
                Өнгө засах — {editingColor.code}
              </p>
              <button type="button" onClick={() => setEditingColor(null)} className="text-[11px] text-charcoal/50">
                Хаах ✕
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Код</label>
                <input name="code" defaultValue={editingColor.code} className="field" />
              </div>
              <div>
                <label className="label">Өнгөний нэр</label>
                <input name="name" defaultValue={editingColor.name ?? ""} className="field" />
              </div>
              <div>
                <label className="label">HEX (баталгаажсан бол)</label>
                <input name="hex" defaultValue={editingColor.hex ?? ""} className="field" placeholder="#D9C3A0" />
              </div>
              <div>
                <label className="label">Өнгөний бүлэг</label>
                <select name="family" defaultValue={editingColor.family ?? ""} className="field">
                  <option value="">—</option>
                  {Object.entries(FAMILY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Боломж</label>
                <select name="availability" defaultValue={editingColor.availability} className="field">
                  {AVAILABILITY.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Swatch зураг</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadSwatch(file);
                  }}
                  className="w-full text-[10.5px]"
                />
                {editingColor.swatch_image && (
                  <p className="mt-1 truncate text-[9.5px] text-charcoal/40">{editingColor.swatch_image}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={busy} className="btn btn-primary py-2">
                Хадгалах
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`${editingColor.code} кодыг устгах уу?`)) {
                    api(`/api/admin/colors?id=${editingColor.id}`, "DELETE").then(() => setEditingColor(null));
                  }
                }}
                className="border border-[#9B3B2E]/30 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[#9B3B2E]"
              >
                Устгах
              </button>
            </div>
          </form>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addColor(new FormData(e.currentTarget));
          }}
          className="border border-charcoal/12 bg-porcelain p-5"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Өнгө нэмэх</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <input name="new_code" className="field py-2 text-[12px]" placeholder="Код (заавал)" />
            <input name="new_color_name" className="field py-2 text-[12px]" placeholder="Өнгөний нэр" />
            <input name="new_hex" className="field py-2 text-[12px]" placeholder="#HEX (сонголтоор)" />
            <select name="new_family" className="field py-2 text-[12px]">
              <option value="">Бүлэг</option>
              {Object.entries(FAMILY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={busy} className="btn btn-outline mt-3 py-2">
            Код нэмэх
          </button>
          <p className="mt-2 text-[10px] leading-relaxed text-charcoal/40">
            Кодыг үйлдвэрлэгчийн жагсаалтаас яг хэвээр оруулна. HEX-г зөвхөн баталгаажсан
            дээжээс бичнэ — тодорхойгүй бол хоосон үлдээж, swatch зураг оруулна.
          </p>
        </form>

        <p className="text-[10px] text-charcoal/35">
          {pending ? "Шинэчилж байна…" : "Өөрчлөлт хадгалагдсаны дараа сайт шууд шинэчлэгдэнэ."}
        </p>
      </div>
    </div>
  );
}
