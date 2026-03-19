/**
 * Lighting.js — Setup pencahayaan museum.
 *
 * Menambahkan ambient light dan point-light di setiap titik lampu langit-langit,
 * lengkap dengan bola kecil yang merepresentasikan bohlam.
 *
 * Dependensi: THREE (global), Museum (untuk tinggi ruangan)
 */

import { ROOM } from "./Museum.js";

/** Pasang semua pencahayaan ke dalam scene */
export function buildLighting(scene) {
  // Ambient cahaya hangat redup
  scene.add(new THREE.AmbientLight(0x3a2e18, 0.7));

  // Geometri & material bohlam (dipakai ulang untuk semua lampu)
  const bulbGeo = new THREE.SphereGeometry(0.11, 6, 6);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0cc });

  // Posisi grid lampu langit-langit
  const lightGrid = [
    [-8, -8], [8, -8],
    [-8,  0], [8,  0],
    [-8,  8], [8,  8],
    [ 0, -8], [0,  8],
    [ 0,  0],
  ];

  lightGrid.forEach(([x, z]) => {
    const light = new THREE.PointLight(0xfff0cc, 0.55, 16);
    light.position.set(x, ROOM.H - 0.3, z);
    scene.add(light);

    // Visual bohlam kecil
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.copy(light.position);
    scene.add(bulb);
  });
}
