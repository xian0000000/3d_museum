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
  let faceTex;

  if (data.isStack) {
    // Tech Stack — nampilin badge-badge teknologi
    const TECHS = [
      { label:"Python",     color:"#3b82f6" },
      { label:"JavaScript", color:"#f59e0b" },
      { label:"TypeScript", color:"#60a5fa" },
      { label:"Golang",     color:"#34d399" },
      { label:"React",      color:"#38bdf8" },
      { label:"HTML/CSS",   color:"#f97316" },
      { label:"Arduino",    color:"#22c55e" },
      { label:"SQL",        color:"#a78bfa" },
      { label:"MongoDB",    color:"#4ade80" },
    ];
    const S   = 256;
    const cv  = document.createElement("canvas");
    cv.width  = cv.height = S;
    const ctx = cv.getContext("2d");

    // Background
    ctx.fillStyle = data.bg || "#0f0a1e";
    ctx.fillRect(0, 0, S, S);

    // Grid lines subtle
    ctx.strokeStyle = "#a78bfa18"; ctx.lineWidth = 0.6;
    for (let i = 0; i < S; i += S / 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
    }

    // Border
    ctx.strokeStyle = "#a78bfa88"; ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, S - 16, S - 16);

    // Title
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TECH STACK", S / 2, 30);

    // Badge grid — 3 kolom
    const cols = 3;
    const badgeW = 72, badgeH = 18, gapX = 6, gapY = 5;
    const startX = (S - cols * badgeW - (cols - 1) * gapX) / 2;
    const startY = 44;

    TECHS.forEach((tech, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const bx  = startX + col * (badgeW + gapX);
      const by  = startY + row * (badgeH + gapY);

      // Badge background
      ctx.fillStyle = tech.color + "28";
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 4);
      ctx.fill();

      // Badge border
      ctx.strokeStyle = tech.color + "99";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 4);
      ctx.stroke();

      // Label
      ctx.fillStyle = tech.color;
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tech.label, bx + badgeW / 2, by + badgeH / 2);
    });

    faceTex = new THREE.CanvasTexture(cv);
    faceTex.encoding = THREE.sRGBEncoding;

  } else if (data.isAvailability) {
    // Availability — status dengan pulse indicator
    const S   = 256;
    const cv  = document.createElement("canvas");
    cv.width  = cv.height = S;
    const ctx = cv.getContext("2d");

    ctx.fillStyle = data.bg || "#0a1a0a";
    ctx.fillRect(0, 0, S, S);

    ctx.strokeStyle = "#22c55e18"; ctx.lineWidth = 0.6;
    for (let i = 0; i < S; i += S / 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
    }

    ctx.strokeStyle = "#22c55e88"; ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, S - 16, S - 16);

    // Lingkaran status hijau
    const cx = S / 2, cy = S * 0.38;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
    grad.addColorStop(0, "#22c55e");
    grad.addColorStop(0.6, "#16a34a");
    grad.addColorStop(1, "#14532d");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    // Ring pulse
    ctx.strokeStyle = "#22c55e55";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#22c55e22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.stroke();

    // Checkmark di tengah
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✓", cx, cy);

    // Teks status
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 20px monospace";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("OPEN TO WORK", S / 2, S * 0.72);

    ctx.fillStyle = "#22c55e88";
    ctx.font = "13px sans-serif";
    ctx.fillText("Klik untuk kirim email", S / 2, S * 0.84);

    faceTex = new THREE.CanvasTexture(cv);
    faceTex.encoding = THREE.sRGBEncoding;

  } else {
    faceTex = TextureFactory.cubeFace(
      (data.title || "").toUpperCase(),
      data.icon  || "?",
      data.bg    || "#0e0a04",
      data.accent|| "#c8a050",
    );
  }

  const cubeMat  = new THREE.MeshLambertMaterial({ map: faceTex });
  const cube     = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), cubeMat);
  cube.position.y = 1.65;
  group.add(cube);

  // ── Label melayang di atas kubus ─────────────────────────
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width  = 512;
  labelCanvas.height = 128;
  const lctx = labelCanvas.getContext("2d");

  // Latar pill transparan
  const accent = data.accent || "#c8a050";
  lctx.clearRect(0, 0, 512, 128);
  lctx.beginPath();
  lctx.roundRect(16, 24, 480, 80, 20);
  lctx.fillStyle = "rgba(8,6,4,0.78)";
  lctx.fill();
  lctx.strokeStyle = accent;
  lctx.lineWidth = 3;
  lctx.stroke();

  // Icon kecil + teks judul
  lctx.textAlign = "center";
  lctx.textBaseline = "middle";
  lctx.fillStyle = accent;
  lctx.font = "bold 34px Arial,sans-serif";
  lctx.fillText((data.icon || "") + "  " + (data.title || ""), 256, 64);

  // Teks hint kecil — sesuai tipe patung
  const hintText = data.isStack ? "dekati untuk lihat detail" : "klik untuk kunjungi";
  lctx.fillStyle = "rgba(255,255,255,0.55)";
  lctx.font = "22px Arial,sans-serif";
  lctx.fillText(hintText, 256, 98);

  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMat = new THREE.SpriteMaterial({
    map: labelTex, transparent: true, depthTest: false });
  const label = new THREE.Sprite(labelMat);
  label.scale.set(1.8, 0.45, 1);
  label.position.y = 2.55;
  group.add(label);

  scene.add(group);

  return {
    mesh:     cube,
    group,
    position: pos.clone().setY(1.7),
    radius:   2.5,
    data,
  };
}
