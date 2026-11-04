"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { styleByKey } from "@/lib/catalog";
import { fabricTexture } from "./textures";

export type CurtainProps = {
  width: number;
  height: number;
  styleKey: string;
  fabric: string;
  color: string;
  position: [number, number, number];
  layer?: "main" | "sheer";
  opacityOverride?: number;
  side?: "left" | "right" | "center";
};

function buildGeometry(width: number, height: number, styleKey: string, scale: number) {
  const style = styleByKey(styleKey);
  const folds = Math.max(3, Math.round(style.pleatFrequency * scale));
  const segX = Math.min(220, folds * 16);
  const segY = 28;
  const geo = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const depth = style.pleatDepth;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const fromTop = (height / 2 - y) / height; // 0 дээд, 1 доод
    const u = (x + width / 2) / width;

    const phase = u * folds * Math.PI * 2;
    let amp = depth;
    let z = Math.sin(phase) * amp;

    switch (style.key) {
      case "pencil":
        // дээд талдаа чанга, доошоо нээгдэнэ
        z = Math.sin(phase) * depth * (0.45 + 0.75 * fromTop) + Math.sin(phase * 2.1) * depth * 0.12;
        break;
      case "pinch": {
        // хавчсан гүн атираа — орой нь хурц
        const crest = Math.sign(Math.sin(phase)) * Math.pow(Math.abs(Math.sin(phase)), 0.55);
        z = crest * depth * (0.65 + 0.35 * fromTop);
        break;
      }
      case "eyelet":
        z = Math.sin(phase) * depth * 1.15 + Math.cos(phase * 0.5) * 0.004;
        break;
      case "classic":
        z = Math.sin(phase) * depth * (0.7 + 0.5 * fromTop);
        break;
      case "wave":
      case "ceiling":
      default:
        z = Math.sin(phase) * depth * (0.85 + 0.2 * fromTop);
        break;
    }

    // доод ирмэг бага зэрэг чөлөөтэй унах
    z += Math.sin(u * Math.PI * 2 * (folds * 0.37)) * 0.006 * fromTop;

    // дээд талдаа атираа хураагдана
    const gather =
      style.key === "pencil" ? 1 - 0.1 * (1 - fromTop) : style.key === "pinch" ? 1 - 0.13 * (1 - fromTop) : 1;
    pos.setXYZ(i, x * gather, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

export default function Curtain({
  width,
  height,
  styleKey,
  fabric,
  color,
  position,
  layer = "main",
  opacityOverride,
  side = "center",
}: CurtainProps) {
  const style = styleByKey(styleKey);
  const geometry = useMemo(
    () => buildGeometry(width, height, styleKey, width / 1.5),
    [width, height, styleKey],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const { map, bump } = useMemo(() => fabricTexture(fabric as never), [fabric]);

  const isSheer = layer === "sheer" || fabric === "sheer" || style.key === "sheer";
  const opacity = opacityOverride ?? (isSheer ? 0.32 : 1);
  const roughness =
    fabric === "velvet" ? 0.62 : fabric === "blackout" ? 0.98 : fabric === "sheer" ? 0.55 : 0.86;
  const sheen =
    fabric === "velvet" ? 0.9 : fabric === "jacquard" ? 0.35 : fabric === "blind" ? 0.1 : 0.16;

  return (
    <group position={position}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          map={map}
          bumpMap={bump}
          bumpScale={fabric === "velvet" ? 0.012 : 0.006}
          roughness={roughness}
          metalness={0}
          sheen={sheen}
          sheenRoughness={fabric === "velvet" ? 0.55 : 0.8}
          sheenColor={fabric === "velvet" ? "#ffffff" : color}
          transparent={opacity < 1}
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={opacity > 0.9}
        />
      </mesh>

      {/* дээд ирмэгийн тууз */}
      {layer === "main" && (
        <mesh position={[0, height / 2 - 0.012, 0]} castShadow>
          <boxGeometry args={[width * (style.key === "pinch" || style.key === "pencil" ? 0.9 : 1), 0.025, 0.05]} />
          <meshStandardMaterial color={side === "center" ? "#D8CFC0" : "#D8CFC0"} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}
