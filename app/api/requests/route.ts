import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Хүсэлтийн өгөгдөл буруу байна." }, { status: 400 });
  }

  const name = String(body.customerName ?? "").trim();
  const phone = String(body.phoneNumber ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Нэрээ бүтэн бичнэ үү." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { error: "Утасны дугаараа зөв оруулна уу. Жишээ: 99112233" },
      { status: 400 },
    );
  }

  const publicId = createRequest({
    customerName: name,
    phoneNumber: phone,
    address: body.address ? String(body.address).slice(0, 300) : null,
    preferredDate: body.preferredDate ? String(body.preferredDate).slice(0, 40) : null,
    details: body.details ? String(body.details).slice(0, 2000) : null,
    designPublicId: body.designPublicId ? String(body.designPublicId) : null,
    type: body.type === "quotation" ? "quotation" : "consultation",
  });

  return NextResponse.json({ ok: true, publicId });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  return NextResponse.json({ requests: listRequests() });
}
