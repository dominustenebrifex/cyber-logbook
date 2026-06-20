import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/dev-design/Navbar";
import { Hero } from "@/components/dev-design/Hero";
import { About } from "@/components/dev-design/About";
import { Timeline } from "@/components/dev-design/Timeline";
import { Tracks } from "@/components/dev-design/Tracks";
import { Partners } from "@/components/dev-design/Partners";
import { Team } from "@/components/dev-design/Team";
import { Access } from "@/components/dev-design/Access";
import { FinalLog } from "@/components/dev-design/FinalLog";

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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient layers (placeholder for future cosmic background) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,oklch(0.55_0.27_295/0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,oklch(0.85_0.16_215/0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,oklch(0.06_0.015_270/0.6)_100%)]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <h1 className="sr-only">DEV DESIGN — Cinematic creative hackathon archive</h1>
        <Hero />
        <About />
        <Timeline />
        <Tracks />
        <Partners />
        <Team />
        <Access />
        <FinalLog />
      </main>
    </div>
  );
}
