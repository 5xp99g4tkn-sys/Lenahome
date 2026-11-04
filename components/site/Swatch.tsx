import { readableTextOn } from "@/lib/color-science";

type SwatchProps = {
  hex?: string | null;
  code: string;
  name?: string | null;
  image?: string | null;
  fabric?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const TEXTURE_BG: Record<string, string> = {
  drape:
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 4px)",
  jacquard:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.14) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 5px)",
  velvet:
    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.18), transparent 60%)",
  blackout:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, rgba(0,0,0,0.07) 1px 3px)",
  sheer: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08))",
  linen:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)",
  blind:
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, rgba(0,0,0,0.05) 2px 3px)",
};

const SIZES: Record<string, string> = {
  xs: "h-9 w-9",
  sm: "h-14 w-14",
  md: "h-24 w-full",
  lg: "h-40 w-full",
};

export default function Swatch({
  hex,
  code,
  name,
  image,
  fabric = "drape",
  size = "md",
  showLabel = true,
  className = "",
}: SwatchProps) {
  const hasImage = Boolean(image);
  const hasHex = Boolean(hex);

  return (
    <div className={`${className}`}>
      <div
        className={`relative overflow-hidden ${SIZES[size]} border border-charcoal/10`}
        style={{
          backgroundColor: hasImage ? "#F1EAE0" : hasHex ? (hex as string) : "#E6DDCE",
        }}
        title={hasImage ? `${code} — баталгаажсан swatch` : hasHex ? `${code} — ойролцоо тон` : `${code} — swatch зураг шаардлагатай`}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image as string}
            alt={`${code} даавууны өнгө`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : hasHex ? (
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{ backgroundImage: TEXTURE_BG[fabric] ?? TEXTURE_BG.drape }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div
              className="absolute inset-0 opacity-70"
              style={{ backgroundImage: TEXTURE_BG[fabric] ?? TEXTURE_BG.drape }}
            />
            <span className="relative text-[8px] uppercase tracking-[0.16em] text-charcoal/45">
              Swatch
            </span>
            <span className="relative text-[7px] uppercase tracking-[0.12em] text-charcoal/35">
              шаардлагатай
            </span>
          </div>
        )}

        {!hasHex && !hasImage && size !== "xs" && (
          <span className="absolute inset-x-0 bottom-0 border-t border-charcoal/10 bg-ivory/70 px-1 py-0.5 text-center text-[8px] tracking-[0.06em] text-charcoal/60">
            {code}
          </span>
        )}

        {hasHex && !hasImage && (
          <span
            className="absolute right-0.5 top-0.5 rounded-full px-1 py-px text-[7px] tracking-[0.08em]"
            style={{
              backgroundColor: "rgba(0,0,0,0.22)",
              color: readableTextOn(hex as string),
            }}
          >
            ~
          </span>
        )}
      </div>

      {showLabel && (
        <div className="mt-2">
          <p className="truncate text-[11px] font-medium tracking-[0.04em] text-charcoal">
            {code}
          </p>
          <p className="truncate text-[10px] text-charcoal/50">{name ?? "—"}</p>
        </div>
      )}
    </div>
  );
}
