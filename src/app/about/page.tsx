"use client";

import { useTheme } from "@/components/ThemeProvider";
import { GitFork, GitPullRequest, Monitor } from "lucide-react";
import Link from "next/link";

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

function SketchBorder({
  className = "",
  children,
  color = C.border,
  fill = "transparent",
}: {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  fill?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill={fill}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="7 3 4 2 8 3"
          strokeLinecap="round"
          rx="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="5" cy="5" r="1.5" fill={color} opacity="0.6" />
        <circle cx="calc(100% - 5px)" cy="5" r="1.5" fill={color} opacity="0.6" />
        <circle cx="5" cy="calc(100% - 5px)" r="1.5" fill={color} opacity="0.6" />
        <circle cx="calc(100% - 5px)" cy="calc(100% - 5px)" r="1.5" fill={color} opacity="0.6" />
      </svg>
      {children}
    </div>
  );
}

function TermWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md overflow-hidden ${className}`}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          backgroundColor: C.surface2,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
        </div>
        <span
          className="flex-1 text-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            color: C.muted,
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

const jsDoc = [
  "/**",
  " * @name     Evi Nur Annisa",
  " * @role     Fullstack Engineer",
  " * @location Remote-first · Onsite · Anywhere",
  " * @focus    Web development · Product thinking · Problem solving",
  " * @values   Clean code · Simplicity · Good UX",
  " * @fun      Collects ideas like browser tabs 😭",
  " */",
];

const skillGroups = [
  {
    label: "Frontend",
    color: C.teal,
    emoji: Monitor,
    items: [
      "Next.js",
      "Vue.js",
      "TypeScript",
      "JavaScript",
      "TanStack Query",
      "Tailwind CSS",
      "Styled Components",
      "MapLibre GL JS",
      "Google Maps JS API",
      "Places API",
      "GeoJSON",
      "Jest",
    ],
  },
  {
    label: "Backend",
    color: C.green,
    emoji: Monitor,
    items: [
      "Golang",
      "Express.js",
      "RESTful API",
      "JWT",
      "Auth & Authorization",
      "API Design",
      "Google OAuth 2.0",
      "Swagger",
      "Postman",
    ],
  },
  {
    label: "Database",
    color: C.orange,
    emoji: Monitor,
    items: ["PostgreSQL", "MongoDB", "Prisma ORM", "ERD", "Database Design"],
  },
  {
    label: "DevOps & Infra",
    color: C.purple,
    emoji: Monitor,
    items: ["Docker", "MinIO", "Nginx", "Jenkins", "Git", "GitHub", "GitLab"],
  },
  {
    label: "Testing",
    color: C.amber,
    emoji: Monitor,
    items: ["Jest", "Playwright", "Katalon Studio"],
  },
  {
    label: "Architecture",
    color: C.blue,
    emoji: Monitor,
    items: [
      "Microfrontend",
      "Component-Based Architecture",
      "Client-Server Architecture",
      "TRD",
      "SDLC",
    ],
  },
];

const githubStats = [
  {
    icon: GitPullRequest,
    label: "Pull Requests",
    value: "128",
  },
  {
    icon: GitFork,
    label: "Repositories",
    value: "24",
  },
  {
    icon: GitFork,
    label: "Commit",
    value: "24",
  },
  {
    icon: GitFork,
    label: "Commits",
    value: "24",
  },
];

export default function About() {
  const { theme } = useTheme();

  return (
    <div className="mt-16" style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      {/* page header */}
      <div className="px-6 pt-12 pb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: C.green,
            }}
          >
            // 01
          </span>
          <h1
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(2rem,4vw,2.8rem)",
              fontWeight: 700,
              color: C.fg,
              margin: 0,
            }}
          >
            about_me
          </h1>
          <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
        </div>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: C.muted,
          }}
        >
          <span style={{ color: C.red }}>./</span>who i am, what i do, how i got here
        </p>
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* jsdoc card */}
          <TermWindow title="about.js">
            <div className="p-5">
              {jsDoc.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    lineHeight: "1.8rem",
                    color: C.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {line}
                </div>
              ))}
              <div style={{ marginTop: "16px" }}>
                {[
                  [C.red, "const ", C.blue, "me", C.fg, " = {"],
                  [
                    C.fg,
                    "  stack:   ",
                    C.teal,
                    '"Go + Express.js + Next.js + Vue + MapLibre"',
                    C.fg,
                    ",",
                  ],
                  [C.fg, "  db:      ", C.teal, '"PostgreSQL · MongoDB · Prisma"', C.fg, ","],
                  [C.fg, "  devops:  ", C.teal, '"Docker · Jenkins · Nginx"', C.fg, ","],
                  [C.fg, "  open:    ", C.orange, "true", C.fg, ","],
                  [C.fg, "}"],
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      lineHeight: "1.8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Array.from(
                      {
                        length: row.length / 2,
                      },
                      (_, j) => (
                        <span
                          key={j}
                          style={{
                            color: row[j * 2] as string,
                          }}
                        >
                          {row[j * 2 + 1]}
                        </span>
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TermWindow>

          {/* bio + facts */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0" style={{ width: 72, height: 72 }}>
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 72 72"
                  fill="none"
                >
                  <path
                    d="M36,3 C54,2 69,15 69,36 C69,57 55,69 36,69 C17,69 3,56 3,36 C3,16 18,3 36,3 Z"
                    stroke={C.green}
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <img
                  src="/assets/images/foto.jpg"
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    filter: "grayscale(15%)",
                  }}
                />
                <span
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 animate-pulse"
                  style={{
                    backgroundColor: C.green,
                    borderColor: C.bg,
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.fg,
                  }}
                >
                  Evi Nur Annisa
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.64rem",
                    color: C.muted,
                  }}
                >
                  Fullstack Engineer
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.88rem",
                lineHeight: "1.8",
                color: C.muted,
              }}
            >
              Fullstack Engineer with 3+ years of experience in{" "}
              <span style={{ color: theme === "dark" ? C.blue : C.blue }}>web development</span>,
              with a passion for exploring new ideas and staying curious about new technologies.
              Always learning, building, and growing through every project. Experienced across
              projects in{" "}
              <span style={{ color: theme === "dark" ? C.green : C.amber }}>
                banking, geospatial, and carbon certification
              </span>
              . Strong eye for UI details, write clean code, and care about usability. Take a moment
              to explore the resume and see what fun things have been built. Thanks for stopping by!
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {githubStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <SketchBorder key={stat.label} className="p-3" color={C.border} fill={C.surface}>
                    <div className="relative z-10 p-0.5">
                      <Icon className="mb-1.5" size={16} style={{ color: C.muted }} />

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.58rem",
                          color: theme === "dark" ? C.green : C.blue,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {stat.label}
                      </div>

                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.74rem",
                          fontWeight: 500,
                          color: C.fg,
                          lineHeight: "1.3",
                          marginTop: "4px",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  </SketchBorder>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
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
                💬 See my Playground
              </Link>
            </div>
          </div>
        </div>

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
              color: theme === "dark" ? C.red : C.green,
              marginRight: "10px",
            }}
          >
            git fetch
          </span>
          skills_map
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {skillGroups.map((g) => {
              const Icon = g.emoji;
              return (
                <div
                  key={g.label}
                  className="rounded-md p-4"
                  style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${g.color}60`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {/* <span className="text-base">{g.emoji}</span> */}
                    <Icon size={16} style={{ color: C.muted }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: g.color,
                      }}
                    >
                      {g.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <span
                        key={item}
                        className="transition-all duration-200 cursor-default"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          padding: "3px 8px",
                          borderRadius: "2px",
                          backgroundColor: `${g.color}10`,
                          border: `1px solid ${g.color}30`,
                          color: C.fg,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                            `${g.color}25`;
                          (e.currentTarget as HTMLSpanElement).style.color = g.color;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                            `${g.color}10`;
                          (e.currentTarget as HTMLSpanElement).style.color = C.fg;
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
