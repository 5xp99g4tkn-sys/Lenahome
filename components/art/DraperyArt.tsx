import { hexToRgb, rgbToHex } from "@/lib/color-science";

function shade(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return rgbToHex(r + (target - r) * t, g + (target - g) * t, b + (target - b) * t);
}

/** SVG-ээр зурсан хөшигний атираа — гадаад зураггүйгээр бодит мэдрэмж өгнө. */
export function DraperyArt({
  color = "#D9C3A0",
  folds = 9,
  className = "",
  sheen = 0.5,
  opacity = 1,
}: {
  color?: string;
  folds?: number;
  className?: string;
  sheen?: number;
  opacity?: number;
}) {
  const id = `dr-${color.replace("#", "")}-${folds}`;
  const step = 100 / folds;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        {Array.from({ length: folds }).map((_, i) => {
          const center = i * step + step / 2;
          const light = shade(color, 0.16 * sheen + 0.06);
          const mid = shade(color, 0);
          const dark = shade(color, -(0.3 - 0.1 * sheen));
          return (
            <linearGradient
              key={i}
              id={`${id}-${i}`}
              x1={`${i * step}%`}
              y1="0%"
              x2={`${(i + 1) * step}%`}
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={dark} />
              <stop offset="28%" stopColor={mid} />
              <stop offset="52%" stopColor={light} />
              <stop offset="74%" stopColor={mid} />
              <stop offset="100%" stopColor={shade(color, -0.22)} />
              <title>{`fold-${center}`}</title>
            </linearGradient>
          );
        })}
        <linearGradient id={`${id}-veil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
          <stop offset="12%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      {Array.from({ length: folds }).map((_, i) => (
        <rect
          key={i}
          x={`${i * step}%`}
          y="0"
          width={`${step + 0.4}%`}
          height="100%"
          fill={`url(#${id}-${i})`}
        />
      ))}
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-veil)`} />
    </svg>
  );
}

/** Нүүр хуудасны архитектурын хэсэг — цонх, гэрэл, хөшиг */
export function HeroScene({
  curtainColor = "#C9B393",
  wallColorOf = "#EFE7DA",
  sheerColor = "#F6F1E7",
}: {
  curtainColor?: string;
  wallColorOf?: string;
  sheerColor?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EFE7DA]">
      <svg
        viewBox="0 0 720 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-label="Хөшиг бүхий зочны өрөөний архитектурын визуал"
        role="img"
      >
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(wallColorOf, 0.06)} />
            <stop offset="60%" stopColor={wallColorOf} />
            <stop offset="100%" stopColor={shade(wallColorOf, -0.1)} />
          </linearGradient>
          <linearGradient id="daylight" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#FFFDF6" />
            <stop offset="46%" stopColor="#FBF3E3" />
            <stop offset="100%" stopColor="#E8DCC6" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8AE8A" />
            <stop offset="100%" stopColor="#A98D69" />
          </linearGradient>
          <linearGradient id="floorLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF6E2" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFF6E2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sofa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C8274" />
            <stop offset="100%" stopColor="#6E665A" />
          </linearGradient>
          <linearGradient id="sheerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sheerColor} stopOpacity="0.92" />
            <stop offset="100%" stopColor={sheerColor} stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.32" r="0.62">
            <stop offset="0%" stopColor="#FFFCF2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFCF2" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* wall + ceiling */}
        <rect width="720" height="900" fill="url(#wall)" />
        <rect x="0" y="0" width="720" height="86" fill="#F7F0E4" />
        <line x1="0" y1="86" x2="720" y2="86" stroke="#DCCFB8" strokeWidth="1" />
        {/* floor */}
        <rect x="0" y="700" width="720" height="200" fill="url(#floor)" />
        <rect x="0" y="700" width="720" height="10" fill="#B89B76" />
        {/* window opening */}
        <rect x="196" y="150" width="336" height="520" fill="url(#daylight)" />
        <rect x="196" y="150" width="336" height="520" fill="none" stroke="#E4D8C2" strokeWidth="3" />
        <g stroke="#EADFCB" strokeWidth="2">
          <line x1="364" y1="150" x2="364" y2="670" />
          <line x1="196" y1="410" x2="532" y2="410" />
        </g>
        {/* sunlight patch on floor */}
        <path d="M196 670 L532 670 L640 900 L96 900 Z" fill="url(#floorLight)" />
        {/* sheer layer */}
        <foreignObject x="186" y="120" width="356" height="580">
          <div className="h-full w-full" style={{ filter: "blur(0.4px)" }}>
            <DraperyArt color={sheerColor} folds={16} sheen={0.15} opacity={0.82} />
          </div>
        </foreignObject>
        {/* main curtains */}
        <foreignObject x="96" y="110" width="150" height="700">
          <DraperyArt color={curtainColor} folds={5} sheen={0.6} />
        </foreignObject>
        <foreignObject x="482" y="110" width="150" height="700">
          <DraperyArt color={curtainColor} folds={5} sheen={0.6} />
        </foreignObject>
        {/* track */}
        <rect x="80" y="104" width="566" height="8" fill="#4B443A" />
        {/* sofa silhouette */}
        <g>
          <rect x="60" y="726" width="600" height="96" rx="10" fill="url(#sofa)" opacity="0.92" />
          <rect x="60" y="700" width="600" height="34" rx="12" fill="#9A9081" opacity="0.92" />
          <rect x="108" y="726" width="180" height="60" rx="8" fill="#A29684" opacity="0.7" />
          <rect x="432" y="726" width="180" height="60" rx="8" fill="#A29684" opacity="0.7" />
        </g>
        {/* plant */}
        <g opacity="0.85">
          <rect x="612" y="700" width="46" height="60" rx="4" fill="#B9A88C" />
          <path d="M635 700 C620 660 612 610 636 566 C650 600 652 648 635 700 Z" fill="#7C8771" />
          <path d="M635 700 C656 668 676 640 664 596 C642 626 630 660 635 700 Z" fill="#8D9884" />
        </g>
        <rect width="720" height="900" fill="url(#glow)" />
        <ellipse cx="360" cy="420" rx="300" ry="240" fill="#FFFAF0" opacity="0.18" filter="url(#soft)" />
      </svg>
    </div>
  );
}
