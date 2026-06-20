import { useMemo } from "react";
import { SectionLabel } from "./ui";
import { SectionDiagnostics } from "./HudDiagnostics";

type Partner = {
  id: string;
  code: string;
  tier: "ALPHA" | "BETA" | "GAMMA";
  region: string;
};

const PARTNERS: Partner[] = [
  { id: "N-01", code: "NODE/01", tier: "ALPHA", region: "EU-WEST" },
  { id: "N-02", code: "CIPHER", tier: "ALPHA", region: "NA-EAST" },
  { id: "N-03", code: "ATLAS", tier: "BETA", region: "EU-NORTH" },
  { id: "N-04", code: "VANTA", tier: "BETA", region: "AS-PAC" },
  { id: "N-05", code: "ECHO LAB", tier: "GAMMA", region: "NA-WEST" },
  { id: "N-06", code: "ORBIT", tier: "ALPHA", region: "EU-CENTRAL" },
  { id: "N-07", code: "PRISM", tier: "BETA", region: "SA-EAST" },
  { id: "N-08", code: "HELIX", tier: "GAMMA", region: "AF-NORTH" },
  { id: "N-09", code: "AXIOM", tier: "ALPHA", region: "OC-EAST" },
  { id: "N-10", code: "MIRAGE", tier: "BETA", region: "AS-WEST" },
];

// Deterministic positions on a 100x100 virtual grid forming an organic
// network around a central "DEV CORE" node.
const POSITIONS: Array<{ x: number; y: number }> = [
  { x: 14, y: 22 },
  { x: 32, y: 12 },
  { x: 54, y: 18 },
  { x: 78, y: 14 },
  { x: 88, y: 38 },
  { x: 80, y: 70 },
  { x: 58, y: 82 },
  { x: 34, y: 84 },
  { x: 14, y: 64 },
  { x: 8, y: 42 },
];

const CORE = { x: 50, y: 48 };

// Cross-links between neighbouring nodes (indices into PARTNERS).
const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 0],
  [0, 2],
  [3, 5],
  [6, 8],
];

export function Partners() {
  const nodes = useMemo(
    () => PARTNERS.map((p, i) => ({ ...p, ...POSITIONS[i] })),
    [],
  );

  return (
    <section id="partners" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="04" title="PARTNERSHIP DATABASE" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display text-4xl text-foreground sm:text-5xl">
            ALLIED <span className="text-[color:var(--cyan)]">NETWORK</span>
          </h2>
          <p className="text-mono max-w-sm text-[11px] text-[color:var(--muted-foreground)]">
            // {PARTNERS.length} NODES INDEXED // LINK INTEGRITY 98.4% // COLOR PROFILES PENDING
          </p>
        </div>

        <SectionDiagnostics
          className="mt-4"
          label="PARTNER DB"
          records={`${PARTNERS.length.toString().padStart(3, "0")} ENTRIES`}
        />

        {/* Network map */}
        <div className="relative mt-10 border border-[color:var(--border)] bg-[color:var(--surface-1)]/40">
          {/* corner markers */}
          <span className="absolute -top-px -left-px h-3 w-3 border-t border-l border-[color:var(--cyan)]" />
          <span className="absolute -top-px -right-px h-3 w-3 border-t border-r border-[color:var(--cyan)]" />
          <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-[color:var(--cyan)]" />
          <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[color:var(--cyan)]" />

          <div className="grid-bg absolute inset-0 opacity-25" />

          {/* Topbar */}
          <div className="text-mono relative flex items-center justify-between border-b border-[color:var(--border)] px-3 py-2 text-[9px] text-[color:var(--muted-foreground)]">
            <span>MAP // ALLIED-NETWORK.D001</span>
            <span className="hidden sm:inline">RENDER MODE // TOPOLOGY</span>
            <span className="text-[color:var(--cyan)]">LIVE</span>
          </div>

          <div className="relative aspect-[16/10] w-full">
            {/* Connection lines + core */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Lines from each node to core */}
              {nodes.map((n) => (
                <line
                  key={`c-${n.id}`}
                  x1={n.x}
                  y1={n.y}
                  x2={CORE.x}
                  y2={CORE.y}
                  stroke="var(--cyan)"
                  strokeOpacity="0.18"
                  strokeWidth="0.15"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Cross-links */}
              {LINKS.map(([a, b], i) => {
                const A = nodes[a];
                const B = nodes[b];
                return (
                  <line
                    key={`l-${i}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke="var(--cyan)"
                    strokeOpacity="0.28"
                    strokeWidth="0.12"
                    strokeDasharray="0.6 0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {/* Core glow */}
              <circle cx={CORE.x} cy={CORE.y} r="12" fill="url(#coreGlow)" />
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r="2.2"
                fill="var(--cyan)"
                opacity="0.9"
              />
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r="4.5"
                fill="none"
                stroke="var(--cyan)"
                strokeOpacity="0.5"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Core label */}
            <div
              className="text-mono pointer-events-none absolute -translate-x-1/2 translate-y-3 text-[9px] text-[color:var(--cyan)]"
              style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}
            >
              DEV / CORE
            </div>

            {/* Nodes */}
            {nodes.map((n) => (
              <div
                key={n.id}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div className="relative flex flex-col items-center gap-1">
                  <div className="relative h-7 w-7 border border-[color:var(--cyan-dim)] bg-[color:var(--surface-0)]/80 transition-all duration-300 group-hover:border-[color:var(--cyan)] group-hover:shadow-[0_0_18px_var(--cyan)]">
                    <div className="absolute inset-1 bg-[color:var(--muted-foreground)]/15 transition-colors group-hover:bg-[color:var(--cyan)]/30" />
                    <span className="absolute -top-px -left-px h-1 w-1 bg-[color:var(--cyan)]" />
                    <span className="absolute -bottom-px -right-px h-1 w-1 bg-[color:var(--cyan)]" />
                  </div>
                  <span className="text-mono whitespace-nowrap text-[8px] text-[color:var(--muted-foreground)] transition-colors group-hover:text-[color:var(--cyan)]">
                    {n.code}
                  </span>
                  {/* hover tooltip */}
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-5 -translate-x-1/2 whitespace-nowrap border border-[color:var(--cyan-dim)] bg-[color:var(--surface-0)]/95 px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p className="text-mono text-[8px] text-[color:var(--cyan)]">
                      {n.id} // {n.tier}
                    </p>
                    <p className="text-mono text-[8px] text-[color:var(--muted-foreground)]">
                      REGION {n.region}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer registry */}
          <div className="relative border-t border-[color:var(--border)]">
            <ul className="text-mono grid grid-cols-2 gap-px bg-[color:var(--border)] text-[9px] sm:grid-cols-3 md:grid-cols-5">
              {nodes.map((n) => (
                <li
                  key={`row-${n.id}`}
                  className="flex items-center justify-between gap-2 bg-[color:var(--surface-1)]/80 px-2 py-1.5 text-[color:var(--muted-foreground)]"
                >
                  <span className="text-[color:var(--cyan)]">{n.id}</span>
                  <span className="truncate">{n.code}</span>
                  <span className="opacity-60">{n.tier[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
