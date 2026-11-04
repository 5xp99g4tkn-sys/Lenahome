"use client";

import { useState } from "react";

type Props = {
  designPublicId?: string;
  contextLabel?: string;
  compact?: boolean;
};

export default function ConsultationForm({ designPublicId, contextLabel, compact }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("customer_name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const next: Record<string, string> = {};
    if (name.length < 2) next.customer_name = "Нэрээ бүтэн бичнэ үү.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) next.phone = "Утасны дугаараа зөв оруулна уу. Жишээ: 99112233";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phoneNumber: phone,
          address: String(data.get("address") ?? ""),
          preferredDate: String(data.get("preferred_date") ?? ""),
          details: String(data.get("details") ?? ""),
          designPublicId: designPublicId ?? null,
          type: "consultation",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Хүсэлт илгээгдсэнгүй.");
      setReference(json.publicId as string);
      setState("ok");
      form.reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Алдаа гарлаа.");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="border border-charcoal/15 bg-white/80 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20">
          <span className="text-[16px]">✓</span>
        </div>
        <h3 className="mt-5 font-display text-[24px]">Хүсэлт хүлээн авлаа</h3>
        <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-charcoal/60">
          Манай зөвлөх ажлын цагийн дотор тан руу залгаж, хэмжилтийн цагийг тохиролцоно.
        </p>
        {reference && (
          <p className="mt-4 inline-block border border-charcoal/15 px-3 py-1.5 text-[11px] tracking-[0.1em] text-charcoal/70">
            Хүсэлтийн дугаар: {reference}
          </p>
        )}
        <div className="mt-6">
          <a href="tel:+97677477788" className="btn btn-primary">
            Яаралтай бол 7747 7788
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`border border-charcoal/12 bg-white/70 ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <p className="eyebrow">Зөвлөгөөний хүсэлт</p>
      <h3 className="mt-2 font-display text-[24px] leading-tight sm:text-[28px]">
        Мэргэжлийн хэмжилт хүсэх
      </h3>
      {contextLabel && (
        <p className="mt-2 border-l-2 border-champagne pl-3 text-[11.5px] text-charcoal/60">
          {contextLabel}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="customer_name" className="label">Нэр *</label>
          <input id="customer_name" name="customer_name" className="field" autoComplete="name" />
          {errors.customer_name && <p className="mt-1 text-[10.5px] text-[#9B3B2E]">{errors.customer_name}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">Утас *</label>
          <input id="phone" name="phone" className="field" inputMode="tel" autoComplete="tel" placeholder="99112233" />
          {errors.phone && <p className="mt-1 text-[10.5px] text-[#9B3B2E]">{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className="label">Хаяг / байршил</label>
          <input id="address" name="address" className="field" placeholder="Дүүрэг, хороо, байр" />
        </div>
        <div>
          <label htmlFor="preferred_date" className="label">Хүссэн огноо</label>
          <input id="preferred_date" name="preferred_date" type="date" className="field" />
        </div>
        <div>
          <label htmlFor="details" className="label">Нэмэлт мэдээлэл</label>
          <input id="details" name="details" className="field" placeholder="Өрөөний төрөл, хүсэлт" />
        </div>
      </div>

      {serverError && (
        <p className="mt-4 border border-[#9B3B2E]/30 bg-[#9B3B2E]/5 px-3 py-2 text-[11px] text-[#9B3B2E]">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn btn-primary mt-5 w-full">
        {state === "loading" ? "Илгээж байна…" : "Хүсэлт илгээх"}
      </button>
      <p className="mt-3 text-[10px] leading-relaxed text-charcoal/40">
        Таны мэдээллийг зөвхөн зөвлөгөө, хэмжилт зориулалтаар ашиглана. Гуравдагч
        талд дамжуулахгүй.
      </p>
    </form>
  );
}
