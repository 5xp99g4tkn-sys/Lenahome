"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoomScene, { type SceneConfig } from "./RoomScene";
import { LIGHTING_RIG } from "@/lib/rooms";

export type CameraView = { pos: [number, number, number]; target: [number, number, number] };

export const CAMERA_VIEWS: Record<string, CameraView> = {
  front: { pos: [0, 1.62, 2.55], target: [0, 1.32, -1.6] },
  angle: { pos: [-1.85, 1.68, 2.15], target: [-0.25, 1.28, -1.4] },
  close: { pos: [-0.75, 1.5, 0.75], target: [-0.45, 1.45, -2.6] },
  wide: { pos: [0, 1.95, 3.15], target: [0, 1.1, -1.5] },
};

function CameraRig({ view }: { view: CameraView }) {
  const { camera, controls } = useThree() as unknown as {
    camera: THREE.Camera;
    controls: { target: THREE.Vector3; update: () => void } | null;
  };
  const targetPos = useRef(new THREE.Vector3(...view.pos));
  const targetLook = useRef(new THREE.Vector3(...view.target));

  useEffect(() => {
    targetPos.current.set(...view.pos);
    targetLook.current.set(...view.target);
  }, [view]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 3.2);
    camera.position.lerp(targetPos.current, k);
    if (controls) {
      controls.target.lerp(targetLook.current, k);
      controls.update();
    }
  });
  return null;
}

function CaptureBridge({ onReady }: { onReady: (capture: () => string) => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    onReady(() => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    });
  }, [gl, scene, camera, onReady]);
  return null;
}

export default function StudioCanvas({
  config,
  view,
  onReady,
  onContextError,
}: {
  config: SceneConfig;
  view: CameraView;
  onReady: (capture: () => string) => void;
  onContextError?: () => void;
}) {
  const rig = LIGHTING_RIG[config.lighting];

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: rig.exposure,
      }}
      camera={{ fov: 46, position: view.pos, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMappingExposure = rig.exposure;
      }}
      onError={() => onContextError?.()}
      className="touch-none"
    >
      <Suspense fallback={null}>
        <RoomScene config={config} />
        <CameraRig view={view} />
        <CaptureBridge onReady={onReady} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          minDistance={1.1}
          maxDistance={6.5}
          minPolarAngle={0.55}
          maxPolarAngle={Math.PI / 2 - 0.02}
          minAzimuthAngle={-1.1}
          maxAzimuthAngle={1.1}
          target={[0, 1.35, -1.4]}
        />
      </Suspense>
    </Canvas>
  );
}
