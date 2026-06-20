import { SectionLabel } from "./ui";

const NODES = [
  {
    id: "001",
    code: "T-MINUS 14",
    title: "SIGNAL BROADCAST",
    body: "Initial transmission. Creator registration channels open across the archive network.",
  },
  {
    id: "002",
    code: "T-MINUS 07",
    title: "ARCHIVE BRIEFING",
    body: "Classified briefing dispatched to authorized personnel. Module parameters revealed.",
  },
  {
    id: "003",
    code: "T-00",
    title: "PROTOCOL EXECUTION",
    body: "48-hour cinematic execution window. Units deploy. Artifacts generated. System observes.",
  },
  {
    id: "004",
    code: "T+02",
    title: "FINAL ARCHIVE",
    body: "Submissions sealed. Anomalies indexed. Final reports broadcast across all channels.",
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="02" title="MISSION SEQUENCE DATABASE" />
        <h2 className="text-display mt-6 text-4xl text-foreground sm:text-5xl">
          MISSION NODES
        </h2>
        <p className="text-mono mt-3 text-[11px] text-[color:var(--muted-foreground)]">
          // CINEMATIC SEQUENCE // CHRONOLOGY INDEXED BY SYSTEM
        </p>

        <div className="relative mt-16">
          {/* Central stream */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[color:var(--cyan-dim)] to-transparent lg:left-1/2" />

          <ol className="space-y-12">
            {NODES.map((n, i) => {
              const right = i % 2 === 1;
              return (
                <li key={n.id} className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                  {/* node dot */}
                  <span className="absolute left-4 top-3 grid h-3 w-3 -translate-x-1/2 place-items-center bg-[color:var(--surface-0)] lg:left-1/2">
                    <span className="h-2 w-2 bg-[color:var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
                  </span>

                  <div
                    className={`pl-10 lg:pl-0 ${
                      right ? "lg:col-start-2 lg:pl-12" : "lg:pr-12 lg:text-right"
                    }`}
                  >
                    <div className="hud-panel inline-block w-full max-w-md border-[color:var(--border)] p-5 text-left transition-colors hover:border-[color:var(--cyan-dim)]">
                      <div className="text-mono flex items-center justify-between text-[10px] text-[color:var(--muted-foreground)]">
                        <span className="text-[color:var(--cyan)]">MISSION NODE {n.id}</span>
                        <span>{n.code}</span>
                      </div>
                      <h3 className="text-display mt-3 text-2xl text-foreground">{n.title}</h3>
                      <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{n.body}</p>
                      <div className="text-mono mt-4 flex items-center gap-2 text-[9px] text-[color:var(--muted-foreground)]">
                        <span className="h-1 w-1 bg-[color:var(--cyan)]" />
                        ARCHIVED // ENTRY {n.id}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
