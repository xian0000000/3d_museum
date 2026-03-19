/**
 * LoadingScreen.js — Animasi layar muat saat museum pertama dibuka.
 *
 * Mengembalikan Promise yang resolve setelah animasi selesai.
 * Dependensi: DOM saja
 */

const STAGES = [
  "Memuat arsitektur…",
  "Memasang lukisan…",
  "Menyalakan lampu…",
  "Membuka pintu…",
];

/**
 * Jalankan animasi loading bar.
 * @returns {Promise<void>} resolve saat fade-out selesai
 */
export function runLoadingScreen() {
  return new Promise((resolve) => {
    const screen = document.getElementById("loading");
    const fill   = document.getElementById("l-fill");
    const label  = document.getElementById("l-lbl");

    let progress = 0;

    const tick = setInterval(() => {
      progress += Math.random() * 11 + 4;
      fill.style.width = `${Math.min(progress, 100)}%`;

      const stageIndex = Math.min(
        Math.floor(progress / 27),
        STAGES.length - 1,
      );
      label.textContent = STAGES[stageIndex];

      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          screen.style.opacity = "0";
          setTimeout(() => {
            screen.style.display = "none";
            resolve();
          }, 800);
        }, 300);
      }
    }, 160);
  });
}
