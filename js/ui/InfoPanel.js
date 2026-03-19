/**
 * InfoPanel.js — Panel info pameran yang muncul saat pemain mendekat.
 *
 * Cara menambah tipe pameran baru (misal isPortfolio):
 *   1. Tambahkan blok `else if (d.isPortfolio)` di method _applyStyle().
 *   2. Tentukan label, warna, dan apakah ada link.
 *
 * Dependensi: DOM (tidak butuh Three.js)
 */

/** Konfigurasi tampilan per tipe pameran */
const EXHIBIT_STYLES = {
  isStatistic: {
    tag: "StatLab",
    borderColor: "#00e5c8",
    textColor: "#00e5c8",
    showLink: true,
  },
  isChatOcean: {
    tag: "Chat Ocean",
    borderColor: "#007bff",
    textColor: "#4da6ff",
    showLink: true,
  },
  isLibrary: {
    tag: "Perpustakaan Kuno",
    borderColor: "#2d6abf",
    textColor: "#7eb8f7",
    showLink: true,
  },
  // ── Tambahkan tipe baru di sini ↓ ──────────────────────────
  // isPortfolio: {
  //   tag: "Portfolio",
  //   borderColor: "#e0a020",
  //   textColor: "#f0c040",
  //   showLink: true,
  // },
};

const DEFAULT_STYLE = {
  tag: "Koleksi Tetap",
  borderColor: "#3a2e18",
  textColor: "#5a4a28",
  showLink: false,
};

export class InfoPanel {
  constructor() {
    this._el       = document.getElementById("panel");
    this._title    = document.getElementById("p-title");
    this._desc     = document.getElementById("p-desc");
    this._meta     = document.getElementById("p-meta");
    this._tag      = document.getElementById("p-tag");
    this._linkWrap = document.getElementById("p-link-wrap");
    this._link     = document.getElementById("p-link");
    this._last     = null;

    // Hover effect pada tombol link
    this._link.addEventListener("mouseenter", () => {
      this._link.style.background = "#c8a050";
      this._link.style.color = "#080604";
    });
    this._link.addEventListener("mouseleave", () => {
      this._link.style.background = "transparent";
      this._link.style.color = "#c8a050";
    });
  }

  /**
   * Panggil setiap frame — deteksi pameran terdekat dan perbarui UI.
   * @param {THREE.Vector3} camPos
   * @param {Array}         exhibits – array { position, radius, data }
   */
  update(camPos, exhibits) {
    let nearest = null, minDist = Infinity;

    for (const ex of exhibits) {
      const dist = camPos.distanceTo(ex.position);
      if (dist < ex.radius && dist < minDist) {
        minDist = dist;
        nearest = ex;
      }
    }

    if (nearest === this._last) return; // Tidak ada perubahan
    this._last = nearest;

    if (nearest) {
      this._show(nearest.data);
    } else {
      this._hide();
    }
  }

  _show(data) {
    this._title.textContent = data.title;
    this._desc.textContent  = data.desc;
    this._meta.textContent  = `${data.artist} · ${data.year}`;
    this._applyStyle(data);
    this._el.classList.add("on");
  }

  _hide() {
    this._el.classList.remove("on");
  }

  _applyStyle(data) {
    // Cari tipe yang cocok dari EXHIBIT_STYLES
    const styleKey = Object.keys(EXHIBIT_STYLES).find((k) => data[k]);
    const style    = styleKey ? EXHIBIT_STYLES[styleKey] : DEFAULT_STYLE;

    this._tag.textContent        = style.tag;
    this._tag.style.borderColor  = style.borderColor;
    this._tag.style.color        = style.textColor;

    if (style.showLink && data.url) {
      this._link.href              = data.url;
      this._linkWrap.style.display = "block";
    } else {
      this._linkWrap.style.display = "none";
    }
  }
}
