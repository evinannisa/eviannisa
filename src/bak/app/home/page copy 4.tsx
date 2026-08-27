"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { CodeTyping } from "@/components/CodeTyping";

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

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="mt-10 sm:mt-4">
      <section
        className="min-h-screen flex items-center relative overflow-hidden px-6 py-18 md:px-10 md:py-24 lg:px-20 lg:py-16 notebook"
        style={{ backgroundColor: C.bg }}
      >
        {/* margin line */}
        <div
          className="absolute top-7.5 bottom-0 left-4 sm:top-13.5 md:left-8 lg:left-16 xl:left-18 w-px"
          style={{ backgroundColor: "rgba(224, 92, 74, 0.28)", pointerEvents: "none" }}
        />

        {/* floating doodles */}
        {/* <svg
          className="hero-doodle float hidden md:block"
          style={{ top: "4rem", right: "3rem" }}
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M28,4 L30,22 L48,18 L33,29 L43,46 L28,35 L13,46 L23,29 L8,18 L26,22 Z"
            stroke="#e8a838"
            strokeWidth="1.5"
            fill="rgba(232,168,56,0.12)"
            strokeLinejoin="round"
          />
          <path
            d="M49,6 L50,12 L56,10 L51,14 L54,20 L49,15 L44,20 L47,14 L42,10 L48,12 Z"
            stroke="#e05c4a"
            strokeWidth="1.2"
            fill="rgba(224,92,74,0.12)"
            strokeLinejoin="round"
          />
          <path
            d="M6,38 L7,44 L13,42 L9,46 L12,52 L7,47 L2,52 L5,46 L0,42 L6,44 Z"
            stroke="#4a8fa8"
            strokeWidth="1.2"
            fill="rgba(74,143,168,0.12)"
            strokeLinejoin="round"
          />
        </svg> */}
        <svg
          className="hero-doodle wiggle hidden"
          style={{ bottom: "6rem", right: "7rem", opacity: 0.4 }}
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M45,8 C65,6 84,22 84,45 C84,68 67,83 45,83 C23,83 6,67 6,45 C6,24 22,9 45,8 Z"
            stroke="#e05c4a"
            strokeWidth="2"
            strokeDasharray="6 3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {/* <svg
          className="hero-doodle hidden xl:block"
          style={{ top: "33.333%", right: "1.5rem", opacity: 0.3 }}
          width="100"
          height="14"
          viewBox="0 0 100 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2,7 Q12,2 22,7 Q32,12 42,7 Q32,2 42,7 Q52,12 62,7 Q52,2 62,7 Q72,12 82,7 Q72,2 82,7 Q92,12 102,7 Q92,2 102,7 Q112,12 122,7"
            stroke="#4a8fa8"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg> */}
        <svg
          className="hero-doodle hidden xl:block"
          style={{ bottom: "18rem", left: "6.5rem", opacity: 0.3 }}
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M28,4 L30,22 L48,18 L33,29 L43,46 L28,35 L13,46 L23,29 L8,18 L26,22 Z"
            stroke="#e8a838"
            strokeWidth="1.5"
            fill="rgba(232,168,56,0.12)"
            strokeLinejoin="round"
          />
          <path
            d="M49,6 L50,12 L56,10 L51,14 L54,20 L49,15 L44,20 L47,14 L42,10 L48,12 Z"
            stroke="#e05c4a"
            strokeWidth="1.2"
            fill="rgba(224,92,74,0.12)"
            strokeLinejoin="round"
          />
          <path
            d="M6,38 L7,44 L13,42 L9,46 L12,52 L7,47 L2,52 L5,46 L0,42 L6,44 Z"
            stroke="#4a8fa8"
            strokeWidth="1.2"
            fill="rgba(74,143,168,0.12)"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          style={{ opacity: 0.3 }}
          className="hero-doodle mb-35 bottom-0 right-160"
          width="80"
          height="14"
          viewBox="0 0 80 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2,7 Q12,2 22,7 Q32,12 42,7 Q32,2 42,7 Q52,12 62,7 Q52,2 62,7 Q72,12 82,7 Q72,2 82,7 Q92,12 102,7"
            stroke={theme === "dark" ? C.green : C.amber}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="scroll-hint">
          <span className="hidden">scroll</span>
          <i></i>
        </div>

        <div className="max-w-5xl mx-auto w-full grid-cols-1 grid md:grid-cols-2 xl:grid-cols-[1fr_auto] items-center relative z-10">
          {/* ── left ── */}
          <div className="mb-14 lg:mb-0">
            {/* headline */}
            <h1
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "clamp(2rem,6vw,4rem)",
                color: C.fg,
                lineHeight: 1.05,
              }}
              className="mb-4 font-bold"
            >
              I'm{" "}
              <span className="pen">
                Evi
                <svg viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M0,6 Q25,1 50,6 Q75,11 100,6 Q125,1 150,6 Q175,11 200,6"
                    stroke={theme === "dark" ? "#3FB950" : "#e8a838"}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.88rem",
                lineHeight: "1.8",
                color: C.muted,
              }}
              className="mb-7 lg:max-w-150"
            >
              I build things, learn new stuff, and turn little ideas into something real. I’m always
              curious, trying something new, and seeing how it goes.
              <br />
              This is a little space where I keep the things I’ve been working on.
            </p>

            {/* status */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5"
              style={{
                border: `1px solid ${C.green}/40`,
                borderRadius: "4px",
                backgroundColor: "rgba(63,185,80,0.06)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                color: C.green,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              status: open_to_work = true
            </div>

            {/* CTA */}
            {/* <div className="flex-wrap gap-3 mb-8 flex">
              <Link
                href="/projects"
                className="transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "9px 20px",
                  backgroundColor: theme === "dark" ? C.green : C.fg,
                  color: theme === "dark" ? "#0d1117" : "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                $ View Resume
              </Link>
              <Link
                href="/chat"
                className="transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "9px 20px",
                  backgroundColor: "transparent",
                  color: C.fg,
                  borderRadius: "4px",
                  textDecoration: "none",
                  border: `2px dashed ${C.border}`,
                }}
              >
                💬 Ask About Me
              </Link>
            </div> */}

            {/* socials */}
            <div className="flex gap-2 flex-wrap items-center">
              <svg
                className="hidden sm:block"
                style={{ opacity: 0.4 }}
                width="48"
                height="38"
                viewBox="0 0 48 38"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4,19 Q19,5 36,17"
                  stroke={C.fg}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M31,11 L36,17 L29,19"
                  stroke={C.fg}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              {["Behance", "GitHub", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.66rem",
                    padding: "3px 9px",
                    border: `1px solid ${C.border}`,
                    borderRadius: "3px",
                    color: C.muted,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    height: "fit-content",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.green;
                    e.currentTarget.style.borderColor = C.green;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.muted;
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  ↗ {s}
                </a>
              ))}
            </div>
          </div>

          {/* ── right: editor yang mengetik sendiri ── */}
          <div className="flex justify-center lg:justify-end w-11/12">
            <CodeTyping />
          </div>
        </div>
      </section>
    </div>
  );
}
