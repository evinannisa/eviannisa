"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* Warna khas bagian ini. Tiap bagian di halaman about memakai satu token
   berbeda, dan hanya di prefiks, marka, serta satu detail — tidak pernah di
   teks isi — supaya warnanya terasa tanpa jadi pelangi. */
const ACCENT = "var(--teal-color)";

/* Memakai set glyph monokrom Simple Icons (public/assets/icons, CC0), bukan
   artwork Wikimedia di public/assets/stack.

   Alasannya bukan selera: logo Wikimedia multi-warna dan bentuknya bergantung
   pada kontras internal. Begitu dipaksa jadi satu warna, detail dalamnya rata —
   TypeScript jadi kotak pejal karena kotak biru dan huruf "TS" putihnya
   sama-sama jadi opaque, PostgreSQL jadi siluet gajah tanpa detail. Glyph
   Simple Icons digambar sebagai single path justru untuk diwarnai, jadi
   bentuknya tetap terbaca.

   Semua glyph viewBox 24x24, jadi tiap sel grid berukuran sama dan kolomnya
   lurus — tidak lagi ragged seperti barisan wordmark dengan lebar berbeda.
   Prisma juga ikut masuk di sini; di Wikimedia tidak ada. */
/* `tilt` dan `size` ditulis eksplisit, bukan diacak: Math.random() akan
   menghasilkan nilai berbeda di server dan di browser sehingga React melaporkan
   hydration mismatch. Angkanya dipilih agar tidak ada dua tetangga yang miring
   ke arah sama dengan besar sama, jadi barisnya terbaca ditempel tangan, bukan
   berpola. Pola `tilt` ini mengikuti FloatingContacts yang sudah memakai cara
   sama di halaman ini. */
type Mark = { slug: string; name: string; tilt: number; size: number };

const STACK: Mark[] = [
  { slug: "nextdotjs", name: "Next.js", tilt: -7, size: 1.72 },
  { slug: "vuedotjs", name: "Vue.js", tilt: 5, size: 1.58 },
  { slug: "typescript", name: "TypeScript", tilt: -3, size: 1.66 },
  { slug: "tailwindcss", name: "Tailwind CSS", tilt: 8, size: 1.75 },
  { slug: "go", name: "Go", tilt: -5, size: 1.6 },
  { slug: "express", name: "Express.js", tilt: 3, size: 1.7 },
  { slug: "postgresql", name: "PostgreSQL", tilt: -8, size: 1.63 },
  { slug: "mongodb", name: "MongoDB", tilt: 4, size: 1.74 },
  { slug: "prisma", name: "Prisma", tilt: -2, size: 1.57 },
  { slug: "docker", name: "Docker", tilt: 6, size: 1.68 },
  { slug: "nginx", name: "Nginx", tilt: -6, size: 1.61 },
  { slug: "git", name: "Git", tilt: 2, size: 1.71 },
];

export function StackStrip() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const items = self.selector!(".stack-logo");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(items, { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({ paused: true }).to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.045,
      });

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            tl.play();
            io.disconnect();
          }
        },
        { threshold: 0 },
      );
      if (rootRef.current) io.observe(rootRef.current);

      return () => io.disconnect();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="mb-4">
        {/* Disamakan dengan dua pola label yang sudah ada di halaman ini:
            judul kartu `hello_world.js` (JetBrains Mono 0.66rem muted) dan
            baris `./who i am...` yang prefiksnya berwarna --red-color. Caveat
            dilepas dari sini supaya blok ini terbaca satu keluarga dengan
            kartu di atasnya, bukan sebagai bagian terpisah.

            Perintahnya menunjuk sub-direktori, bukan `~/stack` polos: yang
            tampil di bawah bukan seluruh stack melainkan yang paling sering
            dipakai, dan `ls` pada satu folder memang mengeluarkan sebagian isi
            saja — jadi labelnya jujur terhadap yang ditampilkan. Perintah git
            (`git log`/`git fetch`) tidak dipakai karena keduanya melaporkan
            commit dan remote, bukan daftar isi. */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            /* lebih besar dari label chrome kartu (0.66rem): ini judul bagian,
               bukan metadata berkas, jadi boleh selangkah lebih tegas */
            fontSize: "0.8rem",
            color: "var(--muted-color)",
            lineHeight: 1,
          }}
        >
          <span style={{ color: ACCENT }}>$ </span>ls ~/stack/most-used
        </span>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-4"
        style={{ ["--accent" as string]: ACCENT }}
      >
        {STACK.map((m) => (
          /* kemiringan dipegang pembungkus, warna dan mask dipegang anaknya:
             kalau digabung, tween `y` milik GSAP menimpa rotate-nya */
          <span
            key={m.slug}
            className="stack-mark"
            style={{ ["--tilt" as string]: `${m.tilt}deg` }}
          >
            <span
              className="stack-logo"
              role="img"
              aria-label={m.name}
              title={m.name}
              style={{
                ["--ico" as string]: `url(/assets/icons/${m.slug}.svg)`,
                ["--size" as string]: `${m.size}rem`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
