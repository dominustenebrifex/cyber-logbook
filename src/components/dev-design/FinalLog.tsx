import { CornerFrame, SectionLabel } from "./ui";

const REPORT = [
  { k: "ARCHIVE STATUS", v: "STABLE", tone: "cyan" as const },
  { k: "PROTOCOL", v: "ACTIVE", tone: "cyan" as const },
  { k: "ANOMALY STATUS", v: "UNCONTAINABLE", tone: "purple" as const },
];

const CHANNELS = [
  { id: "001", name: "INSTAGRAM", handle: "@devdesign", href: "https://instagram.com" },
  { id: "002", name: "LINKEDIN", handle: "/dev-design", href: "https://linkedin.com" },
  { id: "003", name: "YOUTUBE", handle: "/devdesign", href: "https://youtube.com" },
  { id: "004", name: "EMAIL", handle: "signal@devdesign.archive", href: "mailto:signal@devdesign.archive" },
];

export function FinalLog() {
  return (
    <section id="log" className="relative scroll-mt-24 pt-24 pb-12 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="07" title="FINAL SYSTEM REPORT" />

        <CornerFrame className="mt-8 bg-[color:var(--surface-1)]/60">
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="relative p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-px bg-[color:var(--border)] sm:grid-cols-3">
              {REPORT.map((r) => (
                <div key={r.k} className="bg-[color:var(--surface-1)] p-5">
                  <p className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
                    {r.k}
                  </p>
                  <p
                    className={`text-display mt-2 text-2xl ${
                      r.tone === "purple"
                        ? "text-[color:var(--purple)]"
                        : "text-[color:var(--cyan)]"
                    }`}
                  >
                    {r.v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-[color:var(--border)] pt-8 text-center">
              <p className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
                FINAL CONCLUSION //
              </p>
              <p className="text-display mt-4 text-3xl leading-tight text-foreground sm:text-5xl">
                CREATIVITY <br className="sm:hidden" />
                <span className="text-[color:var(--cyan)]">CANNOT BE CONTAINED.</span>
              </p>
            </div>
          </div>
        </CornerFrame>

        {/* Channels */}
        <div className="mt-12">
          <p className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
            EXTERNAL COMMUNICATION CHANNELS //
          </p>
          <div className="mt-4 grid grid-cols-1 gap-px bg-[color:var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((c) => (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[color:var(--surface-1)]/80 p-5 transition-colors hover:bg-[color:var(--surface-2)]"
              >
                <span className="absolute inset-0 border border-transparent transition-colors group-hover:border-[color:var(--cyan-dim)]" />
                <div className="text-mono flex items-center justify-between text-[10px] text-[color:var(--muted-foreground)]">
                  <span>CHANNEL {c.id}</span>
                  <span className="text-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100">
                    OPEN →
                  </span>
                </div>
                <p className="text-display mt-3 text-xl text-foreground transition-colors group-hover:text-[color:var(--cyan)]">
                  {c.name}
                </p>
                <p className="text-mono mt-1 text-[10px] text-[color:var(--muted-foreground)]">
                  {c.handle}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Footer line */}
        <footer className="text-mono mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] pt-6 text-[10px] text-[color:var(--muted-foreground)]">
          <span>D-001 // DEV DESIGN ARCHIVE // {new Date().getFullYear()}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-blink bg-[color:var(--cyan)]" />
            END OF TRANSMISSION
          </span>
        </footer>
      </div>
    </section>
  );
}
