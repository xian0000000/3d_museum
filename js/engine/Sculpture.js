/**
 * Sculpture.js — Kubus 3D di atas pedestal museum.
 *
 * Setiap kubus: pedestal → ring emas → kubah kaca → BoxGeometry dengan
 * canvas texture (icon + label) di semua 6 sisi.
 *
 * Tambah bentuk baru? Cukup tambah data di exhibits.js — shape tidak
 * dipakai lagi, semua patung kini kubus berputar.
 *
 * Dependensi: THREE (global), Materials, TextureFactory
 */

import { Materials }      from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

export function createSculpture(scene, data, pos) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);

  // ── Pedestal silinder ─────────────────────────────────────
  const ped = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.50, 1.0, 20), mat.pedestal);
  ped.position.y = 0.5; group.add(ped);

  // ── Ring emas atas & bawah ────────────────────────────────
  const rg   = new THREE.CylinderGeometry(0.50, 0.50, 0.055, 20);
  const rTop = new THREE.Mesh(rg,         mat.gold); rTop.position.y = 1.025; group.add(rTop);
  const rBot = new THREE.Mesh(rg.clone(), mat.gold); rBot.position.y = 0.028; group.add(rBot);

  // ── Kubah kaca ────────────────────────────────────────────
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.54, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat.glass);
  dome.position.y = 1.055; group.add(dome);

  // ── Kubus dengan canvas texture ──────────────────────────
  const faceTex  = TextureFactory.cubeFace(
    (data.title || "").toUpperCase(),
    data.icon  || "?",
    data.bg    || "#0e0a04",
    data.accent|| "#c8a050",
  );
  const cubeMat  = new THREE.MeshLambertMaterial({ map: faceTex });
  const cube     = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), cubeMat);
  cube.position.y = 1.65;
  group.add(cube);

  // ── Spotlight pedestal ────────────────────────────────────
  const pl = new THREE.PointLight(0xfff8d0, 0.75, 4.5);
  pl.position.set(0, 4.8, 0); group.add(pl);

  scene.add(group);

  return {
    mesh:     cube,
    group,
    position: pos.clone().setY(1.7),
    radius:   2.5,
    data,
  };
}
