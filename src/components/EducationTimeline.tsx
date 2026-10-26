"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

const ACCENT = "var(--muted-color)";

// Doodle buku dipakai di dua ukuran: besar di layar lebar, kecil di samping judul.
const bookPaths = (
  <>
    <path
      className="edu-draw"
      d="M7,21 C23,15 41,13 58,18 C58,41 58,63 58,82 C41,77 23,79 8,84 C6,62 8,41 7,21"
    />
    <path
      className="edu-draw"
      d="M58,18 C75,13 93,15 109,21 C108,41 109,62 107,84 C93,79 75,77 58,82"
    />
    <path className="edu-draw" strokeWidth="1.4" d="M15,33 C27,29 41,28 50,31" />
    <path className="edu-draw" strokeWidth="1.4" d="M15,45 C27,41 41,40 50,43" />
    <path className="edu-draw" strokeWidth="1.4" d="M15,57 C27,53 38,52 46,55" />
    <path className="edu-draw" strokeWidth="1.4" d="M66,31 C78,28 92,29 101,33" />
    <path className="edu-draw" strokeWidth="1.4" d="M66,43 C78,40 89,41 98,45" />
  </>
);

export function EducationTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const draws = self.selector!(".edu-draw") as SVGPathElement[];

      draws.forEach((d) => {
        const len = d.getTotalLength();
        gsap.set(d, { strokeDasharray: len, strokeDashoffset: len });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(draws, { strokeDashoffset: 0 });
        return;
      }

      const tl = gsap
        .timeline({ paused: true })
        .to(draws, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut", stagger: 0.05 })
        .add(() => {
          gsap.to(self.selector!(".edu-doodle"), {
            y: -5,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: { each: 0.34, from: "random" },
          });
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
    <div ref={rootRef} className="relative lg:max-w-160">
      <div className="flex gap-2.5 items-center mb-2">
        <div className="font-mono text-[0.845rem] text-muted opacity-[0.65]">// 01</div>
        <div className="font-caveat text-xl sm:text-2xl font-bold text-foreground tracking-[0.080em]">
          Education
        </div>
        <svg
          className="edu-doodle edu-book doodle-sm lg:hidden pointer-events-none"
          width={34}
          viewBox="0 0 120 92"
          fill="none"
          stroke="var(--muted-color)"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {bookPaths}
        </svg>
      </div>

      <p className="mb-4 sm:mb-6 lg:max-w-160 text-sm sm:text-base text-muted font-poppins-sans leading-[1.8] tracking-[0.012em]">
        This is where it all started. It began with random campus assignments, then somehow turned
        into an internship where coding stopped being &ldquo;just homework&rdquo; and started
        feeling like I was actually building something.
      </p>

      <svg
        className="edu-doodle edu-book hidden lg:block absolute pointer-events-none"
        style={{ right: "-10.5rem", top: "5.5rem", width: 132 }}
        viewBox="0 0 120 92"
        fill="none"
        stroke="var(--muted-color)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        aria-hidden="true"
      >
        {bookPaths}
      </svg>

      <svg
        className="edu-doodle hidden lg:block absolute pointer-events-none"
        style={{ right: "-13rem", top: "3.1rem", width: 26 }}
        viewBox="0 0 40 40"
        fill="none"
        stroke="var(--muted-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
        aria-hidden="true"
      >
        <path
          className="edu-draw"
          d="M20,5 L23.7,14.9 L34.3,15.4 L26,21.9 L28.8,32.1 L20,26.3 L11.2,32.1 L14,21.9 L5.7,15.4 L16.3,14.9 Z"
        />
      </svg>

      <svg
        className="edu-doodle hidden lg:block absolute pointer-events-none"
        style={{
          right: "-13.5rem",
          top: "15.5rem",
          width: 30,
        }}
        viewBox="0 0 19 10"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        aria-hidden="true"
      >
        <path
          className="edu-draw"
          d="M6.20,1.70 C4.66,2.34 2.98,3.66 2.00,5.00 C2.87,6.32 4.39,7.68 5.80,8.40"
        />
        <path className="edu-draw" d="M11.60,1.20 C10.74,3.64 9.18,6.68 7.70,8.80" />
        <path
          className="edu-draw"
          d="M13.20,1.90 C14.71,2.51 16.35,3.79 17.30,5.10 C16.42,6.37 14.90,7.65 13.50,8.30"
        />
      </svg>

      <div className="tl-list pl-4 sm:pl-[1.85rem]">
        <div className="tl-row">
          <svg
            className="tl-dot"
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="5.5" cy="5.5" r="3.6" fill="var(--red-color)" />
          </svg>

          <div className="flex flex-col gap-1 ml-4">
            <div className="font-mono text-sm sm:text-base text-foreground">
              Informatics Engineering
            </div>
            <div className="font-mono text-[12px] sm:text-sm text-muted">
              Amikom Yogyakarta Univesity | GPA 3,82 | 2019 - 2022
            </div>
            <div className="mt-1.5 text-sm sm:text-base text-muted flex flex-col gap-2.5 font-poppins-sans leading-[1.7]">
              <span>
                I also joined a few events and organizations through HIMADITI and BEM. Before
                getting into internships, I got to be a teaching assistant, helping students learn
                web development during practical sessions. My first internship was part of my degree
                program, where I learned what working was really like. Later, I joined the MSIB
                program through Kampus Merdeka, where I got to collaborate with different teams and
                meet people from different parts of Indonesia.
              </span>
              <Link href="/experience" className="self-start">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-sm sm:text-base text-muted font-poppins-sans hover:text-foreground">
                    See more experiences
                  </span>
                  <svg width="14" height="9" viewBox="0 0 17 9" fill="none" aria-hidden="true">
                    <path
                      d="M1,4.6 C5,4.1 10,4.9 15.4,4.4"
                      stroke="var(--muted-color)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.2,1.6 C13.4,2.8 14.6,3.9 15.8,4.5 C14.6,5.3 13.5,6.4 12.4,7.6"
                      stroke="var(--muted-color)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
