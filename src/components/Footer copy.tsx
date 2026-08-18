import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

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

// ─── terminal window chrome ───────────────────────────────────────────────────
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
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
    >
      {/* title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ backgroundColor: C.surface2, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
        </div>
        <span
          className="flex-1 text-center"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: C.muted }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── hand-drawn doodle floaters ───────────────────────────────────────────────
function DoodleStars({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path
        d="M26,3 L28,20 L44,16 L31,27 L40,43 L26,33 L12,43 L21,27 L8,16 L24,20 Z"
        stroke={C.green}
        strokeWidth="1.2"
        fill="rgba(63,185,80,0.08)"
        strokeLinejoin="round"
      />
      <path
        d="M46,5 L47,11 L53,9 L48,13 L51,19 L46,14 L41,19 L44,13 L39,9 L45,11 Z"
        stroke={C.amber}
        strokeWidth="1"
        fill="rgba(210,153,34,0.1)"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const subjects = ["Job Opportunity", "Freelance Project", "Open Source", "Other"];
  const { theme, setTheme } = useTheme();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 13px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    color: C.fg,
    backgroundColor: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.2s",
  };
  //   rgba(196, 180, 154, 0.15) #1A1E21
  return (
    <footer
      style={{
        borderTop: `1px dashed ${theme === "dark" ? "rgba(196, 180, 154, 0.15)" : C.border}`,
        backgroundColor: theme === "dark" ? C.surface : "#F5ECE1",
      }}
    >
      <section id="contact" className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            {/* <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "clamp(2rem,4vw,2.8rem)",
                fontWeight: 700,
                color: C.fg,
              }}
            >
              get_in_touch
            </span> */}
            <div
              className="flex items-center gap-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: C.green }}>➜</span>
              <span style={{ color: C.blue }}>~/get_in_touch</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-14">
            {/* left */}
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  color: C.muted,
                  marginBottom: "1rem",
                }}
              >
                Open to full-time roles and freelance opportunities. Looking for someone to join
                your team or help bring a project to life? Let’s talk.
              </p>

              <TermWindow title="contact.sh" className="mb-6">
                <div
                  className="p-4"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    lineHeight: "1.8rem",
                  }}
                >
                  {[
                    { prompt: "$", key: "email", value: "hellolilstarry@gmail.com", color: C.blue },
                    {
                      prompt: "$",
                      key: "location",
                      value: "Remote · Onsite · Anywhere",
                      color: C.green,
                    },
                    {
                      prompt: "$",
                      key: "response",
                      value: "09:00–17:00 WIB daily",
                      color: C.amber,
                    },
                    { prompt: "$", key: "status", value: "open_to_work=true", color: C.teal },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center gap-2">
                      <span style={{ color: C.green }}>{row.prompt}</span>
                      <span style={{ color: C.muted }}>echo</span>
                      <span style={{ color: C.red }}>${row.key}</span>
                      <span style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </TermWindow>

              {/* <DoodleStars className="opacity-40" /> */}
            </div>

            {/* right — form */}
            {sent ? (
              <TermWindow title="sent.sh">
                <div className="flex flex-col items-center justify-center p-14 text-center">
                  <div className="text-5xl mb-4">🚀</div>
                  <div
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: "1.8rem",
                      fontWeight: 700,
                      color: C.green,
                      marginBottom: "6px",
                    }}
                  >
                    Message sent!
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      color: C.muted,
                    }}
                  >
                    exit code: 0 — will reply soon
                  </div>
                </div>
              </TermWindow>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.green)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.green)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                {/* subject chips */}
                <div className="flex flex-wrap justify-between gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, subject: s })}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        padding: "4px 10px",
                        border: `1px solid ${form.subject === s ? C.green : C.border}`,
                        borderRadius: "3px",
                        cursor: "pointer",
                        backgroundColor: form.subject === s ? "rgba(63,185,80,0.12)" : C.bg,
                        color: form.subject === s ? C.green : C.muted,
                        transition: "all 0.2s",
                      }}
                    >
                      {form.subject === s ? "▶ " : ""}
                      {s}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={5}
                  placeholder="Describe your project or role..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "none", height: "6.3rem" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.green)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                />

                <button
                  type="submit"
                  className="transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    padding: "11px 22px",
                    backgroundColor: C.green,
                    color: "#0d1117",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  $ git push --message "hire me" ↵
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </footer>
  );
}
