"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { CURTAIN_STYLES, FULLNESS_OPTIONS, LIGHTING_PRESETS, styleByKey } from "@/lib/catalog";
import {
  FLOOR_OPTIONS,
  FURNITURE_SWATCHES,
  ROOMS,
  WALL_SWATCHES,
  roomByKey,
  type LightingKey,
} from "@/lib/rooms";
import { buildQuote, calcFabric, formatMnt, type PricingSettings } from "@/lib/quote";
import type { DbColor, DbMaterial } from "@/lib/db";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { DraperyArt } from "@/components/art/DraperyArt";
import { CAMERA_VIEWS, type CameraView } from "./StudioCanvas";
import type { SceneConfig } from "./RoomScene";

const StudioCanvas = dynamic(() => import("./StudioCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#EDE7DD]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-charcoal/20 border-t-charcoal" />
        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-charcoal/50">
          3D орчин ачаалж байна
        </p>
      </div>
    </div>
  ),
});

type Props = {
  materials: DbMaterial[];
  colors: DbColor[];
  settings: PricingSettings;
  initial: {
    material?: string;
    code?: string;
    style?: string;
    room?: string;
    w?: string;
    h?: string;
    windows?: string;
    panels?: string;
    fullness?: string;
  };
};

type Tab = "design" | "size" | "quote";

export default function StudioShell({ materials, colors, settings, initial }: Props) {
  const [tab, setTab] = useState<Tab>("design");
  const [roomKey, setRoomKey] = useState(initial.room && roomByKey(initial.room) ? initial.room : ROOMS[0].key);
  const room = roomByKey(roomKey);

  const [materialSlug, setMaterialSlug] = useState(initial.material ?? materials[0]?.slug ?? "new-drappe");
  const material = materials.find((m) => m.slug === materialSlug) ?? materials[0];
  const materialColors = useMemo(
    () => colors.filter((c) => c.material_slug === materialSlug),
    [colors, materialSlug],
  );

  const [colorCode, setColorCode] = useState<string | null>(initial.code ?? null);
  const selectedColor = useMemo(() => {
    const exact = materialColors.find((c) => c.code === colorCode);
    return exact ?? materialColors.find((c) => c.hex) ?? materialColors[0] ?? null;
  }, [materialColors, colorCode]);

  const [styleKey, setStyleKey] = useState(
    initial.style && CURTAIN_STYLES.some((s) => s.key === initial.style) ? initial.style : "wave",
  );
  const [fullness, setFullness] = useState(Number(initial.fullness) || 2);
  const [panels, setPanels] = useState(Number(initial.panels) || 2);
  const [lengthMode, setLengthMode] = useState<"floor" | "sill" | "ceiling">("floor");
  const [widthCm, setWidthCm] = useState(Number(initial.w) || 240);
  const [heightCm, setHeightCm] = useState(Number(initial.h) || 220);
  const [ceilingCm, setCeilingCm] = useState(270);
  const [windows, setWindows] = useState(Number(initial.windows) || 1);

  const [lighting, setLighting] = useState<LightingKey>("day");
  const [viewKey, setViewKey] = useState<keyof typeof CAMERA_VIEWS>("front");

  const [wallColor, setWallColor] = useState(room.wall);
  const [floorType, setFloorType] = useState(room.floorType);
  const [floorColor, setFloorColor] = useState(room.floor);
  const [furnitureColor, setFurnitureColor] = useState(room.furniture);

  const [colorQuery, setColorQuery] = useState("");
  const [webgl, setWebgl] = useState<"unknown" | "ok" | "unsupported">("unknown");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [shareId, setShareId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const captureRef = useRef<(() => string) | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setWebgl(ok ? "ok" : "unsupported");
    } catch {
      setWebgl("unsupported");
    }
  }, []);

  useEffect(() => {
    setWallColor(room.wall);
    setFloorType(room.floorType);
    setFloorColor(room.floor);
    setFurnitureColor(room.furniture);
    setCeilingCm(Math.round(room.ceilingHeight * 100));
  }, [room]);

  const sceneColor = selectedColor?.hex ?? "#CDBBA2";

  const measurement = useMemo(
    () =>
      calcFabric(
        { widthCm, heightCm, ceilingCm, windows, panels, fullness },
        material?.fabric_width ?? 280,
        {
          styleKey,
          withPatternRepeat: material ? ["jacquard", "velvet"].includes(material.fabric) : false,
          settings,
        },
      ),
    [widthCm, heightCm, ceilingCm, windows, panels, fullness, material, styleKey, settings],
  );

  const quote = useMemo(
    () =>
      buildQuote({
        meters: measurement.totalMeters,
        windowWidthCm: widthCm,
        windows,
        panels,
        styleKey,
        pricePerMeter: material?.price_per_meter ?? null,
        settings,
      }),
    [measurement.totalMeters, widthCm, windows, panels, styleKey, material, settings],
  );

  const sceneConfig: SceneConfig = useMemo(
    () => ({
      room,
      wallColor,
      floorColor,
      floorType,
      furnitureColor,
      ceilingHeight: Math.min(3.6, Math.max(2.4, ceilingCm / 100)),
      windowW: Math.min(3.6, Math.max(1.4, widthCm / 100)),
      windowH: Math.min(2.4, Math.max(1.1, heightCm / 100)),
      sillHeight: Math.min(1.0, Math.max(0.45, 1.55 - heightCm / 200)),
      styleKey,
      fabric: material?.fabric ?? "drape",
      color: sceneColor,
      sheerColor: "#F4EEE3",
      fullness,
      lengthMode,
      panels,
      lighting,
      showSheer: styleByKey(styleKey).key === "double",
    }),
    [
      room,
      wallColor,
      floorColor,
      floorType,
      furnitureColor,
      ceilingCm,
      widthCm,
      heightCm,
      styleKey,
      material,
      sceneColor,
      fullness,
      lengthMode,
      panels,
      lighting,
    ],
  );

  const filteredColors = useMemo(() => {
    const q = colorQuery.trim().toLowerCase();
    if (!q) return materialColors;
    return materialColors.filter(
      (c) => c.code.toLowerCase().includes(q) || (c.name ?? "").toLowerCase().includes(q),
    );
  }, [materialColors, colorQuery]);

  async function saveDesign() {
    setSaveState("saving");
    setMessage(null);
    try {
      const preview = captureRef.current ? await shrink(captureRef.current(), 1400) : null;
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType: room.label,
          curtainStyle: styleByKey(styleKey).label,
          materialId: material?.id,
          materialName: material?.name,
          colorCode: selectedColor?.code,
          colorName: selectedColor?.name,
          measurements: {
            widthCm,
            heightCm,
            ceilingCm,
            windows,
            panels,
            fullness,
            totalMeters: measurement.totalMeters,
            style: styleKey,
            length: lengthMode,
          },
          estimatedPrice: quote.total,
          preview,
          lighting,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Хадгалж чадсангүй");
      setShareId(json.publicId);
      setSaveState("saved");
      setMessage("Дизайн хадгалагдлаа. Холбоосыг хуулж, гэр бүл, дизайнертайгаа хуваалцаарай.");
    } catch (err) {
      setSaveState("error");
      setMessage(err instanceof Error ? err.message : "Алдаа гарлаа.");
    }
  }

  function downloadPreview() {
    if (!captureRef.current) return;
    const link = document.createElement("a");
    link.href = captureRef.current();
    link.download = `lena-home-${roomKey}-${selectedColor?.code ?? "design"}.png`;
    link.click();
  }

  return (
    <div className="grid gap-px bg-charcoal/10 lg:grid-cols-[1fr_420px]">
      {/* ---------------- 3D талбар ---------------- */}
      <div className="relative bg-[#EDE7DD]">
        <div className="relative h-[52vh] min-h-[340px] w-full lg:h-[calc(100vh-74px)] lg:min-h-[620px]">
          {webgl === "unsupported" ? (
            <FallbackPreview
              color={sceneColor}
              fabric={material?.fabric}
              label={room.label}
              code={selectedColor?.code}
            />
          ) : (
            <StudioCanvas
              config={sceneConfig}
              view={CAMERA_VIEWS[viewKey] as CameraView}
              onReady={(capture) => {
                captureRef.current = capture;
              }}
              onContextError={() => setWebgl("unsupported")}
            />
          )}

          {/* дээд зурвас */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
            <div className="pointer-events-auto border border-white/40 bg-ivory/80 px-3 py-2 backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal/50">{room.label}</p>
              <p className="mt-0.5 text-[11px] text-charcoal">
                {material?.name} <span className="text-charcoal/35">/</span>{" "}
                {selectedColor?.code ?? "—"}{" "}
                <span className="text-charcoal/35">/</span> {styleByKey(styleKey).label}
              </p>
            </div>
            <div className="pointer-events-auto flex flex-wrap gap-1">
              {(Object.keys(CAMERA_VIEWS) as (keyof typeof CAMERA_VIEWS)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewKey(key)}
                  className={`border px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.12em] backdrop-blur-md transition-colors ${
                    viewKey === key
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-white/50 bg-ivory/75 text-charcoal/70 hover:bg-ivory"
                  }`}
                >
                  {key === "front" ? "Урд" : key === "angle" ? "Өнцөг" : key === "close" ? "Ойр" : "Өргөн"}
                </button>
              ))}
            </div>
          </div>

          {/* доод зурвас — гэрэлтүүлэг */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/45 to-transparent p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {LIGHTING_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setLighting(preset.key as LightingKey)}
                    className={`border px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.1em] backdrop-blur-md transition-colors ${
                      lighting === preset.key
                        ? "border-ivory bg-ivory text-charcoal"
                        : "border-white/45 bg-charcoal/25 text-ivory/85 hover:bg-charcoal/45"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={downloadPreview}
                  className="border border-white/45 bg-charcoal/30 px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.1em] text-ivory backdrop-blur-md hover:bg-charcoal/55"
                >
                  Татах
                </button>
                <button
                  type="button"
                  onClick={saveDesign}
                  disabled={saveState === "saving"}
                  className="border border-ivory bg-ivory px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.1em] text-charcoal hover:bg-champagne"
                >
                  {saveState === "saving" ? "Хадгалж…" : saveState === "saved" ? "Хадгалсан ✓" : "Хадгалах"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-[9.5px] text-ivory/60">
              Хуруугаар чирж эргүүлэх · хоёр хуруугаар томруулах · хөшиг дээр дарж ойртох
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Удирдлагын самбар ---------------- */}
      <aside className="flex max-h-none flex-col bg-ivory lg:max-h-[calc(100vh-74px)]">
        <div className="flex shrink-0 border-b border-charcoal/12">
          {(
            [
              ["design", "Дизайн"],
              ["size", "Хэмжээ"],
              ["quote", "Үнэ"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 border-b-2 py-3 text-[10.5px] uppercase tracking-[0.16em] transition-colors ${
                tab === key
                  ? "border-charcoal text-charcoal"
                  : "border-transparent text-charcoal/45 hover:text-charcoal/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {tab === "design" && (
            <div className="space-y-6">
              <Panel title="Өрөө">
                <div className="grid grid-cols-2 gap-1.5">
                  {ROOMS.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRoomKey(r.key)}
                      className={`flex items-center gap-2 border p-2 text-left transition-colors ${
                        roomKey === r.key
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/12 hover:border-charcoal/35"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 overflow-hidden border border-current/20">
                        <span className="h-full w-1/2" style={{ background: r.wall }} />
                        <span className="h-full w-1/2" style={{ background: r.floor }} />
                      </span>
                      <span className="text-[10.5px] leading-tight">{r.label}</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Хөшигний загвар" action={<span className="text-[10px] text-charcoal/40">9 загвар</span>}>
                <div className="flex flex-wrap gap-1.5">
                  {CURTAIN_STYLES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setStyleKey(s.key);
                        setFullness(s.defaultFullness);
                      }}
                      className={`border px-2.5 py-1.5 text-[11px] transition-colors ${
                        styleKey === s.key
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] leading-relaxed text-charcoal/50">
                  {styleByKey(styleKey).desc}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-1">
                  {CURTAIN_STYLES.slice(0, 8).map((s) => (
                    <div key={s.key} className="border border-charcoal/10">
                      <div className="h-12 overflow-hidden">
                        <DraperyArt color={sceneColor} folds={Math.max(3, Math.round(s.pleatFrequency))} sheen={0.4} className="h-full w-full" />
                      </div>
                      <p className="truncate px-1 py-1 text-[8px] text-charcoal/55">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Материал">
                <div className="grid grid-cols-2 gap-1.5">
                  {materials.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => {
                        setMaterialSlug(m.slug);
                        setColorCode(null);
                      }}
                      className={`border p-2 text-left transition-colors ${
                        materialSlug === m.slug
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/12 hover:border-charcoal/35"
                      }`}
                    >
                      <p className="text-[10.5px] tracking-[0.06em]">{m.name}</p>
                      <p className={`mt-0.5 text-[9.5px] ${materialSlug === m.slug ? "text-ivory/60" : "text-charcoal/45"}`}>
                        {m.price_per_meter ? `${formatMnt(m.price_per_meter)}/м` : "Үнэ тохируулаагүй"}
                      </p>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel
                title="Даавууны өнгө"
                action={<span className="text-[10px] text-charcoal/40">{materialColors.length} код</span>}
              >
                <input
                  className="field mb-2 py-1.5 text-[12px]"
                  placeholder="Кодоор хайх…"
                  value={colorQuery}
                  onChange={(e) => setColorQuery(e.target.value)}
                />
                <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto pr-1">
                  {filteredColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorCode(c.code)}
                      title={`${c.code}${c.name ? " — " + c.name : ""}`}
                      className={`relative aspect-square border transition-transform hover:scale-105 ${
                        selectedColor?.id === c.id ? "border-charcoal ring-1 ring-charcoal" : "border-charcoal/12"
                      }`}
                      style={{ backgroundColor: c.hex ?? "#E6DDCE" }}
                    >
                      {c.swatch_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.swatch_image} alt={c.code} className="h-full w-full object-cover" />
                      )}
                      {!c.hex && !c.swatch_image && (
                        <span className="absolute inset-0 flex items-center justify-center text-[6.5px] leading-none text-charcoal/45">
                          код
                        </span>
                      )}
                    </button>
                  ))}
                  {filteredColors.length === 0 && (
                    <p className="col-span-6 py-4 text-center text-[11px] text-charcoal/45">
                      Код олдсонгүй
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10.5px] text-charcoal/50">
                  <span>
                    Сонгосон: <b className="text-charcoal">{selectedColor?.code ?? "—"}</b>{" "}
                    {selectedColor?.name ? `· ${selectedColor.name}` : ""}
                  </span>
                  {selectedColor && !selectedColor.hex && (
                    <span className="text-[#9B3B2E]">Swatch шаардлагатай</span>
                  )}
                </div>
                {selectedColor && !selectedColor.hex && !selectedColor.swatch_image && (
                  <p className="mt-2 border-l-2 border-champagne bg-porcelain px-2 py-1.5 text-[10px] leading-relaxed text-charcoal/55">
                    Энэ кодын бодит өнгө бүртгэгдээгүй тул 3D дээр нейтрал тон харуулж байна.
                    Шоурумд дээж үзэхийг зөвлөж байна.
                  </p>
                )}
              </Panel>

              <Panel title="Дүүргэлт">
                <div className="grid grid-cols-4 gap-1.5">
                  {FULLNESS_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFullness(f.value)}
                      className={`border px-1 py-2 text-[10px] ${
                        fullness === f.value
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/15 text-charcoal/70"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Өрөөний тохируулга">
                <p className="label">Хананы өнгө</p>
                <div className="flex flex-wrap gap-1.5">
                  {WALL_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setWallColor(c)}
                      className={`h-7 w-7 border ${wallColor === c ? "border-charcoal ring-1 ring-charcoal" : "border-charcoal/15"}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Хана ${c}`}
                    />
                  ))}
                </div>
                <p className="label mt-4">Шал</p>
                <div className="flex gap-1.5">
                  {FLOOR_OPTIONS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFloorType(f.key)}
                      className={`flex-1 border px-2 py-1.5 text-[10.5px] ${
                        floorType === f.key
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/15 text-charcoal/70"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <p className="label mt-4">Тавилгын өнгө</p>
                <div className="flex flex-wrap gap-1.5">
                  {FURNITURE_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFurnitureColor(c)}
                      className={`h-7 w-7 border ${furnitureColor === c ? "border-charcoal ring-1 ring-charcoal" : "border-charcoal/15"}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Тавилга ${c}`}
                    />
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {tab === "size" && (
            <div className="space-y-5">
              <Panel title="Цонхны хэмжээ">
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="Өргөн (см)" value={widthCm} onChange={setWidthCm} min={60} max={600} />
                  <NumberField label="Өндөр (см)" value={heightCm} onChange={setHeightCm} min={60} max={350} />
                  <NumberField label="Тааз (см)" value={ceilingCm} onChange={setCeilingCm} min={200} max={400} />
                  <NumberField label="Цонхны тоо" value={windows} onChange={setWindows} min={1} max={10} />
                  <div>
                    <label className="label">Хөшигний тоо</label>
                    <select className="field" value={panels} onChange={(e) => setPanels(Number(e.target.value))}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Урт</label>
                    <select
                      className="field"
                      value={lengthMode}
                      onChange={(e) => setLengthMode(e.target.value as typeof lengthMode)}
                    >
                      <option value="floor">Шал хүртэл</option>
                      <option value="sill">Цонхны доод ирмэг</option>
                      <option value="ceiling">Тааз хүртэл</option>
                    </select>
                  </div>
                </div>
              </Panel>

              <Panel title="Даавууны зарцуулалт">
                <div className="divide-y divide-charcoal/10 text-[12px]">
                  <Row k="Нэг хөшигний өргөн" v={`${Math.round(measurement.panelWidthCm)} см`} />
                  <Row k="Огтлох урт" v={`${Math.round(measurement.cutLengthCm)} см`} />
                  <Row k="Даавууны хэсэг" v={`${measurement.widthsPerPanel} ширхэг / хөшиг`} />
                  <Row k="Нийт даавуу" v={`${measurement.totalMeters} м`} strong />
                  <Row k="Даавууны өргөн" v={`${material?.fabric_width ?? 280} см`} />
                </div>
                {measurement.warnings.length > 0 && (
                  <ul className="mt-3 space-y-1 border-l-2 border-champagne bg-porcelain px-3 py-2">
                    {measurement.warnings.map((w) => (
                      <li key={w} className="text-[10.5px] leading-relaxed text-charcoal/60">
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-[10px] leading-relaxed text-charcoal/40">
                  Урьдчилсан тооцоо. Эцсийн хэмжээг мэргэжлийн хэмжилтийн баг батална.
                </p>
              </Panel>
            </div>
          )}

          {tab === "quote" && (
            <div className="space-y-5">
              <Panel title="Үнийн задаргаа">
                <div className="divide-y divide-charcoal/10">
                  {quote.lines.map((l) => (
                    <div key={l.key} className="flex items-baseline justify-between gap-3 py-2">
                      <div>
                        <p className="text-[12px]">{l.label}</p>
                        <p className="text-[9.5px] text-charcoal/45">{l.detail}</p>
                      </div>
                      <p className="whitespace-nowrap text-[11.5px] tabular-nums">{formatMnt(l.amount)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-charcoal/25 pt-3">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-taupe">Нийт</span>
                  <span className="font-display text-[22px] tabular-nums">{formatMnt(quote.total)}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {quote.notes.map((n) => (
                    <li key={n} className="text-[10px] leading-relaxed text-charcoal/45">• {n}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Дизайнаа хадгалах">
                <button
                  type="button"
                  onClick={saveDesign}
                  disabled={saveState === "saving"}
                  className="btn btn-primary w-full"
                >
                  {saveState === "saving" ? "Хадгалж байна…" : "Дизайн хадгалах"}
                </button>
                <button type="button" onClick={downloadPreview} className="btn btn-outline mt-2 w-full">
                  3D зургийг татах
                </button>
                {shareId && (
                  <div className="mt-3 border border-charcoal/15 bg-porcelain p-3">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-taupe">Хуваалцах холбоос</p>
                    <p className="mt-1 break-all text-[11px] text-charcoal/70">
                      {typeof window !== "undefined" ? window.location.origin : ""}/design/{shareId}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Link href={`/design/${shareId}`} className="btn btn-outline flex-1 py-2">
                        Нээх
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(`${window.location.origin}/design/${shareId}`);
                          setMessage("Холбоос хуулагдлаа.");
                        }}
                        className="btn btn-primary flex-1 py-2"
                      >
                        Хуулах
                      </button>
                    </div>
                  </div>
                )}
                {message && <p className="mt-3 text-[10.5px] leading-relaxed text-charcoal/60">{message}</p>}
              </Panel>

              <Panel title="BRING YOUR DESIGN TO LIFE">
                <p className="font-display text-[18px] leading-snug">
                  Таны орон зай. Таны хэмжээс.
                  <br />
                  Танд зориулсан хөшиг.
                </p>
                <div className="mt-3">
                  <ConsultationForm
                    compact
                    designPublicId={shareId ?? undefined}
                    contextLabel={`${material?.name ?? ""} · ${selectedColor?.code ?? ""} · ${styleByKey(styleKey).label} · ${measurement.totalMeters} м`}
                  />
                </div>
              </Panel>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="field"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className="text-charcoal/50">{k}</span>
      <span className={strong ? "font-medium text-charcoal" : "text-charcoal/80"}>{v}</span>
    </div>
  );
}

function FallbackPreview({
  color,
  fabric,
  label,
  code,
}: {
  color: string;
  fabric?: string;
  label: string;
  code?: string;
}) {
  return (
    <div className="relative h-full w-full bg-[#EDE7DD]">
      <div className="absolute inset-0 grid grid-cols-[1fr_2fr_1fr]">
        <DraperyArt color={color} folds={5} sheen={0.5} />
        <div className="relative bg-gradient-to-b from-[#FBF5E9] to-[#E7DCC8]">
          <div className="absolute inset-8 border border-[#DED2BC]">
            <div className="absolute left-1/2 top-0 h-full w-px bg-[#E5DAC4]" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-[#E5DAC4]" />
          </div>
        </div>
        <DraperyArt color={color} folds={5} sheen={0.5} />
      </div>
      <div className="absolute inset-x-4 bottom-4 border border-charcoal/15 bg-ivory/90 p-3 backdrop-blur">
        <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">3D дэмжигдэхгүй төхөөрөмж</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal/65">
          Таны төхөөрөмж WebGL дэмжихгүй байна. {label} · {fabric ?? "drape"} · {code ?? "—"} —
          статик урьдчилсан харагдац харуулж байна. Хэмжээ, үнэ, зөвлөгөө бүрэн ажиллана.
        </p>
      </div>
    </div>
  );
}

async function shrink(dataUrl: string, maxWidth: number): Promise<string> {
  try {
    const img = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("preview"));
      img.src = dataUrl;
    });
    if (img.width <= maxWidth) return dataUrl;
    const ratio = maxWidth / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = Math.round(img.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return dataUrl;
  }
}
