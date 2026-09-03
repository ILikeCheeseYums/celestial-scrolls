import * as THREE from "three";

/** Banded + speckled procedural texture so planets never read as flat spheres. */
export function makePlanetTexture(base: string, dark: string, bands = 7): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // horizontal bands
  for (let i = 0; i < bands; i++) {
    const y = (i / bands) * size + Math.random() * 12;
    const h = size / bands / (1.4 + Math.random());
    ctx.globalAlpha = 0.12 + Math.random() * 0.22;
    ctx.fillStyle = i % 2 === 0 ? dark : "#ffffff";
    ctx.fillRect(0, y, size, h);
  }

  // speckle / craters
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 900; i++) {
    const r = Math.random() * 5 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? dark : "#ffffff";
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}
