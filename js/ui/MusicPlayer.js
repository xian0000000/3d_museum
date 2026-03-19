/**
 * MusicPlayer.js — Wrapper YouTube IFrame API untuk museum.
 *
 * Cara kerja:
 *   1. Load script YouTube IFrame API
 *   2. Buat YT.Player tersembunyi (1×1px, off-screen)
 *   3. Pantau state perubahan (play / pause / end)
 *   4. toggle() → play jika pause, pause jika play
 *
 * Fallback: jika API belum siap atau gagal load, toggle() membuka
 * YouTube di tab baru (graceful degradation).
 *
 * Dependensi: DOM, YouTube IFrame API (external CDN)
 */

export class MusicPlayer {
  /**
   * @param {string} videoId    – ID video YouTube (bukan URL lengkap)
   * @param {string} fallbackUrl – URL YouTube untuk fallback
   */
  constructor(videoId, fallbackUrl) {
    this._videoId    = videoId;
    this._fallback   = fallbackUrl;
    this._player     = null;
    this._ready      = false;
    this._playing    = false;
    this._callbacks  = [];

    this._initDOM();
    this._loadAPI();
  }

  // ── Inisialisasi ─────────────────────────────────────────────

  _initDOM() {
    // Container tersembunyi — harus ada di DOM agar YT API bisa attach
    const wrap   = document.createElement("div");
    wrap.id      = "yt-player-wrap";
    wrap.style.cssText =
      "position:fixed;bottom:-2px;right:-2px;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:0;overflow:hidden";
    wrap.innerHTML = `<div id="yt-iframe-target"></div>`;
    document.body.appendChild(wrap);
  }

  _loadAPI() {
    // Pasang callback global sebelum script dimuat
    window.onYouTubeIframeAPIReady = () => {
      this._player = new YT.Player("yt-iframe-target", {
        videoId:     this._videoId,
        width:       2,
        height:      2,
        playerVars:  {
          autoplay:       0,
          controls:       0,
          disablekb:      1,
          fs:             0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel:            0,
          playsinline:    1,
        },
        events: {
          onReady:       () => { this._ready = true; },
          onStateChange: (e) => this._onState(e.data),
          onError:       () => { this._ready = false; }, // fallback to URL open
        },
      });
    };

    // Hanya load sekali
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s  = document.createElement("script");
      s.src    = "https://www.youtube.com/iframe_api";
      s.async  = true;
      document.body.appendChild(s);
    }
  }

  // ── State ────────────────────────────────────────────────────

  _onState(state) {
    // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
    const wasPlaying = this._playing;
    this._playing    = (state === 1);
    if (wasPlaying !== this._playing) {
      this._callbacks.forEach(fn => fn(this._playing));
    }
  }

  // ── API publik ───────────────────────────────────────────────

  toggle() {
    if (!this._ready || !this._player) {
      // Fallback: buka di tab baru
      window.open(this._fallback, "_blank", "noopener");
      return;
    }
    if (this._playing) {
      this._player.pauseVideo();
    } else {
      this._player.playVideo();
    }
  }

  stop() {
    if (this._ready && this._player) this._player.stopVideo();
  }

  get isPlaying() { return this._playing; }

  /** Daftar callback dipanggil saat state berubah: fn(isPlaying: boolean) */
  onStateChange(fn) { this._callbacks.push(fn); }
}
