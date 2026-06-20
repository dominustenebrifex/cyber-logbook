import { SectionLabel } from "./ui";

const PARTNERS = [
  "NODE/01",
  "CIPHER",
  "ATLAS",
  "VANTA",
  "ECHO LAB",
  "ORBIT",
  "PRISM",
  "HELIX",
  "AXIOM",
  "MIRAGE",
];

export function Partners() {
  return (
    <section id="partners" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="04" title="PARTNERSHIP DATABASE" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display text-4xl text-foreground sm:text-5xl">
            ALLIED <span className="text-[color:var(--cyan)]">NODES</span>
          </h2>
          <p className="text-mono max-w-sm text-[11px] text-[color:var(--muted-foreground)]">
            // NETWORK CONNECTIONS INDEXED // COLOR PROFILES PENDING ACTIVATION
          </p>
        </div>

        <div className="relative mt-14">
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--cyan)" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          <div className="relative grid grid-cols-2 gap-px bg-[color:var(--border)] sm:grid-cols-3 md:grid-cols-5">
            {PARTNERS.map((p, i) => (
              <div
                key={p}
                className="group relative flex aspect-[4/3] items-center justify-center bg-[color:var(--surface-1)]/80 transition-all duration-300 hover:bg-[color:var(--surface-2)]"
              >
                <span className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[color:var(--cyan-dim)]" />
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border border-[color:var(--muted-foreground)]/40 transition-all duration-300 group-hover:border-[color:var(--cyan)] group-hover:shadow-[0_0_16px_var(--cyan)]">
                    <div className="h-full w-full bg-[color:var(--muted-foreground)]/10 transition-colors group-hover:bg-[color:var(--cyan)]/15" />
                  </div>
                  <span className="text-mono text-[10px] text-[color:var(--muted-foreground)] transition-colors group-hover:text-[color:var(--cyan)]">
                    {p}
                  </span>
                </div>
                <span className="text-mono absolute left-2 top-2 text-[9px] text-[color:var(--muted-foreground)]/60">
                  N-{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
