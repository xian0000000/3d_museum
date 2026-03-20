/**
 * Painting.js — Membuat bingkai lukisan 3D di dinding museum.
 *
 * Setiap lukisan terdiri dari:
 *   - Frame emas (luar & dalam)
 *   - Canvas lukisan (tekstur procedural atau PNG)
 *   - Plakat nama di bawah
 *   - Picture light di DEPAN lukisan (bukan belakang dinding)
 *
 * BUG FIX: light.position sebelumnya (0, 2.6, -1.3) = menembus ke
 * balik dinding untuk semua orientasi. Sekarang (0, h*0.4, 1.4) =
 * selalu di depan canvas, arah +z lokal = ke dalam ruangan.
 *
 * Dependensi: THREE (global), Materials, TextureFactory
 */

import { Materials }      from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

export function createPainting(scene, data, pos, rotY, w = 3.2, h = 2.2) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);
  group.rotation.y = rotY;

  // ── Frame luar (emas) ────────────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.20, h + 0.20, 0.09),
    mat.gold,
  ));

  // ── Frame dalam (emas gelap) ─────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.10),
    mat.darkGold,
  ));

  // ── Pilih tekstur ────────────────────────────────────────────
  let tex;
  if (data.isLifeDashboard) {
    tex = TextureFactory.lifeDashboard();
  } else if (data.isStatistic) {
    tex = TextureFactory.statistic();
  } else if (data.isLibrary) {
    tex = new THREE.TextureLoader().load(
      "perpuskuno.png",
      (t) => { t.encoding = THREE.sRGBEncoding; },
      undefined,
      () => { tex = TextureFactory.library(); },
    );
  } else if (data.isChatOcean) {
    tex = new THREE.TextureLoader().load(
      "chatocean.png",
      (t) => { t.encoding = THREE.sRGBEncoding; },
    );
  } else {
    tex = TextureFactory.painting(data.colors);
  }

  // ── Canvas lukisan ───────────────────────────────────────────
  const canvas = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshLambertMaterial({ map: tex }),
  );
  canvas.position.z = 0.065;
  group.add(canvas);

  // ── Plakat nama ──────────────────────────────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.06, 0.045),
    mat.gold,
  );
  plaque.position.set(0, -(h / 2 + 0.20), 0.04);
  group.add(plaque);

  // ── Picture light — DEPAN lukisan, lokal +z ──────────────────
  // Penting: posisi dalam lokal-space group.
  // Lokal +z selalu menghadap ke dalam ruangan setelah rotasi Y.
  // Dengan demikian cahaya SELALU menerangi dari depan, tidak pernah tembus dinding.
  const light = new THREE.PointLight(0xfff4d0, 1.1, 5.5);
  light.position.set(0, h * 0.3, 1.4);   // sedikit di atas dan di depan
  group.add(light);

  scene.add(group);

  return {
    position: pos.clone().setY(1.7),
    radius:   3.2,
    data,
  };
}
