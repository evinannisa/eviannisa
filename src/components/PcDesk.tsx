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

export function PcDesk({ caseArt, screen, booting }: { caseArt: ReactNode; screen: ReactNode; booting: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.8);
  const [cam, setCam] = useState(0);
  const [orbit, setOrbit] = useState<{ yaw: number; pitch: number } | null>(null);
  const [touring, setTouring] = useState(true);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);

  // Adegan digambar di ruang 1000 px, lalu diskalakan mengikuti lebar kartu.
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
        className={`pc-desk relative aspect-[4/3] w-full touch-none overflow-hidden rounded-[6px] sm:aspect-[16/9] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ perspective: 1500 * k }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label="The finished PC on a desk, next to a monitor showing the build report"
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-base.dist * k}px) scale3d(${k}, ${k}, ${k}) rotateX(${pitch}deg) rotateY(${yaw}deg) translate3d(${-tx}px, ${-ty}px, ${-tz}px)`,
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
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[2px] bg-black">
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

      {/* Pilihan sudut kamera, di bawah adegan agar tidak menutupi gambar */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {CAMS.map((c, i) => (
          <button
            key={c.key}
            type="button"
            onClick={() => pick(i)}
            className={`cursor-pointer rounded-full border px-2.5 py-1 font-poppins-sans text-[0.65rem] backdrop-blur-sm transition-colors duration-300 sm:text-xs ${
              i === cam && !orbit
                ? "border-blue bg-blue/15 text-foreground"
                : "border-border bg-background/60 text-muted hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto hidden font-poppins-sans text-[0.65rem] text-muted sm:inline">
          {touring ? "touring · " : ""}drag to look around
        </span>
      </div>
    </div>
  );
}
