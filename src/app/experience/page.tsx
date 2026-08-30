"use client";

import React from "react";

const C = {
  bg: "var(--bg-color)",
  surface: "var(--surface-color)",
  surface2: "var(--surface2-color)",
  border: "var(--border-color)",
  muted: "var(--muted-color)",
  fg: "var(--fg-color)",
  green: "var(--green-color)",
  amber: "var(--amber-color)",
  blue: "var(--blue-color)",
  purple: "var(--purple-color)",
  red: "var(--red-color)",
  teal: "var(--teal-color)",
  orange: "var(--orange-color)",
};

export const timeline = [
  {
    year: "March 2026 - Current",
    title: "Software Engineer",
    place: "TAN Digital",
    desc: "When I first joined, I started with a project for Mitratel, building data visualizations and geospatial features around tower data. Then, I moved to PMT, where I worked on revamping the UI. After that, I joined a TSEL project, working on network analysis using reports from Ookla and Speedtest.",
  },
  {
    year: "Dec 2024 - Feb 2026",
    title: "Frontend Engineer",
    place: "TAN Digital",
    desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
  },
  {
    year: "Feb 2023 - Nov 2024",
    title: "Frontend Developer",
    place: "Infosys Solusi Terpadu",
    desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
  },
  {
    year: "Oct 2022 - Jan 2023",
    title: "React Js Developer",
    place: "Infosys Solusi Terpadu",
    desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
  },
  {
    year: "Feb 2022 - Jul 2022",
    title: "Frontend Developer",
    place: "Media Kreasi Abadi",
    desc: "Delivered Next.js + Golang SaaS with Google OAuth 2.0, Prisma ORM, Docker, Nginx. Full Playwright E2E coverage.",
  },
  {
    year: "Sep 2021 - Jan 2022",
    title: "Frontend Developer",
    place: "Geeschool Cendekia Mandiri",
    desc: "Developed Vue.js & Next.js apps. Integrated Google Maps JS API and Places API for logistics clients.",
  },
  {
    year: "Feb 2021 - Jul 2021",
    title: "Web Programming Practicum Assistant",
    place: "Forum Asisten",
    desc: "Started with React, fell in love with maps. Built first GeoJSON visualizer and REST API in Express.js.",
  },
];

/* Entri dikelompokkan per perusahaan.

   Alasannya ada di datanya sendiri: dari 7 entri, hanya ada 5 perusahaan —
   TAN Digital dan Infosys Solusi Terpadu masing-masing muncul dua kali sebagai
   dua jabatan berbeda. Daftar rata membuat kedua nama itu terulang dan
   menyembunyikan fakta yang justru paling berarti, yaitu adanya kenaikan
   jabatan di tempat yang sama.

   Yang digabung hanya entri BERURUTAN. Kalau suatu saat ada perusahaan yang
   dimasuki lagi setelah jeda di tempat lain, menggabungkannya jadi satu blok
   akan menyalahi urutan waktunya. */
function groupByPlace(rows: typeof timeline) {
  const out: { place: string; roles: typeof timeline }[] = [];
  for (const r of rows) {
    const last = out[out.length - 1];
    if (last && last.place === r.place) last.roles.push(r);
    else out.push({ place: r.place, roles: [r] });
  }
  return out;
}

/* Rentang gabungan satu perusahaan, diturunkan dari entrinya — bukan ditulis
   ulang di data. Barisnya terurut dari yang terbaru, jadi awalnya diambil dari
   entri TERAKHIR dan akhirnya dari entri PERTAMA. */
function placeSpan(roles: typeof timeline) {
  const first = roles[roles.length - 1].year.split(" - ")[0];
  const last = roles[0].year.split(" - ")[1] ?? roles[0].year;
  return `${first} - ${last}`;
}

/* Hanya TAN Digital yang punya berkas logo di repo ini. Peta, bukan diturunkan
   dari namanya, karena nama berkas tidak mengikuti aturan apa pun. Perusahaan
   yang tidak ada di sini otomatis memakai inisial. */
const PLACE_LOGO: Record<string, string> = {
  "TAN Digital": "/assets/images/logo-tan.webp",
};

/* Inisial untuk perusahaan tanpa logo. Dipotong 3 huruf supaya lebarnya tetap
   sepadan di plakat 34px: "Geeschool Cendekia Mandiri" jadi GCM, bukan tiga
   huruf yang memenuhi kotaknya. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

const MONO = "'JetBrains Mono', monospace";

/* Lebar plakat dan jarak-jarak yang bergantung padanya, ditulis sekali di sini.
   Relnya turun dari TITIK TENGAH plakat, jadi ketiga angka ini saling terikat:
   ubah BADGE, dua lainnya ikut. */
const BADGE = 34;
const RAIL_X = BADGE / 2; // rel sejajar tengah plakat
const ROLE_PAD = 29; // isi jabatan sejajar dengan nama perusahaan di kepala

export default function Experience() {
  const groups = groupByPlace(timeline);

  return (
    <div className="relative mt-8" style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-12 max-w-5xl mx-auto">
        <h1 className="font-caveat text-[clamp(2rem,4vw,2.8rem)] font-bold text-foreground m-0">
          Skill & Experiences
        </h1>
        <p
          className="mt-2 mb-10"
          style={{ fontFamily: MONO, fontSize: "0.72rem", color: C.muted, opacity: 0.75 }}
        >
          {timeline.length} roles across {groups.length} places
        </p>

        {groups.map((g) => (
          <section key={g.place} className="mb-11 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
              {/* Plakat perusahaan: logo kalau ada, kalau tidak inisialnya.
                  Kotaknya sengaja berukuran sama untuk keduanya, jadi kelima
                  kepala kelompok tetap sejajar meski cuma satu yang punya logo.

                  Kotak polos, bukan digambar tangan: di halaman ini yang bertugas
                  jadi doodle adalah penanda jabatan di rel. Kalau plakatnya juga
                  bergaya coretan, keduanya berebut peran dan tampilannya justru
                  jadi ramai. */}
              <div
                className="shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  width: BADGE,
                  height: BADGE,
                  borderRadius: 9,
                  border: `1px solid ${C.border}`,
                  backgroundColor: C.surface,
                }}
              >
                {PLACE_LOGO[g.place] ? (
                  <img
                    className="place-logo"
                    src={PLACE_LOGO[g.place]}
                    alt={g.place}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: initials(g.place).length > 2 ? "0.62rem" : "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: C.muted,
                    }}
                  >
                    {initials(g.place)}
                  </span>
                )}
              </div>

              {/* Nama di kiri, rentang tahun rata kanan. Tanpa garis penghubung:
                  di kepala kelompok yang isinya cuma dua hal, jarak kosong sudah
                  cukup memisahkan keduanya, dan garisnya justru menambah satu
                  elemen bergaris lagi di samping rel putus-putus di bawahnya. */}
              <h2
                className="m-0 shrink-0"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: C.fg,
                }}
              >
                {g.place}
              </h2>
              {/* `ml-auto` menggantikan pengisi ber-`flex-1` yang dulu ada di
                  sini — rentang tahun tetap rata kanan, tapi tanpa elemen
                  tambahan di DOM. */}
              <span
                className="shrink-0 ml-auto"
                style={{
                  fontFamily: MONO,
                  fontSize: "0.61rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.muted,
                }}
              >
                {placeSpan(g.roles)}
              </span>
            </div>

            {/* Rel utuh per kelompok, turun dari tengah plakat di atasnya
                supaya keduanya terbaca satu bagian. Panjang relnya jadi ikut
                menerangkan lama bekerja di satu tempat, dan jeda antar kelompok
                memberi halaman ini ritme yang tidak dimiliki daftar rata. */}
            <div
              className="relative"
              style={{
                marginLeft: RAIL_X,
                paddingLeft: ROLE_PAD,
                borderLeft: `1px solid ${C.border}`,
              }}
            >
              {g.roles.map((t, i) => (
                /* `relative` wajib: penanda di bawah `absolute`, dan tanpa ini
                   ia mengacu ke pembungkus KELOMPOK sehingga semua penanda dalam
                   satu kelompok menumpuk di baris pertama. */
                <div key={t.year} className={`relative ${i < g.roles.length - 1 ? "mb-6" : ""}`}>
                  {/* Penanda jabatan: lingkaran berongga bergaya coretan,
                      menggantikan pita pembatas yang merah dan berisi.

                      Diganti karena sekarang tiap kelompok sudah punya plakat
                      perusahaan. Pita yang berisi penuh itu berat, dan tujuh di
                      antaranya menarik perhatian melebihi plakat yang justru
                      seharusnya jadi jangkar.

                      Warnanya merah, sama seperti pita tadi, tapi bobotnya jauh
                      lebih ringan: garis 1.3px dengan isian 0.22, bukan bidang
                      penuh. Merah dipilih karena satu-satunya yang kuat di KEDUA
                      tema — rasio kontras 8.33 di dark (#ff7b72) dan 3.42 di
                      light (#e05c4a); amber cuma 2.39 di light.

                      Penanda ini juga satu-satunya yang berwarna di halaman ini,
                      jadi ia yang menandai posisi tanpa perlu diperbesar.

                      Tetap doodle, bukan bulatan CSS: sapuannya 380 derajat
                      (melebihi satu putaran) sehingga ujungnya lewat sedikit
                      dari pangkalnya, dan jari-jarinya bervariasi 3.2-3.8.
                      Disambung Catmull-Rom supaya tetap mulus, bukan bergerigi.

                      `left` dihitung, bukan dikira-kira: tepi kiri pembungkus
                      jabatan ada di RAIL_X + 1 + ROLE_PAD dari tepi bagian ini,
                      jadi -(1 + ROLE_PAD + 5.5) menaruh pusat lingkaran tepat di
                      atas rel. */}
                  <svg
                    className="absolute overflow-visible"
                    style={{ left: -(1 + ROLE_PAD + 5.5), top: 4, width: 11, height: 11 }}
                    viewBox="0 0 11 11"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.89,2.05 C5.26,2.05 6.51,1.75 7.08,2.04 C7.64,2.34 7.92,3.22 8.28,3.84 C8.64,4.45 9.26,5.13 9.21,5.74 C9.17,6.34 8.45,6.93 8.02,7.48 C7.58,8.02 7.18,8.82 6.59,9.01 C6.01,9.21 5.19,8.85 4.52,8.65 C3.85,8.45 2.96,8.31 2.54,7.82 C2.13,7.34 2.06,6.43 2.01,5.72 C1.96,5.01 1.88,4.08 2.24,3.55 C2.60,3.02 3.50,2.84 4.15,2.55 C4.81,2.27 5.81,1.96 6.15,1.84"
                      stroke={C.red}
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={C.red}
                      fillOpacity="0.22"
                    />
                  </svg>

                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                    <span
                      style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: "1.28rem",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: C.fg,
                      }}
                    >
                      {t.title}
                    </span>
                    {/* Disembunyikan kalau kelompoknya cuma berisi satu jabatan:
                        rentangnya pasti sama persis dengan yang sudah tertulis di
                        kepala kelompok, dan mengulanginya membuat baris ini
                        terbaca seperti ada dua keterangan waktu yang berbeda. */}
                    {g.roles.length > 1 && (
                      <span
                        className="shrink-0"
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.6rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: C.muted,
                          opacity: 0.8,
                        }}
                      >
                        {t.year}
                      </span>
                    )}
                  </div>

                  <p
                    className="m-0"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.83rem",
                      lineHeight: 1.75,
                      color: C.muted,
                      maxWidth: "620px",
                    }}
                  >
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
