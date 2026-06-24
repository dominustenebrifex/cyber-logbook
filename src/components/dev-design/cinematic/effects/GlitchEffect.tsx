import type { RefObject } from "react";

export function GlitchEffect({ overlayRef }: { overlayRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={overlayRef} className="artifact-glitch" aria-hidden="true">
      <div className="artifact-glitch__tear artifact-glitch__tear--one" />
      <div className="artifact-glitch__tear artifact-glitch__tear--two" />
      <div className="artifact-glitch__rgb" />
    </div>
  );
}
