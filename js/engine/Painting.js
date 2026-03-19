/**
 * Painting.js — Membuat bingkai lukisan 3D di dinding museum.
 *
 * Setiap lukisan terdiri dari:
 *   - Frame emas (luar & dalam)
 *   - Canvas lukisan (tekstur procedural atau PNG)
 *   - Plakat nama di bawah
 *   - Spotlight kecil yang menerangi lukisan
 *
 * Cara menambah jenis lukisan baru (misal isPortfolio):
 *   1. Tambahkan kondisi baru di blok "Pilih tekstur" di bawah.
 *   2. Tambahkan TextureFactory.namaFungsi() di TextureFactory.js.
 *   3. Tambahkan handling info di InfoPanel.js.
 *
 * Dependensi: THREE (global), Materials, TextureFactory
 */

import { Materials } from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

/**
 * Buat satu lukisan dan tambahkan ke scene.
 *
 * @param {THREE.Scene} scene
 * @param {object}      data   – objek dari EXHIBITS
 * @param {THREE.Vector3} pos  – posisi di dunia
 * @param {number}      rotY   – rotasi Y (radian)
 * @param {number}      [w=3.4] – lebar kanvas
 * @param {number}      [h=2.4] – tinggi kanvas
 * @returns {{ position, radius, data }} – dipakai InfoPanel untuk deteksi kedekatan
 */
export function createPainting(scene, data, pos, rotY, w = 3.4, h = 2.4) {
  const mat = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);
  group.rotation.y = rotY;

  // ── Frame luar (emas) ──────────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.22, h + 0.22, 0.10),
    mat.gold,
  ));

  // ── Frame dalam (emas gelap) ───────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.06, h + 0.06, 0.11),
    mat.darkGold,
  ));

  // ── Pilih tekstur ──────────────────────────────────────────
  let paintingTex;

  if (data.isStatistic) {
    paintingTex = TextureFactory.statistic();

  } else if (data.isLibrary) {
    // Coba muat PNG; jika gagal fallback ke canvas
    paintingTex = new THREE.TextureLoader().load(
      "perpuskuno.png",
      (t) => { t.encoding = THREE.sRGBEncoding; },
      undefined,
      () => { paintingTex = TextureFactory.library(); },
    );

  } else if (data.isChatOcean) {
    paintingTex = new THREE.TextureLoader().load(
      "chatocean.png",
      (t) => { t.encoding = THREE.sRGBEncoding; },
    );

  } else {
    paintingTex = TextureFactory.painting(data.colors);
  }

  // ── Canvas lukisan ─────────────────────────────────────────
  const canvas = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshLambertMaterial({ map: paintingTex }),
  );
  canvas.position.z = 0.07;
  group.add(canvas);

  // ── Plakat nama ────────────────────────────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.07, 0.05),
    mat.gold,
  );
  plaque.position.set(0, -(h / 2 + 0.24), 0.04);
  group.add(plaque);

  // ── Spotlight ──────────────────────────────────────────────
  const spotlight = new THREE.PointLight(0xfff4d8, 1.0, 6);
  spotlight.position.set(0, 2.6, -1.3);
  group.add(spotlight);

  scene.add(group);

  // Kembalikan metadata untuk InfoPanel
  return {
    position: pos.clone().setY(1.7),
    radius: 3.0,
    data,
  };
}
