import { useRef } from "react";
import { HeroArtifactSequence } from "./HeroArtifactSequence";

export function MobileHeroArtifact() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="mobile-hero-artifact"
      aria-label="DEV DESIGN AI artifact. Scroll within the chamber to decrypt."
      ref={scrollerRef}
    >
      <div ref={trackRef} className="mobile-hero-artifact__track">
        <div className="mobile-hero-artifact__visual">
          <HeroArtifactSequence scrollContainerRef={scrollerRef} scrollTriggerRef={trackRef} />
        </div>
      </div>
    </div>
  );
}
