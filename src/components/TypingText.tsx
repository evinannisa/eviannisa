"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* Detik per karakter. Jauh lebih lambat dari typing paragraf: "about_me" cuma
   8 karakter, dan pada 0.022s/karakter judulnya selesai dalam 0.18 detik —
   terlalu singkat untuk terbaca sebagai sedang diketik. 0.095 memberi sekitar
   0.76 detik, sepanjang satu ketukan judul. */
const CHAR = 0.095;

export function TypingText({
  text,
  keepCaret = true,
  delay = 0.25,
}: {
  text: string;
  /* Default true: kursor ditinggal berkedip di ujung judul seperti prompt
     terminal. Set false kalau caret harus hilang setelah selesai. */
  keepCaret?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* dipatok dari teks utuh sebelum dikosongkan, supaya baris judul tidak
         mengempis lalu melompat balik saat karakter pertama masuk */
      el.style.minHeight = `${el.offsetHeight}px`;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const chars = Array.from(text);
      el.textContent = "";

      const state = { n: 0 };
      const tl = gsap.timeline({ paused: true, delay }).to(state, {
        n: chars.length,
        duration: chars.length * CHAR,
        ease: "none",
        onStart: () => el.classList.add("typing-caret"),
        onUpdate: () => {
          el.textContent = chars.slice(0, Math.round(state.n)).join("");
        },
        onComplete: () => {
          el.textContent = text;
          if (!keepCaret) el.classList.remove("typing-caret");
        },
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
      io.observe(el);

      return () => io.disconnect();
    }, ref);

    return () => ctx.revert();
  }, [text, keepCaret, delay]);

  return (
    <span ref={ref} className="inline-block">
      {text}
    </span>
  );
}
