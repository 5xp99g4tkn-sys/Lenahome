/**
 * LENA HOME — үйлдвэрлэгчийн даавууны каталог.
 *
 * ЧУХАЛ: Кодыг үйлдвэрлэгчийн жагсаалтаас шууд, өөрчлөлтгүйгээр оруулсан.
 * Өнгөний нэрийг ЗӨВХӨН кодын дотор бичигдсэн өнгөний үгнээс (жишээ нь
 * "VR-10346-SIYAH" -> SIYAH = хар) гаргасан. Эдгээр нь "кодоос гаргасан
 * ойролцоо" гэж тэмдэглэгдэнэ. Албан ёсны HEX утга эсвэл зураг байхгүй
 * кодуудад өнгө зохиохгүй — "Swatch шаардлагатай" гэж харуулна.
 *
 * `source`:
 *   "code"      — өнгөний нэр кодын дотор байгаа (ойролцоо тон)
 *   "none"      — баталгаажсан мэдээлэл алга (swatch зураг шаардлагатай)
 */

export type StyleCategory = "modern" | "classic" | "minimal" | "scandi" | "luxury" | "warm";

export type ColorSeed = {
  code: string;
  name?: string;
  hex?: string;
  family?: string;
  source: "code" | "none";
};

export type MaterialSeed = {
  slug: string;
  name: string;
  nameEn: string;
  pricePerMeter: number | null;
  fabricWidth: number;
  description: string;
  /** Даавууны бүтэц — 3D материал ба сүлжмэлийн харагдацыг тодорхойлно */
  fabric: "drape" | "velvet" | "blackout" | "sheer" | "linen" | "jacquard" | "blind";
  weight: string;
  opacity: number;
  sheen: number;
  availability: "available" | "order" | "unconfigured";
  colors: ColorSeed[];
};

const c = (code: string): ColorSeed => ({ code, source: "none" });

/** Код дотор өнгөний нэр байгаа тохиолдолд */
const n = (code: string, name: string, hex: string, family: string): ColorSeed => ({
  code,
  name,
  hex,
  family,
  source: "code",
});

/* ------------------------------------------------------------------ */
/* A. NEW DRAPPE                                                        */
/* ------------------------------------------------------------------ */
const newDrappe: ColorSeed[] = [
  "10200", "14959", "14964", "14993", "15019", "14990", "14988", "15021",
  "14998", "15001", "15006", "14985", "14960", "14997", "14984", "14962",
  "14955", "14981", "15017", "14968", "14958", "14978", "14977", "14952",
  "14963", "15008", "15011", "14974", "15002", "14957", "14965", "14969",
  "15015",
].map(c);

/* ------------------------------------------------------------------ */
/* B. DOKUFON 16 — кодыг үсгийн дүрсээр яг хэвээр нь хадгалсан          */
/* ------------------------------------------------------------------ */
const dokufon16: ColorSeed[] = [
  "SO1", "S54", "S51", "S35", "S22", "S23", "S12", "S39", "S56", "S09",
  "O1", "O2", "O7", "O3", "O8", "O5", "O6",
].map(c);

/* ------------------------------------------------------------------ */
/* C. DOKUFON 20                                                        */
/* ------------------------------------------------------------------ */
const dokufon20: ColorSeed[] = [
  "C02", "C06", "C13", "C01", "E12", "E17", "C17", "C12", "E06", "E09",
  "E08", "E20",
].map(c);

/* ------------------------------------------------------------------ */
/* D. GAGLA / JAKAK FONLUK                                              */
/* ------------------------------------------------------------------ */
const gagla: ColorSeed[] = ["O2", "13", "O7", "10", "O9"].map(c);

/* ------------------------------------------------------------------ */
/* E. VENEZIA                                                           */
/* ------------------------------------------------------------------ */
const venezia: ColorSeed[] = [
  "P2027", "P2030", "P2029", "P2028", "P2031", "P2034", "P2032", "P2033",
  "P2035", "P2036", "P2037", "P2168", "P2169", "P2172", "P2173", "P2174",
  "P2175", "P2176", "P2194", "P2196", "P2201", "P2170", "P2171", "P2183",
  "P2188", "P2184", "P2186", "P2187", "P2185", "P2189", "P2203", "P2202",
  "P2204", "P2205", "P2206", "P2200", "P2198", "P2197", "P2199", "P2177",
  "P2178", "P2179", "P2180",
].map(c);

/* ------------------------------------------------------------------ */
/* F. RZB TORGON — SERENITY HOME                                        */
/* ------------------------------------------------------------------ */
const rzb: ColorSeed[] = [
  "SERENITY HOME 01", "02", "03", "04", "06", "07", "09", "10", "11", "12",
  "13", "14", "16", "17", "18", "19", "20", "21", "23", "24", "27", "29",
  "30", "31", "32", "33", "34", "36", "37", "38", "39", "40", "41", "42",
  "43", "44", "46", "47", "48",
].map(c);

/* ------------------------------------------------------------------ */
/* G. BLACKOUT — код дотор турк өнгөний нэр байгаа                      */
/* ------------------------------------------------------------------ */
const blackout: ColorSeed[] = [
  n("VR-4368-KREM", "Крем", "#EDE3D1", "cream"),
  n("10326-BLEJ", "Беж", "#D8C6AA", "beige"),
  n("VR10327-ACIK", "Цайвар", "#E9E2D6", "cream"),
  n("VR-10328-KREM", "Крем", "#EDE3D1", "cream"),
  n("VR-10329-TAŞ", "Чулуун", "#B7AFA3", "stone"),
  n("VR-10331-AÇIK", "Цайвар", "#EAE4D9", "cream"),
  n("VR-10332-AQUA", "Аква", "#7FB6B2", "aqua"),
  n("VR-10334-AÇIK GRI", "Цайвар саарал", "#C3BFB7", "greige"),
  n("VR-10335-AÇIK GÜL KURUSU", "Цайвар хатаасан сарнай", "#D3B0A6", "blush"),
  n("VR-10336-GÜL KURUSU", "Хатаасан сарнай", "#B9897E", "blush"),
  n("VR-10337-AÇIK MÜRDÜM", "Цайвар хар нил", "#A47C90", "plum"),
  n("VR-10338-KIREMIT", "Тоосго", "#A85B41", "terracotta"),
  n("VR-10339-BORDO", "Бургунди", "#6E1F2B", "burgundy"),
  n("VR-10340-MÜRDÜM", "Хар нил", "#5B2A44", "plum"),
  n("VR-1041-HARDAL", "Горчиц", "#B48A2C", "mustard"),
  n("VR-1042-CAMEL", "Тэмээн өнгө", "#BE9668", "camel"),
  n("VR-1043-KOYU TOPRAK", "Бараан шороон", "#6B5240", "brown"),
  n("VR-1044-KAHVE", "Кофе бор", "#55392B", "brown"),
  n("VR-18874-KOYU GRI", "Бараан саарал", "#55565A", "charcoal"),
  n("VR-10345-LACIVERT", "Хар хөх", "#1E2A45", "navy"),
  n("VR-10346-SIYAH", "Хар", "#1B1B1C", "black"),
];

/* ------------------------------------------------------------------ */
/* H. ABYLIFE                                                           */
/* ------------------------------------------------------------------ */
const abylife: ColorSeed[] = [
  "V-DB 426", "V-DE 2906", "V-DE 2907", "V-DK 10925", "V-DS 5937",
  "V-DS 5603", "V-DK 9782", "V-DK 9756", "V-DK 10395", "V-DK 10923",
  "V-DK 9832", "V-DK 10924", "V-DK 9759", "V-DM 6406", "V-DM 6407",
].map(c);

/* ------------------------------------------------------------------ */
/* I. PETEK KADIFE — кадифе (velvet)                                    */
/* ------------------------------------------------------------------ */
const petek: ColorSeed[] = [
  n("124889 KREM", "Крем", "#EDE3D3", "cream"),
  n("02 KREM", "Крем", "#EBE1D0", "cream"),
  n("03 A.BEJ", "Цайвар беж", "#DFCDB4", "beige"),
  n("12480 TAŞ", "Чулуун", "#B6AEA2", "stone"),
  n("12490 BEJ", "Беж", "#D6C1A5", "beige"),
  n("35 BEJ", "Беж", "#D8C4A8", "beige"),
  n("10 DEVE TÜYÜ", "Тэмээний ноос", "#B08D6A", "camel"),
  n("36 KAKAO", "Какао", "#5C4033", "brown"),
  n("28 KAHVE", "Кофе бор", "#55392B", "brown"),
  n("29 S.KAHVE", "Бараан кофе", "#3E2B22", "chocolate"),
  n("12483 KAHVE", "Кофе бор", "#573C2C", "brown"),
  n("12485 HARDAL", "Горчиц", "#B48A2C", "mustard"),
  n("13 A.HARDAL", "Цайвар горчиц", "#C9A85C", "mustard"),
  n("12478 SARI", "Шар", "#D6B23F", "mustard"),
  n("12 K.SARI", "Бараан шар", "#B08A22", "mustard"),
  n("16 ÇIMEN YEŞIL", "Шимний ногоон", "#5E7A48", "green"),
  n("17 K.YEŞIL", "Бараан ногоон", "#3E5232", "forest"),
  n("12487 K.PETROL", "Бараан петрол", "#16414B", "teal"),
  n("18 PETROL", "Петрол", "#1F5560", "teal"),
  n("12482 A.PETROL", "Цайвар петрол", "#4C7C84", "teal"),
  n("07 TURKUAZ", "Оюу", "#3FA3A6", "aqua"),
  n("09 MINT", "Менто", "#A9CBB5", "sage"),
  n("08 MAVI", "Цэнхэр", "#4A6FA5", "blue"),
  n("19 A.INDIGO", "Цайвар индиго", "#5A6E96", "blue"),
  n("31 PARLAMENT", "Парламент хөх", "#22375E", "navy"),
  n("32 K.LACIVERT", "Бараан хар хөх", "#172235", "navy"),
  n("04 GRI", "Саарал", "#94928C", "gray"),
  n("12488 GRI", "Саарал", "#8F8D87", "gray"),
  n("30 K.GRI", "Бараан саарал", "#55565A", "charcoal"),
  n("12484 ANTRASIT", "Антрацит", "#3A3D41", "charcoal"),
  n("34 PUDRA", "Пудра", "#D9BDB5", "blush"),
  n("12481 G.KURUSU", "Хатаасан сарнай", "#B9897E", "blush"),
  n("05 PEMBE", "Ягаан", "#D9A0A8", "pink"),
  n("06 Y.AĞIZI", "Уруулын өнгө", "#BE8B85", "blush"),
  n("21 K.LILA", "Бараан лила", "#6E5578", "plum"),
  n("20 G.KURUSU", "Хатаасан сарнай", "#BC8F84", "blush"),
  n("22 FUŞYA", "Фуксия", "#B0397E", "pink"),
  n("12479 MÜRDÜM", "Хар нил", "#5B2A44", "plum"),
  n("25 VIŞNE", "Интоорын", "#7A2230", "wine"),
  n("24 MOR", "Нил ягаан", "#6B4C86", "plum"),
  n("26 MÜRDÜM", "Хар нил", "#5F2C46", "plum"),
  n("11 ORANJ", "Улбар шар", "#CE6F37", "orange"),
  n("12486 KIREMIT", "Тоосго", "#A85B41", "terracotta"),
  n("23 KIRMIZI", "Улаан", "#A62B32", "red"),
  n("27 BORDO", "Бургунди", "#6E1F2B", "burgundy"),
  n("33 SIYAH", "Хар", "#1B1B1C", "black"),
];

/* ------------------------------------------------------------------ */
/* J. RASHEL BLINDS                                                     */
/* ------------------------------------------------------------------ */
const rashel: ColorSeed[] = [
  "10", "12", "51", "13", "15", "16", "17", "54", "18", "52", "53", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32",
  "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50",
].map(c);

export const MATERIALS: MaterialSeed[] = [
  {
    slug: "new-drappe",
    name: "NEW DRAPPE",
    nameEn: "New Drappe",
    pricePerMeter: 130000,
    fabricWidth: 280,
    fabric: "drape",
    weight: "Хүнд даавуу • 320 г/м²",
    opacity: 0.92,
    sheen: 0.18,
    availability: "available",
    description:
      "Гүн уналттай, архитектурын шугамд тохирсон хүнд хөшигний даавуу. Зочны өрөө, танхим зэрэг өргөн орон зайд тохиромжтой. Гэрлийг сайн хааж, хөшигний атираа тогтвортой хадгалагдана.",
    colors: newDrappe,
  },
  {
    slug: "dokufon-16",
    name: "DOKUFON 16",
    nameEn: "Dokufon 16",
    pricePerMeter: 140000,
    fabricWidth: 280,
    fabric: "jacquard",
    weight: "Дунд хүнд • 300 г/м²",
    opacity: 0.88,
    sheen: 0.26,
    availability: "available",
    description:
      "Нарийн нэхмэл бүтэцтэй, гэрэлд бага зэрэг гялалздаг дунд хүнд даавуу. Орчин үеийн болон нео-классик интерьер хэв маягт тохирно.",
    colors: dokufon16,
  },
  {
    slug: "dokufon-20",
    name: "DOKUFON 20",
    nameEn: "Dokufon 20",
    pricePerMeter: 140000,
    fabricWidth: 280,
    fabric: "jacquard",
    weight: "Дунд хүнд • 310 г/м²",
    opacity: 0.9,
    sheen: 0.3,
    availability: "available",
    description:
      "Dokufon цувралын илүү нягт нэхмэл хувилбар. Гүн өнгө, торгомсог гялбаа нь унтлагын өрөө болон зочны өрөөнд тансаг мэдрэмж өгнө.",
    colors: dokufon20,
  },
  {
    slug: "gagla-jakak-fonluk",
    name: "GAGLA / JAKAK FONLUK",
    nameEn: "Gagla / Jakak Fonluk",
    pricePerMeter: 130000,
    fabricWidth: 280,
    fabric: "drape",
    weight: "Хүнд • 330 г/м²",
    opacity: 0.94,
    sheen: 0.14,
    availability: "available",
    description:
      "Фон (хөшигний доод давхарга) болон өргөн хөшигт зориулсан нягт, хөнгөн гялбаагүй даавуу. Гэрэл хаах чанар өндөр.",
    colors: gagla,
  },
  {
    slug: "venezia",
    name: "VENEZIA",
    nameEn: "Venezia",
    pricePerMeter: 110000,
    fabricWidth: 280,
    fabric: "drape",
    weight: "Дунд • 260 г/м²",
    opacity: 0.82,
    sheen: 0.22,
    availability: "available",
    description:
      "Уян хатан уналттай, өдөр тутмын хэрэглээнд тохиромжтой даавуу. Өргөн өнгөний сонголт нь орчин үеийн орон сууцны интерьерэд уян хатан тохирно.",
    colors: venezia,
  },
  {
    slug: "rzb-torgon",
    name: "RZB TORGON",
    nameEn: "RZB Torgon (Serenity Home)",
    pricePerMeter: 85000,
    fabricWidth: 280,
    fabric: "linen",
    weight: "Хөнгөн-дунд • 220 г/м²",
    opacity: 0.7,
    sheen: 0.1,
    availability: "available",
    description:
      "Торгон холимог, матлаг гадаргуутай хөнгөн даавуу. Скандинав болон минималист интерьер, өдрийн гэрэл ихтэй өрөөнд тохирно.",
    colors: rzb,
  },
  {
    slug: "blackout",
    name: "BLACKOUT",
    nameEn: "Blackout",
    pricePerMeter: 95000,
    fabricWidth: 280,
    fabric: "blackout",
    weight: "Нягт • 340 г/м²",
    opacity: 0.99,
    sheen: 0.08,
    availability: "available",
    description:
      "Гэрлийг бүрэн хаах зориулалттай гурван давхаргат даавуу. Унтлагын өрөө, хүүхдийн өрөө, гэрэл мэдрэмтгий орон зайд тохиромжтой.",
    colors: blackout,
  },
  {
    slug: "abylife",
    name: "ABYLIFE",
    nameEn: "Abylife",
    pricePerMeter: null,
    fabricWidth: 280,
    fabric: "velvet",
    weight: "Хүнд • 360 г/м²",
    opacity: 0.96,
    sheen: 0.42,
    availability: "unconfigured",
    description:
      "Гүн өнгө, торгомсог гадаргуутай кадифе бүтэцтэй даавуу. Үнийг администратор тохируулна.",
    colors: abylife,
  },
  {
    slug: "petek-kadife",
    name: "PETEK KADIFE",
    nameEn: "Petek Kadife",
    pricePerMeter: null,
    fabricWidth: 280,
    fabric: "velvet",
    weight: "Хүнд • 380 г/м²",
    opacity: 0.97,
    sheen: 0.46,
    availability: "unconfigured",
    description:
      "Туркийн уламжлалт кадифе нэхмэл. Өнгөний гүн, гэрлийн тусгал нь өрөөнд дулаан, тансаг мэдрэмж өгнө. Үнийг администратор тохируулна.",
    colors: petek,
  },
  {
    slug: "rashel-blinds",
    name: "RASHEL BLINDS",
    nameEn: "Rashel Blinds",
    pricePerMeter: null,
    fabricWidth: 280,
    fabric: "blind",
    weight: "Тууз • 200 г/м²",
    opacity: 0.86,
    sheen: 0.12,
    availability: "unconfigured",
    description:
      "Рол болон туузан хөшигт зориулсан нягт даавуу. Оффис, гал тогоо, нарны гэрэл ихтэй цонхонд тохиромжтой. Үнийг администратор тохируулна.",
    colors: rashel,
  },
];

export const TOTAL_CODES = MATERIALS.reduce((sum, m) => sum + m.colors.length, 0);

export function materialBySlug(slug: string) {
  return MATERIALS.find((m) => m.slug === slug);
}
