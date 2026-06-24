import { CornerFrame, HudTag, SectionLabel, TerminalButton } from "./ui";

const REGISTRATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeaMjB_eHknIGzfcSqk70Q2p4ESeNttH_HTj4gLpQdBRGkOlA/viewform";

export function Access() {
  return (
    <section id="access" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="06" title="CREATOR ACCESS TERMINAL" />

        <CornerFrame className="mt-8 bg-[color:var(--surface-1)]/70">
          <div className="grid-bg absolute inset-0 opacity-25" />
          <div className="relative p-6 sm:p-10">
            <div className="text-mono flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--border)] pb-4 text-[10px] text-[color:var(--muted-foreground)]">
              <span className="text-[color:var(--cyan)]">TERMINAL // D-001/REG</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-blink bg-[color:var(--cyan)]" />
                CONNECTION SECURE
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <HudTag>REGISTRATION STATUS: OPEN</HudTag>
                  <HudTag tone="purple">CLEARANCE PENDING</HudTag>
                </div>

                <h2 className="text-display mt-6 text-4xl leading-[0.95] text-foreground sm:text-5xl">
                  REQUEST
                  <br />
                  <span className="text-[color:var(--cyan)]">CREATOR ACCESS.</span>
                </h2>

                <p className="mt-5 max-w-md text-[color:var(--muted-foreground)]">
                  Submit credentials through the secured registration channel. Authorization granted
                  upon system verification. Identity will be archived.
                </p>

                <div className="mt-8">
                  <TerminalButton href={REGISTRATION_URL} external>
                    [ OPEN CREATOR REGISTRATION ]
                  </TerminalButton>
                </div>
              </div>

              <div className="text-mono space-y-2 border border-[color:var(--border)] bg-[color:var(--surface-0)]/80 p-4 text-[11px] text-[color:var(--muted-foreground)]">
                <p>&gt; INIT terminal.d001 --secure</p>
                <p>
                  &gt; LOAD registration.module ........{" "}
                  <span className="text-[color:var(--cyan)]">OK</span>
                </p>
                <p>
                  &gt; AUTH gateway ...................{" "}
                  <span className="text-[color:var(--cyan)]">OK</span>
                </p>
                <p>
                  &gt; CHANNEL google.forms ...........{" "}
                  <span className="text-[color:var(--cyan)]">LINKED</span>
                </p>
                <p>
                  &gt; CLEARANCE check ................{" "}
                  <span className="text-[color:var(--purple)]">PENDING</span>
                </p>
                <p>
                  &gt; AWAITING OPERATOR INPUT
                  <span className="ml-1 inline-block h-3 w-2 translate-y-0.5 animate-blink bg-[color:var(--cyan)]" />
                </p>
              </div>
            </div>
          </div>
        </CornerFrame>
      </div>
    </section>
  );
}
