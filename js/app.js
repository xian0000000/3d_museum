/**
 * app.js — Entry point Museum 3D.
 *
 * ══════════════════════════════════════════════════════
 *  DENAH (top-view, z ke bawah = selatan)
 * ══════════════════════════════════════════════════════
 *
 *  z=-14  ╔══[P0]══[   P1   ]══[P2]══╗
 *         ║  Galeri Utara             ║
 *  z=-8   ║ P5 (Barat)   P3 (Timur)  ║
 *         ║   ◻ GitHub  LinkedIn ◻   ║  ← kubus kiri-utara & kanan-utara
 *  z=-0.5 ║       ◻ Music ♪          ║  ← kubus musik + visualizer
 *  z=+3   ║ P6 (Barat)   P4 (Timur)  ║
 *  z=+9   ║  [MAP]                   ║
 *  z=+11  ║     [WELCOME]            ║
 *  z=+14  ╚═[P7]════════════[P8]═════╝
 *
 *  Kamera start: (0, 1.7, 10) menghadap +z (selatan)
 * ══════════════════════════════════════════════════════
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
import { runLoadingScreen } from "./ui/LoadingScreen.js";
import { MusicPlayer }       from "./ui/MusicPlayer.js";

// ── Konstanta layout ──────────────────────────────────────────
const { W, D }  = ROOM;
const FRAME_Y   = 2.65;
const N_WALL_Z  = -(D/2) + 0.30;
const S_WALL_Z  =  (D/2) - 0.30;
const E_WALL_X  =  (W/2) - 0.30;
const W_WALL_X  = -(W/2) + 0.30;

// ── Posisi lukisan ────────────────────────────────────────────
const PAINTING_LAYOUT = [
  { idx:0, pos:[-5.5, FRAME_Y, N_WALL_Z], rotY:0,            w:3.0, h:2.2 },
  { idx:1, pos:[   0, FRAME_Y, N_WALL_Z], rotY:0,            w:3.4, h:2.4 },
  { idx:2, pos:[ 5.5, FRAME_Y, N_WALL_Z], rotY:0,            w:3.0, h:2.2 },
  { idx:3, pos:[E_WALL_X, FRAME_Y, -8],   rotY:-Math.PI/2,   w:3.0, h:2.2 },
  { idx:4, pos:[E_WALL_X, FRAME_Y,  3],   rotY:-Math.PI/2,   w:3.0, h:2.2 },
  { idx:5, pos:[W_WALL_X, FRAME_Y, -8],   rotY: Math.PI/2,   w:3.0, h:2.2 },
  { idx:6, pos:[W_WALL_X, FRAME_Y,  3],   rotY: Math.PI/2,   w:3.0, h:2.2 },
  { idx:7, pos:[-5.5, FRAME_Y, S_WALL_Z], rotY:Math.PI,      w:3.0, h:2.2 },
  { idx:8, pos:[ 5.5, FRAME_Y, S_WALL_Z], rotY:Math.PI,      w:3.0, h:2.2 },
];

// ── Posisi patung / kubus ─────────────────────────────────────
const SCULPTURE_POSITIONS = [
  new THREE.Vector3(-3.5, 0, -4.0),   // GitHub  (kiri-utara)
  new THREE.Vector3( 3.5, 0, -4.0),   // LinkedIn (kanan-utara)
  new THREE.Vector3(   0, 0, -0.5),   // Music   (tengah, paling menonjol)
];

function getRoomLabel(z) {
  if (z < -5.5) return "Galeri Utara — Lukisan Seni";
  if (z <  5.5) return "Aula Tengah — Kubus Interaktif";
  return "Galeri Selatan — Proyek Digital";
}

// ── MuseumApp ─────────────────────────────────────────────────
class MuseumApp {
  constructor() {
    this._exhibits   = [];
    this._sculptures = [];
    this._clock      = new THREE.Clock();
    this._rlNameEl   = document.getElementById("rl-name");
    this._musicViz   = null;
    this._musicPlayer= null;
  }

  _initRenderer() {
    this._renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:"high-performance" });
    this._renderer.setSize(innerWidth, innerHeight);
    this._renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

  _initScene() {
    this._scene = new THREE.Scene();
    this._scene.fog        = new THREE.FogExp2(0x0d0a06, 0.018);
    this._scene.background = new THREE.Color(0x0d0a06);
  }

  _initCamera() {
    this._camera = new THREE.PerspectiveCamera(68, innerWidth/innerHeight, 0.05, 60);
    this._camera.position.set(0, 1.7, 10);
  }

  _initResize() {
    window.addEventListener("resize", () => {
      this._camera.aspect = innerWidth/innerHeight;
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
      const data = paintings[idx]; if (!data) return;
      this._exhibits.push(createPainting(scene, data, new THREE.Vector3(...pos), rotY, w, h));
    });

    // Papan sambutan & denah
    createWelcomeBoard(scene, { x:0, z:11.5, rotY:Math.PI });
    createMapBoard(scene, { x:W_WALL_X, y:FRAME_Y, z:9.0, rotY:Math.PI/2 });

    // Patung / kubus
    sculptures.forEach((data, i) => {
      const ex = createSculpture(scene, data, SCULPTURE_POSITIONS[i]);
      this._exhibits.push(ex);
      this._sculptures.push(ex.mesh);
    });

    // Music visualizer — posisi kubus musik (index 2)
    this._musicViz = new MusicVisualizer(scene, SCULPTURE_POSITIONS[2]);
  }

  _initMusic() {
    this._musicPlayer = new MusicPlayer(
      "5uDY6hEYfPc",
      "https://youtu.be/5uDY6hEYfPc?si=Z28WhXUv3kO9rSuO",
    );

    this._musicPlayer.onStateChange((playing) => {
      // Kirim ke visualizer
      this._musicViz.setPlaying(playing);

      // Update badge "Now Playing"
      const badge = document.getElementById("now-playing");
      if (badge) badge.style.display = playing ? "flex" : "none";

      // Beritahu InfoPanel (untuk sync tombol)
      document.dispatchEvent(new CustomEvent("museum:music-state", { detail:{ playing } }));
    });

    // Tombol di InfoPanel minta toggle
    document.addEventListener("museum:music-toggle", () => {
      this._musicPlayer.toggle();
    });
  }

  _initHint() {
    const hint    = document.getElementById("hint");
    const dismiss = () => hint.classList.add("off");
    document.getElementById("enter-btn").addEventListener("click", dismiss);
    this._renderer.domElement.addEventListener("mousedown",  dismiss);
    this._renderer.domElement.addEventListener("touchstart", dismiss, { passive:true });
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta();
    const t  = this._clock.elapsedTime;

    this._controls.update(dt);
    this._rlNameEl.textContent = getRoomLabel(this._camera.position.z);
    this._infoPanel.update(this._camera.position, this._exhibits);

    // Kubus berputar — multi-sumbu biar keren
    this._sculptures.forEach((mesh, i) => {
      mesh.rotation.y += [0.008, 0.006, 0.010][i] || 0.007;
      mesh.rotation.x += [0.003, 0.004, 0.002][i] || 0.003;
      mesh.position.y = 1.65 + Math.sin(t * [0.85, 0.75, 0.70][i] + i * 1.5) * 0.055;
    });

    // Music visualizer
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
    await runLoadingScreen();
    this._loop();
  }
}

new MuseumApp().start();
