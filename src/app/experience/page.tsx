"use client";

import { SkillList } from "@/components/SkillList";
import { RING } from "@/components/AboutDoodles";
import { Monitor } from "lucide-react";
import React from "react";
import { timeline } from "@/data/experience";

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

function groupByPlace(rows: typeof timeline) {
  const out: { place: string; roles: typeof timeline }[] = [];
  for (const r of rows) {
    const last = out[out.length - 1];
    if (last && last.place === r.place) last.roles.push(r);
    else out.push({ place: r.place, roles: [r] });
  }
  return out;
}

function placeSpan(roles: typeof timeline) {
  const first = roles[roles.length - 1].year.split(" - ")[0];
  const last = roles[0].year.split(" - ")[1] ?? roles[0].year;
  return `${first} - ${last}`;
}

const PLACE_LOGO: Record<string, string> = {
  "TAN Digital": "/assets/images/logo-tan.webp",
  "Infosys Solusi Terpadu": "/assets/images/ist-logo.png",
  "Media Kreasi Abadi": "/assets/images/logo-mka.png",
  "Geeschool Cendekia Mandiri": "/assets/images/logo-geschool.webp",
  "Forum Asisten — Amikom Yogyakarta University": "/assets/images/forum_asisten_logo.jpeg",
};

const PLACE_LOCATION: Record<string, string> = {
  "TAN Digital": "Tangerang Selatan, Indonesia",
  "Infosys Solusi Terpadu": "Yogyakarta, Indonesia",
  "Media Kreasi Abadi": "Balikpapan, Indonesia",
  "Geeschool Cendekia Mandiri": "Yogyakarta, Indonesia",
  "Forum Asisten — Amikom Yogyakarta University": "Yogyakarta, Indonesia",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

const BADGE = 34;
const RAIL_X = BADGE / 2; // Garis timeline sejajar dengan tengah logo perusahaan.
const ROLE_PAD = 29; // Isi jabatan sejajar dengan nama perusahaan di header.

const DOT = 11; // Ukuran penanda di timeline.
const DOT_TOP = 4; // Jarak atas penanda agar sejajar dengan tengah baris jabatan.
const DOT_MID = DOT_TOP + DOT / 2; // Titik tengah penanda, tempat garis timeline dimulai.
const ROLE_GAP = 24; // Jarak antarjabatan, setara `mb-6`.

const skillGroups = [
  {
    label: "Web Development",
    color: C.teal,
    emoji: Monitor,
    items: [
      "Next.js",
      "Vue.js",
      "React.js",
      "Astro.js",
      "TypeScript",
      "Microfrontend",
      "TanStack Start",
      "TanStack Query",
      "Tailwind CSS",
      "Styled Components",
      "Vanilla CSS",
      "MapLibre GL JS",
      "Google Maps API",
      "Places API",
      "GeoJSON",
    ],
  },
  {
    label: "Backend & Database",
    color: C.green,
    emoji: Monitor,
    items: [
      "Golang",
      "Express.js",
      "Python",
      "Prisma ORM",
      "Drizzle",
      "RESTful API",
      "Google OAuth 2.0",
      "PostgreSQL",
      "MongoDB",
    ],
  },
  {
    label: "DevOps & Tools",
    color: C.purple,
    emoji: Monitor,
    items: ["Docker", "MinIO", "Nginx", "Jenkins", "Git", "GitHub", "GitLab", "Swagger", "Postman"],
  },
  {
    label: "Testing",
    color: C.amber,
    emoji: Monitor,
    items: ["Jest", "Playwright", "Katalon Studio"],
  },
];

export default function Experience() {
  const groups = groupByPlace(timeline);

  return (
    <div className="relative mt-8" style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-12 max-w-5xl mx-auto">
        <div>
          <h1 className="font-caveat text-[clamp(2rem,4vw,2.8rem)] font-bold text-foreground m-0">
            Work & Stacks
          </h1>
          {/* <p className="font-mono text-[0.7rem] text-muted">
            <span className="text-red">./</span>things i've built · click to expand
          </p> */}
        </div>
        <div className="flex gap-2.5 items-center mb-2 mt-8">
          <div className="font-caveat text-xl sm:text-2xl font-bold text-foreground tracking-[0.080em]">
            Where I&apos;ve Worked
          </div>
        </div>

        <p className="mb-4 sm:mb-6 lg:max-w-160 text-sm sm:text-base text-muted leading-[1.8] font-poppins-sans tracking-[0.012em]">
          The roles I&apos;ve held, the teams I worked alongside, and the products I helped bring to
          production.
        </p>

        {groups.map((g, gi) => (
          <section key={g.place} className="mb-11 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="shrink-0 flex items-center justify-center overflow-hidden rounded-[9px] border border-border bg-surface"
                style={{
                  width: BADGE,
                  height: BADGE,
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
                    className="font-mono font-semibold tracking-[0.04em] text-muted"
                    style={{
                      fontSize: initials(g.place).length > 2 ? "0.62rem" : "0.72rem",
                    }}
                  >
                    {initials(g.place)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-1">
                  <h2 className="m-0 font-poppins-sans text-base text-foreground">{g.place}</h2>
                  {PLACE_LOCATION[g.place] && (
                    <div className="font-mono text-sm text-muted leading-[1.4]">
                      {PLACE_LOCATION[g.place]}
                    </div>
                  )}
                </div>
                <div className="ml-auto self-start text-sm font-poppins-sans text-foreground">
                  {placeSpan(g.roles)}
                </div>
              </div>
            </div>

            <div className="relative" style={{ marginLeft: RAIL_X, paddingLeft: ROLE_PAD }}>
              <span
                aria-hidden="true"
                className="absolute bg-border"
                style={{
                  left: -1,
                  top: DOT_MID,
                  bottom: 0,
                  width: 1,
                }}
              />
              {g.roles.map((t, i) => {
                const top = gi === 0 && i === 0;

                return (
                  <div
                    key={t.year}
                    className="relative"
                    style={{ marginBottom: i < g.roles.length - 1 ? ROLE_GAP : 0 }}
                  >
                    <svg
                      className="absolute overflow-visible"
                      style={{
                        left: -(1 + ROLE_PAD + DOT / 2),
                        top: DOT_TOP,
                        width: DOT,
                        height: DOT,
                      }}
                      viewBox="0 0 11 11"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d={RING}
                        stroke={top ? C.green : C.muted}
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill={top ? C.green : C.muted}
                      />
                    </svg>

                    <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                      <span className="text-base text-foreground font-mono leading-tight opacity-90">
                        {t.title}
                      </span>
                      {g.roles.length > 1 && (
                        <span className="shrink-0 font-mono text-sm text-muted opacity-80">
                          {t.year}
                        </span>
                      )}
                    </div>

                    <p className="m-0 font-poppins-sans text-base leading-[1.75] tracking-[0.012em] text-muted max-w-155">
                      {t.desc}
                    </p>

                    {t.skills.length > 0 && (
                      <ul className="flex flex-wrap gap-2 m-0 mt-4 p-0 list-none max-w-155">
                        {t.skills.map((s) => (
                          <li
                            key={s}
                            className="py-1.5 px-3 font-mono text-[0.805rem] leading-none text-muted rounded-md border border-border bg-transparent"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="mt-14 sm:mt-20">
          <SkillList groups={skillGroups} title="What I Build With" />
        </div>
      </div>
    </div>
  );
}
