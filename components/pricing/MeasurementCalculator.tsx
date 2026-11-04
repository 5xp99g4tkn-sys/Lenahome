"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FULLNESS_OPTIONS, CURTAIN_STYLES, styleByKey } from "@/lib/catalog";
import { calcFabric, buildQuote, formatMnt, type PricingSettings } from "@/lib/quote";

type MaterialLite = {
  id: number;
  slug: string;
  name: string;
  price_per_meter: number | null;
  fabric_width: number;
  fabric: string;
};

export default function MeasurementCalculator({
  materials,
  settings,
  initialMaterialSlug,
  compact = false,
}: {
  materials: MaterialLite[];
  settings: PricingSettings;
  initialMaterialSlug?: string;
  compact?: boolean;
}) {
  const [width, setWidth] = useState(240);
  const [height, setHeight] = useState(230);
  const [ceiling, setCeiling] = useState(270);
  const [windows, setWindows] = useState(1);
  const [panels, setPanels] = useState(2);
  const [fullness, setFullness] = useState(2);
  const [styleKey, setStyleKey] = useState("wave");
  const [materialSlug, setMaterialSlug] = useState(
    initialMaterialSlug ?? materials[0]?.slug ?? "new-drappe",
  );

  const material = materials.find((m) => m.slug === materialSlug) ?? materials[0];
  const style = styleByKey(styleKey);

  const measurement = useMemo(
    () =>
      calcFabric(
        { widthCm: width, heightCm: height, ceilingCm: ceiling, windows, panels, fullness },
        material?.fabric_width ?? 280,
        {
          styleKey,
          withPatternRepeat: material ? ["jacquard", "velvet"].includes(material.fabric) : false,
          settings,
        },
      ),
    [width, height, ceiling, windows, panels, fullness, material, styleKey, settings],
  );

  const quote = useMemo(
    () =>
      buildQuote({
        meters: measurement.totalMeters,
        windowWidthCm: width,
        windows,
        panels,
        styleKey,
        pricePerMeter: material?.price_per_meter ?? null,
        settings,
      }),
    [measurement.totalMeters, width, windows, panels, styleKey, material, settings],
  );

  const studioHref = `/studio?material=${materialSlug}&style=${styleKey}&w=${width}&h=${height}&windows=${windows}&panels=${panels}&fullness=${fullness}`;

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[1.05fr_0.95fr]"}`}>
      {/* -------- inputs -------- */}
      <div className="border border-charcoal/12 bg-white/70 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Хэмжилт</p>
          <span className="text-[10px] text-charcoal/40">см-ээр оруулна</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="m-width" className="label">Цонхны өргөн</label>
            <input
              id="m-width"
              type="number"
              min={30}
              max={1200}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="m-height" className="label">Цонхны өндөр</label>
            <input
              id="m-height"
              type="number"
              min={30}
              max={500}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="m-ceiling" className="label">Таазны өндөр</label>
            <input
              id="m-ceiling"
              type="number"
              min={150}
              max={500}
              value={ceiling}
              onChange={(e) => setCeiling(Number(e.target.value))}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="m-windows" className="label">Цонхны тоо</label>
            <input
              id="m-windows"
              type="number"
              min={1}
              max={12}
              value={windows}
              onChange={(e) => setWindows(Number(e.target.value))}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="m-panels" className="label">Хөшигний тоо (нэг цонх)</label>
            <select
              id="m-panels"
              className="field"
              value={panels}
              onChange={(e) => setPanels(Number(e.target.value))}
            >
              <option value={1}>1 — нэг талдаа</option>
              <option value={2}>2 — хоёр талдаа</option>
              <option value={3}>3 — гурав</option>
              <option value={4}>4 — дөрөв</option>
            </select>
          </div>
          <div>
            <label htmlFor="m-material" className="label">Материал</label>
            <select
              id="m-material"
              className="field"
              value={materialSlug}
              onChange={(e) => setMaterialSlug(e.target.value)}
            >
              {materials.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <p className="label">Дүүргэлт (fullness)</p>
          <div className="grid grid-cols-4 gap-1.5">
            {FULLNESS_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFullness(f.value)}
                className={`border px-1 py-2 text-[10.5px] leading-tight transition-colors ${
                  fullness === f.value
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="m-style" className="label">Хөшигний загвар</label>
          <select
            id="m-style"
            className="field"
            value={styleKey}
            onChange={(e) => setStyleKey(e.target.value)}
          >
            {CURTAIN_STYLES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] leading-relaxed text-charcoal/50">{style.desc}</p>
        </div>

        <div className="mt-5 border-t border-charcoal/10 pt-4">
          <div className="grid grid-cols-2 gap-3 text-[11.5px]">
            <div>
              <p className="text-charcoal/45">Нэг хөшигний өргөн</p>
              <p className="mt-0.5 text-[13px]">{Math.round(measurement.panelWidthCm)} см</p>
            </div>
            <div>
              <p className="text-charcoal/45">Огтлох урт</p>
              <p className="mt-0.5 text-[13px]">{Math.round(measurement.cutLengthCm)} см</p>
            </div>
            <div>
              <p className="text-charcoal/45">Даавууны хэсэг</p>
              <p className="mt-0.5 text-[13px]">{measurement.widthsPerPanel} × хөшиг</p>
            </div>
            <div>
              <p className="text-charcoal/45">Нийт даавуу</p>
              <p className="mt-0.5 text-[13px] font-medium">{measurement.totalMeters} м</p>
            </div>
          </div>
        </div>

        {measurement.warnings.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-l-2 border-champagne bg-porcelain px-3 py-2">
            {measurement.warnings.map((w) => (
              <li key={w} className="text-[10.5px] leading-relaxed text-charcoal/60">
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* -------- quote -------- */}
      <div className="border border-charcoal/12 bg-porcelain p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Урьдчилсан үнийн санал</p>
          <span className="text-[10px] text-charcoal/40">{material?.name}</span>
        </div>

        <div className="mt-4 divide-y divide-charcoal/10">
          {quote.lines.map((line) => (
            <div key={line.key} className="flex items-baseline justify-between gap-4 py-2.5">
              <div>
                <p className="text-[12px] text-charcoal">{line.label}</p>
                <p className="text-[10px] text-charcoal/45">{line.detail}</p>
              </div>
              <p className="whitespace-nowrap text-[12px] tabular-nums">{formatMnt(line.amount)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-charcoal/25 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-taupe">Нийт урьдчилсан</p>
            <p className="mt-1 text-[10px] text-charcoal/40">НӨАТ ороогүй</p>
          </div>
          <p className="font-display text-[26px] tabular-nums">{formatMnt(quote.total)}</p>
        </div>

        <ul className="mt-4 space-y-1.5">
          {quote.notes.map((n) => (
            <li key={n} className="text-[10.5px] leading-relaxed text-charcoal/50">
              • {n}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2">
          <Link href={studioHref} className="btn btn-primary w-full">
            3D-д харах
          </Link>
          <Link
            href={`/contact?material=${materialSlug}&w=${width}&h=${height}&windows=${windows}&panels=${panels}&fullness=${fullness}&style=${styleKey}`}
            className="btn btn-outline w-full"
          >
            Мэргэжлийн хэмжилт хүсэх
          </Link>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-charcoal/40">
          Даавууны зарцуулалт нь урьдчилсан тооцоо. Эцсийн хэмжээ, зарцуулалтыг мэргэжлийн
          хэмжилтийн баг батална.
        </p>
      </div>
    </div>
  );
}
