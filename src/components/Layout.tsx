import { Outlet, NavLink, useLocation } from "react-router";
import { useState, useEffect } from "react";

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
  { to: "/", label: "home", exact: true },
  { to: "/about", label: "about" },
  { to: "/projects", label: "projects" },
  { to: "/writing", label: "writing" },
  { to: "/chat", label: "live_chat", accent: "var(--green-color)" },
];

export function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-2">
          {/* logo */}
          <NavLink
            to="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: C.green,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: C.muted }}>~/</span>dev
            <span style={{ color: C.amber }}>_</span>portfolio
          </NavLink>

          {/* nav items & theme toggle */}
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    style={({ isActive }) => ({
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      fontWeight: isActive ? 600 : 400,
                      padding: "5px 8px",
                      mdPadding: "6px 12px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      display: "block",
                      color: isActive ? (item.accent ?? C.fg) : C.muted,
                      backgroundColor: isActive
                        ? item.accent
                          ? `${item.accent}15`
                          : C.surface2
                        : "transparent",
                      border:
                        item.label === "live_chat"
                          ? `1px solid ${isActive ? C.green : C.border}`
                          : "none",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    })}
                  >
                    {/* {item.label === 'live_chat'
                      ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />chat</span>
                      : <span>{item.label}</span>
                    } */}
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
                  </NavLink>
                </li>
              ))}
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
              {theme === "light" ? "✏️ Light" : "💻 Dark"}
            </button>
          </div>
        </div>
      </nav>

      {/* page content */}
      <main style={{ paddingTop: "60px" }}>
        <Outlet />
      </main>
    </div>
  );
}
