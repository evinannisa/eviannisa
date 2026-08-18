"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Footer } from "@/components/Footer";

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
  // { href: "/", label: "home", exact: true },
  { href: "/about", label: "about_me" },
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
  { href: "/writing", label: "notes" },
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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
    "/": "portfolio",
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
          <Link
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
          </Link>

          {/* nav items & theme toggle */}
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
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
                              color: theme === "dark" ? C.red : C.red,
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
            </ul>

            {/* theme toggle button */}
            <button
              onClick={toggleTheme}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "4px",
                color: C.fg,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              title="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="size-4" style={{ color: C.muted }} />
              ) : (
                <Sun className="size-4" style={{ color: C.muted }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* page content */}
      <main>{children}</main>

      <Footer path={pathname} />
    </div>
  );
}
