import { lazy, Suspense, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HudTag, TerminalButton } from "./ui";

// Three.js + GSAP stay out of the entry chunk. The chamber preserves its layout
// while this client-side enhancement is fetched.
const HeroArtifactSequence = lazy(() =>
  import("./cinematic/HeroArtifactSequence").then(({ HeroArtifactSequence: Component }) => ({
    default: Component,
  })),
);
const MobileHeroArtifact = lazy(() =>
  import("./cinematic/MobileHeroArtifact").then(({ MobileHeroArtifact: Component }) => ({
    default: Component,
  })),
);

export function Hero() {
  const isMobile = useIsMobile();
  const [viewportReady, setViewportReady] = useState(false);

  useEffect(() => setViewportReady(true), []);

  return (
    <section
      id="hero"
      data-hero-sequence
      className="relative overflow-hidden pt-28 pb-14 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-32"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan-dim)] to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-9 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        {/* Left */}
        <div className="hero-copy relative flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <HudTag>CLEARANCE LEVEL: 01</HudTag>
            <HudTag tone="purple">PROTOCOL D-001</HudTag>
            <HudTag tone="muted">FILE 00 / HERO</HudTag>
          </div>

          <div
            className="relative mt-5 h-[clamp(11rem,24vw,18rem)] w-full overflow-hidden sm:mt-7"
            aria-label="DEV DESIGN"
          >
            <img
              src="/assets/hero/dev-design-wordmark-transparent.webp"
              alt="DEV DESIGN"
              width={1047}
              height={394}
              fetchPriority="high"
              decoding="async"
              className="absolute left-0 top-1/2 w-full -translate-x-9 -translate-y-1/2"
            />
          </div>

          <p className="text-mono mt-6 text-[11px] tracking-[0.3em] text-[color:var(--muted-foreground)]">
            // CREATIVITY CANNOT BE CONTAINED.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
            A cinematic design and editing hackathon for creators, designers, editors, filmmakers,
            and digital artists. Enter the archive. Decrypt the system.
          </p>

          <div className="hero-actions mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <TerminalButton
              href="#access"
              className="min-h-11 w-full justify-between sm:w-auto sm:justify-start"
            >
              [ ACCESS SYSTEM ]
            </TerminalButton>
            <TerminalButton
              href="#access"
              variant="secondary"
              className="min-h-11 w-full justify-between sm:w-auto sm:justify-start"
            >
              [ INITIATE CREATOR ACCESS ]
            </TerminalButton>
          </div>

          <div className="hero-hud text-mono mt-12 grid grid-cols-1 gap-3 border-t border-[color:var(--border)] pt-5 text-[10px] text-[color:var(--muted-foreground)] sm:grid-cols-3 sm:gap-4">
            <div className="min-h-11">
              <p className="text-[color:var(--cyan)]">SYS // 01</p>
              <p className="mt-1">
                ARCHIVE STATUS
                <br />
                STABLE
              </p>
            </div>
            <div className="min-h-11">
              <p className="text-[color:var(--cyan)]">SYS // 02</p>
              <p className="mt-1">
                ERROR LOG
                <br />
                017
              </p>
            </div>
            <div className="min-h-11">
              <p className="text-[color:var(--cyan)]">SYS // 03</p>
              <p className="mt-1">
                UPLINK
                <br />
                ACTIVE
              </p>
            </div>
          </div>
        </div>

        {/* Right artifact chamber */}
        <div className="hero-artifact relative">
          <Suspense fallback={<div className="artifact-chamber" aria-hidden="true" />}>
            {viewportReady ? (
              isMobile ? (
                <MobileHeroArtifact />
              ) : (
                <HeroArtifactSequence />
              )
            ) : (
              <div className="artifact-chamber" aria-hidden="true" />
            )}
          </Suspense>

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
