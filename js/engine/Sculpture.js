/**
 * Sculpture.js — Membuat patung 3D di atas pedestal museum.
 *
 * Setiap patung terdiri dari:
 *   - Pedestal silinder dengan ring emas
 *   - Kubah kaca transparan
 *   - Objek patung (bisa torusKnot, sphere, icosahedron, torus)
 *   - Spotlight dari atas
 *
 * Cara menambah bentuk patung baru:
 *   1. Tambahkan key baru ke objek GEOMETRIES di bawah.
 *   2. Gunakan key itu sebagai nilai `shape` di data exhibit.
 *
 * Dependensi: THREE (global), Materials
 */

import { Materials } from "./Materials.js";

/** Peta nama → fungsi pembuat geometri */
const GEOMETRIES = {
  torusKnot:  () => new THREE.TorusKnotGeometry(0.35, 0.12, 96, 14),
  sphere:     () => new THREE.SphereGeometry(0.45, 26, 26),
  icosahedron:() => new THREE.IcosahedronGeometry(0.48, 1),
  torus:      () => new THREE.TorusGeometry(0.36, 0.15, 18, 42),
  // Tambahkan geometri baru di sini ↓
};

/**
 * Buat satu patung dan tambahkan ke scene.
 *
 * @param {THREE.Scene}   scene
 * @param {object}        data  – objek dari EXHIBITS (butuh: color, shape)
 * @param {THREE.Vector3} pos   – posisi di dunia
 * @returns {{ mesh, position, radius, data }}
 */
export function createSculpture(scene, data, pos) {
  const mat = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);

  // ── Pedestal ───────────────────────────────────────────────
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.56, 1, 16),
    mat.pedestal,
  );
  pedestal.position.y = 0.5;
  group.add(pedestal);

  const ringGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.07, 16);
  const ringTop = new THREE.Mesh(ringGeo, mat.gold);
  ringTop.position.y = 1.04;
  group.add(ringTop);

  const ringBot = new THREE.Mesh(ringGeo.clone(), mat.gold);
  ringBot.position.y = 0.035;
  group.add(ringBot);

  // ── Kubah kaca ─────────────────────────────────────────────
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat.glass,
  );
  dome.position.y = 1.08;
  group.add(dome);

  // ── Objek patung ───────────────────────────────────────────
  const geoFn = GEOMETRIES[data.shape] || GEOMETRIES.torus;
  const sculpture = new THREE.Mesh(
    geoFn(),
    new THREE.MeshLambertMaterial({ color: data.color }),
  );
  sculpture.position.y = 1.66;
  group.add(sculpture);

  // ── Spotlight ──────────────────────────────────────────────
  const light = new THREE.PointLight(0xfff0c8, 1.4, 6);
  light.position.set(0, 5, 0);
  group.add(light);

  scene.add(group);

  return {
    mesh: sculpture,
    position: pos.clone().setY(1.7),
    radius: 2.6,
    data,
  };
}
