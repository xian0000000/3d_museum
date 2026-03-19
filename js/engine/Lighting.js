/**
 * Lighting.js — Sistem pencahayaan museum tiga zona.
 *
 * Zona:
 *   - Galeri Utara  (z < -5) : cahaya hangat lebih terang
 *   - Aula Tengah   (-5..+5) : cahaya netral medium
 *   - Galeri Selatan (z > +5) : cahaya sedikit lebih dingin (lobby)
 *
 * Dependensi: THREE (global)
 */

import { ROOM } from "./Museum.js";

const H = ROOM.H;   // 5.5

export function buildLighting(scene) {
  // ── Ambient — cahaya dasar hangat seperti torchlight museum ──
  scene.add(new THREE.AmbientLight(0x2e2010, 0.9));

  // ── Bohlam geometry (shared) ──────────────────────────────────
  const bulbGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe8aa });

  function addCeilingLight(x, z, intensity = 0.5, color = 0xfff0cc, radius = 14) {
    const pt = new THREE.PointLight(color, intensity, radius);
    pt.position.set(x, H - 0.28, z);
    scene.add(pt);
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.copy(pt.position);
    scene.add(bulb);
  }

  // ── Galeri Utara — 4 lampu (2 baris × 2 kolom) ───────────────
  [[-5.5, -11], [5.5, -11],
   [-5.5, -7 ], [5.5, -7 ]
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.52, 0xfff2d0, 12));

  // ── Aula Tengah — 4 lampu simetris mengelilingi patung ────────
  [[-5.5, -3], [5.5, -3],
   [-5.5,  3], [5.5,  3]
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.45, 0xffe8c0, 13));

  // ── Galeri Selatan — 4 lampu (termasuk area lobby) ───────────
  [[-5.5,  8], [5.5,  8],
   [-5.5, 11], [5.5, 11]
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.48, 0xffeedd, 13));

  // ── Lampu pojok — mengisi area gelap di sisi timur/barat ──────
  [
    [-9.5, -10, 0.3], [9.5, -10, 0.3],
    [-9.5,   0, 0.3], [9.5,   0, 0.3],
    [-9.5,  10, 0.3], [9.5,  10, 0.3],
  ].forEach(([x, z, i]) => addCeilingLight(x, z, i, 0xffeedd, 10));
}
