"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROUND_MS = 30_000;
const BEST_KEY = "bug-catcher-best";
const BUG_SIZE = 34;
const MAX_BUGS = 7;

type Phase = "idle" | "playing" | "over";
type Kind = "spider" | "fast";

type Bug = {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  angle: number; // Radian, 0 = menghadap ke kanan.
  speed: number; // px per detik.
  turnIn: number; // ms sampai serangga berganti arah.
  wiggle: number; // Fase gerakan kaki.
};

type Mark = { id: number; x: number; y: number; points: number };

const POINTS: Record<Kind, number> = { spider: 1, fast: 3 };

// Laba-laba digambar menghadap ke atas (kepala di nilai y kecil), lalu dirotasi dari loop.
// Delapan kakinya, empat di tiap sisi, ditekuk di bagian "lutut" agar siluetnya
// terlihat seperti laba-laba, bukan kutu.
function BugDoodle({ kind, size = BUG_SIZE }: { kind: Kind; size?: number }) {
  const ink = kind === "fast" ? "var(--blue-color)" : "var(--fg-color)";
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="bc-legs">
        {/* Kiri */}
        <path d="M17.4,15.6 L11.6,10.4 L8.2,3.8" />
        <path d="M16.8,18.2 L9.4,15.6 L3.6,11.6" />
        <path d="M16.8,21 L9.2,22.6 L3.8,27.4" />
        <path d="M17.6,23.4 L12,28.2 L9,35.4" />
        {/* Kanan */}
        <path d="M22.6,15.6 L28.4,10.4 L31.8,3.8" />
        <path d="M23.2,18.2 L30.6,15.6 L36.4,11.6" />
        <path d="M23.2,21 L30.8,22.6 L36.2,27.4" />
        <path d="M22.4,23.4 L28,28.2 L31,35.4" />
      </g>
      {/* Perut (abdomen) */}
      <path d="M20,20.6 C23.8,20.4 25.6,23.6 25.4,27.2 C25.2,31.2 22.8,33.8 20,33.8 C17,33.9 14.6,31.2 14.6,27.2 C14.5,23.4 16.4,20.8 20,20.6 Z" />
      {kind === "fast" ? (
        <path d="M20,23.4 C18.4,25 18.4,26.6 20,27.6 C21.6,28.6 21.6,30.2 20,31.4" />
      ) : (
        <path d="M18.4,25.4 C19.4,25.8 20.6,25.8 21.6,25.4" />
      )}
      {/* Kepala-dada */}
      <path d="M20,13.2 C22.6,13.1 23.6,15.2 23.5,17.2 C23.4,19.4 22,20.8 20,20.8 C17.9,20.8 16.5,19.4 16.5,17.2 C16.4,15.2 17.6,13.2 20,13.2 Z" />
      {/* Taring kecil */}
      <path d="M18.8,13.4 C18.4,12.4 18.6,11.6 19.2,11.2" />
      <path d="M21.2,13.4 C21.6,12.4 21.4,11.6 20.8,11.2" />
    </svg>
  );
}

function Splat() {
  return (
    <svg
      viewBox="0 0 40 40"
      width={BUG_SIZE}
      height={BUG_SIZE}
      fill="none"
      stroke="var(--muted-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20,13 C24,12.4 27.6,15.6 27,20.2 C26.6,24.6 23.4,27.6 19.4,27.2 C15.2,26.8 12.6,23.4 13,19.4 C13.4,15.6 16.2,13.4 20,13 Z" />
      <path d="M20,9.6 L20,5.4" />
      <path d="M28.4,13 L31.6,10" />
      <path d="M30.4,21.4 L35,22" />
      <path d="M26.6,29.6 L29.4,33.4" />
      <path d="M17.6,30.6 L16,35" />
      <path d="M10.6,25.6 L6.4,27.6" />
      <path d="M10.2,16.8 L6,15" />
    </svg>
  );
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function BugCatcher() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bugIds, setBugIds] = useState<{ id: number; kind: Kind }[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [best, setBest] = useState(0);

  const arenaRef = useRef<HTMLDivElement>(null);
  const bugsRef = useRef<Map<number, Bug>>(new Map());
  const nodesRef = useRef<Map<number, HTMLButtonElement>>(new Map());
  const nextId = useRef(1);
  const scoreRef = useRef(0);

  useEffect(() => setBest(readBest()), []);

  const spawn = useCallback((elapsed: number) => {
    const arena = arenaRef.current;
    if (!arena) return;
    const w = arena.clientWidth;
    const h = arena.clientHeight;
    // Serangga bergerak makin cepat seiring berjalannya ronde.
    const pace = 1 + (elapsed / ROUND_MS) * 0.9;
    const kind: Kind = Math.random() < 0.18 ? "fast" : "spider";
    const bug: Bug = {
      id: nextId.current++,
      kind,
      x: Math.random() * (w - BUG_SIZE),
      y: Math.random() * (h - BUG_SIZE),
      angle: Math.random() * Math.PI * 2,
      speed: (kind === "fast" ? 150 : 80) * pace * (0.8 + Math.random() * 0.4),
      turnIn: 400 + Math.random() * 900,
      wiggle: Math.random() * 10,
    };
    bugsRef.current.set(bug.id, bug);
    setBugIds((ids) => [...ids, { id: bug.id, kind }]);
  }, []);

  const start = () => {
    bugsRef.current.clear();
    scoreRef.current = 0;
    setBugIds([]);
    setMarks([]);
    setScore(0);
    setCaught(0);
    setTimeLeft(ROUND_MS);
    setPhase("playing");
  };

  // Loop utama. Posisi serangga ditulis langsung ke DOM agar React tidak render ulang
  // 60 kali per detik. State hanya diubah saat spawn atau saat waktu berubah.
  useEffect(() => {
    if (phase !== "playing") return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    let spawnIn = 0;
    let shownSec = -1;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const elapsed = now - t0;
      const left = Math.max(0, ROUND_MS - elapsed);

      const sec = Math.ceil(left / 1000);
      if (sec !== shownSec) {
        shownSec = sec;
        setTimeLeft(left);
      }

      if (left <= 0) {
        setPhase("over");
        const final = scoreRef.current;
        setBest((b) => {
          if (final <= b) return b;
          try {
            localStorage.setItem(BEST_KEY, String(final));
          } catch {}
          return final;
        });
        return;
      }

      spawnIn -= dt;
      if (spawnIn <= 0 && bugsRef.current.size < MAX_BUGS) {
        spawn(elapsed);
        spawnIn = Math.max(380, 1100 - elapsed / 40);
      }

      const arena = arenaRef.current;
      const w = arena?.clientWidth ?? 0;
      const h = arena?.clientHeight ?? 0;

      bugsRef.current.forEach((b) => {
        b.turnIn -= dt;
        if (b.turnIn <= 0) {
          b.angle += (Math.random() - 0.5) * 2.2;
          b.turnIn = 400 + Math.random() * 900;
        }
        const step = (b.speed * dt) / 1000;
        b.x += Math.cos(b.angle) * step;
        b.y += Math.sin(b.angle) * step;

        // Memantul saat menyentuh dinding arena.
        if (b.x < 0 || b.x > w - BUG_SIZE) {
          b.x = Math.min(Math.max(b.x, 0), w - BUG_SIZE);
          b.angle = Math.PI - b.angle;
        }
        if (b.y < 0 || b.y > h - BUG_SIZE) {
          b.y = Math.min(Math.max(b.y, 0), h - BUG_SIZE);
          b.angle = -b.angle;
        }
        b.wiggle += dt * 0.025;

        const node = nodesRef.current.get(b.id);
        if (node) {
          // Ditambah 90deg karena gambarnya menghadap ke atas.
          node.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.angle + Math.PI / 2}rad)`;
          if (!still) {
            node.style.setProperty("--leg", `${Math.sin(b.wiggle) * 9}deg`);
          }
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, spawn]);

  const catchBug = (id: number) => {
    const b = bugsRef.current.get(id);
    if (!b || phase !== "playing") return;
    bugsRef.current.delete(id);
    nodesRef.current.delete(id);
    setBugIds((ids) => ids.filter((x) => x.id !== id));

    const points = POINTS[b.kind];
    scoreRef.current += points;
    setScore(scoreRef.current);
    setCaught((c) => c + 1);

    const mark = { id, x: b.x, y: b.y, points };
    setMarks((m) => [...m, mark]);
    window.setTimeout(() => setMarks((m) => m.filter((x) => x.id !== id)), 900);
  };

  const secs = Math.ceil(timeLeft / 1000);
  const urgent = phase === "playing" && secs <= 5;
  const isBest = phase === "over" && score > 0 && score >= best;

  const stats: [label: string, value: React.ReactNode][] = [
    ["score", score],
    [
      "time",
      <span key="t" className={urgent ? "text-red" : undefined}>
        {String(secs).padStart(2, "0")}s
      </span>,
    ],
    ["caught", caught],
    ["best", best],
  ];

  return (
    // Papan permainan berbingkai tebal dengan bayangan offset ala kartu retro.
    // Arena di kiri, kartu keterangan setinggi papan di kanan.
    <div
      className="w-full rounded-[10px] border-2 border-muted bg-background p-3 sm:p-4"
      style={{ boxShadow: "5px 5px 0 var(--border-color)" }}
    >
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div
          ref={arenaRef}
          className="bc-arena relative h-[58vh] min-h-80 max-h-140 w-full select-none overflow-hidden rounded-[6px] border border-dashed border-border"
          style={{ cursor: phase === "playing" ? "crosshair" : "default" }}
        >
          {bugIds.map(({ id, kind }) => (
            <button
              key={id}
              type="button"
              ref={(el) => {
                if (el) nodesRef.current.set(id, el);
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                catchBug(id);
              }}
              aria-label={kind === "fast" ? "catch blue spider, 3 points" : "catch spider, 1 point"}
              className="absolute left-0 top-0 cursor-crosshair border-none bg-transparent p-0"
              style={{ width: BUG_SIZE, height: BUG_SIZE }}
            >
              <BugDoodle kind={kind} />
            </button>
          ))}

          {marks.map((m) => (
            <span
              key={m.id}
              className="bc-mark pointer-events-none absolute left-0 top-0"
              style={{ transform: `translate(${m.x}px, ${m.y}px)` }}
              aria-hidden="true"
            >
              <Splat />
              <span
                className="bc-plus absolute -top-3 left-1/2 font-caveat text-xl font-bold"
                style={{ color: m.points > 1 ? "var(--blue-color)" : "var(--fg-color)" }}
              >
                +{m.points}
              </span>
            </span>
          ))}

          {phase !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="m-0 font-caveat text-3xl sm:text-4xl font-bold text-foreground">
                {phase === "idle" ? "Ready?" : "Time\u2019s up!"}
              </p>
              <p className="m-0 font-mono text-xs text-muted">
                {phase === "idle" ? (
                  <>
                    press start to release the spiders
                  </>
                ) : (
                  <>
                    {caught} squashed · <span className="text-foreground">{score}</span> points
                    {isBest && <span className="text-blue"> · new best!</span>}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Kartu keterangan, setinggi arena di layar lebar */}
        <aside className="flex flex-col rounded-[6px] border border-border p-4 sm:p-5">
          <h2 className="m-0 font-caveat text-3xl font-bold leading-none text-foreground">
            Catch the Bugs!
          </h2>
          <p className="mt-3 mb-0 font-poppins-sans text-xs sm:text-sm leading-[1.8] text-muted">
            Spiders keep crawling out of the code. Squash as many as you can in {ROUND_MS / 1000}{" "}
            seconds before they take over.
          </p>

          <ul className="mt-4 mb-0 flex list-none flex-col gap-2 p-0 font-mono text-xs text-muted">
            <li className="flex items-center gap-2.5">
              <span className="shrink-0 [&_svg]:block">
                <BugDoodle kind="spider" size={22} />
              </span>
              spider <span className="flex-1 border-b border-dashed border-border" /> +1
            </li>
            <li className="flex items-center gap-2.5">
              <span className="shrink-0 [&_svg]:block">
                <BugDoodle kind="fast" size={22} />
              </span>
              <span className="text-blue">fast spider</span>
              <span className="flex-1 border-b border-dashed border-border" /> +3
            </li>
          </ul>

          <div className="my-4 border-t border-dashed border-border" />

          <dl className="m-0 flex flex-col gap-2 font-mono text-xs sm:text-sm">
            {stats.map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="text-muted">
                  {label}
                </dt>
                <span className="flex-1 translate-y-[-0.2rem] border-b border-dashed border-border" />
                <dd className="m-0 text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={start}
            disabled={phase === "playing"}
            className="mt-6 cursor-pointer rounded-md border border-border bg-transparent px-4 py-2 font-mono text-sm text-foreground transition-[border-color,opacity] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)] hover:border-muted disabled:cursor-default disabled:opacity-40 lg:mt-auto"
          >
            <span className="text-red">▶ </span>
            {phase === "idle" ? "start" : phase === "playing" ? "catching…" : "play again"}
          </button>
        </aside>
      </div>
    </div>
  );
}
