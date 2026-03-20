/**
 * exhibits.js — Data seluruh pameran museum.
 *
 * Slot lukisan:
 *   [0-2] Dinding Utara  · [3-4] Timur · [5-6] Barat · [7-8] Selatan
 *
 * Slot patung (urutan SCULPTURE_POSITIONS di app.js):
 *   0 → kiri-utara  1 → kanan-utara  2 → tengah (musik)
 */

export const EXHIBITS = [

  // ── Lukisan Seni ───────────────────────────────────────────────
  { type:"painting", title:"Harmoni Cahaya",    artist:"Rina Dewanto", year:"2021",
    desc:"Ekspresi abstrak tentang perjalanan waktu melalui gelombang warna yang saling berpadu.",
    colors:["#0e2a4a","#1a6090","#e87820","#f0a030"] },

  { type:"painting", title:"Kota Imajiner",     artist:"Bima Santoso", year:"2019",
    desc:"Karya geometris menggambarkan kompleksitas kehidupan urban — kaca, baja, dan cahaya neon.",
    colors:["#120820","#602080","#c040a0","#40c0e0"] },

  { type:"painting", title:"Hutan Mimpi",       artist:"Laras Utami",  year:"2020",
    desc:"Interpretasi organis dari alam liar melalui sapuan warna hijau yang bebas dan energik.",
    colors:["#081a10","#1a5830","#40a050","#90d840"] },

  { type:"painting", title:"Lautan Waktu",      artist:"Farhan Rizki", year:"2018",
    desc:"Meditasi visual tentang kedalaman samudra sebagai metafora perjalanan jiwa.",
    colors:["#040c1c","#082050","#1060a0","#30b0e0"] },

  { type:"painting", title:"Api Jiwa",          artist:"Rina Dewanto", year:"2022",
    desc:"Energi kehidupan yang berpijar — palet warna panas meledak dalam satu momen abadi.",
    colors:["#2a0800","#a01808","#e05010","#f0a020"] },

  { type:"painting", title:"Life Dashboard",     artist:"Xina",         year:"2026",
    desc:"Dashboard kehidupan interaktif — pantau kebiasaan, target, dan progres harianmu. Klik untuk membuka.",
    colors:["#0a0f1e","#0d2137","#7c3aed","#a855f7"],
    url:"https://xian0000000.github.io/life_dashboard/", isLifeDashboard:true },

  { type:"painting", title:"StatLab",           artist:"Xina",         year:"2026",
    desc:"Platform analisis statistik interaktif — riset, lab, dan keuangan. Klik untuk membuka.",
    colors:["#0a1628","#0d2137","#00e5c8","#00aaf5"],
    url:"https://xian0000000.github.io/statistic/", isStatistic:true },

  { type:"painting", title:"Chat Ocean",        artist:"Xina",         year:"2026",
    desc:"Platform obrolan inovatif berbasis web. Klik tombol untuk mengunjungi.",
    colors:["#007bff","#0056b3","#003366","#001133"],
    url:"https://chatoceanfrontend-production.up.railway.app", isChatOcean:true },

  { type:"painting", title:"Perpustakaan Kuno", artist:"Xina",         year:"2026",
    desc:"Koleksi buku, artikel, dan referensi digital. Klik tombol untuk mengunjungi.",
    colors:["#0a1628","#1a3a6b","#2d6abf","#7eb8f7"],
    url:"https://frontend-production-ac9a.up.railway.app/", isLibrary:true },

  // ── Patung (kubus 3D) ──────────────────────────────────────────
  { type:"sculpture", title:"GitHub",
    artist:"Xina", year:"2026",
    desc:"Lihat semua proyek dan kontribusi open source. Kunjungi profil GitHub.",
    icon:"</>", bg:"#0d1117", accent:"#58a6ff",
    url:"https://github.com/xian0000000",
    isGithub:true },

  { type:"sculpture", title:"LinkedIn",
    artist:"Xina", year:"2026",
    desc:"Terhubung secara profesional. Kunjungi profil LinkedIn.",
    icon:"in", bg:"#08121f", accent:"#0ea5e9",
    url:"https://www.linkedin.com/in/afriansyah-saputro-5638b7362",
    isLinkedin:true },

  { type:"sculpture", title:"Music",
    artist:"Xina", year:"2026",
    desc:"Putar musik museum dan nikmati visualizer audio 3D yang mengelilingi patung.",
    icon:"\u266a", bg:"#0e0a04", accent:"#c8a050",
    videoId:"5uDY6hEYfPc",
    url:"https://youtu.be/5uDY6hEYfPc?si=Z28WhXUv3kO9rSuO",
    isMusic:true },
];
