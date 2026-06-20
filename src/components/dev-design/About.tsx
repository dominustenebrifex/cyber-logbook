import { CornerFrame, HudTag, SectionLabel } from "./ui";

const STATS = [
  { k: "FILE", v: "001" },
  { k: "ORIGIN", v: "CLASSIFIED" },
  { k: "FORMAT", v: "ARCHIVE.BIN" },
  { k: "INTEGRITY", v: "98.4%" },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="01" title="ARCHIVE ENTRY 001" />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Artifact placeholder */}
          <CornerFrame className="aspect-[4/5] bg-[color:var(--surface-1)]/60">
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="text-mono mb-4 text-[9px] text-[color:var(--cyan)]">
                ARCHIVE BOOK ARTIFACT
              </div>
              <div className="relative h-56 w-40 border border-[color:var(--cyan-dim)] bg-gradient-to-b from-[color:var(--surface-2)] to-[color:var(--surface-0)] sm:h-64 sm:w-44">
                <div className="absolute inset-x-3 top-3 border-b border-[color:var(--cyan-dim)] pb-3">
                  <p className="text-mono text-[8px] text-[color:var(--cyan)]">VOL. I</p>
                  <p className="text-display text-xs text-foreground">DEV / DESIGN</p>
                </div>
                <div className="absolute inset-x-3 bottom-3 space-y-1">
                  <div className="h-px w-full bg-[color:var(--border)]" />
                  <div className="h-px w-2/3 bg-[color:var(--border)]" />
                  <div className="h-px w-3/4 bg-[color:var(--border)]" />
                </div>
              </div>
              <p className="text-mono mt-6 text-[9px] text-[color:var(--muted-foreground)]">
                AWAITING ARTIFACT UPLOAD //
              </p>
            </div>
            <div className="text-mono absolute left-3 top-3 text-[9px] text-[color:var(--muted-foreground)]">
              CHAMBER 02
            </div>
            <div className="text-mono absolute right-3 bottom-3 text-[9px] text-[color:var(--cyan)]">
              SEALED
            </div>
          </CornerFrame>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              <HudTag>CLASSIFIED DOCUMENT</HudTag>
              <HudTag tone="purple">EYES ONLY</HudTag>
            </div>

            <h2 className="text-display mt-6 text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              A CINEMATIC<br />HACKATHON<br />
              <span className="text-[color:var(--cyan)]">FOR CREATORS.</span>
            </h2>

            <div className="mt-8 space-y-4 border-l border-[color:var(--cyan-dim)] pl-5 text-[color:var(--muted-foreground)]">
              <p>
                DEV DESIGN is a classified creative protocol — a hackathon engineered for
                designers, editors, filmmakers and digital artists operating at the edge of
                imagination.
              </p>
              <p>
                Inside this archive, every track is a module, every team a unit, every
                submission an artifact. The system is observing. The system is recording.
              </p>
            </div>

            <dl className="text-mono mt-10 grid grid-cols-2 gap-px border border-[color:var(--border)] bg-[color:var(--border)] text-[10px] sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.k} className="bg-[color:var(--surface-1)] p-4">
                  <dt className="text-[color:var(--muted-foreground)]">{s.k}</dt>
                  <dd className="mt-1 text-[color:var(--cyan)]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
