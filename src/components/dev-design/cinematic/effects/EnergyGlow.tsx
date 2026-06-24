import type { RefObject } from "react";

export function EnergyGlow({ glowRef }: { glowRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={glowRef} className="artifact-energy" aria-hidden="true" />;
}
