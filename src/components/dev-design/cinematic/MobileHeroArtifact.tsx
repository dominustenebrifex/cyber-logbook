import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { HeroArtifactSequence } from "./HeroArtifactSequence";

const TOUCH_RETICLE = "/assets/cursor/cursor_scan.webp";

export function MobileHeroArtifact() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const touchCursorRef = useRef<HTMLDivElement>(null);
  const touchReleaseTimer = useRef<number | null>(null);

  const setTouchCursor = (clientX: number, clientY: number) => {
    const visual = visualRef.current;
    const touchCursor = touchCursorRef.current;

    if (!visual || !touchCursor) {
      return;
    }

    if (touchReleaseTimer.current) {
      window.clearTimeout(touchReleaseTimer.current);
      touchReleaseTimer.current = null;
    }

    const rect = visual.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    touchCursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    touchCursor.dataset.active = "true";
  };

  const releaseTouchCursor = () => {
    if (touchReleaseTimer.current) {
      window.clearTimeout(touchReleaseTimer.current);
    }

    touchReleaseTimer.current = window.setTimeout(() => {
      if (touchCursorRef.current) {
        touchCursorRef.current.dataset.active = "false";
      }
    }, 140);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") {
      return;
    }

    setTouchCursor(event.clientX, event.clientY);
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0] ?? event.changedTouches[0];

    if (!touch) {
      return;
    }

    setTouchCursor(touch.clientX, touch.clientY);
  };

  return (
    <div
      className="mobile-hero-artifact"
      aria-label="DEV DESIGN AI artifact. Scroll within the chamber to decrypt."
      ref={scrollerRef}
      onPointerDown={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerUp={releaseTouchCursor}
      onPointerCancel={releaseTouchCursor}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={releaseTouchCursor}
      onTouchCancel={releaseTouchCursor}
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
