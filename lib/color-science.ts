export type StyleCategory = "modern" | "classic" | "minimal" | "scandi" | "luxury" | "warm";

export const STYLE_CATEGORIES: { key: StyleCategory; label: string; desc: string; swatch: string }[] = [
  {
    key: "modern",
    label: "Модерн",
    desc: "Хүйтэн саарал, графит, грейж, бүдэг ногоон, хөх, антрацит, орчин үеийн тауп",
    swatch: "#8E9296",
  },
  {
    key: "classic",
    label: "Классик",
    desc: "Бургунди, вино улаан, гүн хөх, маргад, ойн ногоон, шоколад, алтлаг, гүн нил",
    swatch: "#6E1F2B",
  },
  {
    key: "minimal",
    label: "Минималист",
    desc: "Дулаан цагаан, зааны яс, крем, беж, элс, цайвар саарал, байгалийн тауп",
    swatch: "#EDE4D4",
  },
  {
    key: "scandi",
    label: "Скандинав",
    desc: "Цайвар цагаан, байгалийн беж, зөөлөн саарал, бүдэг ногоон, цайвар хөх, модон тон",
    swatch: "#D8CDBD",
  },
  {
    key: "luxury",
    label: "Тансаг",
    desc: "Шампань, гүн бор, бараан маргад, шөнийн хөх, антрацит, дулаан тауп, баялаг бургунди",
    swatch: "#DCC9A9",
  },
  {
    key: "warm",
    label: "Дулаан & тухтай",
    desc: "Тэмээн өнгө, тоосго, шанцай, карамель, дулаан бор, бүдэг ягаан",
    swatch: "#C08A5E",
  },
];

/** Байгалийн өнгөний гэр бүл -> интерьерийн категори */
const FAMILY_STYLES: Record<string, StyleCategory[]> = {
  white: ["minimal", "scandi"],
  cream: ["minimal", "luxury", "scandi"],
  ivory: ["minimal", "luxury"],
  beige: ["minimal", "scandi", "warm"],
  sand: ["minimal", "scandi"],
  stone: ["minimal", "modern"],
  greige: ["modern", "minimal", "scandi"],
  taupe: ["modern", "luxury", "warm"],
  gray: ["modern", "minimal", "scandi"],
  charcoal: ["modern", "luxury"],
  black: ["modern", "luxury"],
  navy: ["classic", "luxury"],
  blue: ["modern", "scandi"],
  aqua: ["modern", "scandi"],
  teal: ["modern", "classic"],
  sage: ["modern", "scandi"],
  green: ["scandi", "modern"],
  forest: ["classic", "luxury"],
  emerald: ["classic", "luxury"],
  mustard: ["warm", "classic"],
  gold: ["luxury", "classic"],
  camel: ["warm", "luxury"],
  brown: ["warm", "classic"],
  chocolate: ["classic", "luxury", "warm"],
  terracotta: ["warm"],
  burgundy: ["classic", "luxury"],
  wine: ["classic", "luxury"],
  red: ["classic", "warm"],
  plum: ["classic", "luxury"],
  lilac: ["modern", "warm"],
  pink: ["warm", "minimal"],
  blush: ["warm", "minimal"],
  orange: ["warm"],
};

export const FAMILY_LABELS: Record<string, string> = {
  white: "Цагаан",
  cream: "Крем",
  ivory: "Зааны яс",
  beige: "Беж",
  sand: "Элсэн",
  stone: "Чулуун",
  greige: "Грейж",
  taupe: "Тауп",
  gray: "Саарал",
  charcoal: "Антрацит",
  black: "Хар",
  navy: "Хар хөх",
  blue: "Цэнхэр",
  aqua: "Аква",
  teal: "Петрол",
  sage: "Бүдэг ногоон",
  green: "Ногоон",
  forest: "Ойн ногоон",
  emerald: "Маргад",
  mustard: "Горчиц",
  gold: "Алтлаг",
  camel: "Тэмээн өнгө",
  brown: "Бор",
  chocolate: "Шоколад",
  terracotta: "Тоосго",
  burgundy: "Бургунди",
  wine: "Вино",
  red: "Улаан",
  plum: "Нил ягаан",
  lilac: "Лила",
  pink: "Ягаан",
  blush: "Пудра",
  orange: "Улбар шар",
};

export function stylesForFamily(family?: string | null): StyleCategory[] {
  if (!family) return [];
  return FAMILY_STYLES[family] ?? [];
}

/* --------------------------- өнгөний тооцоо --------------------------- */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function srgbToLinear(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function hexToLab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear) as [number, number, number];
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export function deltaE(a: [number, number, number], b: [number, number, number]) {
  const [l1, a1, b1] = a;
  const [l2, a2, b2] = b;
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function nearestFamily(hex: string): string {
  let best = "gray";
  let bestD = Infinity;
  for (const [family, ref] of Object.entries(FAMILY_REFERENCE)) {
    const d = deltaE(hexToLab(hex), hexToLab(ref));
    if (d < bestD) {
      bestD = d;
      best = family;
    }
  }
  return best;
}

const FAMILY_REFERENCE: Record<string, string> = {
  white: "#F2F2F0",
  cream: "#EDE3D1",
  ivory: "#F1EAD9",
  beige: "#D9C6A9",
  sand: "#DCCBAF",
  stone: "#B7AFA3",
  greige: "#BEB5A7",
  taupe: "#8A7C6D",
  gray: "#9A9A96",
  charcoal: "#3C3F43",
  black: "#1B1B1C",
  navy: "#1F2A44",
  blue: "#4A6FA5",
  aqua: "#7FB6B2",
  teal: "#1F4E5A",
  sage: "#A8CBB7",
  green: "#4E6B4A",
  forest: "#2F4A34",
  emerald: "#1F5A45",
  mustard: "#B48A2C",
  gold: "#C9A227",
  camel: "#BE9668",
  brown: "#5A4032",
  chocolate: "#3E2B22",
  terracotta: "#A85B41",
  burgundy: "#6E1F2B",
  wine: "#7A2230",
  red: "#A62B32",
  plum: "#5B2A44",
  lilac: "#9B7FA8",
  pink: "#D9A0A8",
  blush: "#D8BDB6",
  orange: "#CE6F37",
};

export function readableTextOn(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 150 ? "#2A2724" : "#FBF8F3";
}
