import { SectionLabel } from "./ui";
import { SectionDiagnostics } from "./HudDiagnostics";

type Member = {
  id: string;
  name: string;
  role: string;
  clearance: string;
  /** Optional portrait URL. Rendered grayscale, restores to color on hover. */
  portrait?: string;
};

const TEAM: Member[] = [
  { id: "001", name: "AGENT // VEX", role: "PROTOCOL DIRECTOR", clearance: "05" },
  { id: "002", name: "AGENT // NOVA", role: "ARCHIVE ENGINEER", clearance: "04" },
  { id: "003", name: "AGENT // ORION", role: "CINEMATIC LEAD", clearance: "04" },
  { id: "004", name: "AGENT // HALO", role: "DESIGN OPERATIVE", clearance: "03" },
  { id: "005", name: "AGENT // ECHO", role: "SIGNAL ANALYST", clearance: "03" },
  { id: "006", name: "AGENT // CYPRESS", role: "MODULE CURATOR", clearance: "03" },
];

export function Team() {
  return (
    <section id="team" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="05" title="AUTHORIZED PERSONNEL DATABASE" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display text-4xl text-foreground sm:text-5xl">
            PERSONNEL <span className="text-[color:var(--cyan)]">FILES</span>
          </h2>
          <p className="text-mono max-w-sm text-[11px] text-[color:var(--muted-foreground)]">
            // {TEAM.length} OPERATIVES ON RECORD // PORTRAIT RECONSTRUCT ENABLED
          </p>
        </div>

        <SectionDiagnostics
          className="mt-4"
          label="PERSONNEL DB"
          records={`${TEAM.length.toString().padStart(3, "0")} FILES`}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((p) => (
            <article
              key={p.id}
              className="group relative border border-[color:var(--border)] bg-[color:var(--surface-1)]/70 transition-all duration-300 hover:border-[color:var(--cyan-dim)]"
            >
              {/* corner markers */}
              <span className="absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Header bar */}
              <div className="text-mono flex items-center justify-between border-b border-[color:var(--border)] px-3 py-2 text-[10px] text-[color:var(--muted-foreground)]">
                <span>FILE // {p.id}</span>
                <span className="flex items-center gap-1.5 text-[color:var(--cyan)]">
                  <span className="h-1 w-1 animate-blink bg-[color:var(--cyan)]" />
                  VERIFIED
                </span>
              </div>

              {/* Portrait area — large, dominant. Grayscale by default,
                  color on hover. Falls back to scan grid if no portrait. */}
              <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-[color:var(--border)] bg-gradient-to-br from-[color:var(--surface-2)] to-[color:var(--surface-0)]">
                {p.portrait ? (
                  <img
                    src={p.portrait}
                    alt={`Portrait of ${p.name}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover grayscale contrast-110 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.02]"
                  />
                ) : (
                  <PortraitPlaceholder />
                )}

                {/* Overlay grid + vignette */}
                <div className="pointer-events-none absolute inset-0 grid-bg opacity-25 mix-blend-overlay" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--surface-0)]/95 via-[color:var(--surface-0)]/15 to-transparent" />

                {/* Scanline */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--cyan)]/70 opacity-0 transition-opacity duration-300 group-hover:animate-scanline group-hover:opacity-100" />

                {/* HUD corners on image */}
                <span className="absolute top-2 left-2 h-2 w-2 border-t border-l border-[color:var(--cyan)]" />
                <span className="absolute top-2 right-2 h-2 w-2 border-t border-r border-[color:var(--cyan)]" />
                <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-[color:var(--cyan)]" />
                <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-[color:var(--cyan)]" />

                {/* image meta */}
                <div className="text-mono absolute left-3 top-3 flex items-center gap-1.5 text-[9px] text-[color:var(--muted-foreground)]">
                  SCAN //{" "}
                  <span className="text-[color:var(--muted-foreground)] transition-colors duration-500 group-hover:text-[color:var(--cyan)]">
                    <span className="group-hover:hidden">MONOCHROME</span>
                    <span className="hidden group-hover:inline">COLOR RECONSTRUCT</span>
                  </span>
                </div>
                <div className="text-mono absolute right-3 top-3 text-[9px] text-[color:var(--cyan)]">
                  ID {p.id}
                </div>

                {/* bottom name overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-display text-xl text-foreground transition-colors group-hover:text-[color:var(--cyan)]">
                    {p.name}
                  </h3>
                  <p className="text-mono mt-1 text-[10px] text-[color:var(--muted-foreground)]">
                    {p.role}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-mono flex items-center justify-between px-3 py-2 text-[9px] text-[color:var(--muted-foreground)]">
                <span>CLEARANCE {p.clearance}</span>
                <span>ARCHIVE D-001</span>
                <span className="text-[color:var(--cyan)]">ACTIVE</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortraitPlaceholder() {
  return (
    <div className="absolute inset-0">
      <div className="grid-bg absolute inset-0 opacity-40" />
      {/* abstract silhouette */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 130"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="silh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="48" r="18" fill="url(#silh)" />
        <path
          d="M14 130 C18 96 32 80 50 80 C68 80 82 96 86 130 Z"
          fill="url(#silh)"
        />
        <circle
          cx="50"
          cy="48"
          r="18"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity="0.35"
          strokeWidth="0.4"
        />
      </svg>
    </div>
  );
}
