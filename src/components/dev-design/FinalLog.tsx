import { CornerFrame, SectionLabel } from "./ui";

const REPORT = [
  { k: "ARCHIVE STATUS", v: "STABLE", tone: "cyan" as const },
  { k: "PROTOCOL", v: "ACTIVE", tone: "cyan" as const },
  { k: "ANOMALY STATUS", v: "UNCONTAINABLE", tone: "purple" as const },
];

const CHANNELS = [
  {
    id: "001",
    name: "INSTAGRAM",
    handle: "@devdesign.core",
    href: "https://www.instagram.com/devdesign.core?igsh=MTAwMmh3bmV6emxhZQ==",
  },
  {
    id: "002",
    name: "LINKEDIN",
    handle: "Devdesign Club",
    href: "https://www.linkedin.com/in/devdesign-club-863438417?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: "003",
    name: "YOUTUBE",
    handle: "@devdesignB2B",
    href: "https://youtube.com/@devdesignb2b?si=8mkacks4Y8oOLb94",
  },
  {
    id: "004",
    name: "EMAIL",
    handle: "devdesign.core@gmail.com",
    href: "mailto:devdesign.core@gmail.com?subject=DEV%20Design%20Inquiry&body=Hello%20DEV%20Design%2C",
  },
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
                <div
                  key={r.k}
                  className={`report-status-card report-status-card--${
                    r.tone === "purple" ? "cyan" : "purple"
                  } bg-[color:var(--surface-1)] p-5`}
                >
                  <p className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
                    {r.k}
                  </p>
                  <p
                    className={`report-status-card__value text-display mt-2 text-2xl ${
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
