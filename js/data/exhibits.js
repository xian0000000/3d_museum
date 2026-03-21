/**
 * exhibits.js — Data seluruh pameran museum.
 *
 * ── Index lukisan (painting) ─────────────────────────────────
 *  [0-2]  Dinding Utara   (3 slot)
 *  [3-4]  Dinding Timur   (2 slot, zona utara)
 *  [5-6]  Dinding Barat   (2 slot)
 *  [7-8]  Dinding Selatan (2 slot)
 *  [9-13] Galeri Foto     (5 slot kecil, dinding timur zona selatan)
 *
 * ── PNG yang perlu kamu sediakan di folder root ─────────────
 *  lifedashboard.png  → bingkai Life Dashboard
 *  statlab.png        → bingkai StatLab
 *  chatocean.png      → bingkai Chat Ocean
 *  perpuskuno.png     → bingkai Perpustakaan
 *  gallery1.png       → galeri foto slot 1
 *  gallery2.png       → galeri foto slot 2
 *  gallery3.png       → galeri foto slot 3
 *  gallery4.png       → galeri foto slot 4
 *  gallery5.png       → galeri foto slot 5
 */

export const EXHIBITS = [

  // ── [0-2] Dinding Utara ────────────────────────────────────
  { type:"painting", title:"Mobil Radar Pendeteksi Suhu", artist:"Xina", year:"2026",
    desc:"Proyek Arduino: mobil pintar berbasis sensor ultrasonik & suhu DHT. Deteksi objek + monitoring suhu real-time via Tinkercad. Klik untuk membuka.",
    colors:["#0a1a0a","#003300","#00aa44","#00ff88"],
    url:"https://www.tinkercad.com/things/1881v69jM2t-xina-mobil-radar-pendeteksi-suhu?sharecode=3UZy7Uh6HRltGEn634fOgAN3Io0y6fuSHZzWQ2jSLDw",
    png:"arduino.png", isArduino:true },

  { type:"painting", title:"Kota Imajiner",    artist:"Bima Santoso", year:"2019",
    desc:"Karya geometris menggambarkan kompleksitas kehidupan urban — kaca, baja, dan cahaya neon.",
    colors:["#120820","#602080","#c040a0","#40c0e0"] },

  { type:"painting", title:"Hutan Mimpi",      artist:"Laras Utami",  year:"2020",
    desc:"Interpretasi organis dari alam liar melalui sapuan warna hijau yang bebas dan energik.",
    colors:["#081a10","#1a5830","#40a050","#90d840"] },

  // ── [3-4] Dinding Timur ────────────────────────────────────
  { type:"painting", title:"Lautan Waktu",     artist:"Farhan Rizki", year:"2018",
    desc:"Meditasi visual tentang kedalaman samudra sebagai metafora perjalanan jiwa.",
    colors:["#040c1c","#082050","#1060a0","#30b0e0"] },

  { type:"painting", title:"Api Jiwa",         artist:"Rina Dewanto", year:"2022",
    desc:"Energi kehidupan yang berpijar — palet warna panas meledak dalam satu momen abadi.",
    colors:["#2a0800","#a01808","#e05010","#f0a020"] },

  // ── [5-6] Dinding Barat ────────────────────────────────────
  { type:"painting", title:"Life Dashboard",   artist:"Xina",         year:"2026",
    desc:"Dashboard kehidupan interaktif — pantau kebiasaan, target, dan progres harianmu. Klik untuk membuka.",
    colors:["#0a0f1e","#0d2137","#7c3aed","#a855f7"],
    url:"https://xian0000000.github.io/life_dashboard/",
    png:"lifedashboard.png", isLifeDashboard:true },

  { type:"painting", title:"StatLab",          artist:"Xina",         year:"2026",
    desc:"Platform analisis statistik interaktif — riset, lab, dan keuangan. Klik untuk membuka.",
    colors:["#0a1628","#0d2137","#00e5c8","#00aaf5"],
    url:"https://xian0000000.github.io/statistic/",
    png:"statlab.png", isStatistic:true },

  // ── [7-8] Dinding Selatan ──────────────────────────────────
  { type:"painting", title:"Chat Ocean",       artist:"Xina",         year:"2026",
    desc:"Platform obrolan inovatif berbasis web. Klik tombol untuk mengunjungi.",
    colors:["#007bff","#0056b3","#003366","#001133"],
    url:"https://chatoceanfrontend-production.up.railway.app",
    png:"chatocean.png", isChatOcean:true },

  { type:"painting", title:"Perpustakaan Kuno",artist:"Xina",         year:"2026",
    desc:"Koleksi buku, artikel, dan referensi digital. Klik tombol untuk mengunjungi.",
    colors:["#0a1628","#1a3a6b","#2d6abf","#7eb8f7"],
    url:"https://frontend-production-ac9a.up.railway.app/",
    png:"perpuskuno.png", isLibrary:true },

  // ── [9-13] Galeri Foto — dinding timur zona selatan ────────
  // Ganti title/desc sesuai isi foto kamu!
  // File PNG: gallery1.png s/d gallery5.png (taruh di root bersama index.html)
  { type:"painting", title:"Galeri — I",       artist:"Otong Shippuden",         year:"2026",
    desc:"Koleksi foto pribadi.",
    colors:["#0a0a0a","#1a1a1a","#888","#aaa"],
    png:"gallery1.png", isGallery:true, galleryIdx:1 },

  { type:"painting", title:"Galeri — II",      artist:"Otong Shippuden",         year:"2026",
    desc:"Koleksi foto pribadi.",
    colors:["#0a0a0a","#1a1a1a","#888","#aaa"],
    png:"gallery2.png", isGallery:true, galleryIdx:2 },

  { type:"painting", title:"Galeri — III",     artist:"Otong Shippuden",         year:"2026",
    desc:"Koleksi foto pribadi.",
    colors:["#0a0a0a","#1a1a1a","#888","#aaa"],
    png:"gallery3.png", isGallery:true, galleryIdx:3 },

  { type:"painting", title:"Galeri — IV",      artist:"Otong Shippuden",         year:"2026",
    desc:"Koleksi foto pribadi.",
    colors:["#0a0a0a","#1a1a1a","#888","#aaa"],
    png:"gallery4.png", isGallery:true, galleryIdx:4 },

  { type:"painting", title:"Galeri — V",       artist:"Otong Shippuden",         year:"2026",
    desc:"Koleksi foto pribadi.",
    colors:["#0a0a0a","#1a1a1a","#888","#aaa"],
    png:"gallery5.png", isGallery:true, galleryIdx:5 },

  // ── Patung / Kubus 3D ──────────────────────────────────────
  { type:"sculpture", title:"GitHub",
    artist:"Xina", year:"2026",
    desc:"Lihat semua proyek dan kontribusi open source. Kunjungi profil GitHub.",
    icon:"</>", bg:"#0d1117", accent:"#58a6ff",
    url:"https://github.com/xian0000000", isGithub:true },

  { type:"sculpture", title:"LinkedIn",
    artist:"Xina", year:"2026",
    desc:"Terhubung secara profesional. Kunjungi profil LinkedIn.",
    icon:"in", bg:"#08121f", accent:"#0ea5e9",
    url:"https://www.linkedin.com/in/afriansyah-saputro-5638b7362", isLinkedin:true },

  { type:"sculpture", title:"Music",
    artist:"Xina", year:"2026",
    desc:"Putar musik museum dan nikmati visualizer audio 3D yang mengelilingi patung.",
    icon:"\u266a", bg:"#0e0a04", accent:"#c8a050",
    videoId:"5uDY6hEYfPc",
    url:"https://youtu.be/5uDY6hEYfPc", isMusic:true },
];
