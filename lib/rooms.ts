export type RoomPreset = {
  key: string;
  label: string;
  mood: string;
  wall: string;
  wallAlt: string;
  ceiling: string;
  floor: string;
  floorType: "wood" | "stone" | "carpet";
  furniture: string;
  furnitureAlt: string;
  accent: string;
  trim: string;
  windowW: number;
  windowH: number;
  sillHeight: number;
  moulding: boolean;
  rug: string;
  ceilingHeight: number;
};

export const ROOMS: RoomPreset[] = [
  {
    key: "living-modern",
    label: "Орчин үеийн зочны өрөө",
    mood: "Цэвэр шугам, дулаан нейтрал",
    wall: "#EDE7DD",
    wallAlt: "#E4DCCF",
    ceiling: "#F7F3EC",
    floor: "#B08A5E",
    floorType: "wood",
    furniture: "#6E665A",
    furnitureAlt: "#8B8274",
    accent: "#B7AFA3",
    trim: "#F6F2EA",
    windowW: 2.6,
    windowH: 1.95,
    sillHeight: 0.75,
    moulding: false,
    rug: "#CFC3B2",
    ceilingHeight: 3.0,
  },
  {
    key: "living-luxury",
    label: "Тансаг зочны өрөө",
    mood: "Гүн тон, алтлаг тусгал",
    wall: "#E7DED0",
    wallAlt: "#DCD0BE",
    ceiling: "#F4EEE4",
    floor: "#D3CCC0",
    floorType: "stone",
    furniture: "#463C31",
    furnitureAlt: "#5A4C3D",
    accent: "#B99A5F",
    trim: "#F3EDE2",
    windowW: 3.0,
    windowH: 2.15,
    sillHeight: 0.7,
    moulding: true,
    rug: "#BFAE93",
    ceilingHeight: 3.3,
  },
  {
    key: "living-classic",
    label: "Классик европ зочны өрөө",
    mood: "Хээ хавтан, уламжлалт харьцаа",
    wall: "#E6DBC8",
    wallAlt: "#DACBB4",
    ceiling: "#F6F0E6",
    floor: "#8B6B4A",
    floorType: "wood",
    furniture: "#5A4031",
    furnitureAlt: "#75553D",
    accent: "#A98B5F",
    trim: "#F5EFE4",
    windowW: 2.5,
    windowH: 2.3,
    sillHeight: 0.65,
    moulding: true,
    rug: "#C2A78A",
    ceilingHeight: 3.4,
  },
  {
    key: "bedroom-modern",
    label: "Орчин үеийн унтлагын өрөө",
    mood: "Тайван, гэрэл хаах чиглэл",
    wall: "#E9E3DA",
    wallAlt: "#DED7CB",
    ceiling: "#F5F1EA",
    floor: "#A98F6E",
    floorType: "wood",
    furniture: "#6B6259",
    furnitureAlt: "#8A8073",
    accent: "#C0B4A3",
    trim: "#F4EFE7",
    windowW: 2.2,
    windowH: 1.75,
    sillHeight: 0.8,
    moulding: false,
    rug: "#CFC4B4",
    ceilingHeight: 2.85,
  },
  {
    key: "bedroom-master",
    label: "Тансаг мастер унтлагын өрөө",
    mood: "Кадифе, бараан мод",
    wall: "#DCD3C6",
    wallAlt: "#CFC3B2",
    ceiling: "#F1EBE1",
    floor: "#7B6448",
    floorType: "wood",
    furniture: "#3E3A34",
    furnitureAlt: "#57504A",
    accent: "#A88C63",
    trim: "#EFE8DC",
    windowW: 2.7,
    windowH: 2.0,
    sillHeight: 0.75,
    moulding: true,
    rug: "#B6A78F",
    ceilingHeight: 3.05,
  },
  {
    key: "scandi",
    label: "Скандинав интерьер",
    mood: "Цайвар мод, зөөлөн гэрэл",
    wall: "#F4F1EA",
    wallAlt: "#EAE6DC",
    ceiling: "#FAF7F1",
    floor: "#C9AE8B",
    floorType: "wood",
    furniture: "#C9C0B4",
    furnitureAlt: "#D8D0C4",
    accent: "#9BA48F",
    trim: "#FBF8F2",
    windowW: 2.4,
    windowH: 1.9,
    sillHeight: 0.8,
    moulding: false,
    rug: "#E0D8C9",
    ceilingHeight: 2.8,
  },
  {
    key: "apartment",
    label: "Орчин үеийн орон сууц",
    mood: "Хязгаарлагдмал талбай, өндөр цонх",
    wall: "#EDE8E0",
    wallAlt: "#E2DDD4",
    ceiling: "#F5F2EC",
    floor: "#9C8467",
    floorType: "wood",
    furniture: "#7A7268",
    furnitureAlt: "#958C80",
    accent: "#A8A29A",
    trim: "#F4F1EB",
    windowW: 2.0,
    windowH: 1.7,
    sillHeight: 0.85,
    moulding: false,
    rug: "#D2C9BC",
    ceilingHeight: 2.75,
  },
  {
    key: "traditional",
    label: "Классик уламжлалт интерьер",
    mood: "Дулаан мод, гүн өнгө",
    wall: "#E0D3BD",
    wallAlt: "#D3C3A8",
    ceiling: "#F3ECE0",
    floor: "#7A5836",
    floorType: "wood",
    furniture: "#513B2B",
    furnitureAlt: "#6B4E37",
    accent: "#9C7B4F",
    trim: "#EFE6D7",
    windowW: 2.4,
    windowH: 2.2,
    sillHeight: 0.6,
    moulding: true,
    rug: "#B89772",
    ceilingHeight: 3.2,
  },
];

export function roomByKey(key: string): RoomPreset {
  return ROOMS.find((r) => r.key === key) ?? ROOMS[0];
}

export const WALL_SWATCHES = [
  "#F4F1EA",
  "#EDE7DD",
  "#E6DBC8",
  "#DCD3C6",
  "#C8BFAF",
  "#9AA39B",
  "#8E969B",
  "#6E6A63",
];

export const FLOOR_OPTIONS = [
  { key: "wood", label: "Модон шал" },
  { key: "stone", label: "Чулуун хавтан" },
  { key: "carpet", label: "Хивс" },
] as const;

export const FURNITURE_SWATCHES = ["#3E3A34", "#6E665A", "#9A9081", "#C9C0B4", "#513B2B", "#B99A5F"];

export type LightingKey = "morning" | "day" | "afternoon" | "evening" | "night";

export const LIGHTING_RIG: Record<
  LightingKey,
  { sky: string; ground: string; sun: string; sunIntensity: number; fill: number; lamp: number; sunPos: [number, number, number]; exposure: number }
> = {
  morning: {
    sky: "#FFE7C6",
    ground: "#8A6E52",
    sun: "#FFD9A0",
    sunIntensity: 2.6,
    fill: 0.55,
    lamp: 0,
    sunPos: [-4, 1.5, -3.4],
    exposure: 1.05,
  },
  day: {
    sky: "#EAF2F6",
    ground: "#9E9384",
    sun: "#FFF7E8",
    sunIntensity: 3.1,
    fill: 0.85,
    lamp: 0,
    sunPos: [1.5, 3.4, -3.2],
    exposure: 1.1,
  },
  afternoon: {
    sky: "#FCE0BF",
    ground: "#8E7256",
    sun: "#FFC98A",
    sunIntensity: 2.4,
    fill: 0.5,
    lamp: 0.25,
    sunPos: [4.2, 1.8, -3.0],
    exposure: 1.0,
  },
  evening: {
    sky: "#D9B79E",
    ground: "#6A5847",
    sun: "#E9A87A",
    sunIntensity: 0.9,
    fill: 0.32,
    lamp: 1.9,
    sunPos: [3.4, 1.0, -3.2],
    exposure: 0.95,
  },
  night: {
    sky: "#25313E",
    ground: "#1B1A18",
    sun: "#7E97B4",
    sunIntensity: 0.18,
    fill: 0.2,
    lamp: 2.6,
    sunPos: [-2, 2.2, -3.2],
    exposure: 0.9,
  },
};
