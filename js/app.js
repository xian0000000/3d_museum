/**
 * app.js — Entry point utama Museum 3D.
 *
 * Orkestrasi semua modul: scene, kamera, renderer, kontrol, dan game loop.
 * File ini hanya bertanggung jawab atas inisialisasi dan loop — logika
 * domain ada di modul masing-masing.
 *
 * Dependensi: THREE (global via CDN)
 */

import { EXHIBITS }          from "./data/exhibits.js";
import { buildMuseum, ROOM }  from "./engine/Museum.js";
import { buildLighting }      from "./engine/Lighting.js";
import { createPainting }     from "./engine/Painting.js";
import { createSculpture }    from "./engine/Sculpture.js";
import { createWelcomeBoard } from "./engine/WelcomeBoard.js";
import { InfoPanel }          from "./ui/InfoPanel.js";
import { DragControls }       from "./ui/DragControls.js";
import { runLoadingScreen }   from "./ui/LoadingScreen.js";

// ─────────────────────────────────────────────────────────────────────────────
//  Konstanta layout — sesuaikan posisi lukisan di sini jika perlu
// ─────────────────────────────────────────────────────────────────────────────

/** Koordinat patung di lantai museum */
const SCULPTURE_POSITIONS = [
  new THREE.Vector3(-3.5, 0, -3),
  new THREE.Vector3( 3.5, 0, -3),
  new THREE.Vector3( 0,   0,  4),
];

/** Label zona ruangan berdasarkan posisi Z kamera */
function getRoomLabel(z) {
  if (z < -6) return "Galeri Utara — Lukisan";
  if (z >  6) return "Galeri Selatan — Lukisan";
  return "Aula Tengah — Patung";
}

// ─────────────────────────────────────────────────────────────────────────────
//  MuseumApp
// ─────────────────────────────────────────────────────────────────────────────

class MuseumApp {
  constructor() {
    this._exhibits  = [];  // { position, radius, data }
    this._sculptures = []; // THREE.Mesh – untuk animasi rotasi
    this._clock     = new THREE.Clock();
    this._rlNameEl  = document.getElementById("rl-name");
  }

  // ── Inisialisasi ──────────────────────────────────────────────

  _initRenderer() {
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this._renderer.setSize(innerWidth, innerHeight);
    this._renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

  _initScene() {
    this._scene = new THREE.Scene();
    this._scene.fog        = new THREE.FogExp2(0x100c08, 0.028);
    this._scene.background = new THREE.Color(0x100c08);
  }

  _initCamera() {
    this._camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 60);
    this._camera.position.set(0, 1.7, 7);
  }

  _initResize() {
    window.addEventListener("resize", () => {
      this._camera.aspect = innerWidth / innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(innerWidth, innerHeight);
    });
  }

  // ── Penyusunan Pameran ─────────────────────────────────────────

  _buildExhibits() {
    const { W, D } = ROOM;
    const scene    = this._scene;

    const paintings  = EXHIBITS.filter((e) => e.type === "painting");
    const sculptures = EXHIBITS.filter((e) => e.type === "sculpture");

    // Dinding Utara — 3 lukisan
    paintings.slice(0, 3).forEach((data, i) => {
      this._exhibits.push(
        createPainting(scene, data,
          new THREE.Vector3([-6, 0, 6][i], 2.8, -D / 2 + 0.35),
          0, 3.4, 2.4),
      );
    });

    // Dinding Timur — 2 lukisan
    paintings.slice(3, 5).forEach((data, i) => {
      this._exhibits.push(
        createPainting(scene, data,
          new THREE.Vector3(W / 2 - 0.35, 2.9, [-6, 2][i]),
          -Math.PI / 2, 3.0, 2.2),
      );
    });

    // Dinding Barat — 2 lukisan
    paintings.slice(5, 7).forEach((data, i) => {
      this._exhibits.push(
        createPainting(scene, data,
          new THREE.Vector3(-W / 2 + 0.35, 2.9, [-6, 2][i]),
          Math.PI / 2, 3.0, 2.2),
      );
    });

    // Dinding Selatan — 2 lukisan
    paintings.slice(7, 9).forEach((data, i) => {
      this._exhibits.push(
        createPainting(scene, data,
          new THREE.Vector3([-5, 5][i], 2.8, D / 2 - 0.35),
          Math.PI, 3.0, 2.2),
      );
    });

    // Papan selamat datang — di dekat pintu masuk (selatan, hadap ke dalam)
    createWelcomeBoard(scene, { x: 0, z: D / 2 - 1.8, rotY: Math.PI });

    // Patung di tengah ruangan
    sculptures.forEach((data, i) => {
      const ex = createSculpture(scene, data, SCULPTURE_POSITIONS[i]);
      this._exhibits.push(ex);
      this._sculptures.push(ex.mesh);
    });
  }

  // ── Welcome hint ───────────────────────────────────────────────

  _initHint() {
    const hint = document.getElementById("hint");
    const dismiss = () => hint.classList.add("off");
    document.getElementById("enter-btn").addEventListener("click", dismiss);
    this._renderer.domElement.addEventListener("mousedown", dismiss);
    this._renderer.domElement.addEventListener("touchstart", dismiss, { passive: true });
  }

  // ── Game Loop ──────────────────────────────────────────────────

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta();
    const t  = this._clock.elapsedTime;

    this._controls.update(dt);
    this._rlNameEl.textContent = getRoomLabel(this._camera.position.z);
    this._infoPanel.update(this._camera.position, this._exhibits);

    // Animasi rotasi patung
    this._sculptures.forEach((mesh, i) => {
      mesh.rotation.y = t * (0.24 + i * 0.07);
    });

    this._renderer.render(this._scene, this._camera);
  }

  // ── Start ──────────────────────────────────────────────────────

  async start() {
    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initResize();

    buildMuseum(this._scene);
    buildLighting(this._scene);
    this._buildExhibits();

    this._infoPanel = new InfoPanel();
    this._controls  = new DragControls(this._camera, this._renderer.domElement, ROOM);

    this._initHint();

    await runLoadingScreen();
    this._loop();
  }
}

// ── Jalankan aplikasi ────────────────────────────────────────────
new MuseumApp().start();
