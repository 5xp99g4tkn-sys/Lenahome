export type CurtainStyleKey =
  | "wave"
  | "pencil"
  | "pinch"
  | "eyelet"
  | "double"
  | "sheer"
  | "blackout"
  | "ceiling"
  | "classic";

export type CurtainStyle = {
  key: CurtainStyleKey;
  label: string;
  labelEn: string;
  desc: string;
  defaultFullness: number;
  /** Оёдлын ажлын коэффициент */
  laborFactor: number;
  /** Атирааны давтамж (3D) */
  pleatFrequency: number;
  /** Атирааны гүн (3D, метр) */
  pleatDepth: number;
  layers: 1 | 2;
};

export const CURTAIN_STYLES: CurtainStyle[] = [
  {
    key: "wave",
    label: "Долгионт хөшиг",
    labelEn: "Wave",
    desc: "Тэгш, хэмнэлтэй долгион. Орчин үеийн интерьерийн хамгийн цэвэрхэн шийдэл.",
    defaultFullness: 2,
    laborFactor: 1,
    pleatFrequency: 5.5,
    pleatDepth: 0.055,
    layers: 1,
  },
  {
    key: "pencil",
    label: "Харандаан атираа",
    labelEn: "Pencil pleat",
    desc: "Туузаар чангалсан жижиг, нягт атираа. Уян хатан, дулаан мэдрэмжтэй.",
    defaultFullness: 2.2,
    laborFactor: 1.05,
    pleatFrequency: 11,
    pleatDepth: 0.028,
    layers: 1,
  },
  {
    key: "pinch",
    label: "Хавчуур атираа",
    labelEn: "Pinch pleat",
    desc: "Гараар хавчсан гүн атираа. Классик, тансаг интерьерэд зориулсан.",
    defaultFullness: 2.5,
    laborFactor: 1.25,
    pleatFrequency: 4,
    pleatDepth: 0.075,
    layers: 1,
  },
  {
    key: "eyelet",
    label: "Люверст хөшиг",
    labelEn: "Eyelet",
    desc: "Төмөр дээрх бөгжөөр гулсдаг, амархан нээгддэг загвар.",
    defaultFullness: 1.8,
    laborFactor: 1.1,
    pleatFrequency: 6,
    pleatDepth: 0.05,
    layers: 1,
  },
  {
    key: "double",
    label: "Давхар давхарга",
    labelEn: "Double layer",
    desc: "Тюль болон үндсэн даавуу давхарласан. Өдрийн болон шөнийн горимыг нэгэн зэрэг шийднэ.",
    defaultFullness: 2.5,
    laborFactor: 1.4,
    pleatFrequency: 5,
    pleatDepth: 0.055,
    layers: 2,
  },
  {
    key: "sheer",
    label: "Тюль",
    labelEn: "Sheer",
    desc: "Гэрлийг зөөлрүүлэх тунгалаг давхарга. Цонхыг өргөн харагдуулна.",
    defaultFullness: 2.5,
    laborFactor: 0.9,
    pleatFrequency: 8,
    pleatDepth: 0.04,
    layers: 1,
  },
  {
    key: "blackout",
    label: "Гэрэл хаагч",
    labelEn: "Blackout",
    desc: "Гэрлийг бүрэн хаах загвар. Унтлагын өрөө, хүүхдийн өрөөнд тохиромжтой.",
    defaultFullness: 2,
    laborFactor: 1,
    pleatFrequency: 5,
    pleatDepth: 0.05,
    layers: 1,
  },
  {
    key: "ceiling",
    label: "Тааз хүртэл",
    labelEn: "Floor-to-ceiling",
    desc: "Таазнаас шал хүртэл. Өрөөний өндрийг нэмэгдүүлж, архитектурын мэдрэмж өгнө.",
    defaultFullness: 2.2,
    laborFactor: 1.15,
    pleatFrequency: 5,
    pleatDepth: 0.06,
    layers: 1,
  },
  {
    key: "classic",
    label: "Классик драпер",
    labelEn: "Classic drapery",
    desc: "Чөлөөтэй унасан гүн атираа, хажуугийн чимэглэлтэй уламжлалт загвар.",
    defaultFullness: 2.8,
    laborFactor: 1.35,
    pleatFrequency: 3.2,
    pleatDepth: 0.09,
    layers: 1,
  },
];

export function styleByKey(key: string): CurtainStyle {
  return CURTAIN_STYLES.find((s) => s.key === key) ?? CURTAIN_STYLES[0];
}

export const ROOM_TYPES = [
  { key: "living-modern", label: "Орчин үеийн зочны өрөө" },
  { key: "living-luxury", label: "Тансаг зочны өрөө" },
  { key: "living-classic", label: "Классик европ зочны өрөө" },
  { key: "bedroom-modern", label: "Орчин үеийн унтлагын өрөө" },
  { key: "bedroom-master", label: "Тансаг мастер унтлагын өрөө" },
  { key: "scandi", label: "Скандинав интерьер" },
  { key: "apartment", label: "Орчин үеийн орон сууц" },
  { key: "traditional", label: "Классик уламжлалт интерьер" },
];

export const FULLNESS_OPTIONS = [
  { value: 1.5, label: "1.5x — Хөнгөн" },
  { value: 2, label: "2.0x — Стандарт" },
  { value: 2.5, label: "2.5x — Премиум" },
  { value: 3, label: "3.0x — Нэмэлт" },
];

export const LIGHTING_PRESETS = [
  { key: "morning", label: "Өглөөний нар" },
  { key: "day", label: "Өдрийн гэрэл" },
  { key: "afternoon", label: "Үдээс хойш" },
  { key: "evening", label: "Орой" },
  { key: "night", label: "Шөнийн гэрэлтүүлэг" },
] as const;
