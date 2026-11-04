import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lenahome.mn"),
  title: {
    default: "LENA HOME — Захиалгат хөшиг, интерьерийн дизайн студи",
    template: "%s | LENA HOME",
  },
  description:
    "LENA HOME — Улаанбаатар хотын захиалгат хөшиг үйлдвэрлэл. Мэргэжлийн хэмжилт, даавууны зөвлөгөө, 3D хөшигний студи, интерьерийн өнгөний шийдэл.",
  keywords: [
    "хөшиг",
    "захиалгат хөшиг",
    "Улаанбаатар хөшиг",
    "3D хөшигний студи",
    "даавуу",
    "Lena Home",
  ],
  openGraph: {
    title: "LENA HOME — Захиалгат хөшиг, интерьерийн дизайн студи",
    description:
      "Таны орон зай. Таны хэмжээс. Танд зориулсан хөшиг. 3D хөшигний студиээр өрөөндөө тохирох хөшгийг туршиж үзээрэй.",
    locale: "mn_MN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
