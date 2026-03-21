/**
 * InfoPanel.js — Panel info pameran yang muncul saat pemain mendekat.
 *
 * Cara tambah tipe pameran baru:
 *   1. Tambahkan entry di EXHIBIT_STYLES
 *   2. showLink:true  → tombol "Kunjungi Situs"
 *      showMusic:true → tombol "Putar Musik" (dispatch museum:music-toggle)
 *
 * Dependensi: DOM saja
 */

const EXHIBIT_STYLES = {
  isCuaca:     { tag:"Cuaca Bekasi",           borderColor:"#38bdf8", textColor:"#7dd3fc", showLink:true  },
  isDetektif:  { tag:"Detektif Produktivitas", borderColor:"#e8b84b", textColor:"#f5d278", showLink:true  },
  isArduino:   { tag:"Arduino Project",        borderColor:"#00ff88", textColor:"#00cc66", showLink:true  },
  isStatistic: { tag:"StatLab",            borderColor:"#00e5c8", textColor:"#00e5c8", showLink:true  },
  isChatOcean: { tag:"Chat Ocean",          borderColor:"#007bff", textColor:"#4da6ff", showLink:true  },
  isLibrary:   { tag:"Perpustakaan Kuno",   borderColor:"#2d6abf", textColor:"#7eb8f7", showLink:true  },
  isLifeDashboard: { tag:"Life Dashboard",   borderColor:"#a855f7", textColor:"#c084fc", showLink:true  },
  isGithub:    { tag:"GitHub",              borderColor:"#58a6ff", textColor:"#58a6ff", showLink:true  },
  isLinkedin:  { tag:"LinkedIn",            borderColor:"#0ea5e9", textColor:"#0ea5e9", showLink:true  },
  isGallery:   { tag:"Galeri Foto",         borderColor:"#c8a050", textColor:"#e8c870", showLink:false },
  isMusic:     { tag:"Musik",               borderColor:"#c8a050", textColor:"#ffd060", showMusic:true },
};

const DEFAULT_STYLE = {
  tag:"Koleksi Tetap", borderColor:"#3a2e18", textColor:"#5a4a28",
  showLink:false, showMusic:false,
};

export class InfoPanel {
  constructor() {
    this._el        = document.getElementById("panel");
    this._title     = document.getElementById("p-title");
    this._desc      = document.getElementById("p-desc");
    this._meta      = document.getElementById("p-meta");
    this._tag       = document.getElementById("p-tag");
    this._linkWrap  = document.getElementById("p-link-wrap");
    this._link      = document.getElementById("p-link");
    this._musicWrap = document.getElementById("p-music-wrap");
    this._musicBtn  = document.getElementById("p-music-btn");
    this._last      = null;

    // Link hover
    this._link.addEventListener("mouseenter", () => {
      this._link.style.background = "#c8a050";
      this._link.style.color      = "#080604";
    });
    this._link.addEventListener("mouseleave", () => {
      this._link.style.background = "transparent";
      this._link.style.color      = "#c8a050";
    });

    // Music button → dispatch event (app.js handles)
    this._musicBtn.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("museum:music-toggle"));
    });

    // Update tombol musik dari luar
    document.addEventListener("museum:music-state", (e) => {
      this._syncMusicBtn(e.detail.playing);
    });
  }

  // ── Update loop ──────────────────────────────────────────────

  update(camPos, exhibits) {
    let nearest = null, minDist = Infinity;
    for (const ex of exhibits) {
      const d = camPos.distanceTo(ex.position);
      if (d < ex.radius && d < minDist) { minDist = d; nearest = ex; }
    }
    if (nearest === this._last) return;
    this._last = nearest;
    nearest ? this._show(nearest.data) : this._hide();
  }

  // ── Private ──────────────────────────────────────────────────

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
    const key   = Object.keys(EXHIBIT_STYLES).find(k => data[k]);
    const style = key ? EXHIBIT_STYLES[key] : DEFAULT_STYLE;

    this._tag.textContent       = style.tag;
    this._tag.style.borderColor = style.borderColor;
    this._tag.style.color       = style.textColor;

    if (style.showMusic) {
      this._musicWrap.style.display = "block";
      this._linkWrap.style.display  = "none";
    } else if (style.showLink && data.url) {
      this._link.href               = data.url;
      this._linkWrap.style.display  = "block";
      this._musicWrap.style.display = "none";
    } else {
      this._linkWrap.style.display  = "none";
      this._musicWrap.style.display = "none";
    }
  }

  _syncMusicBtn(playing) {
    if (!this._musicBtn) return;
    this._musicBtn.textContent = playing ? "⏸  Pause Musik" : "▶  Putar Musik";
    this._musicBtn.classList.toggle("playing", playing);
  }
}
