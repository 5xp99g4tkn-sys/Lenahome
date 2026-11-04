"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Нэвтрэх боломжгүй");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-display text-[24px] tracking-[0.22em] text-ivory">LENA</span>
            <span className="font-display text-[24px] tracking-[0.32em] text-champagne">HOME</span>
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ivory/40">
            Удирдлагын систем
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 border border-ivory/15 bg-ivory p-7">
          <h1 className="font-display text-[22px]">Нэвтрэх</h1>
          <p className="mt-1 text-[11.5px] text-charcoal/50">
            Зөвхөн эрх бүхий ажилтан нэвтэрнэ.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="label">Нэвтрэх нэр</label>
              <input id="username" name="username" className="field" autoComplete="username" required />
            </div>
            <div>
              <label htmlFor="password" className="label">Нууц үг</label>
              <input
                id="password"
                name="password"
                type="password"
                className="field"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 border border-[#9B3B2E]/30 bg-[#9B3B2E]/5 px-3 py-2 text-[11px] text-[#9B3B2E]">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary mt-5 w-full">
            {loading ? "Шалгаж байна…" : "Нэвтрэх"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-ivory/30">
          Эхний нэвтрэлтийн мэдээллийг суулгацын үед үүсгэсэн. Нууц үгээ заавал солино уу.
        </p>
      </div>
    </div>
  );
}
