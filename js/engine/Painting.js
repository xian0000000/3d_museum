/**
 * Painting.js — Membuat bingkai lukisan 3D di dinding museum.
 *
 * Semua tipe yang punya field `png` akan memuat PNG terlebih dahulu.
 * Jika file PNG tidak ditemukan → fallback ke canvas texture otomatis.
 *
 * Cara tambah jenis baru:
 *   1. Tambah flag (misal isPortfolio:true) + png:"nama.png" di exhibits.js
 *   2. Tambah entry di EXHIBIT_STYLES di InfoPanel.js
 *   3. Tidak perlu ubah Painting.js sama sekali!
 *
 * Dependensi: THREE (global), Materials, TextureFactory
 */

import { Materials }      from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

/**
 * Map flag → fungsi fallback canvas (jika PNG tidak tersedia).
 * Key = nama property di data exhibit.
 */
const FALLBACK_FN = {
  isLifeDashboard: () => TextureFactory.lifeDashboard(),
  isStatistic:     () => TextureFactory.statistic(),
  isLibrary:       () => TextureFactory.library(),
  isChatOcean:     () => TextureFactory.painting(["#007bff","#003366","#001133"]),
  isGallery:       (data) => TextureFactory.galleryPlaceholder(data.galleryIdx || 1),
};

/**
 * Muat PNG dengan fallback ke canvas texture.
 * Mengembalikan THREE.Texture langsung (async load, material update otomatis).
 */
function loadPng(pngFile, fallbackFn) {
  // Buat canvas placeholder dulu agar material langsung ada
  const fallbackTex = fallbackFn();

  // Coba load PNG — jika sukses replace texture di material
  const loader = new THREE.TextureLoader();
  loader.load(
    pngFile,
    (t) => {
      t.encoding = THREE.sRGBEncoding;
      // Ganti map material yang sudah dibuat
      if (fallbackTex._materialRef) {
        fallbackTex._materialRef.map = t;
        fallbackTex._materialRef.needsUpdate = true;
      }
    },
    undefined,
    () => { /* PNG tidak ada → tetap pakai fallback canvas, tidak ada error */ },
  );

  return fallbackTex;
}

/**
 * Buat satu lukisan dan tambahkan ke scene.
 *
 * @param {THREE.Scene}   scene
 * @param {object}        data    – dari EXHIBITS
 * @param {THREE.Vector3} pos
 * @param {number}        rotY
 * @param {number}        [w=3.0]
 * @param {number}        [h=2.2]
 */
export function createPainting(scene, data, pos, rotY, w = 3.0, h = 2.2) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);
  group.rotation.y = rotY;

  // ── Frame luar emas ──────────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.20, h + 0.20, 0.09), mat.gold));

  // ── Frame dalam emas gelap ───────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.10), mat.darkGold));

  // ── Pilih / muat tekstur ─────────────────────────────────
  let tex;

  if (data.png) {
    // Ada field `png` → coba muat PNG, fallback ke canvas
    const flagKey  = Object.keys(FALLBACK_FN).find(k => data[k]);
    const fallback = flagKey
      ? () => FALLBACK_FN[flagKey](data)
      : () => TextureFactory.painting(data.colors);

    tex = loadPng(data.png, fallback);
  } else {
    // Tidak ada PNG → canvas prosedural biasa
    tex = TextureFactory.painting(data.colors);
  }

  // ── Canvas mesh ──────────────────────────────────────────
  const canvasMat = new THREE.MeshLambertMaterial({ map: tex });
  tex._materialRef = canvasMat;   // simpan referensi untuk swap async

  const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), canvasMat);
  canvasMesh.position.z = 0.065;
  group.add(canvasMesh);

  // ── Plakat emas bawah ────────────────────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(w * 0.45, 1.2), 0.06, 0.045), mat.gold);
  plaque.position.set(0, -(h / 2 + 0.20), 0.04);
  group.add(plaque);

  // ── Picture light (lokal +z = ke dalam ruangan) ──────────
  const light = new THREE.PointLight(0xfff4d0, 1.0, 5.0);
  light.position.set(0, h * 0.3, 1.4);
  group.add(light);

  scene.add(group);

  return {
    position: pos.clone().setY(1.7),
    radius:   Math.max(w, 2.2),   // radius proporsional: bingkai kecil = radius kecil
    data,
  };
}
