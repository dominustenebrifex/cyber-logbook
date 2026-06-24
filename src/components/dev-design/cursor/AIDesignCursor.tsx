import { useEffect, useRef } from "react";
import "./cursor.css";

export const CURSOR_ASSETS = {
  pen: "/assets/cursor/cursor_pencil.webp",
  penHover: "/assets/cursor/cursor_pencil_hover.webp",
  scanningReticle: "/assets/cursor/cursor_scan.webp",
  clickRing: "/assets/cursor/cursor_click_ring.webp",
  clickBurst: "/assets/cursor/cursor_click_burst.webp",
  energyTrail: "/assets/cursor/cursor_energy_trail.webp",
} as const;

const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
// Keep the pen anchored to the native pointer; visual effects animate around it.
const LERP_FACTOR = 1;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  angle: number;
}

export function AIDesignCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const penDefaultRef = useRef<HTMLImageElement>(null);
  const penHoverRef = useRef<HTMLImageElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const clickFxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    if (!mediaQuery.matches) return;

    let animationFrame = 0;
    let isTracking = false;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    let isHovering = false;
    let isAnalyzing = false;
    let isClicked = false;
    let pageVisible = !document.hidden;
    let lastFrame = 0;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let trailWasDrawn = false;

    const particles: Particle[] = [];
    const ctx = canvasRef.current?.getContext("2d");

    const trailImg = new Image();
    trailImg.src = CURSOR_ASSETS.energyTrail;

    const resizeCanvas = () => {
      if (canvasRef.current) {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
        canvasRef.current.width = Math.floor(window.innerWidth * ratio);
        canvasRef.current.height = Math.floor(window.innerHeight * ratio);
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
        ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const spawnParticle = (x: number, y: number, vx: number, vy: number, analyzing: boolean) => {
      if (particles.length >= 32) return;
      particles.push({
        x,
        y,
        vx: vx * 0.05,
        vy: vy * 0.05,
        life: 1.0,
        maxLife: analyzing ? 1.0 : 0.6,
        size: analyzing ? 32 : 24,
        angle: Math.atan2(vy, vx),
      });
    };

    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);
      if (!pageVisible || time - lastFrame < 16) return;
      lastFrame = time;
      if (!isTracking || !containerRef.current || !penRef.current || !reticleRef.current || !ctx) {
        return;
      }

      const prevX = currentX;
      const prevY = currentY;

      currentX += (targetX - currentX) * LERP_FACTOR;
      currentY += (targetY - currentY) * LERP_FACTOR;

      const vx = currentX - prevX;
      const vy = currentY - prevY + scrollVelocity * 0.5;
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Subtle, elegant idle floating
      const idleFloatY = Math.sin(time * 0.003) * 3;
      const idleFloatX = Math.cos(time * 0.002) * 1.5;

      // Center container exactly on mouse coordinates
      containerRef.current.style.transform = `translate3d(${currentX + idleFloatX}px, ${currentY + idleFloatY}px, 0)`;

      // Removed dynamic rotation. Just scales down slightly on click.
      const penScale = isClicked ? 0.9 : 1.0;
      penRef.current.style.transform = `scale(${penScale})`;

      const isAnyHover = isHovering || isAnalyzing;
      if (penDefaultRef.current && penHoverRef.current) {
        penDefaultRef.current.style.opacity = isAnyHover ? "0" : "1";
        penHoverRef.current.style.opacity = isAnyHover ? "1" : "0";
      }

      // Reticle Logic
      const reticleSpin = time * (isAnalyzing ? 0.15 : 0.05);
      let reticleScale = isAnalyzing ? 1.3 : isHovering ? 1.0 : 0.6 + Math.sin(time * 0.002) * 0.05;
      let reticleOpacity = isAnalyzing ? 0.6 : isHovering ? 0.4 : 0.15;

      if (isClicked) {
        reticleScale *= 1.5;
        reticleOpacity = 0.0;
      }

      reticleRef.current.style.transform = `translate(-50%, -50%) rotate(${reticleSpin}deg) scale(${reticleScale})`;
      reticleRef.current.style.opacity = reticleOpacity.toString();

      // Energy Trail
      if (speed > 4 || Math.abs(scrollVelocity) > 4) {
        spawnParticle(currentX, currentY, vx, vy, isAnalyzing);
      }
      scrollVelocity *= 0.9;

      // Once the last trail particle has faded, leave the transparent canvas alone
      // until another trail is needed. The pen and reticle continue at full rate.
      if (particles.length === 0 && !trailWasDrawn) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "screen";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life / p.maxLife);

        if (trailImg.complete) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = alpha * 0.7;
          ctx.drawImage(trailImg, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      trailWasDrawn = particles.length > 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isTracking) {
        currentX = targetX;
        currentY = targetY;
        isTracking = true;
      }
    };

    const onScroll = () => {
      const nowY = window.scrollY;
      scrollVelocity = nowY - lastScrollY;
      lastScrollY = nowY;
    };

    const onMouseDown = () => {
      isClicked = true;
      if (clickFxRef.current) {
        clickFxRef.current.classList.remove("play-click");
        void clickFxRef.current.offsetWidth;
        clickFxRef.current.classList.add("play-click");
      }
    };

    const onMouseUp = () => (isClicked = false);
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input")) isHovering = true;
      if (target.closest(".artifact-chamber, [data-hero-sequence]")) isAnalyzing = true;
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input")) isHovering = false;
      if (target.closest(".artifact-chamber, [data-hero-sequence]")) isAnalyzing = false;
    };

    document.documentElement.classList.add("ai-design-cursor-enabled");

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibilityChange);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove("ai-design-cursor-enabled");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const desktopPointer = window.matchMedia(DESKTOP_POINTER_QUERY);
    const hasTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
    if (desktopPointer.matches || !hasTouch) return;

    const container = containerRef.current;
    const pen = penRef.current;
    const reticle = reticleRef.current;
    if (!container || !pen || !reticle) return;

    let frame = 0;
    let active = false;
    let usingPointerEvents = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasPosition = false;

    const render = () => {
      frame = 0;
      if (!hasPosition) return;

      // A short interpolation removes touch-event jitter while keeping the pen
      // visually attached to the finger.
      currentX += (targetX - currentX) * 0.58;
      currentY += (targetY - currentY) * 0.58;
      container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      reticle.style.transform = "translate(-50%, -50%) scale(0.72)";
      reticle.style.opacity = active ? "0.5" : "0";

      if (active || Math.abs(targetX - currentX) > 0.25 || Math.abs(targetY - currentY) > 0.25) {
        frame = requestAnimationFrame(render);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const updatePosition = (x: number, y: number) => {
      targetX = x;
      targetY = y;
      if (!hasPosition) {
        currentX = x;
        currentY = y;
        hasPosition = true;
      }
      active = true;
      container.dataset.touchActive = "true";
      schedule();
    };

    const release = () => {
      active = false;
      container.dataset.touchActive = "false";
      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      usingPointerEvents = true;
      updatePosition(event.clientX, event.clientY);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") updatePosition(event.clientX, event.clientY);
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch") release();
    };

    // Safari versions without complete Pointer Event support use this fallback.
    const onTouchStart = (event: TouchEvent) => {
      if (usingPointerEvents) return;
      const touch = event.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (usingPointerEvents) return;
      const touch = event.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => {
      if (!usingPointerEvents) release();
    };

    container.dataset.touchMode = "true";
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerEnd, { passive: true });
    window.addEventListener("pointercancel", onPointerEnd, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      delete container.dataset.touchMode;
      delete container.dataset.touchActive;
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="ai-design-cursor-canvas" aria-hidden="true" />

      <div ref={containerRef} className="ai-design-cursor-container" aria-hidden="true">
        <div ref={reticleRef} className="ai-cursor-reticle">
          <img src={CURSOR_ASSETS.scanningReticle} alt="" />
        </div>

        <div ref={clickFxRef} className="ai-cursor-click-fx">
          <img src={CURSOR_ASSETS.clickRing} className="click-ring" alt="" />
          <img src={CURSOR_ASSETS.clickBurst} className="click-burst" alt="" />
        </div>

        <div ref={penRef} className="ai-cursor-pen">
          <img
            ref={penDefaultRef}
            src={CURSOR_ASSETS.pen}
            className="pen-state pen-default"
            alt=""
          />
          <img
            ref={penHoverRef}
            src={CURSOR_ASSETS.penHover}
            className="pen-state pen-hover"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

