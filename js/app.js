/**
 * app.js — Entry point Museum 3D.
 *
 * ══════════════════════════════════════════════════════════════
 *  DENAH MUSEUM (top-view)
 * ══════════════════════════════════════════════════════════════
 *
 *  z=-14  ╔══[P0]════[P1 BESAR]════[P2]══╗
 *         ║       Galeri Utara            ║
 *  z=-8   ║ (kosong)      P3:ChatOcean   ║
 *         ║  ◻GitHub   ◻LinkedIn         ║
 *  z=-0.5 ║      ◻Music♪                 ║
 *  z=+3   ║ (kosong)      P4:Perpus      ║
 *         ║                              ║
 *  z=+7   ║ [MAP]   G1 G2 G3 ← galeri  ║  ← 3 bingkai kecil atas
 *  z=+9   ║         G4 G5    ← galeri  ║  ← 2 bingkai kecil bawah
 *  z=+11  ║    [WELCOME BOARD]          ║
 *  z=+14  ╚═[P5:LifeDash]══[P6:StatLab]╝
 *
 *  G1-G5 = 5 bingkai galeri foto di dinding timur, zona selatan
 *  Kamera start: (0, 1.7, 10) → menghadap ke selatan (+z)
 * ══════════════════════════════════════════════════════════════
 */

import { EXHIBITS }          from "./data/exhibits.js";
import { buildMuseum, ROOM } from "./engine/Museum.js";
import { buildLighting }     from "./engine/Lighting.js";
import { createPainting }    from "./engine/Painting.js";
import { createSculpture }   from "./engine/Sculpture.js";
import { createWelcomeBoard} from "./engine/WelcomeBoard.js";
import { createMapBoard }    from "./engine/MapBoard.js";
import { MusicVisualizer }   from "./engine/MusicVisualizer.js";
import { InfoPanel }         from "./ui/InfoPanel.js";
import { DragControls }      from "./ui/DragControls.js";
import { runLoadingScreen, preWarmRenderer }  from "./ui/LoadingScreen.js";
import { MusicPlayer }       from "./ui/MusicPlayer.js";

// ─────────────────────────────────────────────────────────────
//  KONSTANTA POSISI
// ─────────────────────────────────────────────────────────────
const { W, D }  = ROOM;                   // W=22, D=28
const FRAME_Y   = 2.65;                   // eye-level bingkai standar
const FRAME_Y_U = 3.30;                   // bingkai kecil baris atas
const FRAME_Y_L = 1.90;                   // bingkai kecil baris bawah
const N_WALL_Z  = -(D / 2) + 0.30;       // z = -13.70
const S_WALL_Z  =  (D / 2) - 0.30;       // z = +13.70
const E_WALL_X  =  (W / 2) - 0.30;       // x = +10.70
const W_WALL_X  = -(W / 2) + 0.30;       // x = -10.70

// ─────────────────────────────────────────────────────────────
//  LAYOUT LUKISAN
//  idx = index di array paintings (filtered dari EXHIBITS)
// ─────────────────────────────────────────────────────────────
const PAINTING_LAYOUT = [

  // ── Dinding Utara ─────────────────────────────────────────
  { idx: 0, pos: [-5.5, FRAME_Y, N_WALL_Z], rotY: 0,           w: 3.0, h: 2.2 },
  { idx: 1, pos: [   0, FRAME_Y, N_WALL_Z], rotY: 0,           w: 3.4, h: 2.4 }, // tengah lebih besar
  { idx: 2, pos: [ 5.5, FRAME_Y, N_WALL_Z], rotY: 0,           w: 3.0, h: 2.2 },

  // ── Dinding Timur — zona utara ────────────────────────────
  { idx: 3, pos: [E_WALL_X, FRAME_Y, -8],   rotY: -Math.PI/2,  w: 3.0, h: 2.2 },
  { idx: 4, pos: [E_WALL_X, FRAME_Y,  3],   rotY: -Math.PI/2,  w: 3.0, h: 2.2 },

  // ── Dinding Barat ─────────────────────────────────────────
  { idx: 5, pos: [W_WALL_X, FRAME_Y, -8],   rotY:  Math.PI/2,  w: 3.0, h: 2.2 },
  { idx: 6, pos: [W_WALL_X, FRAME_Y,  3],   rotY:  Math.PI/2,  w: 3.0, h: 2.2 },

  // ── Dinding Selatan ───────────────────────────────────────
  // (kosong — akan diisi nanti)

  // ── Galeri Foto — dinding Timur, zona selatan ─────────────
  // 5 bingkai kecil: baris atas 3 buah, baris bawah 2 buah (rata tengah)
  // Posisi Z: 7.5 / 9.5 / 11.5 (atas) dan 8.5 / 10.5 (bawah)
  { idx:  7, pos: [E_WALL_X, FRAME_Y_U,  7.5], rotY: -Math.PI/2, w: 1.4, h: 1.0 },
  { idx:  8, pos: [E_WALL_X, FRAME_Y_U,  9.5], rotY: -Math.PI/2, w: 1.4, h: 1.0 },
  { idx:  9, pos: [E_WALL_X, FRAME_Y_U, 11.5], rotY: -Math.PI/2, w: 1.4, h: 1.0 },
  { idx: 10, pos: [E_WALL_X, FRAME_Y_L,  8.5], rotY: -Math.PI/2, w: 1.4, h: 1.0 },
  { idx: 11, pos: [E_WALL_X, FRAME_Y_L, 10.5], rotY: -Math.PI/2, w: 1.4, h: 1.0 },
];

// ─────────────────────────────────────────────────────────────
//  POSISI KUBUS / PATUNG
// ─────────────────────────────────────────────────────────────
const SCULPTURE_POSITIONS = [
  new THREE.Vector3(-3.5, 0, -4.0),  // GitHub
  new THREE.Vector3( 3.5, 0, -4.0),  // LinkedIn
  new THREE.Vector3(   0, 0, -0.5),  // Music
  new THREE.Vector3(-5.0, 0, 11.0),  // Availability
  new THREE.Vector3( 5.0, 0, 11.0),  // Tech Stack
];

function getRoomLabel(z) {
  if (z < -5.5) return "Galeri Utara — Lukisan Seni";
  if (z <  5.5) return "Aula Tengah — Kubus Interaktif";
  return "Galeri Selatan — Proyek Digital";
}

// ─────────────────────────────────────────────────────────────
//  MuseumApp
// ─────────────────────────────────────────────────────────────
class MuseumApp {
  constructor() {
    this._exhibits    = [];
    this._sculptures  = [];
    this._clock       = new THREE.Clock();
    this._rlNameEl    = document.getElementById("rl-name");
    this._musicViz    = null;
    this._musicPlayer = null;
  }

  _initRenderer() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

    this._renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: "high-performance",
      precision: isMobile ? "mediump" : "highp",
    });
    this._renderer.setSize(innerWidth, innerHeight);
    // Mobile: cap pixel ratio di 1 agar tidak render resolusi terlalu tinggi
    this._renderer.setPixelRatio(isMobile ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 1.5));
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

  _initScene() {
    this._scene = new THREE.Scene();
    this._scene.fog        = new THREE.FogExp2(0x0d0a06, 0.018);
    this._scene.background = new THREE.Color(0x0d0a06);
  }

  _initCamera() {
    this._camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 60);
    this._camera.position.set(0, 1.7, 10);
  }

  _initResize() {
    window.addEventListener("resize", () => {
      this._camera.aspect = innerWidth / innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(innerWidth, innerHeight);
    });
  }

  _buildExhibits() {
    const scene     = this._scene;
    const paintings  = EXHIBITS.filter(e => e.type === "painting");
    const sculptures = EXHIBITS.filter(e => e.type === "sculpture");

    // Lukisan
    PAINTING_LAYOUT.forEach(({ idx, pos, rotY, w, h }) => {
      const data = paintings[idx];
      if (!data) return;
      this._exhibits.push(
        createPainting(scene, data, new THREE.Vector3(...pos), rotY, w, h)
      );
    });

    // Papan sambutan (lobby selatan, hadap ke utara)
    createWelcomeBoard(scene, { x: 0, z: 11.5, rotY: Math.PI });

    // Papan denah (dinding barat, zona selatan)
    createMapBoard(scene, { x: W_WALL_X, y: FRAME_Y, z: 9.0, rotY: Math.PI / 2 });

    // Kubus / patung
    sculptures.forEach((data, i) => {
      const ex = createSculpture(scene, data, SCULPTURE_POSITIONS[i]);
      this._exhibits.push(ex);
      this._sculptures.push(ex.mesh);
    });

    // Music visualizer di posisi kubus musik
    this._musicViz = new MusicVisualizer(scene, SCULPTURE_POSITIONS[2]);
  }

  _initMusic() {
    this._musicPlayer = new MusicPlayer("5uDY6hEYfPc");

    this._musicPlayer.onStateChange((playing) => {
      this._musicViz.setPlaying(playing);
      const badge = document.getElementById("now-playing");
      if (badge) badge.style.display = playing ? "flex" : "none";
      document.dispatchEvent(new CustomEvent("museum:music-state", { detail: { playing } }));
    });

    document.addEventListener("museum:music-toggle", () => {
      this._musicPlayer.toggle();
    });
  }

  _initHint() {
    const hint    = document.getElementById("hint");
    const dismiss = () => { hint.classList.add("off"); };
    document.getElementById("enter-btn").addEventListener("click", dismiss);
    this._renderer.domElement.addEventListener("mousedown",  dismiss);
    this._renderer.domElement.addEventListener("touchstart", dismiss, { passive: true });
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta();
    const t  = this._clock.elapsedTime;

    this._controls.update(dt);
    this._rlNameEl.textContent = getRoomLabel(this._camera.position.z);
    this._infoPanel.update(this._camera.position, this._exhibits);

    // Kubus berputar multi-sumbu (dinamis untuk semua patung)
    const rotY = [0.008, 0.006, 0.010, 0.007, 0.009];
    const rotX = [0.003, 0.004, 0.002, 0.004, 0.003];
    const bobF = [0.85,  0.75,  0.70,  0.80,  0.78 ];
    this._sculptures.forEach((mesh, i) => {
      mesh.rotation.y += rotY[i] ?? 0.008;
      mesh.rotation.x += rotX[i] ?? 0.003;
      mesh.position.y  = 1.65 + Math.sin(t * (bobF[i] ?? 0.80) + i * 1.5) * 0.055;
    });

    if (this._musicViz) this._musicViz.update(t);

    this._renderer.render(this._scene, this._camera);
  }

  async start() {
    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initResize();

    buildMuseum(this._scene);
    buildLighting(this._scene);
    this._buildExhibits();
    this._initMusic();

    this._infoPanel = new InfoPanel();
    this._controls  = new DragControls(this._camera, this._renderer.domElement, ROOM);

    this._initHint();

    // Pre-warm: compile shader & upload texture ke GPU sebelum user masuk
    await preWarmRenderer(this._renderer, this._scene, this._camera);
    await runLoadingScreen();
    this._loop();
  }
}

new MuseumApp().start();
