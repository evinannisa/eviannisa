"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hourglass, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export interface TimeCapsulePopupProps {
  open: boolean;
  onClose: () => void;
}

type Opened = { id: number; name: string; message: string; openAt: string; createdAt: string };
type Summary = { sealed: number; nextOpen: string | null; opened: Opened[] };

// Batas ini harus sama dengan MAX_YEARS dan MAX_MESSAGE di src/app/api/capsules/route.ts.
const MAX_YEARS = 10;
const MAX_MESSAGE = 500;
const QUICK = [
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 },
  { label: "3 years", months: 36 },
];
// Jumlah maksimal amplop yang digambar di brankas. Sisanya ditampilkan sebagai +N.
const VAULT_MAX = 14;
const LINE = "1.75rem";

// Nilai input tanggal ("YYYY-MM-DD") dihitung dari tanggal lokal pengunjung
const toInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addMonths = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return toInput(d);
};
const daysUntil = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000);
};
// Tanggal buka disimpan sebagai tengah malam UTC, jadi ditampilkan dalam UTC agar
// tidak mundur sehari di zona waktu negatif.
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
const fmtSpan = (days: number) => {
  // Memakai 365.25 agar tahun kabisat tetap dihitung bulat, misalnya 366 hari = 1 year.
  const years = Math.round((days / 365.25) * 10) / 10;
  return years >= 1
    ? `${years} year${years === 1 ? "" : "s"}`
    : days >= 60
      ? `${Math.round(days / 30)} months`
      : `${days} day${days === 1 ? "" : "s"}`;
};

function Envelope({ size = 22, seal = "var(--amber-color)" }: { size?: number; seal?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 36 26"
      fill="none"
      stroke="var(--muted-color)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5,3.2 C12,2.6 24,2.8 33.4,3.4 C33.8,10 33.6,17 33.2,23 C23,23.6 13,23.4 2.8,22.8 C2.2,16 2.2,9.6 2.5,3.2 Z" />
      <path d="M2.8,3.6 C8,8.4 13,12.4 18,15.6 C23,12.4 28.2,8.4 33.2,3.6" />
      <circle cx="18" cy="15.4" r="3.4" fill={seal} stroke="none" />
    </svg>
  );
}

/**
 * Pengunjung menulis surat untuk masa depan. Suratnya tersegel sampai tanggal
 * buka yang dipilih, lalu tampil di daftar "opened" untuk semua pengunjung.
 */
export function TimeCapsulePopup({ open, onClose }: TimeCapsulePopupProps) {
  const { theme } = useTheme();
  const [everOpened, setEverOpened] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [openAt, setOpenAt] = useState(() => addMonths(12));
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sealedUntil, setSealedUntil] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const max = new Date();
    max.setFullYear(max.getFullYear() + MAX_YEARS);
    return { minDate: toInput(min), maxDate: toInput(max) };
  }, []);
  const days = openAt ? daysUntil(openAt) : 0;
  const dateOk = !!openAt && openAt >= minDate && openAt <= maxDate;

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/capsules");
      if (!res.ok) throw new Error();
      setSummary(await res.json());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setEverOpened(true);
    load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !dateOk || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, openAt, website }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSealedUntil(json.data?.openAt ?? null);
      setMessage("");
      load();
    } catch (err) {
      setSendError(err instanceof Error && err.message ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (!everOpened) return null;

  return (
    <div
      id="capsule-popup"
      role="dialog"
      aria-label="time capsule"
      inert={!open}
      className="fixed z-60 top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:left-auto sm:bottom-16 sm:right-22 sm:w-[min(390px,calc(100vw-3rem))] sm:translate-x-0 sm:translate-y-0 md:right-[8.3rem]"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div
        className="flex max-h-[min(600px,calc(100dvh-92px))] flex-col overflow-hidden rounded-[10px] border-2 border-muted bg-surface"
        style={{
          boxShadow: "5px 5px 0 var(--border-color)",
          transformOrigin: "bottom right",
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1) rotate(0deg)"
            : "translateY(10px) scale(0.94) rotate(1.5deg)",
          visibility: open ? "visible" : "hidden",
          transition: open
            ? "opacity 0.18s ease-out, transform 0.26s cubic-bezier(0.34, 1.4, 0.5, 1), visibility 0s"
            : "opacity 0.14s ease-in, transform 0.16s ease-in, visibility 0s linear 0.16s",
        }}
      >
        {/* ── kepala ─────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-4 pt-3.5 pb-2">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-full bg-amber text-background">
            <Hourglass size={17} strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="m-0 font-caveat text-[1.7rem] leading-none font-bold text-foreground">
              time capsule
            </p>
            <p className="m-0 mt-0.5 font-poppins-sans text-[0.7rem] text-muted">
              a letter to the future, sealed until the day you pick
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close time capsule"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 text-muted hover:text-foreground"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 font-poppins-sans text-xs text-muted">
          {sealedUntil ? (
            /* ── setelah disegel ─────────────────────────────────────── */
            <div className="capsule-pop flex flex-col items-center py-5 text-center">
              <div className="-rotate-3">
                <Envelope size={120} />
              </div>
              <p className="m-0 mt-3 font-caveat text-[1.9rem] leading-none font-bold text-foreground">
                sealed!
              </p>
              <p className="mt-2 mb-4 max-w-64 leading-[1.7]">
                Locked away until <span className="text-amber">{fmtDate(sealedUntil)}</span>. Come
                back then and it'll be waiting for you.
              </p>
              <button
                type="button"
                onClick={() => setSealedUntil(null)}
                className="cursor-pointer border-none bg-transparent p-0 font-caveat text-lg text-foreground underline decoration-amber decoration-2 underline-offset-4"
              >
                write another letter
              </button>
            </div>
          ) : (
            /* ── kertas surat ────────────────────────────────────────── */
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div
                className="rotate-[-0.6deg] rounded-md border border-border px-3.5 pt-2.5 pb-2"
                style={{ backgroundColor: "var(--bg-color)" }}
              >
                <p className="m-0 font-caveat text-xl text-foreground" style={{ lineHeight: LINE }}>
                  Dear future,
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={MAX_MESSAGE}
                  rows={5}
                  required
                  placeholder="what do you hope has changed by then?"
                  aria-label="your letter"
                  className="block w-full resize-none border-none bg-transparent p-0 font-caveat text-lg text-foreground outline-none placeholder:text-muted/60"
                  style={{
                    lineHeight: LINE,
                    // Garis buku tulis ikut ter-scroll bersama teks.
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${LINE} - 1px), color-mix(in srgb, var(--border-color) 80%, transparent) calc(${LINE} - 1px), color-mix(in srgb, var(--border-color) 80%, transparent) ${LINE})`,
                    backgroundAttachment: "local",
                  }}
                />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.62rem] text-muted/70">
                    {message.length}/{MAX_MESSAGE}
                  </span>
                  <label className="flex items-baseline gap-1 font-caveat text-lg text-foreground">
                    —
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={40}
                      placeholder="your name"
                      aria-label="your name (optional)"
                      className="w-28 border-0 border-b border-border bg-transparent p-0 font-caveat text-lg text-foreground outline-none placeholder:text-muted/60 focus:border-muted"
                    />
                  </label>
                </div>
              </div>

              {/* Field honeypot untuk bot, tidak terlihat oleh pengunjung */}
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {/* ── tanggal buka ──────────────────────────────────────── */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-caveat text-lg text-foreground">open on</span>
                  <input
                    type="date"
                    value={openAt}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setOpenAt(e.target.value)}
                    aria-label="opening date"
                    className="cursor-pointer border-0 border-b-2 border-amber bg-transparent px-0.5 py-0 font-poppins-sans text-xs text-foreground outline-none"
                    style={{ colorScheme: theme }}
                  />
                  {openAt && (
                    <span className={dateOk ? "text-amber" : "text-red"}>
                      {dateOk ? `in ${fmtSpan(days)}` : `pick tomorrow up to ${MAX_YEARS} years`}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK.map((q) => {
                    const value = addMonths(q.months);
                    const on = openAt === value;
                    return (
                      <button
                        key={q.months}
                        type="button"
                        onClick={() => setOpenAt(value)}
                        aria-pressed={on}
                        className={`cursor-pointer rounded-full border px-2.5 py-0.5 font-poppins-sans text-[0.68rem] transition-colors ${
                          on
                            ? "border-amber bg-amber text-background"
                            : "border-border bg-transparent text-muted hover:border-muted hover:text-foreground"
                        }`}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── segel lilin ───────────────────────────────────────── */}
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-[0.66rem] leading-normal">
                  Once it opens, anyone visiting can read it.
                </span>
                <button
                  type="submit"
                  disabled={!message.trim() || !dateOk || sending}
                  className="group flex shrink-0 cursor-pointer items-center gap-2 border-none bg-transparent p-0 disabled:cursor-default disabled:opacity-40"
                >
                  <span className="font-caveat text-xl text-foreground">
                    {sending ? "sealing..." : "seal it"}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red text-background shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] transition-transform duration-300 group-enabled:group-hover:rotate-12 group-enabled:group-hover:scale-110">
                    <Hourglass size={16} strokeWidth={2.4} />
                  </span>
                </button>
              </div>
              {sendError && <p className="m-0 text-red">{sendError}</p>}
            </form>
          )}

          {/* ── brankas & surat yang sudah terbuka ─────────────────────── */}
          <div className="mt-4 border-t border-border pt-3">
            {loadError ? (
              <p className="m-0">Couldn't reach the vault right now.</p>
            ) : !summary ? (
              <p className="m-0">opening the vault...</p>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-caveat text-lg text-foreground">
                    {summary.sealed} letter{summary.sealed === 1 ? "" : "s"} waiting
                  </span>
                  {summary.nextOpen && <span>next opens {fmtDate(summary.nextOpen)}</span>}
                </div>
                {summary.sealed > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {Array.from({ length: Math.min(summary.sealed, VAULT_MAX) }, (_, i) => (
                      <span key={i} style={{ transform: `rotate(${((i * 37) % 13) - 6}deg)` }}>
                        <Envelope />
                      </span>
                    ))}
                    {summary.sealed > VAULT_MAX && <span>+{summary.sealed - VAULT_MAX}</span>}
                  </div>
                )}

                {summary.opened.length > 0 && (
                  <>
                    <p className="m-0 mt-4 font-caveat text-lg text-foreground">already opened</p>
                    <ul className="m-0 mt-1.5 flex list-none flex-col gap-2.5 p-0">
                      {summary.opened.map((c, i) => (
                        <li
                          key={c.id}
                          className="rounded-md border border-border px-3 py-2"
                          style={{
                            backgroundColor: "var(--bg-color)",
                            transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`,
                          }}
                        >
                          <p className="m-0 font-caveat text-lg leading-[1.45] whitespace-pre-wrap text-foreground">
                            {c.message}
                          </p>
                          <p className="m-0 mt-1 text-[0.64rem]">
                            — {c.name} · written {fmtDate(c.createdAt)} · opened {fmtDate(c.openAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
