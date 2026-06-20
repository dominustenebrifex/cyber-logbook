import { SectionLabel } from "./ui";

const TEAM = [
  { id: "001", name: "AGENT // VEX", role: "PROTOCOL DIRECTOR" },
  { id: "002", name: "AGENT // NOVA", role: "ARCHIVE ENGINEER" },
  { id: "003", name: "AGENT // ORION", role: "CINEMATIC LEAD" },
  { id: "004", name: "AGENT // HALO", role: "DESIGN OPERATIVE" },
  { id: "005", name: "AGENT // ECHO", role: "SIGNAL ANALYST" },
  { id: "006", name: "AGENT // CYPRESS", role: "MODULE CURATOR" },
];

export function Team() {
  return (
    <section id="team" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="05" title="AUTHORIZED PERSONNEL DATABASE" />
        <h2 className="text-display mt-6 text-4xl text-foreground sm:text-5xl">
          PERSONNEL <span className="text-[color:var(--cyan)]">FILES</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((p) => (
            <article
              key={p.id}
              className="group relative border border-[color:var(--border)] bg-[color:var(--surface-1)]/70 p-4 transition-all duration-300 hover:border-[color:var(--cyan-dim)]"
            >
              <div className="text-mono flex items-center justify-between text-[10px] text-[color:var(--muted-foreground)]">
                <span>PERSONNEL FILE {p.id}</span>
                <span className="text-[color:var(--cyan)]">VERIFIED</span>
              </div>

              {/* Profile placeholder */}
              <div className="relative mt-3 aspect-[4/5] overflow-hidden border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--surface-2)] to-[color:var(--surface-0)]">
                <div className="grid-bg absolute inset-0 opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative h-20 w-20 rounded-full border border-[color:var(--cyan-dim)] bg-[color:var(--surface-0)] transition-all duration-500 group-hover:border-[color:var(--cyan)] group-hover:shadow-[0_0_24px_var(--cyan)]">
                    <div className="absolute inset-3 rounded-full bg-[color:var(--muted-foreground)]/15 transition-all duration-500 group-hover:bg-[color:var(--cyan)]/20" />
                  </div>
                </div>
                <div className="text-mono absolute left-2 top-2 text-[9px] text-[color:var(--muted-foreground)]">
                  SCAN // MONOCHROME
                </div>
                <div className="text-mono absolute right-2 bottom-2 text-[9px] text-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100">
                  COLOR RECONSTRUCT //
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--surface-0)]/80 via-transparent to-transparent" />
              </div>

              <div className="mt-4">
                <h3 className="text-display text-lg text-foreground transition-colors group-hover:text-[color:var(--cyan)]">
                  {p.name}
                </h3>
                <p className="text-mono mt-1 text-[10px] text-[color:var(--muted-foreground)]">
                  {p.role}
                </p>
              </div>

              <div className="text-mono mt-4 grid max-h-0 grid-rows-[0fr] overflow-hidden text-[10px] text-[color:var(--muted-foreground)] transition-all duration-500 group-hover:grid-rows-[1fr]">
                <div className="min-h-0 border-t border-[color:var(--border)] pt-3">
                  <p>CLEARANCE 03 // ACTIVE</p>
                  <p className="mt-1">OPERATIONAL // ARCHIVE D-001</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
