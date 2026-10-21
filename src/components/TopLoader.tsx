"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Garis progres tipis di tepi atas layar saat pindah halaman.
 *
 * App Router tidak punya event saat navigasi dimulai, jadi awal navigasi
 * dideteksi dari klik pada link internal dan tombol back/forward. Navigasi
 * dianggap selesai saat `pathname` berubah. Selama menunggu, progres bertambah
 * makin lambat hingga mendekati 90% agar tidak terlihat selesai lebih awal.
 */
export function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval>>(undefined);
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);
  const current = useRef(pathname);
  current.current = pathname;

  useEffect(() => {
    const start = () => {
      clearTimeout(hide.current);
      clearInterval(trickle.current);
      setVisible(true);
      setProgress(8);
      trickle.current = setInterval(() => {
        setProgress((p) => p + (90 - p) * 0.1);
      }, 200);
    };

    const onClick = (e: MouseEvent) => {
      // Klik dengan tombol modifier membuka tab baru, jadi halaman ini tidak berganti.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element).closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Navigasi hanya dianggap selesai saat pathname berubah. Link yang hanya
      // mengganti ?query atau #anchor diabaikan agar progres tidak berhenti di tengah.
      if (url.pathname === location.pathname) return;
      start();
    };

    // Back/forward yang hanya mengganti #anchor tidak mengubah pathname, jadi diabaikan.
    const onPop = () => {
      if (location.pathname !== current.current) start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      clearInterval(trickle.current);
      clearTimeout(hide.current);
    };
  }, []);

  // Halaman baru sudah tampil. Progres dipenuhkan, lalu garisnya dipudarkan.
  useEffect(() => {
    clearInterval(trickle.current);
    setProgress((p) => (p > 0 ? 100 : 0));
    hide.current = setTimeout(() => {
      setVisible(false);
      hide.current = setTimeout(() => setProgress(0), 300);
    }, 250);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-9999 h-0.5"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div
        className="h-full bg-blue"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? "none" : "width 0.2s ease-out",
          boxShadow: "0 0 8px var(--blue-color)",
        }}
      />
    </div>
  );
}
