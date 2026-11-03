"use client";

import { useEffect, useRef } from "react";

/**
 * Rasi bintang Orion 3D untuk kolom kanan beranda. Setiap bintang utama diberi nama skill.
 *
 * Posisi bintang dihitung dari koordinat langit aslinya (RA dan deklinasi), jadi dari depan
 * bentuknya sama dengan Orion yang terlihat dari bumi: timur di kiri, utara di atas. Ukuran
 * bintang mengikuti magnitudo aslinya (makin kecil magnitudo, makin terang), dan Betelgeuse
 * diberi warna kuning keemasan.
 *
 * Efek 3D memakai jarak asli tiap bintang dari bumi sebagai kedalaman, lalu diproyeksikan
 * ulang setiap frame dengan perspektif:
 * - Kamera berada sedikit di atas, berayun pelan ke kiri dan kanan, dan mengikuti arah
 *   kursor dengan halus (easing), jadi terasa seperti melihat model 3D.
 * - Bidang acuan berupa grid perspektif di bawah rasi, dengan garis jatuh dari setiap
 *   bintang ke bidang itu, seperti peta bintang 3D. Dari sini terlihat bintang mana yang
 *   dekat dan mana yang jauh.
 * - Bintang yang dekat terlihat lebih besar dan terang, yang jauh lebih kecil dan redup.
 *   Garis rasi yang lebih dekat juga sedikit lebih terang. (Urutan elemen sengaja tidak
 *   diubah setiap frame, karena memindahkan elemen membuat animasi CSS-nya mulai ulang.)
 * - Bintang latar ikut bergeser sedikit sebagai efek paralaks.
 */

type Star = {
  id: string;
  skill: string;
  ra: number; // derajat
  dec: number; // derajat
  mag: number;
  dist: number; // jarak dari bumi dalam tahun cahaya (perkiraan)
  warm?: boolean;
  // Posisi label relatif terhadap bintang.
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
};

const STARS: Star[] = [
  {
    id: "betelgeuse",
    skill: "React",
    ra: 88.79,
    dec: 7.41,
    mag: 0.5,
    dist: 548,
    warm: true,
    label: { dx: -12, dy: 4, anchor: "end" },
  },
  {
    id: "meissa",
    skill: "TypeScript",
    ra: 83.78,
    dec: 9.93,
    mag: 3.33,
    dist: 1100,
    label: { dx: 0, dy: -11, anchor: "middle" },
  },
  {
    id: "bellatrix",
    skill: "Vue.js",
    ra: 81.28,
    dec: 6.35,
    mag: 1.64,
    dist: 250,
    label: { dx: 12, dy: 4, anchor: "start" },
  },
  {
    id: "alnitak",
    skill: "Tailwind CSS",
    ra: 85.19,
    dec: -1.94,
    mag: 1.77,
    dist: 1260,
    label: { dx: -11, dy: 4, anchor: "end" },
  },
  {
    id: "alnilam",
    skill: "Docker",
    ra: 84.05,
    dec: -1.2,
    mag: 1.69,
    dist: 2000,
    // Digeser ke kanan agar tidak bertemu label Tailwind CSS saat rasi berayun.
    label: { dx: 8, dy: 19, anchor: "middle" },
  },
  {
    id: "mintaka",
    skill: "Golang",
    ra: 83.0,
    dec: -0.3,
    mag: 2.23,
    dist: 1200,
    label: { dx: 11, dy: 0, anchor: "start" },
  },
  {
    id: "saiph",
    skill: "PostgreSQL",
    ra: 86.94,
    dec: -9.67,
    mag: 2.06,
    dist: 650,
    label: { dx: -11, dy: 4, anchor: "end" },
  },
  {
    id: "rigel",
    skill: "Next.js",
    ra: 78.63,
    dec: -8.2,
    mag: 0.13,
    dist: 863,
    label: { dx: 13, dy: 4, anchor: "start" },
  },
];

// Garis rasi Orion yang umum dipakai di peta bintang. Urutan dan arahnya adalah urutan
// menggambar: setiap garis dimulai dari bintang yang sudah muncul, dari kepala ke kaki.
const LINES: [string, string][] = [
  ["meissa", "betelgeuse"],
  ["betelgeuse", "bellatrix"],
  ["bellatrix", "meissa"],
  ["betelgeuse", "alnitak"],
  ["bellatrix", "mintaka"],
  ["alnitak", "alnilam"],
  ["alnilam", "mintaka"],
  ["alnitak", "saiph"],
  ["mintaka", "rigel"],
];

// Waktu animasi dalam detik. Garis digambar satu per satu, dan setiap bintang muncul saat
// garis pertama sampai kepadanya. Satu siklus (muncul, bertahan, memudar) berlangsung
// 12 detik, diatur lewat --sc-cycle di index.css.
const START = 0.3;
const STEP = 0.5;
const DRAW = 0.48;
const lineStart = (i: number) => START + i * STEP;
const APPEAR: Record<string, number> = {};
LINES.forEach(([a, b], i) => {
  APPEAR[a] ??= lineStart(i);
  APPEAR[b] ??= lineStart(i) + DRAW;
});

// Proyeksi sederhana: 20 unit per derajat. RA dibalik karena timur berada di kiri.
const SCALE = 20;
const X0 = 85;
const Y0 = 40;
const skyToMap = (ra: number, dec: number) => ({
  x: X0 + (89 - ra) * SCALE,
  y: Y0 + (10 - dec) * SCALE,
});
const POS = Object.fromEntries(STARS.map((s) => [s.id, skyToMap(s.ra, s.dec)]));

// ── 3D ──
// Titik pusat rasi menjadi poros putaran.
const CX = STARS.reduce((n, s) => n + POS[s.id].x, 0) / STARS.length;
const CY = STARS.reduce((n, s) => n + POS[s.id].y, 0) / STARS.length;
// Jarak kamera.
const CAMERA = 560;
// Kedalaman dikompres secara logaritmik: urutan jarak tetap sesuai aslinya, tetapi
// selisihnya diperkecil. Tanpa ini, bintang sabuk (Docker dan Golang) saling menyusul saat
// berayun karena jarak aslinya sangat berbeda (2.000 dan 1.200 tahun cahaya). Nilai ini
// sudah diuji untuk seluruh sudut kamera: label tidak bertumpuk dan bintang tidak bertabrakan.
const DEPTH = 40;
const MEAN_DIST = 900;
// Titik 3D dibuat sedemikian rupa sehingga dari depan hasil proyeksinya tepat sama dengan
// posisi di peta bintang.
const P3 = Object.fromEntries(
  STARS.map((s) => {
    const z = Math.log(s.dist / MEAN_DIST) * DEPTH;
    const k = (CAMERA + z) / CAMERA;
    return [s.id, { x: (POS[s.id].x - CX) * k, y: (POS[s.id].y - CY) * k, z }];
  }),
);
// Bidang acuan berada sedikit di bawah bintang paling bawah.
const PLANE_Y = Math.max(...STARS.map((s) => P3[s.id].y)) + 18;
const RINGS = [45, 90, 135];
const SPOKES = 8;

const deg = (d: number) => (d * Math.PI) / 180;
const BASE_PITCH = deg(11); // kamera sedikit dari atas agar bidang acuan terlihat
const SWAY = deg(18); // ayunan otomatis kiri-kanan
const NOD = deg(4); // anggukan otomatis
const SWAY_PERIOD = 22; // detik
const NOD_PERIOD = 31; // detik
const POINTER_YAW = deg(10); // pengaruh kursor
const POINTER_PITCH = deg(6);

type Cam = { yaw: number; pitch: number };
type Pt = { x: number; y: number; z: number; f: number };
function project(x: number, y: number, z: number, cam: Cam): Pt {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const f = CAMERA / (CAMERA + z2);
  return { x: CX + x1 * f, y: CY + y2 * f, z: z2, f };
}

// Ukuran dan kecerahan bintang relatif terhadap tampilan depan.
type View = Pt & { s: number; o: number };
function starView(id: string, cam: Cam): View {
  const p = P3[id];
  const v = project(p.x, p.y, p.z, cam);
  return {
    ...v,
    s: (CAMERA + p.z) / (CAMERA + v.z),
    o: Math.min(1, Math.max(0.45, 1 - (v.z - p.z) / 160)),
  };
}

// Path grid perspektif: lingkaran konsentris dan jari-jari di bidang acuan.
function planePath(cam: Cam) {
  const pt = (x: number, z: number) => {
    const v = project(x, PLANE_Y, z, cam);
    return `${v.x.toFixed(1)},${v.y.toFixed(1)}`;
  };
  let d = "";
  for (const r of RINGS) {
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      d += `${i ? "L" : "M"}${pt(Math.cos(a) * r, Math.sin(a) * r)}`;
    }
  }
  for (let i = 0; i < SPOKES; i++) {
    const a = (i / SPOKES) * Math.PI * 2;
    d += `M${pt(Math.cos(a) * 20, Math.sin(a) * 20)}L${pt(Math.cos(a) * RINGS[2], Math.sin(a) * RINGS[2])}`;
  }
  return d;
}

const FRONT_CAM: Cam = { yaw: 0, pitch: BASE_PITCH };
const FRONT = Object.fromEntries(STARS.map((s) => [s.id, starView(s.id, FRONT_CAM)]));
const FRONT_FOOT = Object.fromEntries(
  STARS.map((s) => [s.id, project(P3[s.id].x, PLANE_Y, P3[s.id].z, FRONT_CAM)]),
);
const FRONT_PLANE = planePath(FRONT_CAM);

// Jari-jari inti dan pendar dari magnitudo. Bintang paling terang sekitar 3.4 unit.
const coreR = (mag: number) => 3.4 - mag * 0.55;

// Bintang latar yang redup. Posisinya dari generator acak berbenih agar selalu sama
// di server dan browser.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const rand = seeded(7);
const FIELD = Array.from({ length: 46 }, () => ({
  x: rand() * 380,
  y: 16 + rand() * 432,
  r: 0.5 + rand() * 0.8,
  o: 0.15 + rand() * 0.35,
  d: rand() * 6,
}));

const ALL = STARS.map((s) => s.skill).join(", ");

const f2 = (n: number) => n.toFixed(2);

export default function SkillConstellation() {
  const fieldRef = useRef<SVGGElement>(null);
  const planeRef = useRef<SVGPathElement>(null);
  const starRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dropRefs = useRef<(SVGLineElement | null)[]>([]);
  const footRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Posisi kursor (-1 sampai 1). Kamera mengejarnya dengan halus.
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const frame = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      // Ayunan otomatis berhenti saat di-hover, kamera tetap mengikuti kursor.
      if (!pausedRef.current) t += dt;
      const k = 1 - Math.exp(-dt * 3);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;

      const cam: Cam = {
        yaw: SWAY * Math.sin((2 * Math.PI * t) / SWAY_PERIOD) + eased.x * POINTER_YAW,
        pitch:
          BASE_PITCH + NOD * Math.sin((2 * Math.PI * t) / NOD_PERIOD) + eased.y * POINTER_PITCH,
      };

      const views: Record<string, View> = {};
      STARS.forEach((st, i) => {
        const v = starView(st.id, cam);
        views[st.id] = v;
        const el = starRefs.current[i];
        if (el) {
          el.setAttribute("transform", `translate(${f2(v.x)} ${f2(v.y)}) scale(${v.s.toFixed(3)})`);
          el.setAttribute("opacity", v.o.toFixed(3));
        }
        // Garis jatuh ke bidang acuan.
        const foot = project(P3[st.id].x, PLANE_Y, P3[st.id].z, cam);
        const drop = dropRefs.current[i];
        if (drop) {
          drop.setAttribute("x1", f2(v.x));
          drop.setAttribute("y1", f2(v.y));
          drop.setAttribute("x2", f2(foot.x));
          drop.setAttribute("y2", f2(foot.y));
        }
        const footEl = footRefs.current[i];
        if (footEl) {
          footEl.setAttribute("cx", f2(foot.x));
          footEl.setAttribute("cy", f2(foot.y));
          footEl.setAttribute("rx", f2(3.2 * foot.f));
          footEl.setAttribute("ry", f2(3.2 * foot.f * Math.sin(cam.pitch)));
        }
      });

      LINES.forEach(([a, b], i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        el.setAttribute("x1", f2(views[a].x));
        el.setAttribute("y1", f2(views[a].y));
        el.setAttribute("x2", f2(views[b].x));
        el.setAttribute("y2", f2(views[b].y));
        // Garis yang lebih dekat sedikit lebih terang. Nilainya dikirim lewat variabel
        // CSS agar opacity akhirnya tetap bisa diatur per tema di index.css.
        const z = (views[a].z + views[b].z) / 2;
        el.style.setProperty(
          "--sc-depth",
          Math.min(0.32, Math.max(0.1, 0.2 - z / 900)).toFixed(3),
        );
      });

      planeRef.current?.setAttribute("d", planePath(cam));
      // Paralaks: bintang latar dianggap sangat jauh, jadi hanya bergeser sedikit.
      fieldRef.current?.setAttribute(
        "transform",
        `translate(${f2(-Math.sin(cam.yaw) * 22)} ${f2(Math.sin(cam.pitch - BASE_PITCH) * 14)})`,
      );

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <figure
      className="skill-constellation"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <svg viewBox="0 16 380 432" role="img" aria-label={`Orion constellation. Skills: ${ALL}`}>
        <defs>
          <radialGradient id="sc-glow">
            <stop offset="0%" style={{ stopColor: "var(--sc-star)", stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: "var(--sc-star)", stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="sc-glow-warm">
            <stop offset="0%" style={{ stopColor: "var(--sc-warm)", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "var(--sc-warm)", stopOpacity: 0 }} />
          </radialGradient>
          {/* Grid memudar ke arah tepi agar tidak terlihat terpotong. */}
          <radialGradient
            id="sc-plane-fade"
            gradientUnits="userSpaceOnUse"
            cx={CX}
            cy={FRONT_FOOT[STARS[0].id].y}
            r="150"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask
            id="sc-plane-mask"
            maskUnits="userSpaceOnUse"
            x="-200"
            y="-200"
            width="800"
            height="900"
          >
            <rect x="-200" y="-200" width="800" height="900" fill="url(#sc-plane-fade)" />
          </mask>
        </defs>

        <g ref={fieldRef}>
          {FIELD.map((f, i) => (
            <circle
              key={i}
              className="sc-field"
              cx={f.x.toFixed(1)}
              cy={f.y.toFixed(1)}
              r={f.r.toFixed(2)}
              style={{ opacity: f.o, animationDelay: `${-f.d}s` }}
            />
          ))}
        </g>

        {/* Bidang acuan 3D. */}
        <path ref={planeRef} className="sc-plane" d={FRONT_PLANE} mask="url(#sc-plane-mask)" />

        {/* Garis jatuh dari setiap bintang ke bidang acuan, muncul bersama bintangnya. */}
        <g className="sc-drops">
          {STARS.map((s, i) => (
            <g key={s.id} className="sc-drop" style={{ animationDelay: `${APPEAR[s.id]}s` }}>
              <line
                ref={(el) => {
                  dropRefs.current[i] = el;
                }}
                x1={f2(FRONT[s.id].x)}
                y1={f2(FRONT[s.id].y)}
                x2={f2(FRONT_FOOT[s.id].x)}
                y2={f2(FRONT_FOOT[s.id].y)}
              />
              <ellipse
                ref={(el) => {
                  footRefs.current[i] = el;
                }}
                cx={f2(FRONT_FOOT[s.id].x)}
                cy={f2(FRONT_FOOT[s.id].y)}
                rx="3"
                ry="0.8"
              />
            </g>
          ))}
        </g>

        <g className="sc-lines">
          {LINES.map(([a, b], i) => (
            <line
              key={`${a}-${b}`}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              x1={f2(FRONT[a].x)}
              y1={f2(FRONT[a].y)}
              x2={f2(FRONT[b].x)}
              y2={f2(FRONT[b].y)}
              pathLength={1}
              style={{ animationDelay: `${lineStart(i)}s` }}
            />
          ))}
        </g>

        <g>
          {STARS.map((s, i) => {
            const r = coreR(s.mag);
            const bright = s.mag < 1;
            const v = FRONT[s.id];
            // Bintang digambar di titik (0, 0), lalu dipindah lewat transform setiap frame.
            return (
              <g
                key={s.id}
                ref={(el) => {
                  starRefs.current[i] = el;
                }}
                transform={`translate(${f2(v.x)} ${f2(v.y)}) scale(${v.s.toFixed(3)})`}
              >
                <g
                  className={`sc-star${s.warm ? " sc-warm" : ""}`}
                  style={{ animationDelay: `${-(i * 0.7)}s` }}
                >
                  {/* Bungkus untuk animasi muncul, terpisah dari animasi berkelip di .sc-star. */}
                  <g className="sc-pop" style={{ animationDelay: `${APPEAR[s.id]}s` }}>
                    <circle
                      className="sc-glow"
                      r={r * 4}
                      fill={s.warm ? "url(#sc-glow-warm)" : "url(#sc-glow)"}
                    />
                    {/* Pancaran silang tipis untuk dua bintang paling terang. */}
                    {bright && (
                      <path
                        className="sc-spike"
                        d={`M${-r * 4},0 L${r * 4},0 M0,${-r * 4} L0,${r * 4}`}
                      />
                    )}
                    <circle className="sc-core" r={r} />
                    <text
                      className="sc-label"
                      x={s.label.dx}
                      y={s.label.dy}
                      textAnchor={s.label.anchor}
                    >
                      {s.skill}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </figure>
  );
}
