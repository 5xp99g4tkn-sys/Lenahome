"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Swatch from "@/components/site/Swatch";
import { FAMILY_LABELS, STYLE_CATEGORIES } from "@/lib/color-science";
import { formatMnt } from "@/lib/quote";
import type { DbColor, DbMaterial } from "@/lib/db";

type Props = {
  colors: DbColor[];
  materials: DbMaterial[];
  initial?: { q?: string; material?: string; style?: string; family?: string };
};

const PRICE_FILTERS = [
  { key: "all", label: "Бүх үнэ" },
  { key: "low", label: "100,000₮ хүртэл" },
  { key: "mid", label: "100,000–130,000₮" },
  { key: "high", label: "130,000₮-өөс дээш" },
  { key: "none", label: "Үнэ тохируулаагүй" },
];

export default function FabricBrowser({ colors, materials, initial = {} }: Props) {
  const [q, setQ] = useState(initial.q ?? "");
  const [material, setMaterial] = useState(initial.material ?? "all");
  const [style, setStyle] = useState(initial.style ?? "all");
  const [family, setFamily] = useState(initial.family ?? "all");
  const [price, setPrice] = useState("all");
  const [onlyHex, setOnlyHex] = useState(false);
  const [sort, setSort] = useState<"material" | "code" | "price">("material");
  const [active, setActive] = useState<DbColor | null>(null);

  const families = useMemo(() => {
    const set = new Set<string>();
    colors.forEach((c) => c.family && set.add(c.family));
    return Array.from(set).sort();
  }, [colors]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let rows = colors.filter((c) => {
      if (material !== "all" && c.material_slug !== material) return false;
      if (family !== "all" && c.family !== family) return false;
      if (style !== "all" && !c.style_tags.includes(style)) return false;
      if (onlyHex && !c.hex) return false;
      if (price !== "all" && c.price_per_meter != null) {
        const p = c.price_per_meter;
        if (price === "low" && p >= 100000) return false;
        if (price === "mid" && (p < 100000 || p > 130000)) return false;
        if (price === "high" && p <= 130000) return false;
      }
      if (price === "none" && c.price_per_meter != null) return false;
      if (term) {
        const haystack = `${c.code} ${c.name ?? ""} ${c.material_name} ${c.family ?? ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    if (sort === "code") rows = [...rows].sort((a, b) => a.code.localeCompare(b.code));
    if (sort === "price")
      rows = [...rows].sort((a, b) => (a.price_per_meter ?? 1e12) - (b.price_per_meter ?? 1e12));
    return rows;
  }, [colors, q, material, family, style, price, onlyHex, sort]);

  const grouped = useMemo(() => {
    if (sort !== "material") return [{ name: "", rows: filtered }];
    const map = new Map<string, DbColor[]>();
    filtered.forEach((c) => {
      const list = map.get(c.material_name) ?? [];
      list.push(c);
      map.set(c.material_name, list);
    });
    // material order follows materials array
    return materials
      .filter((m) => map.has(m.name))
      .map((m) => ({ name: m.name, rows: map.get(m.name) as DbColor[] }));
  }, [filtered, sort, materials]);

  const activeMaterial = materials.find((m) => m.slug === active?.material_slug);

  const reset = () => {
    setQ("");
    setMaterial("all");
    setStyle("all");
    setFamily("all");
    setPrice("all");
    setOnlyHex(false);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* ------- filters ------- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-charcoal/12 bg-white/70 p-5">
          <label htmlFor="fabric-search" className="label">
            Хайлт
          </label>
          <input
            id="fabric-search"
            className="field"
            placeholder="Код, өнгө, материал…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-2 text-[10.5px] text-charcoal/45">
            Жишээ: <button type="button" className="underline" onClick={() => setQ("14959")}>14959</button>,{" "}
            <button type="button" className="underline" onClick={() => setQ("P2027")}>P2027</button>,{" "}
            <button type="button" className="underline" onClick={() => setQ("BORDO")}>BORDO</button>
          </p>

          <div className="mt-6">
            <p className="label">Материал</p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setMaterial("all")}
                className={`flex w-full items-center justify-between px-2 py-1.5 text-left text-[12px] ${
                  material === "all" ? "bg-charcoal text-ivory" : "text-charcoal/70 hover:bg-porcelain"
                }`}
              >
                <span>Бүгд</span>
                <span className="text-[10px] opacity-60">{colors.length}</span>
              </button>
              {materials.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => setMaterial(m.slug)}
                  className={`flex w-full items-center justify-between px-2 py-1.5 text-left text-[12px] ${
                    material === m.slug ? "bg-charcoal text-ivory" : "text-charcoal/70 hover:bg-porcelain"
                  }`}
                >
                  <span className="truncate pr-2">{m.name}</span>
                  <span className="text-[10px] opacity-60">{m.color_count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="label">Интерьерийн хэв маяг</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStyle("all")}
                className={`border px-2.5 py-1 text-[11px] ${
                  style === "all"
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-charcoal/15 text-charcoal/70"
                }`}
              >
                Бүгд
              </button>
              {STYLE_CATEGORIES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStyle(s.key)}
                  className={`border px-2.5 py-1 text-[11px] ${
                    style === s.key
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {families.length > 0 && (
            <div className="mt-6">
              <p className="label">Өнгөний бүлэг</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setFamily("all")}
                  className={`border px-2.5 py-1 text-[11px] ${
                    family === "all"
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-charcoal/15 text-charcoal/70"
                  }`}
                >
                  Бүгд
                </button>
                {families.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFamily(f)}
                    className={`border px-2.5 py-1 text-[11px] ${
                      family === f
                        ? "border-charcoal bg-charcoal text-ivory"
                        : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
                    }`}
                  >
                    {FAMILY_LABELS[f] ?? f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label htmlFor="price-filter" className="label">
              Үнэ
            </label>
            <select
              id="price-filter"
              className="field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              {PRICE_FILTERS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <label className="mt-5 flex items-center gap-2 text-[11.5px] text-charcoal/70">
            <input
              type="checkbox"
              checked={onlyHex}
              onChange={(e) => setOnlyHex(e.target.checked)}
              className="h-3.5 w-3.5 accent-[#26231f]"
            />
            Зөвхөн өнгө тодорхойлогдсон
          </label>

          <button type="button" onClick={reset} className="mt-6 w-full border border-charcoal/20 py-2 text-[10px] uppercase tracking-[0.16em] text-charcoal/60 hover:border-charcoal">
            Шүүлтүүр цэвэрлэх
          </button>
        </div>

        <p className="mt-4 text-[10.5px] leading-relaxed text-charcoal/45">
          “~” тэмдэглэгээ нь өнгөний нэр кодын дотор бичигдсэн тул гаргасан ойролцоо тон
          гэсэн үг. Албан ёсны swatch ороогүй өнгө “Swatch шаардлагатай” гэж харагдана.
        </p>
      </aside>

      {/* ------- results ------- */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/12 pb-4">
          <p className="text-[12px] text-charcoal/60">
            <span className="font-semibold text-charcoal">{filtered.length}</span> өнгө олдлоо
            {q && <> · “{q}”</>}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-[10px] uppercase tracking-[0.16em] text-taupe">
              Эрэмбэ
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-charcoal/15 bg-white px-2 py-1.5 text-[11.5px]"
            >
              <option value="material">Материалаар</option>
              <option value="code">Кодоор</option>
              <option value="price">Үнээр</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="border border-dashed border-charcoal/20 py-20 text-center">
            <p className="font-display text-[22px]">Илэрц олдсонгүй</p>
            <p className="mt-2 text-[12.5px] text-charcoal/55">
              Кодын хэсгийг эсвэл материалын шүүлтүүрийг өөрчилж үзнэ үү.
            </p>
            <button type="button" onClick={reset} className="btn btn-outline mt-6">
              Шүүлтүүр цэвэрлэх
            </button>
          </div>
        )}

        {grouped.map((group) => (
          <section key={group.name || "all"} className="mt-10 first:mt-6">
            {group.name && (
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-charcoal">
                  {group.name}
                </h2>
                <span className="text-[10.5px] text-charcoal/45">{group.rows.length} өнгө</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {group.rows.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c)}
                  className="group text-left"
                >
                  <Swatch
                    hex={c.hex}
                    image={c.swatch_image}
                    code={c.code}
                    name={c.name}
                    fabric={c.fabric}
                    size="md"
                    showLabel={false}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                  <p className="mt-2 truncate text-[11px] font-medium text-charcoal">{c.code}</p>
                  <p className="truncate text-[10px] text-charcoal/45">
                    {c.name ?? (c.hex ? "Тон тодорхойгүй" : "Swatch шаардлагатай")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ------- detail panel ------- */}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end bg-charcoal/40 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full max-w-lg border border-charcoal/15 bg-ivory p-6 sm:m-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{active.material_name}</p>
                <h3 className="mt-2 font-display text-[26px]">{active.code}</h3>
                <p className="mt-1 text-[12px] text-charcoal/60">
                  {active.name ?? (active.hex ? "Өнгөний нэр тодорхойгүй" : "Swatch зураг шаардлагатай")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Хаах"
                className="h-8 w-8 border border-charcoal/20 text-[13px] leading-none hover:border-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-[120px_1fr] gap-5">
              <Swatch
                hex={active.hex}
                image={active.swatch_image}
                code={active.code}
                fabric={active.fabric}
                size="lg"
                showLabel={false}
              />
              <dl className="space-y-2 text-[12px]">
                <div className="flex justify-between gap-3 border-b border-charcoal/10 pb-1.5">
                  <dt className="text-charcoal/50">Үнэ / метр</dt>
                  <dd>{active.price_per_meter ? formatMnt(active.price_per_meter) : "Тохируулаагүй"}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-charcoal/10 pb-1.5">
                  <dt className="text-charcoal/50">Даавууны өргөн</dt>
                  <dd>{activeMaterial?.fabric_width ?? 280} см</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-charcoal/10 pb-1.5">
                  <dt className="text-charcoal/50">Өнгөний бүлэг</dt>
                  <dd>{active.family ? (FAMILY_LABELS[active.family] ?? active.family) : "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-charcoal/50">Боломж</dt>
                  <dd>
                    {active.availability === "available"
                      ? "Бэлэн"
                      : active.availability === "order"
                        ? "Захиалгаар"
                        : "Тодорхойгүй"}
                  </dd>
                </div>
              </dl>
            </div>

            <p className="mt-4 text-[10.5px] leading-relaxed text-charcoal/45">
              {active.hex && active.hex_source === "code"
                ? "Өнгөний нэр нь үйлдвэрлэгчийн код дотор бичигдсэн байсан тул ойролцоо тон харуулсан. Бодит дээжийг шоурумд үзнэ үү."
                : "Энэ кодын бодит swatch зураг хараахан ороогүй. Ойролцоо өнгө зохиохгүй."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/studio?material=${active.material_slug}&code=${encodeURIComponent(active.code)}${active.fabric === "velvet" ? "&style=pinch" : ""}`}
                className="btn btn-primary"
              >
                3D-д турших
              </Link>
              <Link
                href={`/contact?code=${encodeURIComponent(active.code)}&material=${active.material_slug}`}
                className="btn btn-outline"
              >
                Дээж авах
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
