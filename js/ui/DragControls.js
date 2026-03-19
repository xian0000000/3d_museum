/**
 * DragControls.js — Kontrol kamera FPS tanpa pointer lock.
 *
 * Mendukung:
 *   - Drag mouse / touch → putar pandangan
 *   - WASD / Arrow keys → bergerak maju/mundur/kiri/kanan
 *   - Tombol layar virtual (on-screen buttons)
 *   - Batasan tabrakan dinding otomatis
 *
 * Dependensi: THREE (global)
 */

/** ID tombol layar yang terdaftar → kode keyboard virtual */
const BUTTON_MAP = {
  "b-f": "ArrowUp",
  "b-b": "ArrowDown",
  "b-l": "ArrowLeft",
  "b-r": "ArrowRight",
};

export class DragControls {
  /**
   * @param {THREE.PerspectiveCamera} camera
   * @param {HTMLCanvasElement}       canvas
   * @param {{ W: number, D: number }} roomSize – batas ruangan
   */
  constructor(camera, canvas, roomSize) {
    this._cam       = camera;
    this._yaw       = Math.PI;
    this._pitch     = 0;
    this._dragging  = false;
    this._lx        = 0;
    this._ly        = 0;
    this._keys      = new Set();   // Tombol keyboard fisik
    this._btnKeys   = new Set();   // Tombol layar virtual
    this._halfW     = roomSize.W / 2 - 0.65;
    this._halfD     = roomSize.D / 2 - 0.65;

    this._initMouse(canvas);
    this._initTouch(canvas);
    this._initKeyboard();
    this._initButtons();
  }

  // ── Input Handlers ──────────────────────────────────────────

  _initMouse(canvas) {
    canvas.addEventListener("mousedown", (e) => {
      this._dragging = true;
      this._lx = e.clientX;
      this._ly = e.clientY;
      canvas.classList.add("dragging");
    });
    window.addEventListener("mouseup", () => {
      this._dragging = false;
      canvas.classList.remove("dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!this._dragging) return;
      this._yaw   -= (e.clientX - this._lx) * 0.003;
      this._pitch -= (e.clientY - this._ly) * 0.003;
      this._pitch  = Math.max(-1.0, Math.min(1.0, this._pitch));
      this._lx = e.clientX;
      this._ly = e.clientY;
    });
  }

  _initTouch(canvas) {
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this._dragging = true;
        this._lx = e.touches[0].clientX;
        this._ly = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => { this._dragging = false; });

    window.addEventListener("touchmove", (e) => {
      if (!this._dragging || e.touches.length !== 1) return;
      this._yaw   -= (e.touches[0].clientX - this._lx) * 0.003;
      this._pitch -= (e.touches[0].clientY - this._ly) * 0.003;
      this._pitch  = Math.max(-1.0, Math.min(1.0, this._pitch));
      this._lx = e.touches[0].clientX;
      this._ly = e.touches[0].clientY;
    }, { passive: true });
  }

  _initKeyboard() {
    window.addEventListener("keydown", (e) => {
      this._keys.add(e.code);
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => this._keys.delete(e.code));
  }

  _initButtons() {
    Object.entries(BUTTON_MAP).forEach(([id, code]) => {
      const el = document.getElementById(id);
      if (!el) return;

      const press   = () => this._btnKeys.add(code);
      const release = () => this._btnKeys.delete(code);

      el.addEventListener("mousedown", press);
      el.addEventListener("mouseup",   release);
      el.addEventListener("mouseleave", release);
      el.addEventListener("touchstart", (e) => { e.preventDefault(); press(); }, { passive: false });
      el.addEventListener("touchend",   release);
      el.addEventListener("touchcancel", release);
    });
  }

  // ── Update (panggil setiap frame) ──────────────────────────

  /**
   * @param {number} dt – delta time dalam detik
   */
  update(dt) {
    const speed  = 4.5 * dt;
    const allKeys = new Set([...this._keys, ...this._btnKeys]);

    const forward = new THREE.Vector3(-Math.sin(this._yaw), 0, -Math.cos(this._yaw));
    const right   = new THREE.Vector3( Math.cos(this._yaw), 0, -Math.sin(this._yaw));

    if (allKeys.has("KeyW") || allKeys.has("ArrowUp"))
      this._cam.position.addScaledVector(forward,  speed);
    if (allKeys.has("KeyS") || allKeys.has("ArrowDown"))
      this._cam.position.addScaledVector(forward, -speed);
    if (allKeys.has("KeyA") || allKeys.has("ArrowLeft"))
      this._cam.position.addScaledVector(right, -speed);
    if (allKeys.has("KeyD") || allKeys.has("ArrowRight"))
      this._cam.position.addScaledVector(right,  speed);

    // Batasi agar tidak menembus dinding
    this._cam.position.x = Math.max(-this._halfW, Math.min(this._halfW, this._cam.position.x));
    this._cam.position.z = Math.max(-this._halfD, Math.min(this._halfD, this._cam.position.z));
    this._cam.position.y = 1.7; // Tinggi mata tetap

    // Terapkan rotasi kamera
    this._cam.rotation.order = "YXZ";
    this._cam.rotation.y     = this._yaw;
    this._cam.rotation.x     = this._pitch;
  }
}
