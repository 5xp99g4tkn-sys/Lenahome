import PricingForm from "@/components/admin/PricingForm";
import { getPricingSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminPricingPage() {
  const settings = getPricingSettings();
  return (
    <div>
      <header className="mb-6">
        <p className="eyebrow">Бизнес тохиргоо</p>
        <h1 className="mt-2 font-display text-[26px]">Үнэ ба тооцооллын тариф</h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-charcoal/55">
          Оёдол, дагалдах хэрэгсэл, зам, угсралт, хүргэлтийн тарифыг эндээс өөрчилнө.
          Өөрчлөлт нь сайтын бүх тооцоолуур болон 3D студийн үнийн саналд шууд нөлөөлнө.
        </p>
      </header>
      <PricingForm settings={settings} />
    </div>
  );
}
