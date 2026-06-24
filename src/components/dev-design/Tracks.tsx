import { SectionLabel } from "./ui";

const MODULES = [
  {
    id: "01",
    name: "GRAPHIC DESIGN",
    body: "Static visual systems, brand artifacts, poster protocols, classified key-art.",
    skills: ["IDENTITY", "TYPOGRAPHY", "POSTERS"],
  },
  {
    id: "02",
    name: "VIDEO EDITING",
    body: "Cinematic cuts, rhythmic montage, sound-driven sequencing, trailer engineering.",
    skills: ["MONTAGE", "PACING", "SOUND DESIGN"],
  },
  {
    id: "03",
    name: "MOTION DESIGN",
    body: "Kinetic typography, UI animation, transitions and AI-driven motion systems.",
    skills: ["AFTER FX", "KINETIC", "LOOPS"],
  },
  {
    id: "04",
    name: "DIGITAL ART",
    body: "Conceptual frames, generative imagery, surreal compositions, archive artifacts.",
    skills: ["CONCEPT", "AI ART", "COLLAGE"],
  },
  {
    id: "05",
    name: "FILM & DIRECTION",
    body: "Short-form cinema, narrative construction, atmospheric directing.",
    skills: ["NARRATIVE", "CAMERA", "GRADE"],
  },
  {
    id: "06",
    name: "UI / EXPERIENCE",
    body: "Interface architecture, interaction systems, cinematic product surfaces.",
    skills: ["INTERFACE", "FLOW", "PROTOTYPE"],
  },
];

export function Tracks() {
  return (
    <section id="tracks" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="03" title="CREATIVE MODULE DATABASE" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display text-4xl text-foreground sm:text-5xl">
            CREATIVE
            <br />
            <span className="text-[color:var(--cyan)]">MODULES</span>
          </h2>
          <p className="text-mono max-w-sm text-[11px] text-[color:var(--muted-foreground)]">
            // 06 MODULES INDEXED // ALL STATUSES MARKED AVAILABLE // SELECT ACCESS VECTOR
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px bg-[color:var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <a
              key={m.id}
              href="#access"
              className="track-module group relative bg-[color:var(--surface-1)]/70 p-6 no-underline transition-all duration-300 hover:bg-[color:var(--surface-2)]/80"
            >
              <span className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[color:var(--cyan-dim)]" />
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "inset 0 0 60px -20px var(--cyan)" }}
              />

              <div className="text-mono flex items-center justify-between text-[10px] text-[color:var(--muted-foreground)]">
                <span>MODULE {m.id}</span>
                <span className="flex items-center gap-1.5 text-[color:var(--cyan)]">
                  <span className="h-1 w-1 animate-blink bg-[color:var(--cyan)]" />
                  STATUS: AVAILABLE
                </span>
              </div>

              <h3 className="text-display mt-5 text-2xl text-foreground transition-colors group-hover:text-[color:var(--cyan)]">
                {m.name}
              </h3>

              <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{m.body}</p>

              <div className="text-mono mt-6 flex flex-wrap gap-2 text-[9px]">
                {m.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-[color:var(--border)] px-2 py-1 text-[color:var(--muted-foreground)] transition-colors group-hover:border-[color:var(--cyan-dim)] group-hover:text-[color:var(--cyan)]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-mono mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4 text-[10px] text-[color:var(--muted-foreground)]">
                <span>ACCESS // M-{m.id}</span>
                <span className="text-[color:var(--cyan)] opacity-0 transition-opacity group-hover:opacity-100">
                  ENGAGE →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
