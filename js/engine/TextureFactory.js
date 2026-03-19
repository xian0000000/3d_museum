/**
 * TextureFactory.js — Pembuat tekstur canvas procedural.
 *
 * Setiap fungsi mengembalikan THREE.CanvasTexture yang siap dipakai.
 * Untuk menambah tekstur baru, tambahkan fungsi baru di dalam IIFE
 * dan sertakan di objek return.
 *
 * Dependensi global: THREE (three.min.js via CDN)
 */

/* ─── helper internal ─────────────────────────────────── */
function makeTexture(drawFn, size, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  drawFn(canvas.getContext("2d"), size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

/* ─── export ──────────────────────────────────────────── */
export const TextureFactory = {
  /** Lantai marmer krem dengan serat acak */
  floor() {
    return makeTexture((ctx, S) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, "#ede5d5");
      g.addColorStop(0.5, "#f0eae0");
      g.addColorStop(1, "#ddd5c0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);

      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(140,115,82,${0.07 + Math.random() * 0.14})`;
        ctx.lineWidth = 0.5 + Math.random() * 1.2;
        let x = Math.random() * S, y = Math.random() * S;
        ctx.moveTo(x, y);
        for (let j = 0; j < 7; j++) {
          x += (Math.random() - 0.5) * 60;
          y += (Math.random() - 0.5) * 38;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }, 512, 8, 8);
  },

  /** Dinding bata gelap */
  wall() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#1c1610";
      ctx.fillRect(0, 0, S, S);
      const rh = 48;
      for (let r = 0; r * rh < S + rh; r++) {
        const bw = r % 2 === 0 ? 88 : 72;
        for (let x = 0; x < S; x += bw) {
          const v = 13 + Math.random() * 9;
          ctx.fillStyle = `rgb(${v + 5},${v + 1},${v - 2})`;
          ctx.fillRect(x + 1, r * rh + 1, bw - 2, rh - 2);
        }
        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.fillRect(0, r * rh, S, 1);
        for (let x = 0; x < S; x += r % 2 === 0 ? 88 : 72)
          ctx.fillRect(x, r * rh, 1, rh);
      }
    }, 256, 3, 2);
  },

  /** Langit-langit dengan panel kayu */
  ceiling() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#18140e";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "rgba(75,55,28,.38)";
      ctx.lineWidth = 2.5;
      for (let i = 0; i <= S; i += 128) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
      }
    }, 256, 5, 5);
  },

  /**
   * Lukisan abstrak prosedural acak.
   * @param {string[]} colors – array hex, minimal 2 warna
   */
  painting(colors) {
    return makeTexture((ctx, S) => {
      const H = S * 0.8;
      const g = ctx.createLinearGradient(0, 0, S, H);
      g.addColorStop(0, colors[0]);
      g.addColorStop(1, colors[1] || colors[0]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, H);

      const style = Math.floor(Math.random() * 4);
      if (style === 0) {
        // Brush strokes abstrak
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = colors[i % colors.length] +
            Math.floor(70 + Math.random() * 85).toString(16);
          ctx.save();
          ctx.translate(Math.random() * S, Math.random() * H);
          ctx.rotate((Math.random() - 0.5) * 0.7);
          ctx.fillRect(-50 - Math.random() * 75, -24 - Math.random() * 50,
            78 + Math.random() * 105, 42 + Math.random() * 75);
          ctx.restore();
        }
      } else if (style === 1) {
        // Lingkaran gradasi
        for (let i = 0; i < 6; i++) {
          const cx = Math.random() * S, cy = Math.random() * H, r = 44 + Math.random() * 88;
          const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          rg.addColorStop(0, colors[i % colors.length] + "dd");
          rg.addColorStop(1, colors[(i + 1) % colors.length] + "00");
          ctx.fillStyle = rg;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        }
      } else if (style === 2) {
        // Lapisan horizontal
        [0.5, 0.72, 1].forEach((b, i, a) => {
          const from = H * (a[i - 1] || 0), to = H * b;
          const bg = ctx.createLinearGradient(0, from, 0, to);
          bg.addColorStop(0, colors[i % colors.length] + "cc");
          bg.addColorStop(1, colors[(i + 1) % colors.length] + "cc");
          ctx.fillStyle = bg;
          ctx.fillRect(0, from, S, to - from);
        });
      } else {
        // Kurva bezier
        for (let i = 0; i < 28; i++) {
          ctx.strokeStyle = colors[i % colors.length] +
            Math.floor(80 + Math.random() * 95).toString(16);
          ctx.lineWidth = 4 + Math.random() * 12;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(Math.random() * S, Math.random() * H);
          ctx.bezierCurveTo(Math.random() * S, Math.random() * H,
            Math.random() * S, Math.random() * H,
            Math.random() * S, Math.random() * H);
          ctx.stroke();
        }
      }

      // Vignette
      const vig = ctx.createRadialGradient(S / 2, H / 2, H * 0.1, S / 2, H / 2, H * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,.36)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, S, H);
    }, 256, 1, 1);
  },

  /** Rak buku perpustakaan kuno (fallback jika perpuskuno.png tidak ada) */
  library() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#1a0e06";
      ctx.fillRect(0, 0, S, S);

      const shelfH = Math.floor(S / 4);
      const bookColors = [
        "#8B1a1a","#1a4a8B","#1a6b2a","#7a5a10","#5a1a6b","#8B4a1a",
        "#1a5a5a","#6b3a10","#2a2a8B","#8B6a1a","#3a6b1a","#6b1a3a",
        "#1a3a6b","#8B3a10","#4a8B1a","#8B1a5a","#107a7a","#5a8B10",
      ];

      for (let row = 0; row < 4; row++) {
        const sy = row * shelfH;
        const sg = ctx.createLinearGradient(0, sy + shelfH - 10, 0, sy + shelfH);
        sg.addColorStop(0, "#6b4a20"); sg.addColorStop(1, "#3a2408");
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy + shelfH - 10, S, 10);
        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.fillRect(0, sy + shelfH, S, 4);

        let x = 4;
        while (x < S - 8) {
          const bw = 14 + Math.floor(Math.random() * 18);
          const bh = shelfH - 18 - Math.floor(Math.random() * 14);
          const by = sy + shelfH - 10 - bh;
          const ci = Math.floor(Math.random() * bookColors.length);
          const bg = ctx.createLinearGradient(x, 0, x + bw, 0);
          bg.addColorStop(0, bookColors[ci] + "cc");
          bg.addColorStop(0.3, bookColors[ci]);
          bg.addColorStop(1, bookColors[(ci + 3) % bookColors.length] + "99");
          ctx.fillStyle = bg;
          ctx.fillRect(x, by, bw, bh);
          ctx.fillStyle = "rgba(0,0,0,.35)";
          ctx.fillRect(x, by, 1, bh);
          ctx.fillRect(x + bw - 1, by, 1, bh);
          ctx.fillStyle = "rgba(255,255,255,.18)";
          ctx.fillRect(x + 2, by + Math.floor(bh * 0.25), bw - 4, Math.floor(bh * 0.12));
          x += bw + 1;
        }
      }

      const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,.55)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);

      ctx.fillStyle = "rgba(200,160,80,.82)";
      ctx.font = "bold 22px Georgia,serif";
      ctx.textAlign = "center";
      ctx.fillText("PERPUSTAKAAN", S / 2, S * 0.88);
      ctx.fillStyle = "rgba(200,160,80,.45)";
      ctx.font = "12px Georgia,serif";
      ctx.fillText("DIGITAL", S / 2, S * 0.93);
    }, 512, 1, 1);
  },

  /** Dashboard statistik — bingkai StatLab */
  statistic() {
    return makeTexture((ctx, S) => {
      // Background gelap
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, S, S);

      // Grid halus
      ctx.strokeStyle = "rgba(0,229,200,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= S; i += S / 8) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
      }

      // Bar chart
      const bars = [0.38, 0.62, 0.51, 0.78, 0.43, 0.88, 0.66, 0.57, 0.73, 0.45];
      const areaX = S * 0.08, areaW = S * 0.84;
      const baseY = S * 0.76, maxH = S * 0.46;
      const barW = areaW / bars.length;

      bars.forEach((h, i) => {
        const x = areaX + i * barW;
        const bh = h * maxH;
        const grad = ctx.createLinearGradient(x, baseY - bh, x, baseY);
        grad.addColorStop(0, "#00e5c8");
        grad.addColorStop(1, "rgba(0,100,180,0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, baseY - bh, barW - 5, bh);
      });

      // Garis kurva di atas bar
      ctx.strokeStyle = "#ffcc00";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      bars.forEach((h, i) => {
        const x = areaX + (i + 0.5) * barW;
        const y = baseY - h * maxH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Titik data
      bars.forEach((h, i) => {
        const x = areaX + (i + 0.5) * barW;
        const y = baseY - h * maxH;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffcc00";
        ctx.fill();
      });

      // Garis dasar
      ctx.strokeStyle = "rgba(0,229,200,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(areaX, baseY);
      ctx.lineTo(areaX + areaW, baseY);
      ctx.stroke();

      // Angka sumbu Y (kiri)
      ctx.fillStyle = "rgba(0,229,200,0.45)";
      ctx.font = `${S * 0.04}px monospace`;
      ctx.textAlign = "right";
      ["1.0", "0.5", "0.0"].forEach((lbl, i) => {
        ctx.fillText(lbl, areaX - 4, baseY - [maxH, maxH / 2, 0][i] + 4);
      });

      // Mini pie chart kanan atas
      const pcx = S * 0.78, pcy = S * 0.22, pr = S * 0.1;
      const slices = [
        { pct: 0.35, color: "#00e5c8" },
        { pct: 0.28, color: "#00aaf5" },
        { pct: 0.22, color: "#ffcc00" },
        { pct: 0.15, color: "#ff6b6b" },
      ];
      let startAngle = -Math.PI / 2;
      slices.forEach(({ pct, color }) => {
        const angle = pct * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(pcx, pcy);
        ctx.arc(pcx, pcy, pr, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        startAngle += angle;
      });
      ctx.strokeStyle = "#0a1628";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.stroke();

      // Vignette
      const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, S, S);

      // Judul utama
      ctx.fillStyle = "rgba(0,229,200,0.95)";
      ctx.font = `bold ${S * 0.09}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText("STATLAB", S / 2, S * 0.13);

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `${S * 0.038}px monospace`;
      ctx.fillText("v2.0  —  Analisis Statistik", S / 2, S * 0.21);

      // Label bawah
      ctx.fillStyle = "rgba(0,229,200,0.4)";
      ctx.font = `${S * 0.032}px monospace`;
      ctx.fillText("Riset · Lab · Keuangan", S / 2, S * 0.9);
    }, 512, 1, 1);
  },
};
