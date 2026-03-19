/**
 * exhibits.js — Semua data pameran museum.
 *
 * Cara menambah pameran baru:
 *  1. Tambahkan objek baru ke array EXHIBITS.
 *  2. Untuk lukisan biasa  → type:"painting", colors:[...]
 *  3. Untuk lukisan proyek → type:"painting", isProject:true, url:"...", colors:[...]
 *  4. Untuk patung         → type:"sculpture", shape:"torusKnot"|"sphere"|"icosahedron"|"torus", color:0xRRGGBB
 *
 * Urutan lukisan penting untuk penempatan di dinding:
 *   [0-2]  → Dinding Utara  (3 slot)
 *   [3-4]  → Dinding Timur  (2 slot)
 *   [5-6]  → Dinding Barat  (2 slot)
 *   [7-8]  → Dinding Selatan (2 slot)
 */

export const EXHIBITS = [
  // ── Dinding Utara ──────────────────────────────────────────────
  {
    type: "painting",
    title: "Harmoni Cahaya",
    artist: "Rina Dewanto",
    year: "2021",
    desc: "Ekspresi abstrak tentang perjalanan waktu melalui gelombang warna yang saling berpadu.",
    colors: ["#0e2a4a", "#1a6090", "#e87820", "#f0a030"],
  },
  {
    type: "painting",
    title: "Kota Imajiner",
    artist: "Bima Santoso",
    year: "2019",
    desc: "Karya geometris menggambarkan kompleksitas kehidupan urban — kaca, baja, dan cahaya neon.",
    colors: ["#120820", "#602080", "#c040a0", "#40c0e0"],
  },
  {
    type: "painting",
    title: "Hutan Mimpi",
    artist: "Laras Utami",
    year: "2020",
    desc: "Interpretasi organis dari alam liar melalui sapuan warna hijau yang bebas dan energik.",
    colors: ["#081a10", "#1a5830", "#40a050", "#90d840"],
  },

  // ── Dinding Timur ──────────────────────────────────────────────
  {
    type: "painting",
    title: "Lautan Waktu",
    artist: "Farhan Rizki",
    year: "2018",
    desc: "Meditasi visual tentang kedalaman samudra sebagai metafora perjalanan jiwa.",
    colors: ["#040c1c", "#082050", "#1060a0", "#30b0e0"],
  },
  {
    type: "painting",
    title: "Api Jiwa",
    artist: "Rina Dewanto",
    year: "2022",
    desc: "Energi kehidupan yang berpijar — palet warna panas meledak dalam satu momen abadi.",
    colors: ["#2a0800", "#a01808", "#e05010", "#f0a020"],
  },

  // ── Dinding Barat ──────────────────────────────────────────────
  {
    type: "painting",
    title: "Batas Langit",
    artist: "Yusuf Hakim",
    year: "2023",
    desc: "Panorama abstrak tentang horizon dan kemungkinan tak terbatas yang menanti di baliknya.",
    colors: ["#080015", "#301880", "#6040c0", "#c0a0ff"],
  },
  {
    type: "painting",
    title: "StatLab",
    artist: "Xina",
    year: "2026",
    desc: "Platform analisis statistik interaktif — eksplorasi data riset, lab, dan keuangan. Klik tombol untuk membuka.",
    colors: ["#0a1628", "#0d2137", "#00e5c8", "#00aaf5"],
    url: "https://xian0000000.github.io/statistic/",
    isStatistic: true,
  },

  // ── Dinding Selatan ────────────────────────────────────────────
  {
    type: "painting",
    title: "Chat Ocean",
    artist: "Xina",
    year: "2026",
    desc: "Platform obrolan inovatif berbasis web yang menghubungkan orang-orang, silahkan klik tombol untuk mengunjungi.",
    colors: ["#007bff", "#0056b3", "#003366", "#001133"],
    url: "https://chatoceanfrontend-production.up.railway.app",
    isChatOcean: true,
  },
  {
    type: "painting",
    title: "Perpustakaan Kuno",
    artist: "Xina",
    year: "2026",
    desc: "Jelajahi koleksi buku, artikel, dan referensi digital kami yang terus berkembang. Klik tombol untuk mengunjungi.",
    colors: ["#0a1628", "#1a3a6b", "#2d6abf", "#7eb8f7"],
    url: "https://frontend-production-ac9a.up.railway.app/",
    isLibrary: true,
  },

  // ── Patung / Sculptures ────────────────────────────────────────
  {
    type: "sculpture",
    title: "Lingkaran Abadi",
    artist: "Eko Prasetyo",
    year: "2020",
    desc: "Simpul toroidal emas melambangkan siklus kehidupan yang tak pernah berujung.",
    color: 0xd4a020,
    shape: "torusKnot",
  },
  {
    type: "sculpture",
    title: "Bola Biru Bumi",
    artist: "Mega Sari",
    year: "2019",
    desc: "Bola baja biru merepresentasikan bumi dan rapuhnya ekosistem kita.",
    color: 0x2060c0,
    shape: "sphere",
  },
  {
    type: "sculpture",
    title: "Puncak Merah",
    artist: "Eko Prasetyo",
    year: "2021",
    desc: "Ikosahedron merah — tekad manusia meraih puncak melalui kerja keras dan keberanian.",
    color: 0xc02828,
    shape: "icosahedron",
  },
];
