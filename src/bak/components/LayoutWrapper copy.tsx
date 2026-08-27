"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { FloatingContacts } from "@/components/FloatingContacts";
import { SideMenu } from "@/components/SideMenu";

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

const navItems = [
  { href: "/", label: "home", exact: true },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/writing", label: "writing" },
  // { href: "/chat", label: "live_chat", accent: C.green },
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoverResume, setHoverResume] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function Cursor() {
    return (
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1.1em",
          backgroundColor: C.green,
          verticalAlign: "text-bottom",
          marginLeft: 2,
          animation: "blink 1s step-end infinite",
        }}
      />
    );
  }

  function Typing({ text, speed = 50 }: { text: string; speed?: number }) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    useEffect(() => {
      let i = 0;
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          setDone(true);
          clearInterval(iv);
        }
      }, speed);
      return () => clearInterval(iv);
    }, [text, speed]);
    return (
      <span style={{ color: C.fg }}>
        {displayed}
        {!done && <Cursor />}
      </span>
    );
  }

  const pageCommands: Record<string, string> = {
    "/": "hello_world",
    "/about": "whoami",
    "/projects": "projects",
    "/writing": "writing",
  };

  return (
    <div
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between gap-2">
          {/* logo */}
          {/* <Link
            href="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: theme === "dark" ? C.green : C.red,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            className="flex items-center gap-1"
          >
            <span>
              <span style={{ color: C.muted }}>~/</span>
              dev
            </span>
            <span style={{ color: C.muted }}>(main)</span>
            <span style={{ color: C.fg }}>$</span>
            <Typing text={pageCommands[pathname] || "whoami"} speed={90} />
          </Link> */}

          <a
            href="#"
            className="sketch relative shrink-0"
            style={{
              // @ts-expect-error -- custom property dipakai oleh .sketch
              "--frame": hoverResume ? C.orange : C.border,
              "--frame-fill": "transparent",
              padding: "8px 11px 8px",
              textDecoration: "none",
              transform: hoverResume ? "rotate(0deg)" : "rotate(-1.5deg)",
              transition: "transform 0.18s ease",
            }}
            onMouseEnter={() => setHoverResume(true)}
            onMouseLeave={() => setHoverResume(false)}
          >
            <svg className="frame" preserveAspectRatio="none" aria-hidden="true">
              <rect
                x="3"
                y="3"
                style={{ width: "calc(100% - 6px)", height: "calc(100% - 6px)" }}
                strokeWidth="1.6"
                strokeDasharray="8 3 5 2 9 4"
                strokeLinecap="round"
                rx="3"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx="6" cy="6" r="1.5" opacity="0.4" />
              <circle cy="6" r="1.5" style={{ cx: "calc(100% - 6px)" }} opacity="0.4" />
              <circle cx="6" r="1.5" style={{ cy: "calc(100% - 6px)" }} opacity="0.4" />
              <circle
                r="1.5"
                style={{ cx: "calc(100% - 6px)", cy: "calc(100% - 6px)" }}
                opacity="0.4"
              />
            </svg>
            <span
              className="inner"
              style={{
                /* .inner default flex-direction: column -> dijadikan baris */
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.66rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                color: hoverResume ? C.fg : C.muted,
                transition: "color 0.18s ease",
              }}
            >
              {/* panah unduh tarikan tangan */}
              <svg
                width="11"
                height="12"
                viewBox="0 0 11 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5.5,1 C5.3,3 5.6,5.4 5.5,7.4" />
                <path d="M2.6,5.2 C3.6,6.2 4.7,7.2 5.5,7.8 C6.2,7.1 7.2,6.1 8.4,5.1" />
                <path d="M1.4,10.6 C4,11.1 7.4,11 9.7,10.5" />
              </svg>
              resume
            </span>
          </a>

          {/* nav items & theme toggle */}
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {/* <ul className="flex items-center gap-1 list-none m-0 p-0">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        fontWeight: isActive ? 600 : 400,
                        padding: "5px 8px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        display: "block",
                        color: isActive ? C.fg : C.muted,
                        backgroundColor: isActive ? C.surface2 : "transparent",
                        border:
                          item.label === "live_chat"
                            ? `1px solid ${isActive ? C.green : C.border}`
                            : "none",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label === "live_chat" ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                          live_chat
                        </span>
                      ) : (
                        <>
                          <span
                            style={{
                              color: C.red,
                            }}
                          >
                            ./
                          </span>
                          {item.label}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul> */}

            {/* theme switch — di bawah sm ia dipindah ke dalam dropdown
                SideMenu supaya navbar tidak berdesakan di layar sempit */}
            {/* mr-20 memberi jarak ~80px dari tepi kanan — selebar tab
                SideMenu (~71px) — supaya tab yang didrag ke area navbar tidak
                menutupinya. Hanya sampai lg: dari lg ke atas navbar sudah
                terpusat di max-w-5xl sehingga tepi kanannya jauh dari tepi
                viewport tempat tab menempel, jadi tidak perlu jarak lagi. */}
            <span className="hidden sm:flex sm:mr-40 lg:mr-0">
              <ThemeSwitch />
            </span>
          </div>
        </div>
      </nav>

      {/* page content */}
      <main>{children}</main>

      {/* tab menu mepet kanan + floating contacts */}
      <SideMenu />
      <FloatingContacts />

      {/* <Footer path={pathname} /> */}
    </div>
  );
}
