import { styleByKey } from "./catalog";

export type PricingSettings = {
  hemAllowanceCm: number;
  sideHemCm: number;
  patternRepeatCm: number;
  sewingPerMeter: number;
  accessoriesPerMeter: number;
  trackPerMeter: number;
  bracketPerWindow: number;
  installationPerWindow: number;
  deliveryFee: number;
};

export const DEFAULT_PRICING: PricingSettings = {
  hemAllowanceCm: 25,
  sideHemCm: 10,
  patternRepeatCm: 30,
  sewingPerMeter: 28000,
  accessoriesPerMeter: 6000,
  trackPerMeter: 35000,
  bracketPerWindow: 15000,
  installationPerWindow: 60000,
  deliveryFee: 30000,
};

export type MeasureInput = {
  widthCm: number;
  heightCm: number;
  ceilingCm: number;
  windows: number;
  panels: number;
  fullness: number;
};

export type MeasurementResult = {
  panelWidthCm: number;
  widthsPerPanel: number;
  cutLengthCm: number;
  metersPerPanel: number;
  totalMeters: number;
  drapeWidthCm: number;
  warnings: string[];
};

/**
 * Даавууны зарцуулалтын урьдчилсан тооцоо.
 * Энэ нь үйлдвэрлэлийн эцсийн үзүүлэлт БИШ — хэмжилтийн баг батална.
 */
export function calcFabric(
  input: MeasureInput,
  fabricWidthCm: number,
  opts: { styleKey: string; withPatternRepeat: boolean; settings?: PricingSettings },
): MeasurementResult {
  const settings = opts.settings ?? DEFAULT_PRICING;
  const style = styleByKey(opts.styleKey);
  const windows = Math.max(1, Math.round(input.windows || 1));
  const panels = Math.max(1, Math.round(input.panels || 1));
  const widthCm = Math.max(30, input.widthCm || 0);
  const heightCm = Math.max(30, input.heightCm || 0);
  const fullness = Math.max(1, input.fullness || 2);

  const drapeWidthCm = widthCm * fullness * windows;
  const panelWidthCm = drapeWidthCm / (panels * windows) + settings.sideHemCm;
  const widthsPerPanel = Math.max(1, Math.ceil(panelWidthCm / fabricWidthCm));

  let cutLengthCm = heightCm + settings.hemAllowanceCm;
  if (opts.withPatternRepeat || style.key === "classic" || style.key === "double") {
    cutLengthCm += settings.patternRepeatCm;
  }
  if (style.key === "ceiling" && input.ceilingCm > 0) {
    cutLengthCm = Math.max(cutLengthCm, Math.max(heightCm, input.ceilingCm - 2) + settings.hemAllowanceCm);
  }

  const metersPerPanel = (widthsPerPanel * cutLengthCm) / 100;
  const totalMeters = windows * panels * metersPerPanel;

  const warnings: string[] = [];
  if (input.heightCm > input.ceilingCm && input.ceilingCm > 0)
    warnings.push("Хөшигний өндөр таазны өндрөөс их байна. Хэмжээгээ шалгана уу.");
  if (input.ceilingCm > 0 && input.ceilingCm < 200)
    warnings.push("Таазны өндөр 200 см-ээс бага байна. Шалнаас дээш 1–2 см зай үлдээхийг зөвлөж байна.");
  if (widthsPerPanel > 1)
    warnings.push(
      `Нэг хөшигний өргөн ${Math.round(panelWidthCm)} см тул даавууг ${widthsPerPanel} хэсэг холбоно.`,
    );
  if (fullness < 1.8)
    warnings.push("1.8x-ээс бага дүүргэлт нь атирааг багасгаж, хавтгай харагдуулна.");

  return {
    panelWidthCm,
    widthsPerPanel,
    cutLengthCm,
    metersPerPanel: round(metersPerPanel, 2),
    totalMeters: round(totalMeters, 2),
    drapeWidthCm,
    warnings,
  };
}

export type QuoteLine = {
  key: string;
  label: string;
  detail: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  total: number;
  currency: string;
  hasFabricPrice: boolean;
  notes: string[];
};

export function buildQuote(args: {
  meters: number;
  windowWidthCm: number;
  windows: number;
  panels: number;
  styleKey: string;
  pricePerMeter: number | null;
  settings: PricingSettings;
}): Quote {
  const { meters, settings } = args;
  const style = styleByKey(args.styleKey);
  const windows = Math.max(1, args.windows);
  const panels = Math.max(1, args.panels);
  const lines: QuoteLine[] = [];
  const notes: string[] = [];

  const hasFabricPrice = typeof args.pricePerMeter === "number" && args.pricePerMeter > 0;
  if (hasFabricPrice) {
    lines.push({
      key: "fabric",
      label: "Даавуу",
      detail: `${round(meters, 2)} м × ${formatMnt(args.pricePerMeter as number)}`,
      quantity: round(meters, 2),
      unit: "м",
      unitPrice: args.pricePerMeter as number,
      amount: Math.round(meters * (args.pricePerMeter as number)),
    });
  } else {
    notes.push("Энэ даавууны үнэ хараахан тохируулагдаагүй тул даавууны өртөг тооцоогүй.");
  }

  lines.push({
    key: "sewing",
    label: "Оёдол, үйлдвэрлэл",
    detail: `Оёдлын ажил • ${style.label}`,
    quantity: round(meters, 2),
    unit: "м",
    unitPrice: Math.round(settings.sewingPerMeter * style.laborFactor),
    amount: Math.round(meters * settings.sewingPerMeter * style.laborFactor),
  });

  lines.push({
    key: "accessories",
    label: "Дагалдах хэрэгсэл",
    detail: "Хөшигний тууз, дэгээ, бөгж, холбогч",
    quantity: round(meters, 2),
    unit: "м",
    unitPrice: settings.accessoriesPerMeter,
    amount: Math.round(meters * settings.accessoriesPerMeter),
  });

  const trackMeters = (args.windowWidthCm / 100) * windows * 1.1;
  lines.push({
    key: "track",
    label: "Хөшигний зам",
    detail: `${windows} цонх • ${round(trackMeters, 1)} м зам + бэхэлгээ`,
    quantity: round(trackMeters, 1),
    unit: "м",
    unitPrice: settings.trackPerMeter,
    amount:
      Math.round(trackMeters * settings.trackPerMeter) + settings.bracketPerWindow * windows,
  });

  lines.push({
    key: "installation",
    label: "Угсралт, суурилуулалт",
    detail: `${windows} цонх`,
    quantity: windows,
    unit: "цонх",
    unitPrice: settings.installationPerWindow,
    amount: settings.installationPerWindow * windows,
  });

  lines.push({
    key: "delivery",
    label: "Хүргэлт",
    detail: "Улаанбаатар хот дотор",
    quantity: 1,
    unit: "удаа",
    unitPrice: settings.deliveryFee,
    amount: settings.deliveryFee,
  });

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  notes.push(
    "Энэ нь урьдчилсан тооцоо. Мэргэжлийн хэмжилт хийсний дараа эцсийн үнэ баталгаажна.",
  );
  if (panels < 2) notes.push("Ихэнх тохиолдолд 2 хөшиг (баруун, зүүн) шаардлагатай.");
  if (!hasFabricPrice) notes.push("Даавууны үнийг тохируулсны дараа тооцоо бүрэн болно.");

  return {
    lines,
    subtotal,
    total: subtotal,
    currency: "MNT",
    hasFabricPrice,
    notes,
  };
}

export function round(n: number, digits = 0) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(Math.round(n)) + "₮";
}
