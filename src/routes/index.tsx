import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar } from "@/components/dev-design/Navbar";
import { Hero } from "@/components/dev-design/Hero";

const About = lazy(() => import("@/components/dev-design/About").then(({ About: Component }) => ({ default: Component })));
const Timeline = lazy(() => import("@/components/dev-design/Timeline").then(({ Timeline: Component }) => ({ default: Component })));
const Tracks = lazy(() => import("@/components/dev-design/Tracks").then(({ Tracks: Component }) => ({ default: Component })));
const Partners = lazy(() => import("@/components/dev-design/Partners").then(({ Partners: Component }) => ({ default: Component })));
const Team = lazy(() => import("@/components/dev-design/Team").then(({ Team: Component }) => ({ default: Component })));
const Access = lazy(() => import("@/components/dev-design/Access").then(({ Access: Component }) => ({ default: Component })));
const FinalLog = lazy(() => import("@/components/dev-design/FinalLog").then(({ FinalLog: Component }) => ({ default: Component })));
const HudOverlay = lazy(() => import("@/components/dev-design/HudDiagnostics").then(({ HudOverlay: Component }) => ({ default: Component })));
const AIAtmosphere = lazy(() => import("@/components/dev-design/background/AIAtmosphere").then(({ AIAtmosphere: Component }) => ({ default: Component })));

/** Defers below-the-fold code and its side effects until the user approaches it. */
function Deferred({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [, render] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loaded.current) return;
      loaded.current = true;
      render(true);
      observer.disconnect();
    }, { rootMargin: "900px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="deferred-content min-h-px"><Suspense fallback={null}>{loaded.current ? children : null}</Suspense></div>;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DEV DESIGN // Classified Creative Archive" },
      {
        name: "description",
        content:
          "A cinematic design and editing hackathon for creators, designers, editors, filmmakers, and digital artists. Creativity cannot be contained.",
      },
      { property: "og:title", content: "DEV DESIGN // Classified Creative Archive" },
      {
        property: "og:description",
        content: "Enter the archive. Decrypt the system. Creativity cannot be contained.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    // Applied the dark background directly to the root container
    <div className="relative min-h-screen overflow-x-hidden text-foreground bg-[#020205]">
      {/* Z 0: The Global AI Atmosphere System sits safely at the bottom */}
      <Deferred><AIAtmosphere /></Deferred>

      {/* Z 10: The Digital Grid Structure */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,#020205_100%)] opacity-80" />
      </div>

      {/* Navbar wrapper to ensure it stays clickable */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Z 20: All website content lives here on top */}
      <main className="relative z-20">
        <h1 className="sr-only">DEV DESIGN — Cinematic creative hackathon archive</h1>
        <Hero />
        <Deferred>
          <About />
          <Timeline />
          <Tracks />
          <Partners />
          <Team />
          <Access />
          <FinalLog />
        </Deferred>
      </main>

      {/* Z 50: HUD Overlay stays on top of everything */}
      <div className="relative z-50 pointer-events-none">
        <Deferred><HudOverlay /></Deferred>
      </div>
    </div>
  );
}
