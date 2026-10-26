"use client";

import { useTheme } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { FloatingContacts, whatsappHref } from "@/components/FloatingContacts";
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

const RESUME_MESSAGE = "Halo! Saya lihat portfolio kamu dan ingin minta resume kamu, boleh?";

const navItems = [
  { href: "/", label: "home", exact: true },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/writing", label: "writing" },
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoverResume, setHoverResume] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Navbar beranda transparan, kecuali di layar sempit setelah di-scroll agar tidak menimpa konten.
  const clearNav = isHome && !(mobile && scrolled);
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <div
      className="bg-background min-h-screen"
      style={{
        transition: "background-color 0.2s ease",
      }}
    >
      <nav
        /* Transisi hanya untuk properti yang berubah saat scroll, yaitu background
           dan garis bawah. `transition-all` ikut menganimasikan backdrop-filter dan
           properti layout, sehingga navbar terasa tertinggal dari halaman. */
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
          !clearNav && scrolled ? "border-border" : "border-transparent"
        }`}
        style={{
          backgroundColor: clearNav
            ? "transparent"
            : scrolled
              ? "var(--nav-bg-scrolled)"
              : "var(--nav-bg)",
          backdropFilter: clearNav ? "none" : "blur(10px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-3 flex items-center justify-between gap-2">
          {/* Resume tidak dibagikan langsung, pengunjung diarahkan ke WhatsApp untuk memintanya */}
          <a
            href={whatsappHref(RESUME_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="sketch relative shrink-0 py-1.5 px-2 sm:py-2 sm:px-2.75 no-underline"
            style={{
              // @ts-expect-error -- custom property dipakai oleh .sketch
              "--frame": hoverResume ? C.orange : C.border,
              "--frame-fill": "transparent",
              transform: hoverResume ? "rotate(0deg)" : "rotate(-1.5deg)",
              borderRadius: 5,
              boxShadow: hoverResume
                ? theme === "dark"
                  ? "0 5px 12px -5px rgba(0, 0, 0, 0.55)"
                  : "0 5px 12px -5px rgba(122, 106, 85, 0.45)"
                : theme === "dark"
                  ? "0 2px 6px -3px rgba(0, 0, 0, 0.4)"
                  : "0 2px 6px -3px rgba(122, 106, 85, 0.3)",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
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
              className="inner text-xs sm:text-sm font-mono flex-row! items-center font-medium whitespace-nowrap gap-1 sm:gap-1.25"
              style={{
                color: hoverResume ? C.fg : C.muted,
                transition: "color 0.18s ease",
              }}
            >
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

          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            <span className="hidden sm:flex sm:mr-40 lg:mr-38 xl:mr-0">
              <ThemeSwitch />
            </span>
          </div>
        </div>
      </nav>

      {/* Isi halaman */}
      <main>{children}</main>

      <SideMenu />
      <FloatingContacts />

      {/* <Footer path={pathname} /> */}
    </div>
  );
}
