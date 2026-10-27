"use client";

import { useEffect, useRef, useState } from "react";
import { PcDesk } from "./PcDesk";

// Kotak dengan garis sedikit goyang seperti sketsa. Offset-nya tetap (bukan acak)
// agar gambar tidak berubah setiap render.
function R(x: number, y: number, w: number, h: number) {
  return `M${x + 0.6},${y + 0.4} C${x + w * 0.35},${y - 0.6} ${x + w * 0.7},${y + 0.7} ${x + w - 0.4},${y + 0.2} C${x + w + 0.6},${y + h * 0.35} ${x + w - 0.5},${y + h * 0.7} ${x + w + 0.3},${y + h - 0.5} C${x + w * 0.65},${y + h + 0.6} ${x + w * 0.3},${y + h - 0.5} ${x + 0.4},${y + h + 0.3} C${x - 0.6},${y + h * 0.65} ${x + 0.5},${y + h * 0.3} ${x + 0.6},${y + 0.4} Z`;
}

// Lingkaran dari empat kurva bezier, dibuat sedikit penyok agar terlihat seperti digambar tangan.
function O(cx: number, cy: number, r: number) {
  const k = r * 0.552;
  return `M${cx + r},${cy} C${cx + r},${cy + k} ${cx + k},${cy + r + 0.4} ${cx},${cy + r} C${cx - k},${cy + r} ${cx - r - 0.4},${cy + k} ${cx - r},${cy} C${cx - r},${cy - k} ${cx - k},${cy - r} ${cx + 0.3},${cy - r - 0.3} C${cx + k},${cy - r} ${cx + r + 0.3},${cy - k} ${cx + r},${cy}`;
}

function Fan({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <path d={O(cx, cy, r)} />
      <g className="pc-blades">
        {[0, 72, 144, 216, 288].map((deg) => {
          const a = (deg * Math.PI) / 180;
          const hub = r * 0.24;
          const tip = r * 0.86;
          // Dibulatkan karena hasil Math.cos/sin di Node dan browser bisa berbeda
          // di digit terakhir, sehingga memicu hydration mismatch.
          const pt = (ang: number, len: number) =>
            `${(cx + Math.cos(ang) * len).toFixed(2)},${(cy + Math.sin(ang) * len).toFixed(2)}`;
          return <path key={deg} d={`M${pt(a, hub)} Q${pt(a + 0.2, tip)} ${pt(a + 0.9, tip)}`} />;
        })}
        <path d={O(cx, cy, r * 0.22)} />
      </g>
    </>
  );
}

// Tulisan sablon kecil di PCB, seperti label asli di motherboard.
function Silk({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize="5"
      style={{ fontFamily: "var(--font-mono)" }}
      fill="var(--muted-color)"
      stroke="none"
      opacity="0.85"
    >
      {children}
    </text>
  );
}

type Box = { x: number; y: number; w: number; h: number };
const PAD = 4;
// Kabel tercolok ke header kosong terdekat dalam radius ini (satuan papan).
const PLUG_RADIUS = 44;
// Tebal semua kabel yang terpasang di gambar.
const CABLE_W = 2.5;
// Semua titik di dalam casing.
const inCase = (p: { x: number; y: number }) => p.x >= 10 && p.x <= 450 && p.y >= 10 && p.y <= 410;
// Kotak biru untuk komponen dengan satu tujuan digambar lebih besar dari slotnya,
// agar target yang tipis (misalnya M.2, tingginya hanya 22) tetap mudah dibidik.
const GLOW_GROW = 10;
// Diperbesar tapi tetap di dalam dinding casing, dan bisa dibatasi sisi kanannya
// (kipas belakang tidak boleh menutupi panel I/O motherboard).
const grow = (b: Box, n: number, maxRight = 446): Box => {
  const x = Math.max(14, b.x - n);
  const y = Math.max(14, b.y - n);
  const right = Math.min(maxRight, b.x + b.w + n);
  const bottom = Math.min(406, b.y + b.h + n);
  return { x, y, w: right - x, h: bottom - y };
};
const hit = (p: { x: number; y: number }, b: Box, pad = PAD) =>
  p.x >= b.x - pad && p.x <= b.x + b.w + pad && p.y >= b.y - pad && p.y <= b.y + b.h + pad;

// ── geometri papan (viewBox 460 × 420) ──────────────────────────────────────
// Tampak samping casing tower: motherboard ATX berdiri tegak (lebih tinggi
// daripada lebar, rasio asli 244 × 305 mm), panel I/O di kiri atas, PSU di
// bawah shroud, kipas intake di depan (kanan).
const SOCKET: Box = { x: 179, y: 68, w: 52, h: 52 };
const LEVER: Box = { x: 234, y: 60, w: 20, h: 68 };
const DIMM_X = [262, 274, 286, 298];
const DIMM_NAME = ["A1", "A2", "B1", "B2"];
const DIMM_OK = ["A2", "B2"];
// Slot DIMM hanya sekitar 15 px di layar, terlalu kecil untuk dibidik. Karena itu
// RAM cukup dijatuhkan di mana saja pada blok DIMM, lalu slotnya dipilih
// lewat panel dengan tombol besar.
const DIMM_AREA: Box = { x: 252, y: 28, w: 64, h: 172 };
const PCIE16: Box = { x: 110, y: 198, w: 190, h: 8 };
const PCIE4: Box = { x: 110, y: 268, w: 130, h: 8 };
// Area kartu grafis jika dipasang di slot tersebut (kartu menggantung di bawah slot).
const GPU16_ZONE: Box = { x: 96, y: 194, w: 280, h: 56 };
const GPU4_ZONE: Box = { x: 96, y: 262, w: 280, h: 56 };
const SSD: Box = { x: 146, y: 146, w: 118, h: 22 };
const COOLER: Box = { x: 168, y: 56, w: 76, h: 78 };
const CASEFAN: Box = { x: 24, y: 38, w: 68, h: 68 };
const PSU: Box = { x: 22, y: 342, w: 186, h: 60 };
// Area zoom kamera untuk setiap komponen. Area CPU mencakup tuas socket, dan area
// kartu grafis mencakup kedua slot PCIe agar pilihan x16/x4 tetap terlihat.
const FOCUS: Record<string, Box> = {
  cpu: { x: 170, y: 52, w: 92, h: 84 },
  paste: SOCKET,
  ram: DIMM_AREA,
  ssd: SSD,
  cooler: COOLER,
  fan: CASEFAN,
  gpu: { x: 96, y: 194, w: 280, h: 124 },
  psu: PSU,
};

// Kabel dan header tujuannya. Pengguna harus mencocokkan sendiri karena semua header
// menyala bersamaan, dan konektor EPS & PCIe sengaja dibuat mirip seperti aslinya.
type Cable = {
  id: string;
  name: string;
  pins: string;
  port: Box;
  portName: string;
  // Gambar pin: [baris, kolom], lalu kolom tempat konektor terbelah (4+4 / 6+2).
  grid: [number, number];
  split?: number;
  d: string;
  ok: string;
  // Pengenalan singkat kabel untuk kartu penjelasan.
  title: string;
  what: string;
};
const CABLES: Cable[] = [
  {
    id: "atx",
    name: "24-pin ATX",
    pins: "2 × 12",
    port: { x: 312, y: 68, w: 18, h: 60 },
    portName: "ATX_24",
    grid: [2, 12],
    d: "M204,366 C276,366 350,362 350,318 L350,138 C350,112 345,100 331,98",
    ok: "24-pin ATX clicked in, the motherboard has power",
    title: "What is the 24-pin ATX cable?",
    what: "The main power cable of the motherboard. It powers the board itself, along with the RAM, the SSD and the chips on it.",
  },
  {
    id: "eps",
    name: "EPS 4+4 · CPU",
    pins: "8-pin, splits 4+4",
    port: { x: 174, y: 24, w: 30, h: 14 },
    portName: "CPU_8P",
    grid: [2, 4],
    split: 2,
    d: "M34,346 C20,338 17,320 17,296 L17,38 C17,24 25,18 42,18 L170,18 C182,18 189,21 189,27",
    ok: "EPS 4+4 in, the CPU power stages are fed directly",
    title: "What is the EPS cable?",
    what: "A power cable just for the CPU. It feeds the power stages around the socket, which turn it into the low voltage the CPU runs on.",
  },
  {
    id: "pcie",
    name: "PCIe 6+2 · GPU",
    pins: "8-pin, splits 6+2",
    port: { x: 338, y: 196, w: 22, h: 12 },
    portName: "GPU 8-pin",
    grid: [2, 4],
    split: 3,
    d: "M204,376 C296,376 377,370 377,326 L377,236 C377,214 366,204 350,203",
    ok: "PCIe 6+2 in, the card gets up to 150 W on top of the 75 W from the slot",
    title: "What is the PCIe power cable?",
    what: "Extra power for the graphics card. The slot alone gives up to 75 W, and this cable adds up to 150 W more.",
  },
  {
    id: "fan",
    name: "CPU fan",
    pins: "4-pin PWM",
    port: { x: 114, y: 139, w: 20, h: 12 },
    portName: "CPU_FAN",
    grid: [1, 4],
    d: "M172,118 C156,120 140,124 131,133 C127,137 125,140 124,143",
    ok: "fan in CPU_FAN, the BIOS can now speed it up and down with the temperature",
    title: "What is the CPU fan cable?",
    what: "It powers the cooler fan and lets the motherboard change its speed based on the CPU temperature.",
  },
  {
    id: "panel",
    name: "Front panel",
    pins: "PWR · RESET · LED",
    port: { x: 268, y: 300, w: 48, h: 16 },
    portName: "F_PANEL",
    grid: [2, 5],
    d: "M440,392 C404,392 352,388 324,360 C306,342 296,328 292,313",
    ok: "front panel wired, the power button on the case now works",
    title: "What are the front panel cables?",
    what: "They connect the power button, reset button and LEDs on the case to the motherboard, so the case buttons can control the PC.",
  },
];

// Alasan kabel tidak cocok dengan header tujuan, ditulis dengan istilah teknisi.
function cableMismatch(c: Cable, port: Cable) {
  if (c.id === "pcie" && port.id === "eps") {
    return "PCIe and EPS are both 8-pin but keyed differently, forcing a PCIe plug into CPU_8P can short the board";
  }
  if (c.id === "eps" && port.id === "pcie") {
    return "that is the CPU EPS cable, the graphics card needs the PCIe 6+2 one";
  }
  if (c.id === "atx")
    return "the 24-pin only fits the big ATX_24 header on the right edge of the board";
  if (c.id === "fan")
    return "the 4-pin fan cable belongs in CPU_FAN, otherwise the BIOS stops with a CPU fan error";
  if (c.id === "panel") return "front panel wires go to F_PANEL along the bottom edge of the board";
  if (port.id === "atx") return "ATX_24 only takes the 24-pin cable";
  if (port.id === "fan") return "CPU_FAN is a small 4-pin header for the cooler fan";
  if (port.id === "panel") return "F_PANEL takes the case wires for the power button and LEDs";
  return `${c.name} does not fit ${port.portName}`;
}

// Gambar konektor dari grid pin.
function Connector({ c, scale = 1.6, height }: { c: Cable; scale?: number; height?: number }) {
  const [rows, cols] = c.grid;
  const pitch = 5;
  // Potongan 4+4 / 6+2 benar-benar terpisah, seperti konektor aslinya.
  const gap = c.split ? 3.5 : 0;
  const top = 4; // Ruang untuk klip pengunci
  const bodyH = rows * pitch + 3;
  const w = cols * pitch + gap + 5;
  const bottom = top + bodyH;
  const h = bottom + 20;
  const colX = (k: number) => 4.5 + k * pitch + (c.split && k >= c.split ? gap : 0);
  const pieces: [number, number][] = c.split
    ? [
        [0, c.split],
        [c.split, cols],
      ]
    : [[0, cols]];
  // Pin berkunci: sebagian kotak, sebagian bersudut terpotong. Polanya berbeda
  // antara EPS dan PCIe agar keduanya tidak tertukar.
  const keyed = c.id === "atx" || c.id === "eps" || c.id === "pcie";
  const shift = c.id === "pcie" ? 1 : 0;
  const pin = (x: number, y: number, r: number, k: number) => {
    const s = 3;
    if (keyed && (r + k + shift) % 2 === 1) {
      return `M${x},${y} H${x + s - 1} L${x + s},${y + 1} V${y + s} H${x} Z`;
    }
    return R(x, y, s, s);
  };
  // Kabel per kolom pin, dikumpulkan zip tie lalu keluar sebagai satu berkas.
  const bx = w / 2;
  const tieY = bottom + 9;
  const spread = Math.min(0.9, 6 / cols);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={height ? (w * height) / h : w * scale}
      height={height ?? h * scale}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Kabel */}
      {Array.from({ length: cols }).map((_, k) => {
        const x = colX(k) + 1.5;
        const t = bx + (k - (cols - 1) / 2) * spread;
        return (
          <path
            key={`w${k}`}
            d={`M${x},${bottom} L${x},${bottom + 2.5} C${x},${tieY - 2} ${t},${tieY - 3} ${t},${tieY} C${t},${h - 4} ${t + 4},${h - 1.5} ${w - 1},${h - 1.5 - (k - (cols - 1) / 2) * spread}`}
            strokeWidth="0.45"
            opacity="0.8"
          />
        );
      })}
      <path d={R(bx - (cols * spread) / 2 - 1, tieY - 1, cols * spread + 2, 2)} strokeWidth="0.6" />

      {/* Rumah konektor + klip pengunci */}
      {pieces.map(([k0, k1]) => {
        const x0 = colX(k0) - 2;
        const x1 = colX(k1 - 1) + 5;
        const mx = (x0 + x1) / 2;
        return (
          <g key={k0}>
            <path d={R(x0, top, x1 - x0, bodyH)} strokeWidth="0.8" />
            {c.id === "fan" ? (
              // Kipas: rusuk pengarah di satu sisi, tanpa klip.
              <path d={`M${x0 + 2},${top} V${top - 1.6} H${x1 - 2} V${top}`} strokeWidth="0.6" />
            ) : c.id === "panel" ? null : (
              <path
                d={`M${mx - 2.5},${top} V${top - 2.6} H${mx + 2.5} V${top} M${mx - 1.5},${top - 2.6} L${mx},${top - 3.6} L${mx + 1.5},${top - 2.6}`}
                strokeWidth="0.6"
              />
            )}
          </g>
        );
      })}

      {/* Pin */}
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((_, k) => {
          // Pin kosong sebagai kunci, seperti header front panel asli.
          if (c.id === "panel" && r === 1 && k === 4) return null;
          return (
            <path
              key={`${r}-${k}`}
              d={pin(colX(k), top + 1.5 + r * pitch, r, k)}
              strokeWidth="0.5"
            />
          );
        }),
      )}
    </svg>
  );
}

type Kind = "place" | "paste" | "ram" | "gpu" | "cables";
type Step = {
  id: string;
  name: string;
  spec: string;
  kind: Kind;
  tip: string;
  done: string;
  watts: number;
  slot?: Box;
  icon: { box: Box; art: React.ReactNode };
  // Prasyarat fisik: komponen yang harus terpasang dulu, dan alasannya.
  needs?: string[];
  needsWhy?: string;
  // Materi singkat: apa itu, bagaimana kerjanya, dan tips teknisi.
  learn: { what: string };
};

const CPU_ART = (
  <>
    <rect x={181} y={70} width={48} height={48} rx="1.5" style={{ fill: "var(--bg-color)" }} />
    <rect x={184.5} y={73.5} width={41} height={41} rx="3.5" />
    <path
      d="M182.6,116.4 V112 L187,116.4 Z"
      fill="var(--amber-color)"
      stroke="none"
      opacity="0.7"
    />
    <text
      x={205}
      y={80.5}
      textAnchor="middle"
      fontSize="3.2"
      style={{ fontFamily: "var(--font-mono)" }}
      fill="var(--muted-color)"
      stroke="none"
    >
      RYZEN 7 7800X3D
    </text>
  </>
);
const RAM_ART = (x: number) => (
  <g key={x}>
    <path d={R(x, 42, 7, 132)} style={{ fill: "var(--bg-color)" }} />
    {[0, 1, 2, 3].map((k) => (
      <path key={k} d={R(x + 1.6, 50 + k * 30, 3.8, 18)} />
    ))}
  </g>
);
const SSD_ART = (
  <>
    <path d={R(156, 150, 100, 12)} style={{ fill: "var(--bg-color)" }} />
    <path d={R(166, 152, 18, 8)} />
    <path d={R(190, 152, 18, 8)} />
    <path d={R(214, 152, 14, 8)} />
    <path d={O(252, 156, 2.2)} />
  </>
);
const COOLER_ART = (
  <>
    <path d={R(170, 58, 72, 74)} style={{ fill: "var(--bg-color)" }} />
    <path d="M174,62 L182,62 M230,62 L238,62 M174,128 L182,128 M230,128 L238,128" />
    <Fan cx={206} cy={95} r={30} />
  </>
);
const CASEFAN_ART = (
  <>
    <path d={R(26, 40, 64, 64)} style={{ fill: "var(--bg-color)" }} />
    <Fan cx={58} cy={72} r={27} />
  </>
);
const GPU_ART = (
  <>
    <path d={R(104, 206, 268, 40)} style={{ fill: "var(--bg-color)" }} />
    <path d={R(98, 202, 6, 48)} style={{ fill: "var(--bg-color)" }} />
    <Fan cx={170} cy={226} r={16} />
    <Fan cx={240} cy={226} r={16} />
    <path d="M282,212 L282,240 M292,212 L292,240 M302,212 L302,240 M312,212 L312,240 M322,212 L322,240 M332,212 L332,240 M342,212 L342,240 M352,212 L352,240 M362,212 L362,240" />
    <path d={R(340, 200, 16, 6)} />
  </>
);
const PSU_ART = (
  <>
    <path d={R(24, 344, 182, 56)} style={{ fill: "var(--bg-color)" }} />
    <Fan cx={72} cy={372} r={20} />
    <path d="M130,352 L130,392 M140,352 L140,392 M150,352 L150,392 M160,352 L160,392 M170,352 L170,392 M180,352 L180,392 M190,352 L190,392" />
  </>
);

// ── motherboard ─────────────────────────────────────────────────────────────
// Digambar seperti tampak atas di datasheet: garis lurus, pin konektor nyata,
// sirip heatsink, dan jalur PCB. Koordinatnya mengikuti zona drop di atas.
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Deretan pin header (kotak kecil terisi), seperti yang terlihat dari atas.
function Pins({
  x,
  y,
  cols,
  rows,
  dx,
  dy = dx,
  size = 2.2,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  dx: number;
  dy?: number;
  size?: number;
}) {
  return (
    <g fill="var(--muted-color)" stroke="none" opacity="0.8">
      {range(rows).flatMap((r) =>
        range(cols).map((c) => (
          <rect key={`${r}-${c}`} x={x + c * dx} y={y + r * dy} width={size} height={size} />
        )),
      )}
    </g>
  );
}

// Chip IC dengan kaki di keempat sisi (QFP) atau dua sisi (SOIC).
function Chip({
  x,
  y,
  w,
  h,
  quad = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  quad?: boolean;
}) {
  const legs: string[] = [];
  for (let i = 2; i < w - 1; i += 2.4) legs.push(`M${x + i},${y} v-1.6 M${x + i},${y + h} v1.6`);
  if (quad)
    for (let i = 2; i < h - 1; i += 2.4) legs.push(`M${x},${y + i} h-1.6 M${x + w},${y + i} h1.6`);
  return (
    <>
      <path d={legs.join(" ")} strokeWidth="0.6" />
      <rect x={x} y={y} width={w} height={h} rx="0.6" />
      <circle cx={x + 2} cy={y + 2} r="0.7" fill="var(--muted-color)" stroke="none" />
    </>
  );
}

// Port USB-A ganda di panel I/O belakang.
function UsbPair({ y }: { y: number }) {
  return (
    <>
      <rect x={95} y={y} width={13} height={12} rx="0.6" />
      <rect
        x={97}
        y={y + 2.2}
        width={7}
        height={2}
        fill="var(--muted-color)"
        stroke="none"
        opacity="0.6"
      />
      <rect
        x={97}
        y={y + 7.8}
        width={7}
        height={2}
        fill="var(--muted-color)"
        stroke="none"
        opacity="0.6"
      />
    </>
  );
}

function Motherboard({ leverD, leverStroke }: { leverD: string; leverStroke: string }) {
  const fins = (n: number, f: (i: number) => string) => range(n).map(f).join(" ");
  return (
    <g stroke="var(--muted-color)" strokeWidth="1">
      <defs>
        {/* Medan pin LGA di dalam soket */}
        <pattern id="pc-lga" width="2.6" height="2.6" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="0.42" fill="var(--muted-color)" stroke="none" />
        </pattern>
      </defs>

      {/* PCB */}
      <rect
        x={100}
        y={26}
        width={232}
        height={290}
        rx="3"
        strokeWidth="1.3"
        style={{ fill: "color-mix(in srgb, var(--fg-color) 3%, transparent)" }}
      />

      {/* Jalur PCB: soket ke DIMM, soket ke M.2 / PCIe, chipset ke SATA & PCIe */}
      <path
        stroke="var(--border-color)"
        strokeWidth="0.6"
        d={[
          fins(8, (i) => `M235,${75 + i * 4} H262`),
          fins(5, (i) => `M${193 + i * 6},134 V${137 + i * 1} L${190 + i * 4},${141 + i * 1} V146`),
          fins(4, (i) => `M${150 + i * 4},168 V${182 - i * 2} L${158 + i * 4},${190 - i * 2} V198`),
          fins(4, (i) => `M306,${262 + i * 4} H${308 + i * 1.5} V${224 + i * 14} H314`),
          "M240,270 H250 M240,273 H250",
          fins(3, (i) => `M134,${66 + i * 4} H140`),
        ].join(" ")}
      />

      {/* Lubang baut standar ATX, bertepi tembaga */}
      {[
        [106, 32],
        [250, 32],
        [326, 32],
        [106, 196],
        [250, 196],
        [326, 196],
        [106, 310],
        [250, 310],
        [326, 310],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="3.2" strokeWidth="1.4" />
          <circle cx={x} cy={y} r="1.5" style={{ fill: "var(--bg-color)" }} />
        </g>
      ))}

      {/* Panel I/O belakang: port menonjol keluar dari tepi kiri, ditutup shroud */}
      <rect x={108} y={34} width={26} height={100} rx="2" />
      <path d={fins(9, (i) => `M113,${42 + i * 10} H129`)} strokeWidth="0.7" opacity="0.6" />
      <UsbPair y={37} />
      <rect x={96} y={53} width={11} height={5} rx="2.5" />
      <rect x={95} y={62} width={13} height={13} rx="0.6" />
      <rect x={98.5} y={71} width={6} height={3} />
      <path d="M95,79 H108 V84 L106,86.5 H97 L95,84 Z" />
      <path d="M95,90 H108 V97 H98 L95,94 Z" />
      <UsbPair y={101} />
      {[118.5, 124.5, 130.5].map((cy) => (
        <circle key={cy} cx={101} cy={cy} r="2.3" />
      ))}

      {/* VRM: heatsink berbentuk L dengan sirip, choke, dan kapasitor */}
      <rect x={160} y={40} width={92} height={14} rx="1.5" />
      <path d={fins(21, (i) => `M${164 + i * 4},42 V52`)} strokeWidth="0.7" />
      <rect x={142} y={58} width={16} height={90} rx="1.5" />
      <path d={fins(21, (i) => `M144,${62 + i * 4} H156`)} strokeWidth="0.7" />
      {range(6).map((k) => (
        <g key={`c${k}`}>
          <rect x={169 + k * 10} y={56} width={7} height={7} rx="0.8" />
          <path d={`M${170.5 + k * 10},59.5 h4`} strokeWidth="0.6" />
        </g>
      ))}
      {range(5).map((k) => (
        <g key={`l${k}`}>
          <rect x={161} y={68 + k * 10} width={7} height={7} rx="0.8" />
          <path d={`M164.5,${69.5 + k * 10} v4`} strokeWidth="0.6" />
        </g>
      ))}
      {[
        [164, 126],
        [170, 126],
        [164, 133],
        [170, 133],
      ].map(([cx, cy]) => (
        <g key={`cap${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="2.4" />
          <path d={`M${cx - 1.4},${cy} h2.8`} strokeWidth="0.5" />
        </g>
      ))}

      {/* Soket AM5: braket penahan, pelat beban, medan pin LGA, segitiga emas */}
      <rect x={175} y={64} width={60} height={60} rx="2" strokeWidth="1.2" />
      {[
        [178.5, 67.5],
        [231.5, 67.5],
        [178.5, 120.5],
        [231.5, 120.5],
      ].map(([cx, cy]) => (
        <circle key={`s${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />
      ))}
      <rect x={181} y={70} width={48} height={48} rx="1" />
      <rect x={186} y={75} width={38} height={38} fill="url(#pc-lga)" strokeWidth="0.6" />
      <path
        d="M183,116 L183,110 L189,116 Z"
        stroke="var(--amber-color)"
        fill="var(--amber-color)"
        fillOpacity="0.35"
      />
      <Silk x={180} y={131}>
        AM5 · LGA1718
      </Silk>
      {/* Tuas soket */}
      <rect x={239.5} y={122} width={5} height={4} rx="0.6" />
      <path d={leverD} stroke={leverStroke} strokeWidth="1.5" />

      {/* DIMM DDR5: kontak, takik kunci, dan kait di kedua ujung */}
      {DIMM_X.map((x, i) => (
        <g key={x}>
          <rect x={x} y={40} width={7} height={136} rx="0.8" />
          <path
            d={`M${x + 3.5},44 V112 M${x + 3.5},119 V172`}
            strokeWidth="0.8"
            strokeDasharray="0.6 1.2"
            opacity="0.7"
          />
          <path d={`M${x},114 h7 M${x},117 h7`} strokeWidth="0.6" />
          <rect x={x + 0.5} y={34} width={6} height={5} rx="0.8" />
          <rect x={x + 0.5} y={177} width={6} height={5} rx="0.8" />
          <Silk x={x - 0.5} y={190}>
            {DIMM_NAME[i]}
          </Silk>
        </g>
      ))}

      {/* Header daya: 24-pin ATX (2 × 12) dan 8-pin EPS (2 × 4) */}
      <rect x={314} y={70} width={14} height={56} rx="1" />
      <rect x={328} y={93} width={2} height={10} rx="0.5" />
      <Pins x={316.6} y={72.6} cols={2} rows={12} dx={6.4} dy={4.5} size={2.4} />
      <Silk x={306} y={138}>
        ATX_24
      </Silk>
      <rect x={176} y={28} width={26} height={8} rx="1" />
      <rect x={186} y={26} width={6} height={2} rx="0.5" />
      <Pins x={178.6} y={29.4} cols={4} rows={2} dx={6} dy={3.2} size={2} />
      <Silk x={206} y={35}>
        CPU_8P
      </Silk>

      {/* Header kipas CPU (4-pin PWM) dan chip LAN dekat panel I/O */}
      <rect x={116} y={142} width={16} height={6} rx="0.8" />
      <Pins x={117.6} y={144} cols={4} rows={1} dx={3.6} size={2} />
      <Silk x={106} y={158}>
        CPU_FAN
      </Silk>
      <Chip x={112} y={166} w={10} h={10} />
      <Silk x={125} y={173}>
        LAN
      </Silk>

      {/* M.2: konektor M-key, tapak 2280 putus-putus, dudukan baut 2242/2260/2280 */}
      <rect x={146} y={149} width={8} height={16} rx="1" />
      <path d="M146,153 h8" strokeWidth="0.6" />
      <rect
        x={154}
        y={150}
        width={104}
        height={14}
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.5"
      />
      <circle cx={206} cy={157} r="1.2" opacity="0.6" />
      <circle cx={228} cy={157} r="1.2" opacity="0.6" />
      <circle cx={258} cy={157} r="2.2" />
      <Silk x={156} y={176}>
        M2_1 · PCIe 4.0 x4
      </Silk>

      {/* PCIe x16 berlapis baja dengan takik kunci dan kait; slot kedua x4 */}
      <rect x={108} y={196} width={194} height={12} rx="1.2" />
      <rect x={PCIE16.x} y={PCIE16.y} width={PCIE16.w} height={PCIE16.h} rx="0.6" />
      <path d="M132,198 v8 M135,198 v8" strokeWidth="0.7" />
      <path
        d="M112,202 H130 M137,202 H292"
        strokeWidth="1.4"
        strokeDasharray="0.6 1.4"
        opacity="0.6"
      />
      <rect x={302} y={197} width={6} height={10} rx="0.8" />
      <Silk x={112} y={193}>
        PCIEX16_1
      </Silk>
      <rect x={PCIE4.x} y={PCIE4.y} width={PCIE4.w} height={PCIE4.h} rx="0.6" />
      <path d="M132,268 v8 M135,268 v8" strokeWidth="0.7" />
      <path
        d="M112,272 H130 M137,272 H160"
        strokeWidth="1.4"
        strokeDasharray="0.6 1.4"
        opacity="0.6"
      />
      <Silk x={112} y={264}>
        PCIEX4_2
      </Silk>

      {/* Area antar slot: BIOS flash, Super I/O, nama papan */}
      <Chip x={122} y={222} w={10} h={7} quad={false} />
      <Silk x={120} y={239}>
        BIOS
      </Silk>
      <Chip x={196} y={222} w={16} h={16} />
      <Silk x={214} y={232}>
        SIO
      </Silk>
      <Silk x={238} y={232}>
        B650-A ATX
      </Silk>
      <Silk x={238} y={240}>
        REV 1.02
      </Silk>

      {/* Chipset dengan heatsink bersirip */}
      <rect x={250} y={254} width={56} height={40} rx="2" />
      <path
        d={fins(12, (i) => `M${255 + i * 4},256 V261 M${255 + i * 4},287 V292`)}
        strokeWidth="0.7"
      />
      <rect x={256} y={264} width={44} height={20} rx="1" />
      <text
        x={278}
        y={276.5}
        textAnchor="middle"
        fontSize="6"
        style={{ fontFamily: "var(--font-mono)" }}
        fill="var(--muted-color)"
        stroke="none"
      >
        B650
      </text>

      {/* SATA 6 Gb/s dengan kunci berbentuk L */}
      {range(4).map((k) => (
        <g key={`s${k}`}>
          <rect x={314} y={220 + k * 14} width={12} height={9} rx="0.6" />
          <path
            d={`M316.5,${222.5 + k * 14} H323.5 V${226.5 + k * 14} H321 V${224.5 + k * 14} H316.5 Z`}
            strokeWidth="0.6"
          />
        </g>
      ))}
      <Silk x={306} y={282}>
        SATA6G
      </Silk>

      {/* Audio: codec di area berpelindung, baterai CMOS, header depan */}
      <Silk x={110} y={283}>
        AUDIO
      </Silk>
      <rect x={108} y={286} width={24} height={18} rx="1" strokeDasharray="2 1.5" opacity="0.7" />
      <Chip x={112} y={290} w={9} h={9} />
      {[290.5, 295, 299.5].map((cy) => (
        <circle key={cy} cx={127} cy={cy} r="1.7" />
      ))}
      <circle cx={160} cy={298} r="8" />
      <circle cx={160} cy={298} r="6.2" strokeWidth="0.6" />
      <path d="M158,298 h4 M160,296 v4" strokeWidth="0.6" />
      <Silk x={171} y={300}>
        CR2032
      </Silk>
      <rect x={206} y={304} width={26} height={8} rx="0.8" />
      <Pins x={208} y={305.2} cols={5} rows={2} dx={4.8} dy={3.4} size={1.8} />
      <Silk x={206} y={300}>
        F_USB
      </Silk>
      <rect x={270} y={304} width={44} height={8} rx="0.8" />
      <Pins x={274} y={305.2} cols={5} rows={2} dx={8.4} dy={3.4} size={1.8} />
      <Silk x={276} y={324}>
        F_PANEL
      </Silk>
    </g>
  );
}

const STEPS: Step[] = [
  {
    id: "cpu",
    name: "CPU",
    spec: "Ryzen 7 7800X3D · AM5",
    kind: "place",
    slot: SOCKET,
    tip: "line up the golden triangle with the socket corner, then lock the lever",
    done: "CPU seated and lever locked",
    watts: 120,
    learn: {
      what: "The Central Processing Unit is the brain of the computer. Every click, keystroke and line of code ends up as instructions the CPU executes.",
    },
    icon: { box: { x: 175, y: 64, w: 60, h: 60 }, art: CPU_ART },
  },
  {
    id: "paste",
    needs: ["cpu"],
    needsWhy: "the paste goes right on top of the CPU",
    name: "Thermal Paste",
    spec: "pea-sized dot",
    kind: "paste",
    tip: "drag the paste onto the CPU, then squeeze out a pea-sized dot",
    done: "pea-sized dot, the cooler pressure will spread it evenly",
    watts: 0,
    learn: {
      what: "Thermal paste sits between the CPU and the cooler. It fills the tiny air gaps between them so heat can flow from the CPU into the cooler.",
    },
    icon: {
      box: { x: 0, y: 0, w: 40, h: 40 },
      art: (
        <>
          <path d="M8,32 L26,14 L30,18 L12,36 Z" />
          <path d="M26,14 L32,8 M30,18 L36,12 M32,8 L36,12" />
          <path d={O(8, 34, 2.4)} />
        </>
      ),
    },
  },
  {
    id: "ram",
    name: "RAM",
    spec: "DDR5-6000 CL30 · 2×16 GB",
    kind: "ram",
    tip: "drop the RAM onto the slots, then pick the pair that runs in dual channel",
    done: "dual channel enabled",
    watts: 10,
    learn: {
      what: "Random Access Memory is the short-term workspace of the computer. It holds whatever the CPU is working on right now: open apps, browser tabs, game levels.",
    },
    icon: { box: { x: 208, y: 40, w: 134, h: 134 }, art: [262, 280].map(RAM_ART) },
  },
  {
    id: "ssd",
    name: "M.2 SSD",
    spec: "1 TB NVMe Gen4",
    kind: "place",
    slot: SSD,
    tip: "slide it into M2_1 at an angle, press down and screw it in",
    done: "M.2 screwed down, no cables needed",
    watts: 7,
    learn: {
      what: "A Solid State Drive is long-term storage. The operating system, apps and your files live here and stay put when the power is off.",
    },
    icon: { box: { x: 146, y: 97, w: 118, h: 118 }, art: SSD_ART },
  },
  {
    id: "cooler",
    needs: ["paste"],
    needsWhy: "the cooler sits right on top of the paste",
    name: "CPU Cooler",
    spec: "tower · 120 mm fan",
    kind: "place",
    slot: COOLER,
    tip: "mount it straight on top of the CPU",
    done: "cooler mounted, its fan cable gets plugged in with the other cables",
    watts: 3,
    learn: {
      what: "The CPU cooler moves heat away from the CPU so it can keep running at full speed.",
    },
    icon: { box: { x: 166, y: 54, w: 80, h: 80 }, art: COOLER_ART },
  },
  {
    id: "fan",
    name: "Case Fan",
    spec: "120 mm · rear exhaust",
    kind: "place",
    slot: CASEFAN,
    tip: "rear position, blowing hot air out the back",
    done: "rear exhaust set, airflow goes front to back",
    watts: 2,
    learn: {
      what: "Case fans move air through the whole case, pulling cool air in and pushing hot air out, so every part stays cool.",
    },
    icon: { box: { x: 22, y: 36, w: 72, h: 72 }, art: CASEFAN_ART },
  },
  {
    id: "gpu",
    name: "Graphics Card",
    spec: "RTX 4070 SUPER · 12 GB",
    kind: "gpu",
    tip: "two PCIe slots on this board, only one gives the card all its lanes",
    done: "clicked into PCIe x16",
    watts: 220,
    learn: {
      what: "The Graphics Processing Unit draws everything you see on screen, and is also what powers most AI work today.",
    },
    icon: { box: { x: 96, y: 86, w: 280, h: 280 }, art: GPU_ART },
  },
  {
    id: "psu",
    name: "Power Supply",
    spec: "750 W · 80+ Gold · modular",
    kind: "place",
    slot: PSU,
    tip: "into the shroud at the bottom, fan facing down",
    done: "750 W with plenty of headroom",
    watts: 0,
    learn: {
      what: "The Power Supply Unit is the heart of the system. It feeds every part with the electricity it needs.",
    },
    icon: { box: { x: 20, y: 280, w: 190, h: 190 }, art: PSU_ART },
  },
  {
    id: "cables",
    needs: ["psu", "gpu", "cooler"],
    needsWhy:
      "the cables run from the PSU to the parts, including the graphics card and the cooler fan",
    name: "Cables",
    spec: "ATX · EPS · PCIe · fan · front panel",
    kind: "cables",
    tip: "drag each cable from the kit to its header, check the pins, two of them look alike",
    done: "everything is wired up, time to power on",
    watts: 0,
    learn: {
      what: "Cables carry power from the PSU to the parts, and signals from the case to the motherboard.",
    },
    icon: {
      box: { x: 0, y: 0, w: 40, h: 40 },
      art: (
        <>
          <path d={R(14, 6, 12, 18)} />
          <path d="M17,10 L23,10 M17,14 L23,14 M17,18 L23,18" />
          <path d="M20,24 C20,30 12,30 12,36 M20,24 C20,30 28,30 28,36" />
        </>
      ),
    },
  },
];

const TOTAL_W = STEPS.reduce((s, x) => s + x.watts, 0);

function PartIcon({ step, size }: { step: Step; size: number }) {
  const { x, y, w, h } = step.icon.box;
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={Math.max(w, h) / 26}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {step.icon.art}
    </svg>
  );
}

function learnTitle(s: Step) {
  if (s.id === "cables") return "What are the cables for?";
  if (s.id === "paste") return "What is thermal paste?";
  if (s.id === "ram") return "What is RAM?";
  const article = /^[AEIOU]|^M\.2/.test(s.name) ? "an" : "a";
  return `What is ${article} ${s.name}?`;
}

// Kartu materi: pengenalan singkat komponen dan fungsinya. Untuk kabel, isinya
// mengikuti kabel yang sedang dipegang atau baru dicolok.
function LearnCard({
  step,
  cable,
  note,
  onClose,
}: {
  step: Step;
  cable?: Cable;
  note?: string;
  onClose?: () => void;
}) {
  return (
    <div className="font-poppins-sans">
      <p className="m-0 font-caveat text-xl sm:text-2xl font-bold leading-none text-foreground">
        {cable ? cable.title : learnTitle(step)}
      </p>
      {note && <p className="mt-1.5 mb-0 text-[0.785rem] text-muted">{note}</p>}
      <p className="mt-3 mb-0 text-sm leading-[1.75] text-foreground">
        {cable ? cable.what : step.learn.what}
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-md border border-border py-2.5 font-mono text-sm text-foreground"
        >
          got it
        </button>
      )}
    </div>
  );
}

const PASTE_R = 17; // Radius titik pasta saat penuh (100%), di koordinat papan.
const PASTE_MIN = 38;
const PASTE_MAX = 64;
const R_MIN = (PASTE_MIN / 100) * PASTE_R;
const R_MAX = (PASTE_MAX / 100) * PASTE_R;
const ZOOM = 4;

// Layar POST seperti BIOS motherboard asli: label rata kiri, nilai sejajar.
const POST_LINES: [string, string][] = [
  ["CPU", "AMD Ryzen 7 7800X3D 8-Core Processor"],
  ["Speed", "4200 MHz"],
  ["Memory Test", "mem"],
  ["Memory Info", "DDR5-6000 · Dual-Channel Interleaved"],
  ["NVMe", "1 TB PCIe Gen4 SSD · detected"],
  ["PCIe x16", "NVIDIA GeForce RTX 4070 SUPER 12 GB"],
  ["USB Devices", "1 Keyboard, 1 Mouse"],
  ["CPU Fan", "1180 RPM"],
  ["CPU Temp", "41 °C"],
];
const MEM_MB = 32768;
// Wallpaper desktop: gradasi lembut berlapis seperti wallpaper bawaan OS.
const WALLPAPER = [
  "radial-gradient(120% 90% at 10% 110%, #2f6bff 0%, transparent 55%)",
  "radial-gradient(90% 80% at 100% 0%, #a855f7 0%, transparent 60%)",
  "radial-gradient(70% 70% at 75% 95%, #0ea5c6 0%, transparent 60%)",
  "linear-gradient(160deg, #0b1024 0%, #1b1446 100%)",
].join(", ");
const MEM_LINE = POST_LINES.findIndex(([, v]) => v === "mem");

function grade(mistakes: number) {
  if (mistakes === 0) return { letter: "S", line: "flawless build, are you a technician?" };
  if (mistakes <= 2) return { letter: "A", line: "clean build, a couple of slips" };
  if (mistakes <= 4) return { letter: "B", line: "it boots, that is what matters" };
  return { letter: "C", line: "it boots... somehow" };
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

type Msg = { text: string; tone: "ok" | "warn" };

// onLitChange memberi tahu halaman saat PC menyala, karena setelah itu judul halaman
// mengikuti tampilan desktop di semua ukuran layar.
export function PcBuilder({ onLitChange }: { onLitChange?: (lit: boolean) => void }) {
  // Komponen yang sudah terpasang; urutannya bebas selama prasyaratnya terpenuhi.
  const [done, setDone] = useState<string[]>([]);
  // Komponen yang sedang difokuskan pengguna, yaitu yang terakhir dipilih di daftar.
  const [focusId, setFocusId] = useState<string | null>(null);
  const [cpuIn, setCpuIn] = useState(false);
  const [leverDown, setLeverDown] = useState(false);
  const [paste, setPaste] = useState(0);
  const [holding, setHolding] = useState(false);
  const [pasteOn, setPasteOn] = useState(false);
  const [pasteState, setPasteState] = useState<"idle" | "little" | "much" | "ok">("idle");
  const [ram, setRam] = useState<string[]>([]);
  // Setelah sekali salah memilih slot, slot yang disarankan disorot agar pengguna tidak menebak lagi.
  const [ramHint, setRamHint] = useState(false);
  const [ramPick, setRamPick] = useState(false);
  const [cables, setCables] = useState<string[]>([]);
  // Kabel yang sedang diseret
  const [cableDrag, setCableDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [msg, setMsg] = useState<Msg | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  // Item yang dipilih dengan ketukan di layar sentuh, formatnya "part:cpu" atau "cable:atx".
  // Hanya item ini yang bisa diseret, sehingga daftar tetap bisa digulir.
  const [picked, setPicked] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [phase, setPhase] = useState<"build" | "post" | "done">("build");
  const [postShown, setPostShown] = useState(0);
  // Angka memory test yang terus naik di layar POST.
  const [memCount, setMemCount] = useState(0);
  // Desktop: kartu penjelasan ditaruh di samping papan.
  const [wide, setWide] = useState(false);
  // Mobile dan tablet: komponen atau kabel yang baru terpasang tetap di-zoom bersama
  // penjelasannya sampai "got it" ditekan. Item berikutnya tetap bisa langsung dipilih.
  const [review, setReview] = useState<{ step: string; cable?: string } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<SVGGElement>(null);
  // Komponen atau kabel yang sedang ditekan. moved bernilai true jika sudah benar-benar diseret.
  // armed bernilai false jika item belum dipilih, jadi geserannya hanya menggulir halaman.
  const press = useRef<{
    kind: "part" | "cable";
    id: string;
    x: number;
    y: number;
    moved: boolean;
    armed: boolean;
    touch: boolean;
  } | null>(null);
  // Handler drag dari render terbaru, dipanggil oleh listener di window.
  const dragFns = useRef<{
    move: (e: PointerEvent) => void;
    end: (e: PointerEvent | null) => void;
  }>({
    move: () => {},
    end: () => {},
  });
  const pasteRef = useRef(0);

  const byId = (id: string) => STEPS.find((x) => x.id === id)!;
  const has = (id: string) => done.includes(id);
  // Pasta yang sudah pas langsung dianggap selesai tanpa menunggu langkahnya ditandai,
  // agar cooler bisa langsung diseret.
  const ready = (x: Step) =>
    !has(x.id) && (x.needs ?? []).every((n) => has(n) || (n === "paste" && pasteState === "ok"));
  // Langkah yang sudah dimulai harus diselesaikan terlebih dulu.
  const lock =
    cpuIn && !leverDown
      ? "cpu"
      : pasteOn && !has("paste")
        ? "paste"
        : ramPick && !has("ram")
          ? "ram"
          : null;
  const active = drag?.id ?? null;
  const cur: Step | undefined = lock
    ? byId(lock)
    : active
      ? byId(active)
      : focusId && ready(byId(focusId))
        ? byId(focusId)
        : ram.length && !has("ram")
          ? byId("ram")
          : STEPS.find(ready);
  const built = done.length === STEPS.length;
  const showKit = phase === "build" && ready(byId("cables")) && !lock;
  const panelOpen = (cur?.kind === "ram" && ramPick) || (cur?.kind === "paste" && pasteOn);
  // Cable kit muncul begitu kabel bisa dipasang, apa pun komponen yang sedang disorot.
  const holdingCable = cableDrag !== null;
  const pct = Math.round((done.length / STEPS.length) * 100);
  const watts = STEPS.filter((x) => has(x.id)).reduce((sum, x) => sum + x.watts, 0);
  const elapsed = startedAt ? (endedAt ?? now) - startedAt : 0;

  // Halaman tidak ikut tergulir selama drag. Listener harus non-passive agar
  // preventDefault berlaku.
  useEffect(() => {
    const block = (e: TouchEvent) => {
      if (press.current?.armed) e.preventDefault();
    };
    window.addEventListener("touchmove", block, { passive: false });
    return () => window.removeEventListener("touchmove", block);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Stopwatch
  useEffect(() => {
    if (!startedAt || endedAt) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [startedAt, endedAt]);

  // Pasta bertambah selama tombol ditahan.
  useEffect(() => {
    if (!holding) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      pasteRef.current = Math.min(100, pasteRef.current + (t - last) * 0.038);
      last = t;
      setPaste(pasteRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding]);

  // Layar POST menampilkan teks baris demi baris.
  useEffect(() => {
    if (phase !== "post") return;
    if (postShown > POST_LINES.length) {
      const t = window.setTimeout(() => setPhase("done"), 1400);
      return () => window.clearTimeout(t);
    }
    // Jeda lebih lama di awal (logo) dan selama memory test menghitung.
    const wait = postShown === 0 ? 1200 : postShown === MEM_LINE + 1 ? 1100 : 300;
    const t = window.setTimeout(() => setPostShown((n) => n + 1), wait);
    return () => window.clearTimeout(t);
  }, [phase, postShown]);

  useEffect(() => {
    if (phase !== "post" || postShown !== MEM_LINE + 1) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setMemCount(Math.round((k * MEM_MB) / 1024) * 1024);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, postShown]);

  // Layar pendek: pastikan panel yang baru terbuka (beserta tombolnya) terlihat utuh.
  useEffect(() => {
    if (!panelOpen) return;
    const t = window.setTimeout(
      () => panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      60,
    );
    return () => window.clearTimeout(t);
  }, [panelOpen]);

  const begin = () => setStartedAt((t) => t ?? Date.now());
  const say = (text: string, tone: Msg["tone"] = "ok") => setMsg({ text, tone });
  const oops = (text: string) => {
    setMistakes((m) => m + 1);
    say(text, "warn");
  };
  const advance = (id: string) => {
    say(byId(id).done);
    setDone((d) => (d.includes(id) ? d : [...d, id]));
    setFocusId(null);
    setPicked(null);
    if (!wide) setReview({ step: id });
  };

  // Alasan komponen ini belum bisa dipasang.
  const nudge = (x: Step) => {
    setShake(x.id);
    window.setTimeout(() => setShake(null), 450);
    if (lock && lock !== x.id) {
      return say(
        lock === "cpu"
          ? "lock the socket lever first"
          : lock === "paste"
            ? "finish the thermal paste first"
            : "pick a slot for the RAM first",
        "warn",
      );
    }
    const missing = (x.needs ?? []).filter((n) => !has(n)).map((n) => byId(n).name);
    if (missing.length) {
      say(`${x.name} needs ${missing.join(" and ")} first, ${x.needsWhy}`, "warn");
    }
  };

  // Halaman ikut scroll saat sesuatu diseret ke dekat tepi layar, karena di layar kecil
  // daftar & cable kit berada di bawah papan. Aturannya:
  // - hanya berjalan jika papan PC belum terlihat utuh. Tepi atasnya dihitung dari
  //   bawah navbar yang menempel, agar header teratas tidak tertutup navbar
  // - berhenti saat kursor berada di atas kotak biru, agar target tidak bergeser
  //   dari bawah kursor saat pengguna sudah membidiknya.
  const dragPt = useRef<{ x: number; y: number } | null>(null);
  const glowRef = useRef<Box[]>([]);
  const autoScroll = (clientY: number, clientX = 0) => {
    dragPt.current = { x: clientX, y: clientY };
  };
  const dragging = drag !== null || cableDrag !== null;
  useEffect(() => {
    if (!dragging) {
      dragPt.current = null;
      return;
    }
    let raf = 0;
    const tick = () => {
      const pt = dragPt.current;
      const rect = svgRef.current?.getBoundingClientRect();
      if (pt && rect) {
        const nav = document.querySelector<HTMLElement>("body .fixed.top-0.left-0.right-0");
        const top = Math.max(0, nav?.getBoundingClientRect().bottom ?? 0) + 8;
        const edge = 56;
        const sp = toSvg(pt.x, pt.y);
        const onTarget = pt.y >= top && !!sp && glowRef.current.some((b) => hit(sp, b, 2));
        if (!onTarget) {
          if (pt.y < top + edge && rect.top < top) {
            window.scrollBy(0, -Math.min(top - rect.top, Math.ceil((top + edge - pt.y) / 3)));
          } else if (pt.y > window.innerHeight - edge && rect.bottom > window.innerHeight) {
            const over = rect.bottom - window.innerHeight;
            window.scrollBy(0, Math.min(over, Math.ceil((pt.y - (window.innerHeight - edge)) / 3)));
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    // Matriks diambil dari grup zoom, termasuk saat animasinya masih berjalan,
    // sehingga titik drop selalu sesuai dengan gambar di layar.
    const ctm = (boardRef.current ?? svg)?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  };
  // Slot DIMM yang berada di bawah titik, untuk drop atau klik langsung di papan saat zoom RAM.
  const slotAt = (p: { x: number; y: number }) => {
    if (p.y < 30 || p.y > 186) return null;
    const i = DIMM_X.findIndex((x) => p.x >= x - 2.5 && p.x <= x + 9.5);
    return i < 0 ? null : DIMM_NAME[i];
  };

  // Komponen dijatuhkan di titik p (koordinat papan).
  const placeAt = (id: string, p: { x: number; y: number }) => {
    const s = STEPS.find((x) => x.id === id)!;
    if (s.kind === "paste") {
      if (pasteOn)
        return say("the paste is on the CPU, press & hold the button below the board to squeeze");
      if (!inCase(p)) return say("drop the paste onto the CPU", "warn");
      setPasteOn(true);
      return say("good, now squeeze out a pea-sized dot");
    }
    if (s.kind === "ram") {
      // Dijatuhkan di blok DIMM: langsung masuk ke slot terdekat dari titik drop.
      if (!hit(p, DIMM_AREA)) return say("drop the stick onto the RAM slots", "warn");
      const near = DIMM_X.reduce(
        (best, x, i) =>
          Math.abs(p.x - (x + 3.5)) < Math.abs(p.x - (DIMM_X[best] + 3.5)) ? i : best,
        0,
      );
      setRamPick(true);
      return pickSlot(DIMM_NAME[near]);
    }
    if (s.kind === "gpu") {
      // Slot x4 hanya dianggap dipilih jika dijatuhkan tepat di sana (bukan di x16).
      if (hit(p, GPU4_ZONE) && !hit(p, GPU16_ZONE)) {
        return oops("that slot only runs at x4, the card wants the full x16 lanes up top");
      }
      if (inCase(p)) return advance("gpu");
      return say("drop the card onto a PCIe slot", "warn");
    }
    // Komponen dengan satu tujuan langsung masuk ke tempatnya, di mana pun dijatuhkan di dalam casing.
    if (s.slot && inCase(p)) {
      if (id === "cpu") {
        setCpuIn(true);
        return say("triangle lined up, now lower the socket lever");
      }
      return advance(id);
    }
    say("drop it on the glowing outline", "warn");
  };

  const onBoardClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (phase !== "build") return;
    const p = toSvg(e.clientX, e.clientY);
    if (!p) return;
    if (lock === "paste")
      return say("press & hold the button below the board to squeeze the paste");
    if (lock === "ram") {
      const slot = slotAt(p);
      if (slot) pickSlot(slot);
      return;
    }
    if (lock === "cpu") {
      if (hit(p, LEVER)) {
        setLeverDown(true);
        advance("cpu");
      } else say("click the socket lever to lock the CPU in", "warn");
      return;
    }
  };

  // Kabel dicolok ke header terdekat dari titik drop. Header dipilih sendiri oleh
  // pengguna; jika kabelnya salah, tampilkan alasan kabel tidak cocok.
  const plug = (cid: string, p: { x: number; y: number }) => {
    // Header kosong terdekat, diukur ke tepi kotaknya (0 jika di dalam kotak),
    // sehingga drop di dekat header atau di label-nya tetap terhitung.
    const edge = (b: Box) =>
      Math.hypot(
        Math.max(b.x - p.x, 0, p.x - (b.x + b.w)),
        Math.max(b.y - p.y, 0, p.y - (b.y + b.h)),
      );
    let port: Cable | undefined;
    let best = PLUG_RADIUS;
    for (const c of CABLES) {
      if (cables.includes(c.id) || (c.id === "pcie" && !has("gpu"))) continue;
      const d = edge(c.port);
      if (d <= best) {
        best = d;
        port = c;
      }
    }
    const cable = CABLES.find((c) => c.id === cid)!;
    if (!port) return say("drop the plug onto one of the glowing headers", "warn");
    begin();
    if (port.id !== cid) {
      setShake(`cable-${cid}`);
      window.setTimeout(() => setShake(null), 450);
      return oops(cableMismatch(cable, port));
    }
    const next = [...cables, cid];
    setCables(next);
    if (next.length === CABLES.length) advance("cables");
    else say(`${cable.ok} (${next.length}/${CABLES.length})`);
    setPicked(null);
    if (!wide) setReview({ step: "cables", cable: cid });
  };

  // Panel bisa ditutup untuk memasang komponen lain terlebih dulu. Stik RAM yang
  // sudah masuk tetap terpasang.
  // Petunjuk muncul saat item yang sedang dikerjakan diseret atau diklik lagi.
  const busyTip = (x: Step) =>
    x.id === "cpu" && cpuIn
      ? "the CPU is seated, click the socket lever to lock it"
      : x.kind === "paste" && pasteOn
        ? "the paste is on the CPU, press & hold the button below the board to squeeze"
        : x.tip;

  // Komponen lain boleh dipasang kapan saja. Langkah pasta/RAM yang belum selesai
  // disimpan sementara dan tidak memblokir drag.
  const setAside = (id: string) => {
    if (lock === "paste" && id !== "paste") closePaste();
    if (lock === "ram" && id !== "ram") closeRamPick();
  };

  const closeRamPick = () => {
    setRamPick(false);
    say(
      ram.length ? "one stick is in, drag the RAM again for the second" : "RAM put aside for now",
    );
  };
  const closePaste = () => {
    if (holding || pasteState === "ok") return;
    setPasteOn(false);
    pasteRef.current = 0;
    setPaste(0);
    setPasteState("idle");
    say("paste put aside, drag it onto the CPU when you are ready");
  };

  const pickSlot = (name: string) => {
    if (ram.includes(name) || has("ram")) return;
    if (!DIMM_OK.includes(name)) {
      setRamHint(true);
      setShake(name);
      window.setTimeout(() => setShake(null), 450);
      return oops(
        `${name} is only used when all four slots are filled, with two sticks use A2 + B2 for dual channel`,
      );
    }
    const nextRam = [...ram, name];
    setRam(nextRam);
    if (nextRam.length === 2) {
      setRamPick(false);
      advance("ram");
    } else say(`${name} clicked in, now the second stick`);
  };

  const startPaste = () => {
    if (pasteState === "ok") return;
    pasteRef.current = 0;
    setPaste(0);
    setPasteState("idle");
    begin();
    setHolding(true);
  };

  const releasePaste = () => {
    if (!holding) return;
    setHolding(false);
    const v = pasteRef.current;
    if (v >= PASTE_MIN && v <= PASTE_MAX) {
      // Jeda sebentar agar pengguna sempat melihat hasil yang benar.
      setPasteState("ok");
      window.setTimeout(() => advance("paste"), 900);
      return;
    }
    setPasteState(v < PASTE_MIN ? "little" : "much");
    oops(
      v < PASTE_MIN
        ? "too little paste, that leaves air gaps, wipe it and try again"
        : "too much, it squeezed over the edge, clean it up and try again",
    );
  };

  // Komponen yang bisa diseret saat ini. Kabel diseret dari cable kit, sedangkan CPU
  // yang sudah terpasang dan pasta yang sudah dioles diselesaikan langsung di papan.
  const canGrab = (x: Step) =>
    ready(x) &&
    x.kind !== "cables" &&
    !(x.id === "cpu" && cpuIn) &&
    !(x.kind === "paste" && pasteOn);

  const onDragMove = (e: PointerEvent) => {
    const pr = press.current;
    if (!pr || !pr.armed) return;
    if (!pr.moved) {
      if (Math.hypot(e.clientX - pr.x, e.clientY - pr.y) < 5) return;
      pr.moved = true;
      if (pr.kind === "part") {
        const s = byId(pr.id);
        if (!canGrab(s)) {
          press.current = null;
          if (!ready(s)) return nudge(s);
          setFocusId(s.id);
          return say(busyTip(s));
        }
        setAside(s.id);
        begin();
        setFocusId(s.id);
      }
    }
    const at = { id: pr.id, x: e.clientX, y: e.clientY };
    if (pr.kind === "part") setDrag(at);
    else setCableDrag(at);
    autoScroll(e.clientY, e.clientX);
  };

  // e bernilai null jika drag dibatalkan (pointercancel atau jendela kehilangan fokus).
  const onDragEnd = (e: PointerEvent | null) => {
    const pr = press.current;
    press.current = null;
    setDrag(null);
    setCableDrag(null);
    if (!pr || !e) return;
    if (pr.moved) {
      const p = toSvg(e.clientX, e.clientY);
      if (!p) return;
      return pr.kind === "part" ? placeAt(pr.id, p) : plug(pr.id, p);
    }
    // Klik atau ketukan memilih item dan menampilkan garis bantunya. Komponen tetap
    // dipasang dengan drag, dan di layar sentuh hanya item terpilih yang bisa diseret.
    const then = pr.touch ? "now drag" : "drag";
    if (pr.kind === "cable") {
      setPicked(`cable:${pr.id}`);
      return say(`${then} the ${CABLES.find((c) => c.id === pr.id)!.name} cable onto its header`);
    }
    const s = byId(pr.id);
    if (!ready(s)) return nudge(s);
    setFocusId(s.id);
    if (canGrab(s)) setPicked(`part:${s.id}`);
    say(canGrab(s) ? `${then} the ${s.name} into the case` : busyTip(s));
  };
  dragFns.current = { move: onDragMove, end: onDragEnd };

  // Event gerak & lepas didengarkan di window, bukan di tombolnya, agar drop selalu
  // terdeteksi di mana pun kursor dilepas dan komponen tidak tertinggal melayang.
  const startPress = (kind: "part" | "cable", id: string, e: React.PointerEvent) => {
    if (e.button !== 0) return;
    window.getSelection()?.removeAllRanges();
    setReview(null);
    // Mouse dan pena bisa langsung menyeret. Sentuhan hanya menyeret item yang sudah
    // dipilih, selain itu browser menggulir halaman (pointercancel).
    const touch = e.pointerType === "touch";
    press.current = {
      kind,
      id,
      x: e.clientX,
      y: e.clientY,
      moved: false,
      armed: !touch || picked === `${kind}:${id}`,
      touch,
    };
    const move = (ev: PointerEvent) => dragFns.current.move(ev);
    const up = (ev: PointerEvent) => stop(ev);
    const cancel = () => stop(null);
    const stop = (ev: PointerEvent | null) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      dragFns.current.end(ev);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
  };

  const reset = () => {
    setReview(null);
    setDone([]);
    setFocusId(null);
    setCpuIn(false);
    setLeverDown(false);
    setPasteOn(false);
    setPasteState("idle");
    setPaste(0);
    pasteRef.current = 0;
    setRam([]);
    setRamHint(false);
    setRamPick(false);
    setCables([]);
    setCableDrag(null);
    setPicked(null);
    setMsg(null);
    setMistakes(0);
    setStartedAt(null);
    setEndedAt(null);
    setPhase("build");
    setPostShown(0);
  };

  const powerOn = () => {
    setEndedAt(Date.now());
    setPostShown(0);
    setMemCount(0);
    setPhase("post");
  };

  // Slot yang berdenyut menandai tujuan komponen yang sedang dipegang atau aksi
  // berikutnya. Garis bantu dan labelnya muncul di setiap langkah, tanpa menunggu
  // komponen dipegang, agar pengguna langsung tahu tujuan dan fungsinya.
  // Mobile dan tablet: garis bantu baru muncul setelah item diketuk, dipegang, atau
  // langkahnya sedang dikerjakan, agar papan tidak penuh petunjuk sejak awal.
  const hint = wide || !!active || !!lock || !!picked;
  const glow: { b: Box; label?: string }[] = [];
  if (phase === "build" && holdingCable) {
    CABLES.filter((c) => !cables.includes(c.id) && (c.id !== "pcie" || has("gpu"))).forEach((c) =>
      glow.push({ b: grow(c.port, 4), label: c.portName }),
    );
  } else if (phase === "build" && cur && hint) {
    const verb = active ? "drop" : "drag";
    if (cur.id === "cpu" && cpuIn && !leverDown) {
      glow.push({ b: LEVER, label: "click to lock the lever" });
    } else if (cur.kind === "paste") {
      if (!pasteOn)
        glow.push({
          b: grow(SOCKET, GLOW_GROW),
          label: `${verb} the paste onto the CPU`,
        });
    } else if (cur.kind === "cables" && ready(cur)) {
      CABLES.filter((c) => !cables.includes(c.id)).forEach((c) =>
        glow.push({ b: grow(c.port, 4), label: c.portName }),
      );
    } else if (cur.kind === "ram") {
      if (!ramPick) glow.push({ b: DIMM_AREA, label: `${verb} the RAM onto these slots` });
    } else if (cur.kind === "gpu") {
      glow.push({ b: GPU16_ZONE, label: `${verb} here for PCIe x16` });
      glow.push({ b: GPU4_ZONE, label: `${verb} here for PCIe x4` });
    } else if (cur.slot) {
      glow.push({
        b: grow(cur.slot, GLOW_GROW, cur.id === "fan" ? 96 : 446),
        label: `${verb} the ${cur.name} here`,
      });
    }
  }

  glowRef.current = glow.map((g) => g.b);

  const inZone = paste >= PASTE_MIN && paste <= PASTE_MAX;
  const pasteInk =
    paste > PASTE_MAX || pasteState === "much" || pasteState === "little"
      ? "var(--red-color)"
      : inZone || pasteState === "ok"
        ? "var(--blue-color)"
        : "var(--muted-color)";
  const pasteStatus =
    pasteState === "ok"
      ? "pea-sized, perfect!"
      : holding
        ? paste < PASTE_MIN
          ? "keep holding…"
          : inZone
            ? "just right, let go now!"
            : "too much! let go"
        : pasteState === "little"
          ? "too little, it would leave air gaps"
          : pasteState === "much"
            ? "too much, it would spill over the edge"
            : "hold until the dot fills the blue ring";

  // Untuk langkah yang butuh ketelitian, kamera mendekat ke area kerjanya dan
  // kontrolnya ditampilkan di bawah papan, tanpa popup yang menumpuk.
  const zoomed = cur?.kind === "paste" && pasteOn && phase === "build";
  const ramOpen = cur?.kind === "ram" && ramPick && phase === "build";
  // Kamera selalu mengarah ke komponen yang sedang dikerjakan. Di layar lebar, target
  // digeser ke kiri (ox) karena sisi kanan dipakai untuk kartu penjelasan.
  // Zoom dan kartu penjelasan hanya muncul saat komponen sedang dipegang atau
  // langkahnya sedang dikerjakan (tuas CPU, olesan pasta, pilih slot RAM).
  // Selain itu, papan tampil utuh tanpa kartu.
  const aiming = !!active || !!lock;
  // Kabel yang sedang diseret ikut di-zoom dan diberi penjelasan seperti komponen lain.
  const heldCable = cableDrag ? CABLES.find((c) => c.id === cableDrag.id) : undefined;
  const reviewing = !!review && !wide && !aiming && !heldCable && phase === "build";
  const reviewCable = reviewing ? CABLES.find((c) => c.id === review.cable) : undefined;
  // Kabel yang sedang dipegang atau baru dicolok: zoom dan penjelasannya mengikuti kabel ini.
  const focusCable = heldCable ?? reviewCable;
  const explainStep =
    phase !== "build"
      ? undefined
      : heldCable
        ? byId("cables")
        : aiming
          ? cur
          : reviewing
            ? byId(review.step)
            : undefined;
  const explain = !!explainStep;
  const side = wide && explain;
  const ox = side ? 135 : 230;
  const fit = (b: Box, max: number) => {
    const s = Math.max(side ? 0.8 : 1, Math.min(max, (side ? 240 : 400) / b.w, 360 / b.h));
    return { cx: b.x + b.w / 2, cy: b.y + b.h / 2, s };
  };
  const view = !explainStep
    ? { cx: 230, cy: 210, s: 1 }
    : focusCable
      ? // Zoom ke header tujuan kabel, dengan sedikit area di sekitarnya.
        fit(grow(focusCable.port, 40), side ? 2.6 : 2.2)
      : zoomed
        ? { cx: 205, cy: 94, s: side ? 3.4 : ZOOM }
        : fit(FOCUS[explainStep.id] ?? { x: 10, y: 10, w: 440, h: 400 }, side ? 2.6 : 2.2);
  const zoom = view.s !== 1 || view.cx !== ox ? view : null;
  // Batas papan yang terlihat (di luar kartu), dalam koordinat papan.
  const vx0 = view.cx - ox / view.s;
  const vx1 = view.cx + ((side ? 270 : 452) - ox) / view.s;
  const vy0 = view.cy - 210 / view.s;
  const vy1 = view.cy + 210 / view.s;

  const g = grade(mistakes);
  // Jam di taskbar, diambil saat sistem dinyalakan.
  const clock = endedAt
    ? new Date(endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const lit = phase !== "build";
  useEffect(() => onLitChange?.(lit), [lit, onLitChange]);
  // Komponen yang sudah terpasang dipindah ke bawah agar komponen berikutnya selalu di atas.
  const queue = [...STEPS.filter((s) => !has(s.id)), ...STEPS.filter((s) => has(s.id))];
  // Begitu juga kabel yang sudah tercolok.
  const cableQueue = [
    ...CABLES.filter((c) => !cables.includes(c.id)),
    ...CABLES.filter((c) => cables.includes(c.id)),
  ];

  // Isi casing dipakai dua kali: di papan saat merakit dan di dinding kaca casing
  // pada adegan meja 3D setelah sistem dinyalakan.
  const caseArt = (
    <>
      {/* Casing + shroud PSU + kipas intake depan */}
      <path
        d={R(10, 10, 440, 400)}
        stroke="var(--muted-color)"
        fill={lit ? "var(--bg-color)" : "none"}
      />
      {/* Kaki casing, terlihat saat PC berdiri di meja */}
      {lit && (
        <path d="M36,410 V418 H70 V410 M390,410 V418 H424 V410" stroke="var(--muted-color)" />
      )}
      <path d="M10.5,332 C140,331 300,333.4 449.5,332" stroke="var(--muted-color)" />
      <g stroke="var(--muted-color)">
        <path d={R(382, 40, 58, 58)} />
        <Fan cx={411} cy={69} r={24} />
        <path d={R(382, 106, 58, 58)} />
        <Fan cx={411} cy={135} r={24} />
      </g>
      <Silk x={394} y={180}>
        INTAKE
      </Silk>
      <Silk x={392} y={402}>
        PWR
      </Silk>
      <path
        d={O(428, 400, 4)}
        stroke="var(--muted-color)"
        fill={lit ? "var(--blue-color)" : "none"}
        className={lit ? "pc-led" : undefined}
      />

      {/* Motherboard ATX, sudah terpasang sebagai alas */}
      <Motherboard
        leverD={leverDown || !cpuIn ? "M242,124 L242,72 L247,68" : "M242,124 L242,92 L254,66"}
        leverStroke={cpuIn && !leverDown ? "var(--fg-color)" : "var(--muted-color)"}
      />

      {/* Garis bantu yang berdenyut */}
      {glow.map(({ b }, i) => (
        <path
          key={i}
          d={R(b.x - 2, b.y - 2, b.w + 4, b.h + 4)}
          stroke="var(--blue-color)"
          strokeWidth="1.6"
          className="pc-pulse"
        />
      ))}
      {/* Label digambar setelah semua garis agar tidak tertimpa, dan diberi
          tepi warna latar (paint-order) agar tetap terbaca di atas gambar */}
      {glow.map(({ b, label }, i) => {
        if (!label) return null;
        // Garis bantu di luar area zoom tidak diberi label.
        if (b.x + b.w < vx0 || b.x > vx1 || b.y + b.h < vy0 || b.y > vy1) return null;
        // Ukuran label di layar tetap sama, berapa pun zoom-nya. Di layar sempit papan
        // ikut mengecil, jadi label diperbesar agar tetap terbaca.
        const k = (wide ? 1 : 1.35) / view.s;
        const above = b.y - 10 * k >= vy0 + 12 * k;
        const x = Math.max(vx0 + 4 * k, Math.min(b.x - 2 * k, vx1 - (label.length * 4.9 + 4) * k));
        return (
          <text
            key={`t${i}`}
            x={x}
            y={above ? b.y - 10 * k : b.y + b.h + 14 * k}
            fontSize={8 * k}
            style={{ fontFamily: "var(--font-poppins-sans)" }}
            fill="var(--blue-color)"
            stroke="var(--bg-color)"
            strokeWidth={4 * k}
            paintOrder="stroke"
            className="pointer-events-none"
          >
            {label}
          </text>
        );
      })}

      {/* Komponen terpasang, urutan gambar = urutan tumpuk */}
      {cpuIn && <g className="pc-drop">{CPU_ART}</g>}
      {/* Slot dual channel ditandai langsung di papan setelah salah pilih */}
      {ramOpen &&
        ramHint &&
        DIMM_OK.filter((n) => !ram.includes(n)).map((n) => (
          <rect
            key={n}
            x={DIMM_X[DIMM_NAME.indexOf(n)] - 2}
            y={32}
            width={11}
            height={152}
            rx="2"
            stroke="var(--blue-color)"
            className="pc-pulse"
          />
        ))}
      {/* Pita target ukuran biji kacang, hanya saat zoom */}
      {zoomed && pasteState !== "ok" && (
        <path
          d={`M${205 + R_MAX},94 a${R_MAX},${R_MAX} 0 1 0 0,0.01 Z M${205 + R_MIN},94 a${R_MIN},${R_MIN} 0 1 0 0,0.01 Z`}
          fillRule="evenodd"
          fill="var(--blue-color)"
          stroke="none"
          opacity="0.14"
        />
      )}
      {paste > 0 && !has("cooler") && (
        <circle
          cx={205}
          cy={94}
          r={Math.max(0.6, (paste / 100) * PASTE_R)}
          fill={zoomed ? pasteInk : "var(--muted-color)"}
          stroke="none"
          opacity="0.8"
        />
      )}
      {zoomed && pasteState !== "ok" && (
        <g stroke="var(--blue-color)" strokeWidth="0.8" opacity="0.7">
          <circle cx={205} cy={94} r={R_MIN} />
          <circle cx={205} cy={94} r={R_MAX} />
        </g>
      )}
      {ram.map((name) => (
        <g key={name} className="pc-drop">
          {RAM_ART(DIMM_X[DIMM_NAME.indexOf(name)])}
        </g>
      ))}
      {has("ssd") && <g className="pc-drop">{SSD_ART}</g>}
      {has("cooler") && <g className="pc-drop">{COOLER_ART}</g>}
      {has("fan") && <g className="pc-drop">{CASEFAN_ART}</g>}
      {has("gpu") && <g className="pc-drop">{GPU_ART}</g>}
      {has("psu") && <g className="pc-drop">{PSU_ART}</g>}
      {/* Kabel: satu garis solid, tebalnya sama untuk semua kabel */}
      {CABLES.filter((c) => cables.includes(c.id)).map((c) => (
        <g key={c.id}>
          <path d={c.d} pathLength={1} strokeWidth={CABLE_W / view.s} className="pc-cable" />
          <rect
            x={c.port.x + 1.5}
            y={c.port.y + 1.5}
            width={c.port.w - 3}
            height={c.port.h - 3}
            rx="1"
            strokeWidth="1.2"
            style={{ fill: "var(--bg-color)" }}
          />
        </g>
      ))}
    </>
  );
  // Layar POST mode teks: abu-abu VGA di atas hitam, seperti BIOS asli. Share Tech Mono
  // dipakai karena bentuknya mirip font terminal BIOS, tetapi garisnya tipis.
  const postScreen = (
    <div
      className="flex flex-1 flex-col px-6 py-5 text-[0.75rem] leading-[1.47] text-[#b4b4b4]"
      // font-synthesis dimatikan agar browser tidak membuat versi tebal tiruan.
      style={{ fontFamily: "'Share Tech Mono', monospace", fontWeight: 400, fontSynthesis: "none" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-[#e2e2e2]">B650-A ATX · UEFI BIOS v3.10</p>
          <p className="m-0 text-[#7c7c7c]">Copyright (C) 2026 · All rights reserved</p>
        </div>
        {/* Logo papan di pojok kanan atas, seperti layar POST asli */}
        <span className="shrink-0 border border-[#b4b4b4] px-1.5 py-0.5 tracking-[0.12em] text-[#e2e2e2]">
          B650
        </span>
      </div>
      <dl className="m-0 mt-4 grid grid-cols-[auto_1fr] gap-x-3">
        {POST_LINES.slice(0, Math.max(0, postShown - 1)).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-[#7c7c7c]">{k}</dt>
            <dd className="m-0 truncate">
              : {v === "mem" ? `${memCount}M${memCount === MEM_MB ? " OK" : ""}` : v}
            </dd>
          </div>
        ))}
      </dl>
      {postShown > POST_LINES.length && (
        <p className="m-0 mt-2">
          Booting from NVMe 1 TB ... <span className="pc-caret">_</span>
        </p>
      )}
      <p className="m-0 mt-auto text-[#7c7c7c]">
        Press DEL or F2 to enter UEFI Setup · F8 for Boot Menu
      </p>
    </div>
  );
  const desktop = (
    <div
      className="pc-fade relative flex flex-1 flex-col font-poppins-sans text-white"
      style={{ background: WALLPAPER }}
    >
      <div className="flex flex-1 items-center justify-center p-3">
        <div className="pc-boot w-full max-w-[19rem] overflow-hidden rounded-lg border border-white/15 bg-[#11131a]/90 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            <span className="ml-1.5 text-[0.55rem] text-white/60">build report</span>
          </div>
          <div className="flex items-center gap-4 px-4 pt-4">
            <p className="m-0 text-[3.2rem] font-semibold leading-none">{g.letter}</p>
            <div className="min-w-0">
              <p className="m-0 text-base font-semibold leading-tight">It boots!</p>
              <p className="m-0 mt-0.5 text-[0.66rem] leading-snug text-white/65">{g.line}</p>
            </div>
          </div>
          <dl className="m-0 mt-4 grid grid-cols-3 gap-2 border-t border-white/10 px-4 py-2.5 text-[0.62rem]">
            {[
              ["time", fmt(elapsed)],
              ["slips", String(mistakes)],
              ["load", `${TOTAL_W} W`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-white/55">{k}</dt>
                <dd className="m-0 mt-0.5 font-mono">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/* Taskbar: ikon aplikasi di tengah, jam di kanan */}
      <div className="flex h-7 shrink-0 items-center justify-between bg-black/55 px-3">
        <span className="w-14" />
        <span className="flex items-center gap-2">
          <span className="grid h-3 w-3 grid-cols-2 gap-px">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="rounded-[1px] bg-white/85" />
            ))}
          </span>
          {["#5aa9ff", "#ffb547", "#9b8cff", "#4ade80"].map((c) => (
            <span key={c} className="h-3 w-3 rounded-[3px]" style={{ background: c }} />
          ))}
        </span>
        <span className="w-14 whitespace-nowrap text-right font-mono text-[0.6rem] text-white/85">
          {clock}
        </span>
      </div>
    </div>
  );

  return (
    // Teks yang terseleksi bisa memicu drag bawaan browser yang membatalkan pointer
    // (pointercancel), sehingga komponen gagal dijatuhkan sampai halaman diklik.
    <div className="w-full select-none bg-background" onDragStart={(e) => e.preventDefault()}>
      {/* Lebar kolom papan dibatasi sesuai gambar PC (37.5rem) agar sisa lebarnya
          dipakai kartu "Build a PC". grid-cols-1 menjaga kolom di mobile agar tidak
          melebar mengikuti baris status */}
      <div
        className={`grid grid-cols-1 ${lit ? "gap-4" : "gap-3 sm:gap-4 md:grid-cols-[minmax(0,37.5rem)_minmax(18rem,1fr)]"}`}
      >
        {/* ── papan: casing terbuka ─────────────────────────────────────── */}
        <div className="relative flex flex-col overflow-hidden">
          {/* Lebarnya sama dengan gambar PC di bawah. Garis casing digambar mulai x=10
              dari viewBox 460, jadi padding 10/460 lebar membuat teks sejajar tepat
              dengan garis casing. Persen padding mengacu ke lebar pembungkus ini.
              Pergeseran 9.25/460 (tepi luar garis casing, stroke 1.5) membuat casing
              sejajar dengan judul halaman. Persen translate mengacu ke lebar elemen
              itu sendiri, jadi tetap pas di semua ukuran layar. Lebar 460/441.5 membuat
              tepi kanan casing ikut sejajar, sehingga jarak kiri dan kanan sama. */}
          <div className="w-[calc(100%*460/441.5)] md:max-w-150 -translate-x-[calc(100%*9.25/460)]">
            <div
              className={`flex items-baseline justify-between gap-x-4 px-[calc(100%*10/460)] font-poppins-sans text-muted ${lit ? "text-sm" : "text-xs sm:text-sm"}`}
            >
              <span className="flex min-w-0 gap-4">
                <span className="min-w-0 truncate">
                  {built ? (
                    lit ? (
                      ""
                    ) : (
                      <>
                        build complete
                        {/* Dipendekkan di mobile dan tablet agar tidak terpotong */}
                        <span className="hidden lg:inline"> · ready to power on</span>
                      </>
                    )
                  ) : (
                    (cur?.name ?? "")
                  )}
                </span>
                {!lit && (
                  <span className="shrink-0">
                    load{" "}
                    <span className="text-foreground">
                      {watts} W{has("psu") ? " / 750 W" : ""}
                    </span>
                  </span>
                )}
              </span>
              {/* Setelah menyala, waktu & slip dipindahkan ke laporan di layar monitor */}
              <span className={`flex shrink-0 gap-4 ${lit ? "hidden" : ""}`}>
                <span>
                  time <span className="text-foreground">{fmt(elapsed)}</span>
                </span>
                <span>
                  slips{" "}
                  <span className={mistakes ? "text-red" : "text-foreground"}>{mistakes}</span>
                </span>
              </span>
            </div>
            {/* Feedback terakhir tampil tepat di atas papan, hanya di desktop. Tingginya
              minimal satu baris agar gambar PC tidak bergeser saat pesan muncul */}
            <div
              className={`mt-1 min-h-[1.7em] px-[calc(100%*10/460)] font-poppins-sans text-sm leading-[1.7] ${lit ? "hidden" : "hidden lg:block"}`}
            >
              <p
                className="m-0"
                style={{ color: msg?.tone === "warn" ? "var(--red-color)" : "var(--blue-color)" }}
                aria-live="polite"
              >
                {msg ? msg.text : ""}
              </p>
            </div>
          </div>

          {/* Saat merakit, tampil gambar PC beserta panel RAM atau pasta di bawahnya.
              Setelah PC menyala, tampil adegan meja 3D. Kamera menyorot layar selama BIOS,
              lalu berkeliling ke sudut lainnya */}
          {lit ? (
            <PcDesk
              caseArt={caseArt}
              screen={phase === "post" ? postScreen : desktop}
              booting={phase === "post"}
            />
          ) : (
            <div className="relative">
              <div className="relative mt-3 w-[calc(100%*460/441.5)] md:max-w-150 -translate-x-[calc(100%*9.25/460)] overflow-hidden">
                <svg
                  ref={svgRef}
                  viewBox="0 0 460 420"
                  className="block w-full select-none"
                  fill="none"
                  stroke="var(--fg-color)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={onBoardClick}
                  style={{ cursor: ramOpen ? "pointer" : "default" }}
                  role="img"
                  aria-label={`PC case, ${pct}% built`}
                >
                  <g
                    ref={boardRef}
                    className={zoom ? "pc-zoomed" : undefined}
                    style={{
                      transform: `translate(${ox}px, 210px) scale(${view.s}) translate(${-view.cx}px, ${-view.cy}px)`,
                      transition: "transform 0.7s cubic-bezier(0.22, 0.8, 0.24, 1)",
                    }}
                  >
                    {caseArt}
                  </g>
                </svg>

                {/* Tepi area zoom memudar ke warna latar agar potongan gambar tidak terlihat kasar */}
                {explain && (
                  <div
                    className={`pc-fade pointer-events-none absolute inset-y-0 left-0 ${side ? "w-[58.7%]" : "w-full"}`}
                    style={{ boxShadow: "inset 0 0 24px 18px var(--bg-color)" }}
                  />
                )}

                {/* Layar lebar: penjelasan komponen di samping area zoom */}
                {side && explainStep && (
                  <div
                    key={explainStep.id}
                    className="pc-slide absolute inset-y-0 right-0 flex w-[41.3%] flex-col justify-center overflow-y-auto bg-background py-2 pl-6"
                  >
                    <LearnCard
                      step={explainStep}
                      cable={heldCable}
                      note={heldCable && `holding ${heldCable.name} · ${heldCable.pins}`}
                    />
                  </div>
                )}
              </div>

              {/* Pilih slot RAM: papan di-zoom ke blok DIMM, tombol slot ada di bawahnya */}
              {ramOpen && (
                <div
                  ref={panelRef}
                  className="pc-drop mx-auto mt-3 flex w-full max-w-96 flex-col items-center gap-3"
                >
                  <p
                    className="m-0 text-center font-poppins-sans text-sm text-muted"
                    aria-live="polite"
                  >
                    {ram.length
                      ? "one stick in, pick the slot for the second one"
                      : "two sticks, four slots, only one pair runs in dual channel"}
                  </p>
                  <div className="flex w-full items-center gap-2">
                    <div className="grid flex-1 grid-cols-4 gap-2">
                      {DIMM_NAME.map((name) => {
                        const filled = ram.includes(name);
                        const hinted = ramHint && DIMM_OK.includes(name) && !filled;
                        return (
                          <button
                            key={name}
                            type="button"
                            disabled={filled}
                            onClick={() => pickSlot(name)}
                            className={`cursor-pointer rounded-md border bg-transparent px-1 py-2.5 font-poppins-sans text-sm sm:text-base transition-[border-color,color] duration-300 disabled:cursor-default ${
                              filled
                                ? "border-blue text-blue"
                                : hinted
                                  ? "border-blue text-foreground"
                                  : "border-muted text-foreground hover:border-foreground"
                            } ${shake === name ? "pc-shake" : ""}`}
                            aria-label={`slot ${name}${filled ? ", has a stick" : ""}`}
                          >
                            {filled ? `${name} ✓` : name}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={closeRamPick}
                      className="cursor-pointer rounded-md border-none bg-transparent px-3 py-2.5 font-poppins-sans text-sm text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      later
                    </button>
                  </div>
                </div>
              )}

              {/* Olesan pasta: papan di-zoom ke CPU, status dan tombol tahan ada di bawahnya */}
              {zoomed && (
                <div
                  ref={panelRef}
                  className="pc-drop mx-auto mt-3 flex w-full max-w-96 flex-col items-center gap-3"
                >
                  <p
                    className="m-0 text-center font-poppins-sans text-sm"
                    style={{ color: pasteInk }}
                    aria-live="polite"
                  >
                    {pasteStatus}
                  </p>
                  <div className="grid w-full grid-cols-1 gap-2 md:flex md:items-center">
                    <button
                      type="button"
                      disabled={pasteState === "ok"}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        startPaste();
                      }}
                      onPointerUp={releasePaste}
                      onPointerCancel={releasePaste}
                      onKeyDown={(e) => {
                        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                          e.preventDefault();
                          startPaste();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === " " || e.key === "Enter") releasePaste();
                      }}
                      className={`flex-1 cursor-pointer touch-none select-none rounded-md border bg-transparent px-3 py-2.5 font-poppins-sans text-sm sm:text-base transition-[border-color,color] duration-300 ${holding ? "border-blue text-blue" : "border-muted text-foreground"}`}
                    >
                      {pasteState === "ok"
                        ? "✓ perfect"
                        : holding
                          ? "squeezing…"
                          : pasteState === "idle"
                            ? "press & hold to squeeze"
                            : "press & hold to try again"}
                    </button>
                    <button
                      type="button"
                      onClick={closePaste}
                      className="cursor-pointer rounded-md border-none bg-transparent px-3 py-2.5 font-poppins-sans text-sm text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      later
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile, tablet, dan langkah kabel: kartu penjelasan di bawah papan */}
          {!side && explainStep && (
            <div
              key={`${explainStep.id}-${focusCable?.id ?? ""}`}
              className="pc-slide mt-3 w-full md:max-w-150"
            >
              <LearnCard
                step={explainStep}
                cable={focusCable}
                note={
                  heldCable
                    ? `holding ${heldCable.name} · ${heldCable.pins}`
                    : reviewing
                      ? (reviewCable?.ok ?? explainStep.done)
                      : undefined
                }
                onClose={reviewing ? () => setReview(null) : undefined}
              />
            </div>
          )}

          {phase === "done" && (
            <div className="pc-boot mt-4 flex justify-end">
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer rounded-md border border-border bg-transparent px-4 py-2 font-poppins-sans text-base text-foreground transition-[border-color] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)] hover:border-muted"
              >
                <span className="text-red">▶ </span>build another
              </button>
            </div>
          )}
        </div>

        {/* ── kartu: lembar rakitan ─────────────────────────────────────── */}
        {!lit && (
          <aside className="flex flex-col md:border-l md:border-border md:pl-5">
            {/* Mulai tablet. Di mobile, judul halaman sudah menjadi "Build a PC" */}
            <div className="hidden md:block">
              <h2 className="m-0 font-caveat text-3xl font-bold leading-none text-foreground">
                Build a PC
              </h2>
            </div>

            <div className="flex items-baseline justify-between md:mt-4">
              <span className="font-poppins-sans text-sm text-muted">progress</span>
              <span className="font-caveat text-2xl font-bold text-foreground">{pct}%</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-border">
              <div
                className="h-full bg-blue transition-[width] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)]"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Di layar sentuh, item harus diketuk dulu sebelum bisa di-drag (lihat startPress). */}
            <p className="mt-4 mb-0 font-poppins-sans text-xs leading-[1.6] text-muted lg:hidden">
              Tap a part first, then drag it into the case.
            </p>

            <>
              <ol className="mt-2 mb-0 flex list-none flex-col gap-1 p-0 md:mt-4">
                {queue.map((s) => {
                  // Nomor tetap mengikuti urutan rakitan, bukan posisi di daftar.
                  const i = STEPS.indexOf(s);
                  const isDone = has(s.id);
                  // Setelah cable kit muncul, yang diseret adalah kabelnya. Langkah kabel
                  // dinonaktifkan agar tidak terlihat bisa diklik.
                  const isLocked = isDone || (s.id === "cables" && showKit);
                  const isReady = phase === "build" && ready(s);
                  const isFocus = phase === "build" && cur?.id === s.id;
                  const missing = (s.needs ?? []).filter((n) => !has(n)).map((n) => byId(n).name);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        disabled={isLocked}
                        onPointerDown={(e) => !isLocked && startPress("part", s.id, e)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`flex w-full [-webkit-touch-callout:none] items-center gap-2.5 rounded-[5px] border px-2 py-1.5 text-left transition-[border-color,opacity] duration-500 ${
                          picked === `part:${s.id}` ? "touch-none" : "touch-pan-y"
                        } ${
                          isLocked
                            ? "cursor-default border-transparent opacity-50"
                            : drag?.id === s.id || picked === `part:${s.id}`
                              ? "cursor-grabbing border-blue"
                              : isFocus
                                ? "cursor-grab border-muted"
                                : isReady
                                  ? "cursor-grab border-transparent hover:border-border"
                                  : "cursor-not-allowed border-transparent opacity-55"
                        } ${shake === s.id ? "pc-shake" : ""}`}
                        aria-label={`${i + 1}. ${s.name}, ${s.spec}${isDone ? ", done" : ""}`}
                      >
                        <span className={`shrink-0 ${isDone ? "text-muted" : "text-foreground"}`}>
                          <PartIcon step={s} size={22} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-poppins-sans text-[0.805rem] leading-tight text-foreground">
                            {isDone ? "✓ " : `${i + 1}. `}
                            {s.name}
                          </span>
                          <span className="block truncate font-poppins-sans text-[0.705rem] leading-tight text-muted">
                            {!isDone && missing.length
                              ? `needs ${missing.join(" + ")} first`
                              : s.spec}
                          </span>
                        </span>
                      </button>
                      {/* Cable kit tampil tepat di bawah langkah kabel. Setiap kabel digambar
                      dengan bentuk pin aslinya untuk diseret ke header yang sesuai di papan */}
                      {s.id === "cables" && showKit && (
                        <div className="pc-drop mt-2 mb-1">
                          <ul className="mt-0 mb-0 flex list-none flex-col gap-1 p-0 pl-3">
                            {cableQueue.map((c) => {
                              const isIn = cables.includes(c.id);
                              return (
                                <li key={c.id}>
                                  <button
                                    type="button"
                                    disabled={isIn}
                                    onPointerDown={(e) => !isIn && startPress("cable", c.id, e)}
                                    onContextMenu={(e) => e.preventDefault()}
                                    className={`flex w-full [-webkit-touch-callout:none] items-center gap-2.5 rounded-[5px] border bg-transparent px-2 py-1.5 text-left font-poppins-sans transition-[border-color,opacity] duration-300 ${
                                      picked === `cable:${c.id}` ? "touch-none" : "touch-pan-y"
                                    } ${
                                      isIn
                                        ? "cursor-default border-transparent opacity-50"
                                        : cableDrag?.id === c.id || picked === `cable:${c.id}`
                                          ? "cursor-grabbing border-blue"
                                          : "cursor-grab border-transparent text-foreground hover:border-border"
                                    } ${shake === `cable-${c.id}` ? "pc-shake" : ""}`}
                                    aria-label={`cable ${c.name}${isIn ? ", plugged in" : ""}`}
                                  >
                                    <span className="flex w-10 shrink-0 justify-center text-foreground">
                                      <Connector c={c} height={22} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-[0.805rem] leading-tight text-foreground">
                                        {isIn ? "✓ " : ""}
                                        {c.name}
                                      </span>
                                      <span className="block truncate text-[0.705rem] leading-tight text-muted">
                                        {c.pins}
                                      </span>
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="mt-auto grid grid-cols-1 gap-2 pt-6 md:flex">
                <button
                  type="button"
                  disabled={!built}
                  onClick={powerOn}
                  className="flex-1 cursor-pointer rounded-md border border-border bg-transparent px-3 py-2 font-poppins-sans text-sm sm:text-base text-foreground transition-[border-color,opacity] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)] hover:border-muted disabled:cursor-default disabled:opacity-40"
                >
                  <span className="text-red">▶ </span>
                  power on
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="cursor-pointer rounded-md border border-border bg-transparent px-3 py-2 font-poppins-sans text-sm sm:text-base text-muted transition-[border-color] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)] hover:border-muted"
                >
                  reset
                </button>
              </div>
            </>
          </aside>
        )}
      </div>

      {cableDrag && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 text-foreground"
          style={{ transform: `translate(${cableDrag.x - 32}px, ${cableDrag.y - 12}px)` }}
          aria-hidden="true"
        >
          <Connector c={CABLES.find((c) => c.id === cableDrag.id)!} />
        </div>
      )}

      {/* Komponen yang sedang diseret */}
      {drag && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 text-foreground"
          style={{ transform: `translate(${drag.x - 30}px, ${drag.y - 30}px)` }}
          aria-hidden="true"
        >
          <PartIcon step={STEPS.find((s) => s.id === drag.id)!} size={60} />
        </div>
      )}
    </div>
  );
}
