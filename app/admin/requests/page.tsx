import RequestTable, { type RequestRow } from "@/components/admin/RequestTable";
import { listRequests } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminRequestsPage() {
  const requests = listRequests() as unknown as RequestRow[];
  return (
    <div>
      <header className="mb-6">
        <p className="eyebrow">Хэрэглэгчийн хүсэлт</p>
        <h1 className="mt-2 font-display text-[26px]">Зөвлөгөө ба хэмжилтийн хүсэлт</h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-charcoal/55">
          Хүсэлт бүрийн төлөвийг өөрчилж, дотоод тэмдэглэл хөтөлнө. Хэрэглэгчийн
          мэдээллийг зөвхөн эрх бүхий ажилтан харна.
        </p>
      </header>
      <RequestTable requests={requests} />
    </div>
  );
}
