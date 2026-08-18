"use client";

import { useTheme } from "@/components/ThemeProvider";
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

export default function Experience() {
  const { theme } = useTheme();

  const timeline = [
    {
      year: "March 2026 - Current",
      title: "Software Engineer",
      place: "TAN Digital",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
    },
    {
      year: "Dec 2024 - Feb 2026",
      title: "Frontend Engineer",
      place: "TAN Digital",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
    },
    {
      year: "Feb 2023 - Nov 2024",
      title: "Frontend Developer",
      place: "Infosys Solusi Terpadu",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
    },
    {
      year: "Oct 2022 - Jan 2023",
      title: "React Js Developer",
      place: "Infosys Solusi Terpadu",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Built real-time fleet tracking with MapLibre + Vue.js. Led microfrontend architecture migration across 3 teams.",
    },
    {
      year: "Feb 2022 - Jul 2022",
      title: "Frontend Developer",
      place: "Media Kreasi Abadi",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Delivered Next.js + Golang SaaS with Google OAuth 2.0, Prisma ORM, Docker, Nginx. Full Playwright E2E coverage.",
    },
    {
      year: "Sep 2021 - Jan 2022",
      title: "Frontend Developer",
      place: "Geeschool Cendekia Mandiri",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Developed Vue.js & Next.js apps. Integrated Google Maps JS API and Places API for logistics clients.",
    },
    {
      year: "Feb 2021 - Jul 2021",
      title: "Web Programming Practicum Assistant",
      place: "Forum Asisten",
      color: theme === "dark" ? C.green : C.blue,
      desc: "Started with React, fell in love with maps. Built first GeoJSON visualizer and REST API in Express.js.",
    },
  ];

  return (
    <div>
      <div className="mb-12">
        <h2
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: C.fg,
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: theme === "dark" ? C.amber : C.red,
              marginRight: "10px",
            }}
          >
            git log
          </span>
          experience
        </h2>
        <div className="relative pl-6" style={{ borderLeft: `1px dashed ${C.border}` }}>
          {timeline.map((t, i) => (
            <div key={i} className="relative mb-8 pl-6">
              {/* dot */}
              <div
                className="absolute -left-3 top-1.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  backgroundColor: t.color,
                  borderColor: C.bg,
                  boxShadow: `0 0 8px ${t.color}60`,
                }}
              />
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: t.color,
                  }}
                >
                  {t.year}
                </span>
                <span
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: C.fg,
                  }}
                >
                  {t.title}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: C.muted,
                  }}
                >
                  @ {t.place}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.83rem",
                  lineHeight: "1.7",
                  color: C.muted,
                  maxWidth: "560px",
                }}
              >
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
