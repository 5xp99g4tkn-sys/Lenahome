"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMnt, type PricingSettings } from "@/lib/quote";

const FIELDS: { key: keyof PricingSettings; label: string; hint: string; unit: string }[] = [
  { key: "sewingPerMeter", label: "Оёдлын ажил", hint: "Нэг метр даавуунд ногдох оёдлын зардал", unit: "₮ / м" },
  { key: "accessoriesPerMeter", label: "Дагалдах хэрэгсэл", hint: "Тууз, дэгээ, бөгж, холбогч", unit: "₮ / м" },
  { key: "trackPerMeter", label: "Хөшигний зам", hint: "Нэг метр замын үнэ (бэхэлгээ тусад нь)", unit: "₮ / м" },
  { key: "bracketPerWindow", label: "Замны бэхэлгээ", hint: "Нэг цонхны бэхэлгээ", unit: "₮ / цонх" },
  { key: "installationPerWindow", label: "Угсралт", hint: "Нэг цонхны угсралт, тааруулга", unit: "₮ / цонх" },
  { key: "deliveryFee", label: "Хүргэлт", hint: "Улаанбаатар хот дотор", unit: "₮ / удаа" },
  { key: "hemAllowanceCm", label: "Захын зай", hint: "Дээд болон доод захыг нугалахад нэмэгдэх урт", unit: "см" },
  { key: "sideHemCm", label: "Хажуугийн зай", hint: "Хөшиг бүрийн хажуу зах", unit: "см" },
  { key: "patternRepeatCm", label: "Хээний давталт", hint: "Жаккард, кадифед нэмэгдэх нөөц", unit: "см" },
];

export default function PricingForm({ settings }: { settings: PricingSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<PricingSettings>(settings);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setState("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Хадгалж чадсангүй");
      setState("ok");
      setMessage("Тохиргоо хадгалагдлаа. Бүх тооцоолуур шинэ үнээр ажиллана.");
      router.refresh();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Алдаа гарлаа");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="border border-charcoal/12 bg-ivory p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Үнийн тохиргоо</p>
          <span className="text-[10px] text-charcoal/40">Бүх утга ₮ эсвэл см</span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="label">
                {f.label} <span className="text-charcoal/35">({f.unit})</span>
              </label>
              <input
                id={f.key}
                type="number"
                min={0}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: Number(e.target.value) })}
                className="field"
              />
              <p className="mt-1 text-[9.5px] text-charcoal/40">{f.hint}</p>
            </div>
          ))}
        </div>

        <button type="button" onClick={save} disabled={state === "saving"} className="btn btn-primary mt-6">
          {state === "saving" ? "Хадгалж байна…" : "Тохиргоо хадгалах"}
        </button>

        {message && (
          <p
            className={`mt-4 border px-3 py-2 text-[11px] ${
              state === "error"
                ? "border-[#9B3B2E]/30 bg-[#9B3B2E]/5 text-[#9B3B2E]"
                : "border-charcoal/15 bg-white text-charcoal/70"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="border border-charcoal/12 bg-porcelain p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Одоогийн тариф</p>
          <ul className="mt-3 space-y-1.5 text-[11.5px]">
            {FIELDS.slice(0, 6).map((f) => (
              <li key={f.key} className="flex justify-between gap-3 border-b border-charcoal/8 pb-1">
                <span className="text-charcoal/55">{f.label}</span>
                <span>{formatMnt(values[f.key] as number)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-charcoal/12 bg-ivory p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">Тооцооны томьёо</p>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-charcoal/60">
            <p>Нийт хөшигний өргөн = цонхны өргөн × дүүргэлт × цонхны тоо</p>
            <p>Нэг хөшигний өргөн = нийт өргөн ÷ хөшигний тоо + хажуугийн зай</p>
            <p>Даавууны хэсэг = ⌈нэг хөшигний өргөн ÷ даавууны өргөн⌉</p>
            <p>Огтлох урт = өндөр + захын зай (+ хээний давталт)</p>
            <p>Даавуу (м) = хэсэг × огтлох урт × хөшигний тоо × цонхны тоо ÷ 100</p>
            <p className="pt-1 text-charcoal/45">
              Даавууны өртөг = даавуу (м) × нэг метрийн үнэ. Бусад мөрүүд тусад нь
              нэмэгдэнэ.
            </p>
          </div>
        </div>

        <div className="border-l-2 border-champagne bg-porcelain px-4 py-3 text-[10.5px] leading-relaxed text-charcoal/55">
          Энэ тооцоо нь урьдчилсан. Эцсийн хэмжээ, үнийг мэргэжлийн хэмжилт батална.
        </div>
      </div>
    </div>
  );
}
