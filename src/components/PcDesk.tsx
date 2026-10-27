"use client";

import { type CSSProperties, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";

// Adegan meja setelah PC menyala, dibuat dengan CSS 3D tanpa library.
// Satuannya px di ruang adegan, dengan titik (0,0,0) di tengah permukaan meja.
// Sumbu mengikuti CSS: x ke kanan, y ke BAWAH, z mendekat ke penonton.
// Semua benda berdiri di atas y = 0, jadi tingginya bernilai negatif.

type Face = { style?: CSSProperties; children?: ReactNode; className?: string };
type Side = "front" | "back" | "left" | "right" | "top" | "bottom";

// Cahaya datang dari depan atas, jadi tiap sisi digelapkan sesuai arahnya.
// Gelapnya memakai inset box-shadow agar isi sisi (gambar casing, layar) tidak ikut gelap.
const SHADE: Record<Side, number> = { top: 0, front: 0.1, left: 0.28, right: 0.34, back: 0.45, bottom: 0.6 };

function Box({
  x = 0,
  y = 0,
  z = 0,
  w,
  h,
  d,
  fill,
  faces = {},
  ry = 0,
  children,
}: {
  x?: number;
  y?: number;
  z?: number;
  w: number;
  h: number;
  d: number;
  fill: string;
  faces?: Partial<Record<Side, Face>>;
  ry?: number;
  children?: ReactNode;
}) {
  const geo: Record<Side, [number, number, string]> = {
    front: [w, h, `translateZ(${d / 2}px)`],
    back: [w, h, `rotateY(180deg) translateZ(${d / 2}px)`],
    right: [d, h, `rotateY(90deg) translateZ(${w / 2}px)`],
    left: [d, h, `rotateY(-90deg) translateZ(${w / 2}px)`],
    top: [w, d, `rotateX(90deg) translateZ(${h / 2}px)`],
    bottom: [w, d, `rotateX(-90deg) translateZ(${h / 2}px)`],
  };
  return (
    <div
      className="absolute top-0 left-0"
      style={{ transformStyle: "preserve-3d", transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg)` }}
    >
      {(Object.keys(geo) as Side[]).map((s) => {
        const [fw, fh, t] = geo[s];
        const f = faces[s];
        return (
          <div
            key={s}
            className={`absolute overflow-hidden ${f?.className ?? ""}`}
            style={{
              width: fw,
              height: fh,
              left: -fw / 2,
              top: -fh / 2,
              transform: t,
              backfaceVisibility: "hidden",
              background: fill,
              boxShadow: SHADE[s] ? `inset 0 0 0 9999px rgba(0,0,0,${SHADE[s]})` : undefined,
              ...f?.style,
            }}
          >
            {f?.children}
          </div>
        );
      })}
      {children}
    </div>
  );
}

// Bidang datar di permukaan meja, seperti alas mouse, bayangan, dan pantulan cahaya.
function Flat({ x, z, w, d, y = -0.5, style }: { x: number; z: number; w: number; d: number; y?: number; style: CSSProperties }) {
  return (
    <div
      className="absolute"
      style={{
        width: w,
        height: d,
        left: -w / 2,
        top: -d / 2,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(90deg)`,
        backfaceVisibility: "hidden",
        ...style,
      }}
    />
  );
}

// Tata letak meja.
const DESK = { w: 940, d: 460, t: 30 };
const MON = { x: -60, z: -110, w: 470, h: 306, d: 14, lift: 112 };
const MON_Y = -MON.lift - MON.h / 2;
// Tinggi leher dudukan, dari pelat di meja sampai tengah punggung panel.
const NECK_H = -MON_Y - 6;
// Proporsi dinding samping casing sama dengan viewBox gambar casing (460 x 420).
const TOWER = { x: 340, z: -20, w: 128, h: 230, d: 252 };

type Cam = { key: string; label: string; yaw: number; pitch: number; dist: number; at: [number, number, number] };
// Sudut kamera: yaw positif = kamera di kiri, pitch negatif = kamera di atas.
// Urutan ini juga urutan tur: layar selama BIOS, lalu front sampai top down.
const CAMS: Cam[] = [
  { key: "screen", label: "screen", yaw: 0, pitch: 2.4, dist: -330, at: [MON.x, MON_Y, MON.z] },
  { key: "front", label: "front", yaw: 0, pitch: -7, dist: 160, at: [20, -170, 0] },
  { key: "hero", label: "desk", yaw: 26, pitch: -17, dist: 120, at: [40, -150, 0] },
  { key: "low", label: "low angle", yaw: 40, pitch: -2, dist: -120, at: [150, -130, 0] },
  { key: "glass", label: "side glass", yaw: 64, pitch: -9, dist: -260, at: [TOWER.x, -TOWER.h / 2, TOWER.z] },
  { key: "top", label: "top down", yaw: 6, pitch: -62, dist: 900, at: [60, -100, 40] },
];

const KEY_ROWS = [14, 14, 13, 12, 0];

type P3 = [number, number, number];
// Belakang casing dan belakang dudukan VESA monitor, tempat kabel tersambung.
const TOWER_BACK = TOWER.z - TOWER.d / 2;
const VESA_BACK = MON.z - MON.d / 2 - 22;
// Kabel yang tergeletak di meja.
const ON_DESK = -2.5;
// Lubang kabel di meja. Colokan listrik dianggap ada di bawah meja, jadi kedua kabel
// power masuk ke lubang ini dari arah yang berlawanan.
const HOLE = { x: 140, z: -212, r: 16 };
// Kabel berjalan lurus sejajar meja, monitor, dan casing agar terlihat rapi. Hanya
// tikungannya yang dibuat melengkung (lihat smooth). Kabel display dan kabel power
// memakai jalur masing-masing yang sejajar.
const CABLE_LANE = -194;
const POWER_LANE = -184;
const CABLES: P3[][] = [
  // Kabel display: dari belakang monitor turun ke meja, menyusur ke belakang casing, lalu
  // naik ke port kartu grafis.
  [
    [MON.x + 40, MON_Y + 40, VESA_BACK],
    [MON.x + 40, MON_Y + 40, CABLE_LANE],
    [MON.x + 40, ON_DESK, CABLE_LANE],
    [TOWER.x - 40, ON_DESK, CABLE_LANE],
    [TOWER.x - 40, -120, CABLE_LANE],
    [TOWER.x - 40, -120, TOWER_BACK],
  ],
  // Kabel power monitor, masuk ke lubang kabel dari kiri.
  [
    [MON.x - 40, MON_Y + 60, VESA_BACK],
    [MON.x - 40, MON_Y + 60, POWER_LANE],
    [MON.x - 40, ON_DESK, POWER_LANE],
    [HOLE.x - 5, ON_DESK, POWER_LANE],
    [HOLE.x - 5, ON_DESK, HOLE.z],
    [HOLE.x - 5, 30, HOLE.z],
  ],
  // Kabel power casing dari PSU di bagian bawah, masuk ke lubang kabel dari kanan.
  [
    [TOWER.x + 40, -30, TOWER_BACK],
    [TOWER.x + 40, -30, POWER_LANE],
    [TOWER.x + 40, ON_DESK, POWER_LANE],
    [HOLE.x + 5, ON_DESK, POWER_LANE],
    [HOLE.x + 5, ON_DESK, HOLE.z],
    [HOLE.x + 5, 30, HOLE.z],
  ],
];

// Setiap tikungan dibulatkan dengan kurva bezier kuadrat, lalu dipecah menjadi titik-titik
// rapat agar kabel terlihat melengkung.
function smooth(pts: P3[], radius = 50, steps = 10): P3[] {
  const lerp = (a: P3, b: P3, t: number): P3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const dist = (a: P3, b: P3) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const out: P3[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, c, b] = [pts[i - 1], pts[i], pts[i + 1]];
    const p0 = lerp(c, a, Math.min(radius, dist(a, c) / 2) / dist(a, c));
    const p2 = lerp(c, b, Math.min(radius, dist(c, b) / 2) / dist(c, b));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      out.push(lerp(lerp(p0, c, t), lerp(c, p2, t), t));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// Ujung kabel yang memakai konektor: [awal, akhir]. Ujung kabel power yang masuk ke lubang
// meja tidak terlihat, jadi tanpa konektor.
const CABLE_ENDS: [boolean, boolean][] = [
  [true, true],
  [true, false],
  [true, false],
];

// Kabel digambar sebagai rangkaian potongan pendek. Tiap potongan berupa satu bidang
// bergradasi yang diputar pada sumbunya agar selalu menghadap kamera, jadi kabel tampak
// bulat dari sudut mana pun dan tidak terlihat pipih. view adalah sudut kamera (derajat).
function Cable({
  pts,
  ends,
  view,
  moving,
}: {
  pts: P3[];
  ends: [boolean, boolean];
  view: { yaw: number; pitch: number };
  moving: boolean;
}) {
  const t = 6;
  const tube = "linear-gradient(180deg, #121316 0%, #2f323a 35%, #4a4e58 50%, #2f323a 65%, #121316 100%)";
  const path = smooth(pts);
  // Arah dari adegan ke kamera, dalam koordinat adegan.
  const cy = (view.yaw * Math.PI) / 180;
  const cp = (view.pitch * Math.PI) / 180;
  const cam: P3 = [-Math.cos(cp) * Math.sin(cy), Math.sin(cp), Math.cos(cp) * Math.cos(cy)];
  const transition = moving ? "none" : "transform 1.8s cubic-bezier(0.65, 0, 0.35, 1)";

  const segments = path.slice(1).map((b, i) => {
    const a = path[i];
    const [dx, dy, dz] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.01) return null;
    const yaw = Math.atan2(-dz, dx);
    const pitch = Math.atan2(dy, Math.hypot(dx, dz));
    // Sumbu y dan z lokal potongan setelah diputar, untuk menghitung putaran (roll)
    // yang membuat bidang menghadap kamera.
    const ly: P3 = [-Math.sin(pitch) * Math.cos(yaw), Math.cos(pitch), Math.sin(pitch) * Math.sin(yaw)];
    const lz: P3 = [Math.sin(yaw), 0, Math.cos(yaw)];
    const dot = (u: P3, v: P3) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const roll = Math.atan2(-dot(cam, ly), dot(cam, lz));
    // Sedikit lebih panjang agar sambungan antarpotongan tidak berlubang.
    const w = len + t * 0.8;
    return (
      <div
        key={i}
        className="absolute"
        style={{
          width: w,
          height: t,
          left: -w / 2,
          top: -t / 2,
          background: tube,
          borderRadius: t / 2,
          transform: `translate3d(${(a[0] + b[0]) / 2}px, ${(a[1] + b[1]) / 2}px, ${(a[2] + b[2]) / 2}px) rotateY(${yaw}rad) rotateZ(${pitch}rad) rotateX(${roll}rad)`,
          transition,
        }}
      />
    );
  });

  // Konektor di ujung kabel, searah dengan potongan terakhirnya (sumbu z).
  const plug = (e: P3, n: P3, key: string) => {
    const dir = Math.sign(n[2] - e[2]) || 1;
    return (
      <Box
        key={key}
        x={e[0]}
        y={e[1]}
        z={e[2] + dir * 6}
        w={13}
        h={10}
        d={12}
        fill="linear-gradient(180deg, #2b2e35, #1b1d22)"
      />
    );
  };
  return (
    <>
      {segments}
      {ends[0] && plug(pts[0], pts[1], "start")}
      {ends[1] && plug(pts[pts.length - 1], pts[pts.length - 2], "end")}
    </>
  );
}

export function PcDesk({ caseArt, screen, booting }: { caseArt: ReactNode; screen: ReactNode; booting: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  // Posisi dan skala layar monitor di bingkai, untuk lapisan 2D (lihat flatOn).
  const [flat, setFlat] = useState<{ x: number; y: number; w: number; h: number; s: number } | null>(null);
  const [k, setK] = useState(0.8);
  const [cam, setCam] = useState(0);
  const [orbit, setOrbit] = useState<{ yaw: number; pitch: number } | null>(null);
  const [touring, setTouring] = useState(true);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);

  // Adegan 3D selalu digambar selebar 1000 px, lalu hasilnya diperkecil dengan scale 2D
  // mengikuti lebar kartu. Safari tidak akurat menghitung adegan 3D yang diperkecil di
  // dalam ruang 3D, jadi cara ini menjaga adegan tetap sama di semua ukuran layar.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / 1000));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Kamera berganti sudut otomatis seperti video produk, lalu berhenti saat pengguna memilih sudut sendiri.
  // Selama BIOS kamera tetap di layar, setelah selesai pindah ke front lalu berputar sampai top down.
  useEffect(() => {
    if (!touring) return;
    if (booting) {
      setCam(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCam(2);
      setTouring(false);
      return;
    }
    if (cam === 0) {
      setCam(1);
      return;
    }
    const t = window.setTimeout(() => setCam((c) => (c + 1 < CAMS.length ? c + 1 : 1)), 4200);
    return () => window.clearTimeout(t);
  }, [touring, cam, booting]);

  const base = CAMS[cam];
  const yaw = orbit?.yaw ?? base.yaw;
  const pitch = orbit?.pitch ?? base.pitch;
  const [tx, ty, tz] = base.at;

  // Saat kamera di sudut "screen", isi monitor juga ditampilkan sebagai lapisan 2D di atas
  // monitor 3D. Safari menggambar elemen 3D dengan resolusi rendah, sehingga teks di
  // monitor tampak buram. Berlaku di semua ukuran layar agar tampilannya sama.
  const flatOn = base.key === "screen" && !orbit && !dragging;
  useEffect(() => {
    if (!flatOn) {
      setFlat(null);
      return;
    }
    // Diukur begitu kamera diam: langsung jika tidak sedang bergerak (misalnya saat BIOS
    // dimulai), atau tepat setelah transisi kamera selesai. Dengan begitu teks 3D yang
    // buram tidak sempat terlihat.
    let live = true;
    const measure = () => {
      const stage = stageRef.current?.getBoundingClientRect();
      const el = screenRef.current;
      if (!live || !stage || !el) return;
      const r = el.getBoundingClientRect();
      setFlat({ x: r.left - stage.left, y: r.top - stage.top, w: r.width, h: r.height, s: r.width / el.offsetWidth });
    };
    const raf = requestAnimationFrame(() => {
      const moving = sceneRef.current?.getAnimations() ?? [];
      Promise.all(moving.map((a) => a.finished)).then(measure, () => {});
    });
    return () => {
      live = false;
      cancelAnimationFrame(raf);
    };
  }, [flatOn, k]);

  const pick = (i: number) => {
    setTouring(false);
    setOrbit(null);
    setCam(i);
  };

  const onDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, yaw, pitch };
    setTouring(false);
    setDragging(true);
  };
  const onMove = (e: PointerEvent) => {
    const s = drag.current;
    if (!s) return;
    setOrbit({
      yaw: Math.max(-80, Math.min(80, s.yaw + (e.clientX - s.x) * 0.3)),
      pitch: Math.max(-70, Math.min(8, s.pitch - (e.clientY - s.y) * 0.25)),
    });
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  // Perangkat tetap berwarna gelap, sedangkan meja dan dinding mengikuti tema.
  const metal = "linear-gradient(180deg, #2a2d33, #1a1c20)";
  const plastic = "linear-gradient(180deg, #232427, #141517)";

  return (
    <div className="pc-fade">
      <div
        ref={stageRef}
        className={`pc-desk relative aspect-[16/9] w-full touch-none overflow-hidden rounded-[6px] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label="The finished PC on a desk, next to a monitor saying Welcome"
      >
        <div
          className="absolute top-0 left-0"
          style={{ width: 1000, height: 562.5, perspective: 1500, transform: `scale(${k})`, transformOrigin: "0 0" }}
        >
          <div
            ref={sceneRef}
            className="absolute top-1/2 left-1/2"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(${-base.dist}px) rotateX(${pitch}deg) rotateY(${yaw}deg) translate3d(${-tx}px, ${-ty}px, ${-tz}px)`,
              transition: dragging ? "none" : "transform 1.8s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            {/* Dinding: cahaya layar dan lampu strip memantul di belakang monitor */}
            <div
              className="absolute"
              style={{
                width: 2000,
                height: 900,
                left: -1000,
                top: -900,
                transform: `translateZ(${-DESK.d / 2 - 10}px)`,
                background:
                  "radial-gradient(38% 34% at 47% 64%, var(--pc-bias) 0%, transparent 70%), var(--pc-wall)",
                maskImage: "radial-gradient(60% 75% at 50% 70%, #000 45%, transparent 80%)",
              }}
            />

            {/* Meja: serat kayu tipis di permukaan, tepi depan lebih gelap */}
            <Box
              y={DESK.t / 2}
              w={DESK.w}
              h={DESK.t}
              d={DESK.d}
              fill="var(--pc-desk)"
              faces={{
                top: {
                  style: {
                    background:
                      "repeating-linear-gradient(90deg, transparent 0 37px, var(--pc-grain) 38px, transparent 41px 83px, var(--pc-grain) 84px, transparent 86px), linear-gradient(180deg, var(--pc-desk-far), var(--pc-desk))",
                  },
                },
                front: { style: { background: "var(--pc-desk-edge)" } },
              }}
            />

            {/* Pantulan cahaya layar dan RGB casing di meja, lalu bayangan kontak tiap benda */}
            <Flat
              x={MON.x}
              z={MON.z + 150}
              w={720}
              d={330}
              y={-0.4}
              style={{ background: "radial-gradient(50% 50% at 50% 30%, rgba(125, 110, 255, 0.22), transparent 70%)" }}
            />
            <Flat
              x={TOWER.x - 40}
              z={TOWER.z + 10}
              w={300}
              d={360}
              y={-0.4}
              style={{ background: "radial-gradient(50% 50% at 40% 50%, rgba(88, 166, 255, 0.28), transparent 70%)" }}
            />
            <Flat
              x={TOWER.x}
              z={TOWER.z}
              w={TOWER.w + 40}
              d={TOWER.d + 40}
              y={-0.6}
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55), transparent 75%)" }}
            />
            <Flat
              x={MON.x}
              z={MON.z + 30}
              w={260}
              d={190}
              y={-0.6}
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.5), transparent 75%)" }}
            />

            {/* Alas meja kain, keyboard, dan mouse */}
            <Flat
              x={MON.x + 40}
              z={140}
              w={640}
              d={210}
              y={-0.8}
              style={{
                borderRadius: 14,
                background: "linear-gradient(180deg, #24262b, #1c1d21)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 6px 18px rgba(0,0,0,0.35)",
              }}
            />
            <Box
              x={MON.x}
              y={-8}
              z={140}
              w={380}
              h={14}
              d={128}
              fill={metal}
              faces={{
                top: {
                  style: { padding: 9, display: "flex", flexDirection: "column", gap: 4 },
                  children: KEY_ROWS.map((n, r) => (
                    <div key={r} className="flex flex-1 gap-1">
                      {n === 0 ? (
                        <>
                          <span className="w-[16%] rounded-[3px] bg-[#3a3d44]" />
                          <span className="flex-1 rounded-[3px] bg-[#3a3d44]" />
                          <span className="w-[16%] rounded-[3px] bg-[#3a3d44]" />
                        </>
                      ) : (
                        Array.from({ length: n }, (_, i) => (
                          <span
                            key={i}
                            className="flex-1 rounded-[3px]"
                            style={{
                              background: "linear-gradient(180deg, #43464e, #34373d)",
                              boxShadow: "0 1.5px 0 #17181b, 0 0 6px rgba(88,166,255,0.18)",
                            }}
                          />
                        ))
                      )}
                    </div>
                  )),
                },
              }}
            />
            <Box
              x={MON.x + 280}
              y={-7}
              z={150}
              w={38}
              h={14}
              d={64}
              fill={plastic}
              faces={{
                top: {
                  style: {
                    borderRadius: "19px 19px 16px 16px",
                    background: "radial-gradient(60% 40% at 50% 30%, #3b3e45, #1c1d20)",
                  },
                },
              }}
            />

            {/* Monitor: kaki dan dudukan, panel tipis, serta tonjolan VESA di bagian belakang */}
            <Box
              x={MON.x}
              y={-3}
              z={MON.z - 4}
              w={210}
              h={6}
              d={130}
              fill={metal}
              faces={{ top: { style: { borderRadius: 10, background: "linear-gradient(180deg, #2c2f35, #3a3d44)" } } }}
            />
            <Box x={MON.x} y={-6 - NECK_H / 2} z={MON.z - MON.d / 2 - 29} w={46} h={NECK_H} d={14} fill={metal} />
            <Box x={MON.x} y={MON_Y + 10} z={MON.z - MON.d / 2 - 11} w={190} h={150} d={22} fill={plastic} />
            <Box
              x={MON.x}
              y={MON_Y}
              z={MON.z}
              w={MON.w}
              h={MON.h}
              d={MON.d}
              fill={plastic}
              faces={{
                front: {
                  style: { background: "#0b0b0c", padding: "8px 8px 16px", boxShadow: "inset 0 0 0 1px #2b2c30" },
                  children: (
                    <>
                      <div ref={screenRef} className="relative flex h-full flex-col overflow-hidden rounded-[2px] bg-black">
                        {screen}
                        {/* Lapisan kaca dengan kilap diagonal tipis */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 32%, transparent 33%)" }}
                        />
                      </div>
                      <span className="pc-led absolute bottom-[6px] left-1/2 h-[3px] w-[3px] rounded-full bg-blue" />
                    </>
                  ),
                },
              }}
            />

            {CABLES.map((pts, i) => (
              <Cable key={i} pts={pts} ends={CABLE_ENDS[i]} view={{ yaw, pitch }} moving={dragging} />
            ))}
            {/* Lubang kabel di meja, dengan cincin karet di tepinya */}
            <Flat
              x={HOLE.x}
              z={HOLE.z}
              w={HOLE.r * 2}
              d={HOLE.r * 2}
              y={-0.6}
              style={{ borderRadius: "50%", background: "#050506", boxShadow: "inset 0 0 0 3px #2a2c31, inset 0 0 8px 4px rgba(0,0,0,0.9)" }}
            />

            {/* Casing: sisi kaca kiri menghadap monitor, bagian depan mesh dengan dua kipas intake */}
            <Box
              x={TOWER.x}
              y={-TOWER.h / 2}
              z={TOWER.z}
              w={TOWER.w}
              h={TOWER.h}
              d={TOWER.d}
              fill={metal}
              faces={{
                left: {
                  // Isi casing selalu digambar terang di atas interior gelap, apa pun tema situsnya.
                  style: {
                    background: "#0a0b0f",
                    boxShadow: "inset 0 0 0 5px #24262b, inset 0 0 40px rgba(88,166,255,0.18)",
                    ["--bg-color" as string]: "#0b0d12",
                    ["--fg-color" as string]: "#d6dcea",
                    ["--muted-color" as string]: "#5d6474",
                    ["--blue-color" as string]: "#6cb4ff",
                  },
                  children: (
                    <>
                      <svg
                        viewBox="0 0 460 420"
                        className="pc-on block h-full w-full"
                        fill="none"
                        stroke="var(--fg-color)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {caseArt}
                      </svg>
                      {/* Kaca tempered: pantulan miring dan tepi yang sedikit berkilau */}
                      <div
                        className="pointer-events-none absolute inset-[5px]"
                        style={{
                          background:
                            "linear-gradient(112deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 26%, transparent 27%, transparent 62%, rgba(255,255,255,0.06) 63%, transparent 78%)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                        }}
                      />
                    </>
                  ),
                },
                front: {
                  style: { padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 },
                  children: (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="pc-led h-[4px] w-[4px] rounded-full bg-[#6cb4ff]" />
                        <span className="h-[9px] w-[9px] rounded-full border border-[#555a64] bg-[#1b1d21]" />
                      </div>
                      <div
                        className="relative flex flex-1 flex-col items-center justify-around rounded-[4px]"
                        style={{
                          background:
                            "radial-gradient(circle, #0c0d10 1.1px, transparent 1.6px) 0 0 / 5px 5px, #24262b",
                        }}
                      >
                        {[0, 1].map((i) => (
                          <span
                            key={i}
                            className="h-[78px] w-[78px] rounded-full"
                            style={{
                              border: "2px solid rgba(108,180,255,0.85)",
                              boxShadow: "0 0 14px rgba(108,180,255,0.6), inset 0 0 12px rgba(108,180,255,0.45)",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ),
                },
                top: {
                  style: {
                    background:
                      "radial-gradient(circle, #0c0d10 1.1px, transparent 1.6px) 0 0 / 5px 5px, linear-gradient(180deg, #2c2f35, #24262b)",
                    boxShadow: "inset 0 0 0 10px #2a2d33",
                  },
                },
              }}
            />
          </div>
        </div>

        {flat && (
          <div
            className="pointer-events-none absolute overflow-hidden rounded-[2px] bg-black"
            style={{ left: flat.x, top: flat.y, width: flat.w, height: flat.h }}
            aria-hidden="true"
          >
            <div
              className="flex flex-col"
              style={{
                width: flat.w / flat.s,
                height: flat.h / flat.s,
                transform: `scale(${flat.s})`,
                transformOrigin: "0 0",
              }}
            >
              {screen}
            </div>
          </div>
        )}
      </div>

      {/* Pilihan sudut kamera, di bawah adegan agar tidak menutupi gambar */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {CAMS.map((c, i) => (
          <button
            key={c.key}
            type="button"
            onClick={() => pick(i)}
            className={`cursor-pointer rounded-full border px-2.5 py-1 font-poppins-sans text-xs backdrop-blur-sm transition-colors duration-300 ${
              i === cam && !orbit
                ? "border-blue bg-blue/15 text-foreground"
                : "border-border bg-background/60 text-muted hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto font-poppins-sans text-[0.65rem] text-muted">
          {touring ? "touring · " : ""}drag to look around
        </span>
      </div>
    </div>
  );
}
