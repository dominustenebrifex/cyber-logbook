import { CornerFrame, HudTag, TerminalButton } from "./ui";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan-dim)] to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        {/* Left */}
        <div className="relative flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <HudTag>CLEARANCE LEVEL: 01</HudTag>
            <HudTag tone="purple">PROTOCOL D-001</HudTag>
            <HudTag tone="muted">FILE 00 / HERO</HudTag>
          </div>

          <h1 className="text-display mt-8 leading-[0.85] text-foreground">
            <span className="block text-[clamp(3.5rem,11vw,9rem)]">DEV</span>
            <span className="block text-[clamp(3.5rem,11vw,9rem)] text-[color:var(--cyan)]">
              DESIGN
            </span>
          </h1>

          <p className="text-mono mt-6 text-[11px] tracking-[0.3em] text-[color:var(--muted-foreground)]">
            // CREATIVITY CANNOT BE CONTAINED.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
            A cinematic design and editing hackathon for creators, designers, editors,
            filmmakers, and digital artists. Enter the archive. Decrypt the system.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <TerminalButton href="#access">[ ACCESS SYSTEM ]</TerminalButton>
            <TerminalButton href="#access" variant="secondary">
              [ INITIATE CREATOR ACCESS ]
            </TerminalButton>
          </div>

          <div className="text-mono mt-12 grid grid-cols-3 gap-4 border-t border-[color:var(--border)] pt-5 text-[10px] text-[color:var(--muted-foreground)]">
            <div>
              <p className="text-[color:var(--cyan)]">SYS // 01</p>
              <p className="mt-1">ARCHIVE STATUS<br/>STABLE</p>
            </div>
            <div>
              <p className="text-[color:var(--cyan)]">SYS // 02</p>
              <p className="mt-1">ERROR LOG<br/>017</p>
            </div>
            <div>
              <p className="text-[color:var(--cyan)]">SYS // 03</p>
              <p className="mt-1">UPLINK<br/>ACTIVE</p>
            </div>
          </div>
        </div>

        {/* Right artifact placeholder */}
        <div className="relative">
          <CornerFrame className="aspect-[4/5] w-full bg-gradient-to-br from-[color:var(--surface-1)] via-[color:var(--surface-0)] to-[color:var(--surface-2)] animate-border-pulse">
            <div className="grid-bg absolute inset-0 opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.55_0.27_295/0.3),transparent_60%)]" />

            <div className="text-mono absolute left-3 top-3 text-[9px] text-[color:var(--cyan)]">
              ARTIFACT // CHAMBER 01
            </div>
            <div className="text-mono absolute right-3 top-3 text-[9px] text-[color:var(--muted-foreground)]">
              REC ● 00:00:17
            </div>
            <div className="text-mono absolute left-3 bottom-3 text-[9px] text-[color:var(--muted-foreground)]">
              SEQUENCE //
            </div>
            <div className="text-mono absolute right-3 bottom-3 text-[9px] text-[color:var(--purple)]">
              UNCONTAINED
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="relative grid h-44 w-44 place-items-center border border-[color:var(--cyan-dim)] sm:h-52 sm:w-52">
                <div className="absolute inset-3 border border-[color:var(--purple-dim)]" />
                <div className="absolute inset-6 border border-[color:var(--cyan-dim)]" />
                <span className="text-display text-6xl text-[color:var(--cyan)] sm:text-7xl">D</span>
                <span className="absolute -top-2 left-1/2 h-4 w-px -translate-x-1/2 bg-[color:var(--cyan)]" />
                <span className="absolute -bottom-2 left-1/2 h-4 w-px -translate-x-1/2 bg-[color:var(--cyan)]" />
                <span className="absolute top-1/2 -left-2 h-px w-4 -translate-y-1/2 bg-[color:var(--cyan)]" />
                <span className="absolute top-1/2 -right-2 h-px w-4 -translate-y-1/2 bg-[color:var(--cyan)]" />
              </div>
              <p className="text-mono mt-6 text-[10px] text-[color:var(--muted-foreground)]">
                AI FACE → GLITCH → BUTTERFLY → D PROTOCOL
              </p>
              <p className="text-mono mt-2 text-[9px] text-[color:var(--cyan)]/70">
                SEQUENCE PENDING // RESTRICTED CHAMBER
              </p>
            </div>
          </CornerFrame>

          <div className="text-mono mt-3 flex items-center justify-between text-[9px] text-[color:var(--muted-foreground)]">
            <span>OBJ // 0x4D-001</span>
            <span>CLASS // CINEMATIC</span>
            <span className="text-[color:var(--cyan)]">DO NOT TRANSMIT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
