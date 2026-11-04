import * as THREE from "three";

type FabricKind = "drape" | "jacquard" | "velvet" | "blackout" | "sheer" | "linen" | "blind";

const cache = new Map<string, { map: THREE.Texture; bump: THREE.Texture }>();

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Даавууны бүтцийг процедураар зурна — гадаад зураг хүлээхгүй.
 * Зургийг саарал өнгөөр гаргаж, материалын өнгөтэй үржүүлнэ.
 */
export function fabricTexture(kind: FabricKind): { map: THREE.Texture; bump: THREE.Texture } {
  const existing = cache.get(kind);
  if (existing) return existing;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rnd = mulberry(kind.length * 7919 + 3);

  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, size, size);

  const line = (x1: number, y1: number, x2: number, y2: number, alpha: number, width = 1) => {
    ctx.strokeStyle = `rgba(${alpha > 0 ? 255 : 0},${alpha > 0 ? 255 : 0},${alpha > 0 ? 255 : 0},${Math.abs(alpha)})`;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  if (kind === "velvet") {
    for (let i = 0; i < 9000; i++) {
      const x = rnd() * size;
      const y = rnd() * size;
      const a = rnd() * 0.16;
      ctx.fillStyle = rnd() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 0.8})`;
      ctx.fillRect(x, y, 1.6, 1.6);
    }
    ctx.filter = "blur(1.2px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";
  } else if (kind === "sheer") {
    for (let x = 0; x < size; x += 4) line(x, 0, x, size, -0.16, 1);
    for (let y = 0; y < size; y += 4) line(0, y, size, y, -0.1, 1);
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.1})`;
      ctx.fillRect(rnd() * size, rnd() * size, 2, 2);
    }
  } else if (kind === "linen") {
    for (let x = 0; x < size; x += 5) line(x, 0, x, size, 0.24, 2);
    for (let y = 0; y < size; y += 5) line(0, y, size, y, -0.14, 2);
    for (let i = 0; i < 1600; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.06})`;
      ctx.fillRect(rnd() * size, rnd() * size, 3, 1);
    }
  } else if (kind === "jacquard") {
    for (let y = 0; y < size; y += 3) line(0, y, size, y, -0.1, 1);
    for (let x = 0; x < size; x += 3) line(x, 0, x, size, 0.14, 1);
    // давталттай хээ
    for (let gy = 0; gy < 4; gy++) {
      for (let gx = 0; gx < 4; gx++) {
        const cx = gx * 128 + 64;
        const cy = gy * 128 + 64;
        for (let k = 0; k < 12; k++) {
          const r = 8 + k * 3.4;
          ctx.strokeStyle = `rgba(255,255,255,${0.14 - k * 0.008})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r, r * 0.62, Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  } else if (kind === "blackout") {
    for (let y = 0; y < size; y += 2) line(0, y, size, y, -0.08, 1);
    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.05})`;
      ctx.fillRect(rnd() * size, rnd() * size, 1, 1);
    }
  } else if (kind === "blind") {
    for (let x = 0; x < size; x += 16) {
      line(x, 0, x, size, 0.2, 1);
      line(x + 8, 0, x + 8, size, -0.12, 1);
    }
  } else {
    // drape — энгийн нэхмэл
    for (let y = 0; y < size; y += 3) line(0, y, size, y, -0.09, 1);
    for (let x = 0; x < size; x += 3) line(x, 0, x, size, 0.11, 1);
    for (let i = 0; i < 2500; i++) {
      ctx.fillStyle = `rgba(0,0,0,${rnd() * 0.05})`;
      ctx.fillRect(rnd() * size, rnd() * size, 2, 2);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 4);
  map.anisotropy = 4;

  const bump = map.clone();
  bump.needsUpdate = true;
  bump.repeat.set(3, 4);

  const result = { map, bump };
  cache.set(kind, result);
  return result;
}

export function floorTexture(kind: "wood" | "stone" | "carpet", base: string): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const rnd = mulberry(kind.length * 131 + 11);

  if (kind === "wood") {
    for (let y = 0; y < size; y += 64) {
      ctx.fillStyle = `rgba(0,0,0,${0.06 + rnd() * 0.05})`;
      ctx.fillRect(0, y, size, 2);
      for (let i = 0; i < 60; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${0.03 + rnd() * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const yy = y + rnd() * 60;
        ctx.moveTo(0, yy);
        ctx.bezierCurveTo(size * 0.3, yy + rnd() * 6, size * 0.6, yy - rnd() * 6, size, yy);
        ctx.stroke();
      }
    }
  } else if (kind === "stone") {
    for (let y = 0; y < size; y += 128) {
      for (let x = 0; x < size; x += 128) {
        ctx.fillStyle = `rgba(${rnd() > 0.5 ? 255 : 0},${rnd() > 0.5 ? 255 : 0},255,${0.03 + rnd() * 0.03})`;
        ctx.fillRect(x, y, 128, 128);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.strokeRect(x + 1, y + 1, 126, 126);
      }
    }
  } else {
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = `rgba(${rnd() > 0.5 ? 255 : 0},${rnd() > 0.5 ? 255 : 0},${rnd() > 0.5 ? 255 : 0},0.05)`;
      ctx.fillRect(rnd() * size, rnd() * size, 2, 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}
