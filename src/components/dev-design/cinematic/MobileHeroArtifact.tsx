import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { HeroArtifactSequence } from "./HeroArtifactSequence";

const TOUCH_RETICLE = "/assets/cursor/cursor_scan.webp";

export function MobileHeroArtifact() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const touchCursorRef = useRef<HTMLDivElement>(null);
  const touchReleaseTimer = useRef<number | undefined>(undefined);

  const moveTouchCursor = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;

    const visual = visualRef.current;
    const touchCursor = touchCursorRef.current;
    if (!visual || !touchCursor) return;

    const bounds = visual.getBoundingClientRect();
    touchCursor.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0) translate(-50%, -50%)`;
    touchCursor.dataset.active = "true";
  };

  const releaseTouchCursor = () => {
    if (touchReleaseTimer.current !== undefined) {
      window.clearTimeout(touchReleaseTimer.current);
    }
    touchReleaseTimer.current = window.setTimeout(() => {
      if (touchCursorRef.current) touchCursorRef.current.dataset.active = "false";
    }, 120);
  };

  return (
    <div
      className="mobile-hero-artifact"
      aria-label="DEV DESIGN AI artifact. Scroll within the chamber to decrypt."
      ref={scrollerRef}
      onPointerDown={moveTouchCursor}
      onPointerMove={moveTouchCursor}
      onPointerUp={releaseTouchCursor}
      onPointerCancel={releaseTouchCursor}
    >
      <div ref={trackRef} className="mobile-hero-artifact__track">
        <div ref={visualRef} className="mobile-hero-artifact__visual">
          <HeroArtifactSequence scrollContainerRef={scrollerRef} scrollTriggerRef={trackRef} />
          <div
            ref={touchCursorRef}
            className="mobile-hero-artifact__touch-cursor"
            data-active="false"
            aria-hidden="true"
          >
            <img src={TOUCH_RETICLE} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
