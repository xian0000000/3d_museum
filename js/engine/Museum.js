/**
 * Museum.js — Membangun geometri ruangan (lantai, dinding, langit-langit, pilar, molding).
 *
 * Ekspor:
 *   Museum.ROOM  – { W, D, H } dimensi ruangan dalam unit Three.js
 *   Museum.build(scene) – tambahkan semua mesh ruangan ke scene
 *
 * Dependensi: THREE (global), Materials
 */

import { Materials } from "./Materials.js";

/** Dimensi ruangan — ubah di sini jika perlu memperlebar/memperpanjang */
export const ROOM = { W: 22, D: 28, H: 5.5 };

/** Helper: buat Mesh, posisikan, putar, lalu tambahkan ke scene */
function addMesh(scene, geo, mat, x, y, z, ry = 0) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  scene.add(mesh);
  return mesh;
}

/** Bangun seluruh ruangan museum ke dalam scene */
export function buildMuseum(scene) {
  const mat = Materials.get();
  const { W, D, H } = ROOM;

  // ── Lantai & Langit-langit ──────────────────────────────────
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  scene.add(ceiling);

  // ── Dinding ─────────────────────────────────────────────────
  const wallNS = new THREE.PlaneGeometry(W, H);
  const wallEW = new THREE.PlaneGeometry(D, H);

  addMesh(scene, wallNS,        mat.wall, 0, H / 2, -D / 2);          // Utara
  addMesh(scene, wallNS.clone(), mat.wall, 0, H / 2,  D / 2, Math.PI); // Selatan
  addMesh(scene, wallEW,        mat.wall,  W / 2, H / 2, 0, -Math.PI / 2); // Timur
  addMesh(scene, wallEW.clone(), mat.wall, -W / 2, H / 2, 0,  Math.PI / 2); // Barat

  // ── Pilar ────────────────────────────────────────────────────
  const pillarGeo  = new THREE.BoxGeometry(0.6, H, 0.6);
  const capGeo     = new THREE.BoxGeometry(0.85, 0.16, 0.85);
  const baseGeo    = new THREE.BoxGeometry(0.85, 0.14, 0.85);

  const pillarPositions = [
    [-7, -6], [7, -6], [-7, 0], [7, 0], [-7, 6], [7, 6],
  ];
  pillarPositions.forEach(([x, z]) => {
    addMesh(scene, pillarGeo, mat.wall,  x, H / 2,  z);
    addMesh(scene, capGeo,    mat.gold,  x, H - 0.08, z);
    addMesh(scene, baseGeo,   mat.gold,  x, 0.07,    z);
  });

  // ── Molding (cornice) ────────────────────────────────────────
  const moldW = new THREE.BoxGeometry(W, 0.12, 0.2);
  const moldD = new THREE.BoxGeometry(D, 0.12, 0.2);
  const moldY = H - 0.06;

  // Atas (emas terang)
  addMesh(scene, moldW.clone(), mat.gold,     0, moldY,  -D / 2 + 0.12);
  addMesh(scene, moldW.clone(), mat.gold,     0, moldY,   D / 2 - 0.12);
  addMesh(scene, moldD.clone(), mat.gold, -W / 2 + 0.12, moldY, 0, Math.PI / 2);
  addMesh(scene, moldD.clone(), mat.gold,  W / 2 - 0.12, moldY, 0, Math.PI / 2);

  // Bawah (emas gelap)
  addMesh(scene, moldW.clone(), mat.darkGold,     0, 0.06, -D / 2 + 0.12);
  addMesh(scene, moldW.clone(), mat.darkGold,     0, 0.06,  D / 2 - 0.12);
  addMesh(scene, moldD.clone(), mat.darkGold, -W / 2 + 0.12, 0.06, 0, Math.PI / 2);
  addMesh(scene, moldD.clone(), mat.darkGold,  W / 2 - 0.12, 0.06, 0, Math.PI / 2);
}
