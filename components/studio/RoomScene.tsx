"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import Curtain from "./Curtain";
import { floorTexture } from "./textures";
import { LIGHTING_RIG, type LightingKey, type RoomPreset } from "@/lib/rooms";
import { styleByKey } from "@/lib/catalog";

export type SceneConfig = {
  room: RoomPreset;
  wallColor: string;
  floorColor: string;
  floorType: "wood" | "stone" | "carpet";
  furnitureColor: string;
  ceilingHeight: number;
  windowW: number;
  windowH: number;
  sillHeight: number;
  styleKey: string;
  fabric: string;
  color: string;
  sheerColor: string;
  fullness: number;
  lengthMode: "floor" | "sill" | "ceiling";
  panels: number;
  lighting: LightingKey;
  showSheer: boolean;
};

export default function RoomScene({ config }: { config: SceneConfig }) {
  const { room } = config;
  const roomH = config.ceilingHeight;
  const roomW = Math.max(4.8, config.windowW + 2.4);
  const roomD = 5.6;
  const halfW = roomW / 2;
  const halfD = roomD / 2;
  const windowLeft = -config.windowW / 2;
  const windowRight = config.windowW / 2;
  const windowBottom = config.sillHeight;
  const windowTop = config.sillHeight + config.windowH;
  const rig = LIGHTING_RIG[config.lighting];

  const floorMap = useMemo(
    () => floorTexture(config.floorType, config.floorColor),
    [config.floorType, config.floorColor],
  );

  const railY =
    config.lengthMode === "ceiling" ? roomH - 0.06 : Math.min(roomH - 0.12, windowTop + 0.22);
  const curtainHeight =
    config.lengthMode === "floor"
      ? railY - 0.015
      : config.lengthMode === "ceiling"
        ? roomH - 0.08
        : Math.max(0.9, railY - (windowBottom + 0.04));

  const span = config.windowW + 0.92;
  const panelSpan = span / 2;
  // Хөшиг цонхны хоёр талд хураагдсан байдалтай харагдана
  const panelWidth = panelSpan * (0.6 + config.fullness * 0.07);
  const panelX = 0.5 + panelWidth / 2;
  const curtainZ = -halfD + 0.14;
  const style = styleByKey(config.styleKey);
  const isDouble = style.key === "double";
  const showSheer = config.showSheer || isDouble || style.key === "sheer";

  const wallColor = config.wallColor;
  const wallColorDark = useMemo(() => {
    const c = new THREE.Color(wallColor);
    c.multiplyScalar(0.93);
    return `#${c.getHexString()}`;
  }, [wallColor]);

  const bg = config.lighting === "night" ? "#1B2029" : config.lighting === "evening" ? "#3A3128" : "#EFE7D9";

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 22]} />

      {/* ---------------- гэрэлтүүлэг ---------------- */}
      <hemisphereLight args={[rig.sky, rig.ground, rig.fill * 1.5]} />
      <ambientLight intensity={0.16 + rig.fill * 0.3} color={rig.sky} />
      <directionalLight
        position={rig.sunPos}
        intensity={rig.sunIntensity}
        color={rig.sun}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.4}
        shadow-camera-far={20}
        target-position={[0, 1, -1]}
      />
      <pointLight position={[0, roomH - 0.35, 1.1]} intensity={rig.lamp * 6} color="#FFE3B8" distance={9} castShadow={false} />
      <pointLight position={[-halfW + 0.8, 1.1, 1.4]} intensity={rig.lamp * 2.4} color="#FFCF9A" distance={6} />
      <rectAreaLight
        position={[0, windowTop - config.windowH / 2, -halfD + 0.35]}
        width={config.windowW}
        height={config.windowH}
        intensity={config.lighting === "night" ? 0.4 : 2.6}
        color={rig.sun}
      />

      {/* ---------------- шал ---------------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial
          map={floorMap}
          color={config.floorColor}
          roughness={config.floorType === "stone" ? 0.35 : config.floorType === "carpet" ? 0.95 : 0.62}
          metalness={config.floorType === "stone" ? 0.05 : 0}
        />
      </mesh>

      {/* ---------------- тааз ---------------- */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomH, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color={room.ceiling} roughness={0.95} />
      </mesh>

      {/* ---------------- хойд хана (цонхны нүхтэй) ---------------- */}
      <mesh position={[-(config.windowW / 2 + (halfW - config.windowW / 2) / 2), roomH / 2, -halfD]} receiveShadow castShadow>
        <boxGeometry args={[halfW - config.windowW / 2, roomH, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      <mesh position={[config.windowW / 2 + (halfW - config.windowW / 2) / 2, roomH / 2, -halfD]} receiveShadow castShadow>
        <boxGeometry args={[halfW - config.windowW / 2, roomH, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      {/* цонхны дээд хэсэг */}
      <mesh position={[0, (windowTop + roomH) / 2, -halfD]} receiveShadow castShadow>
        <boxGeometry args={[config.windowW, roomH - windowTop, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      {/* цонхны доод хэсэг */}
      <mesh position={[0, windowBottom / 2, -halfD]} receiveShadow castShadow>
        <boxGeometry args={[config.windowW, windowBottom, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>

      {/* хажуу хана */}
      <mesh position={[-halfW, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColorDark} roughness={0.94} />
      </mesh>
      <mesh position={[halfW, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColorDark} roughness={0.94} />
      </mesh>

      {/* хавтан (молдинг) */}
      {room.moulding && (
        <>
          <mesh position={[0, roomH - 0.09, -halfD + 0.07]}>
            <boxGeometry args={[roomW, 0.12, 0.05]} />
            <meshStandardMaterial color={room.trim} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.06, -halfD + 0.07]}>
            <boxGeometry args={[roomW, 0.12, 0.05]} />
            <meshStandardMaterial color={room.trim} roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.02, -halfD + 0.065]}>
            <boxGeometry args={[roomW, 0.045, 0.02]} />
            <meshStandardMaterial color={room.trim} roughness={0.8} />
          </mesh>
        </>
      )}

      {/* ---------------- цонх ---------------- */}
      <mesh position={[0, windowBottom + config.windowH / 2, -halfD - 0.12]}>
        <planeGeometry args={[config.windowW, config.windowH]} />
        <meshBasicMaterial color={config.lighting === "night" ? "#26303C" : "#FDF6E8"} />
      </mesh>
      <mesh position={[0, windowBottom + config.windowH / 2, -halfD - 0.02]}>
        <planeGeometry args={[config.windowW - 0.04, config.windowH - 0.04]} />
        <meshPhysicalMaterial
          color="#EDF2F4"
          transparent
          opacity={0.10}
          roughness={0.08}
          metalness={0}
          transmission={0.55}
          thickness={0.02}
        />
      </mesh>

      {/* хүрээ */}
      <group position={[0, windowBottom + config.windowH / 2, -halfD]}>
        {[
          [windowLeft, 0, 0.05, config.windowH + 0.1],
          [windowRight, 0, 0.05, config.windowH + 0.1],
        ].map(([x, y, w, h], i) => (
          <mesh key={`v${i}`} position={[x, y as number, 0]} castShadow>
            <boxGeometry args={[w, h, 0.11]} />
            <meshStandardMaterial color={room.trim} roughness={0.45} />
          </mesh>
        ))}
        {[-config.windowH / 2, config.windowH / 2].map((y, i) => (
          <mesh key={`h${i}`} position={[0, y, 0]} castShadow>
            <boxGeometry args={[config.windowW + 0.1, 0.05, 0.11]} />
            <meshStandardMaterial color={room.trim} roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.035, config.windowH, 0.09]} />
          <meshStandardMaterial color={room.trim} roughness={0.45} />
        </mesh>
        <mesh position={[0, config.windowH / 2 - 0.02, 0]}>
          <boxGeometry args={[config.windowW, 0.035, 0.09]} />
          <meshStandardMaterial color={room.trim} roughness={0.45} />
        </mesh>
        {/* цонхны тавцан */}
        <mesh position={[0, -config.windowH / 2 - 0.03, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[config.windowW + 0.18, 0.045, 0.24]} />
          <meshStandardMaterial color={room.trim} roughness={0.5} />
        </mesh>
      </group>

      {/* ---------------- хөшиг ---------------- */}
      {showSheer && (
        <>
          <Curtain
            width={span * 1.02}
            height={curtainHeight + 0.02}
            styleKey={isDouble ? "wave" : "sheer"}
            fabric="sheer"
            color={config.sheerColor}
            position={[0, railY - curtainHeight / 2, curtainZ - 0.05]}
            layer="sheer"
            side="center"
          />
        </>
      )}

      {config.panels >= 1 && (
        <>
          <Curtain
            width={panelWidth}
            height={curtainHeight}
            styleKey={config.styleKey}
            fabric={config.fabric}
            color={config.color}
            position={[-panelX, railY - curtainHeight / 2 - 0.005, curtainZ]}
            side="left"
          />
          {config.panels >= 2 && (
            <Curtain
              width={panelWidth}
              height={curtainHeight}
              styleKey={config.styleKey}
              fabric={config.fabric}
              color={config.color}
              position={[panelX, railY - curtainHeight / 2 - 0.005, curtainZ + 0.012]}
              side="right"
            />
          )}
        </>
      )}

      {/* хөшигний зам */}
      <group position={[0, railY + 0.03, curtainZ]}>
        <mesh castShadow>
          <boxGeometry args={[span + 0.2, 0.045, 0.07]} />
          <meshStandardMaterial color={config.lighting === "night" ? "#5B5A56" : "#7C7A74"} roughness={0.34} metalness={0.55} />
        </mesh>
        {(style.key === "eyelet" || style.key === "wave") && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const x = -span / 2 + 0.06 + (i * (span - 0.02)) / 11;
              return (
                <mesh key={i} position={[x, -0.03, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.018, 0.005, 6, 12]} />
                  <meshStandardMaterial color="#8C8781" roughness={0.3} metalness={0.7} />
                </mesh>
              );
            })}
          </>
        )}
      </group>

      {/* ---------------- тавилга ---------------- */}
      <group position={[-1.55, 0, 1.15]} rotation={[0, 0.34, 0]}>
        <RoundedBox args={[2.1, 0.24, 0.92]} radius={0.04} smoothness={3} position={[0, 0.36, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={config.furnitureColor} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[2.1, 0.62, 0.2]} radius={0.05} smoothness={3} position={[0, 0.68, -0.36]} castShadow>
          <meshStandardMaterial color={config.furnitureColor} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.96, 0.18, 0.72]} radius={0.05} smoothness={3} position={[-0.5, 0.56, 0.04]} castShadow>
          <meshStandardMaterial color={room.furnitureAlt} roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.96, 0.18, 0.72]} radius={0.05} smoothness={3} position={[0.5, 0.56, 0.04]} castShadow>
          <meshStandardMaterial color={room.furnitureAlt} roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.2, 0.44, 0.86]} radius={0.05} smoothness={3} position={[-1.05, 0.52, 0]} castShadow>
          <meshStandardMaterial color={config.furnitureColor} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.2, 0.44, 0.86]} radius={0.05} smoothness={3} position={[1.05, 0.52, 0]} castShadow>
          <meshStandardMaterial color={config.furnitureColor} roughness={0.85} />
        </RoundedBox>
        {[
          [-0.92, 0.12, 0.36],
          [0.92, 0.12, 0.36],
          [-0.92, 0.12, -0.34],
          [0.92, 0.12, -0.34],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.028, 0.022, 0.24, 8]} />
            <meshStandardMaterial color="#4A3B2C" roughness={0.6} />
          </mesh>
        ))}
        {/* дэр */}
        <RoundedBox args={[0.34, 0.34, 0.12]} radius={0.07} smoothness={3} position={[-0.62, 0.72, -0.2]} rotation={[0.25, 0.1, 0.15]} castShadow>
          <meshStandardMaterial color={room.accent} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.34, 0.34, 0.12]} radius={0.07} smoothness={3} position={[0.56, 0.72, -0.2]} rotation={[0.25, -0.1, -0.15]} castShadow>
          <meshStandardMaterial color={room.rug} roughness={0.95} />
        </RoundedBox>
      </group>

      {/* кофе ширээ */}
      <group position={[-0.15, 0, 0.35]}>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.46, 0.46, 0.05, 32]} />
          <meshStandardMaterial color={config.floorType === "stone" ? "#DAD4CA" : "#8A6642"} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 0.36, 20]} />
          <meshStandardMaterial color="#4A3B2C" roughness={0.5} />
        </mesh>
      </group>

      {/* хивс */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.006, 0.85]} receiveShadow>
        <planeGeometry args={[2.7, 2.1]} />
        <meshStandardMaterial color={room.rug} roughness={1} />
      </mesh>

      {/* кашпо */}
      <group position={[halfW - 0.55, 0, -0.6]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.13, 0.44, 20]} />
          <meshStandardMaterial color="#B9A88C" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#7C8771" roughness={0.95} />
        </mesh>
        <mesh position={[0.16, 0.98, 0.04]} castShadow>
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshStandardMaterial color="#8D9884" roughness={0.95} />
        </mesh>
        <mesh position={[-0.16, 0.96, -0.02]} castShadow>
          <sphereGeometry args={[0.17, 14, 14]} />
          <meshStandardMaterial color="#6E7A63" roughness={0.95} />
        </mesh>
      </group>

      {/* шалавч */}
      <group position={[-halfW + 0.5, 0, -0.4]}>
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.03, 20]} />
          <meshStandardMaterial color="#585450" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 10]} />
          <meshStandardMaterial color="#585450" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.62, 0]} castShadow>
          <coneGeometry args={[0.21, 0.28, 20, 1, true]} />
          <meshStandardMaterial
            color="#EFE3CE"
            emissive="#FFD9A0"
            emissiveIntensity={config.lighting === "night" || config.lighting === "evening" ? 1.4 : 0.12}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* хананы чимэглэл */}
      <group position={[halfW - 0.06, 1.75, 0.25]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.92, 1.12, 0.04]} />
          <meshStandardMaterial color={room.trim} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.76, 0.96]} />
          <meshStandardMaterial color={room.wallAlt} roughness={0.95} />
        </mesh>
      </group>

      {/* хажуугийн ширээ */}
      <group position={[halfW - 0.7, 0, 1.4]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.05, 0.62]} />
          <meshStandardMaterial color="#8A6642" roughness={0.6} />
        </mesh>
        {[
          [-0.26, -0.26],
          [0.26, -0.26],
          [-0.26, 0.26],
          [0.26, 0.26],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.48, 8]} />
            <meshStandardMaterial color="#4A3B2C" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </>
  );
}
