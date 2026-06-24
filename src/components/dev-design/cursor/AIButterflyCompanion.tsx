import { useEffect, useRef } from "react";

const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const FRAME_WIDTH = 64;
const TOTAL_FRAMES = 5;
const COMPANION_OFFSET = 37.5;
const HOVER_RADIUS = 190;
const RETREAT_RADIUS = 235;
const MIN_CURSOR_CLEARANCE = 150;
const SCREEN_PADDING = 40;
const MAX_PARTICLES = 42;

export const BUTTERFLY_ASSETS = {
  sprite: "/assets/cursor/butterfly-spritesheet.webp",
} as const;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
  decay: number;
}

/** A visual companion for AIDesignCursor; it never replaces or controls the primary cursor. */
export function AIButterflyCompanion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    velocityX: 0,
    velocityY: 0,
    time: 0,
    shouldFollow: false,
    retreating: false,
    currentFrame: 0,
    frameTimer: 0,
    particles: [] as Particle[],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frameId = 0;
    let isActive = false;
    let pageVisible = !document.hidden;
    let pointerMovedAt = performance.now();
    let lastFrame = 0;
    let isHoveringControl = false;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const addParticle = (speed: number) => {
      const s = state.current;
      if (s.particles.length >= MAX_PARTICLES) return;

      s.particles.push({
        x: s.currentX,
        y: s.currentY,
        // Drift behind the butterfly so the trail reflects its flight direction.
        vx: -s.velocityX * 0.16 + (Math.random() - 0.5) * 1.8,
        vy: -s.velocityY * 0.16 + (Math.random() - 0.5) * 1.8,
        size: Math.min(3.5, 0.7 + speed * 0.12 + Math.random() * 1.4),
        alpha: 1,
        hue: Math.random() > 0.5 ? 190 : 280,
        decay: 0.012 + Math.random() * 0.02,
      });
    };

    const animate = (now: number) => {
      if (!isActive) return;
      frameId = requestAnimationFrame(animate);
      // The companion stays alive but does substantially less work when idle.
      const idle = now - pointerMovedAt > 180;
      if (!pageVisible || (idle && now - lastFrame < 33)) return;
      lastFrame = now;

      const s = state.current;
      s.time += 1;
      const toCursorX = s.targetX - s.currentX;
      const toCursorY = s.targetY - s.currentY;
      const distance = Math.hypot(toCursorX, toCursorY);
      if (distance < HOVER_RADIUS) {
        s.retreating = true;
        s.shouldFollow = false;
      }
      let desiredX = s.currentX;
      let desiredY = s.currentY;

      if (s.retreating) {
        // Back away to a calm radius whenever the companion gets too close.
        const angle = distance > 0 ? Math.atan2(toCursorY, toCursorX) + Math.PI : s.time * 0.01;
        desiredX = s.targetX + Math.cos(angle) * RETREAT_RADIUS;
        desiredY = s.targetY + Math.sin(angle) * RETREAT_RADIUS;
        if (distance >= RETREAT_RADIUS - 8) s.retreating = false;
      } else {
        // Close to the pointer, orbit a calm 3–4 cm radius instead of chasing it.
        if (s.shouldFollow) {
          desiredX = s.targetX;
          desiredY = s.targetY;
        }
      }

      const isChasing = s.shouldFollow && !s.retreating;
      // It should feel lively in flight, but never snap abruptly onto the cursor.
      const acceleration = s.retreating ? 0.02 : isChasing ? 0.018 : 0.08;
      const damping = s.retreating ? 0.91 : isChasing ? 0.92 : 0.76;
      const maxSpeed = s.retreating ? 8 : isChasing ? 10 : 1.5;
      s.velocityX = (s.velocityX + (desiredX - s.currentX) * acceleration) * damping;
      s.velocityY = (s.velocityY + (desiredY - s.currentY) * acceleration) * damping;
      const speedBeforeCap = Math.hypot(s.velocityX, s.velocityY);
      if (speedBeforeCap > maxSpeed) {
        const scale = maxSpeed / speedBeforeCap;
        s.velocityX *= scale;
        s.velocityY *= scale;
      }

      s.currentX = Math.max(SCREEN_PADDING, Math.min(window.innerWidth - SCREEN_PADDING, s.currentX + s.velocityX));
      s.currentY = Math.max(SCREEN_PADDING, Math.min(window.innerHeight - SCREEN_PADDING, s.currentY + s.velocityY));

      // High chase velocity must never let the companion pass through the primary cursor.
      const cursorGapX = s.currentX - s.targetX;
      const cursorGapY = s.currentY - s.targetY;
      const cursorGap = Math.hypot(cursorGapX, cursorGapY);
      if (cursorGap < MIN_CURSOR_CLEARANCE) {
        const safeAngle = cursorGap > 0 ? Math.atan2(cursorGapY, cursorGapX) : s.time * 0.018;
        s.currentX = s.targetX + Math.cos(safeAngle) * MIN_CURSOR_CLEARANCE;
        s.currentY = s.targetY + Math.sin(safeAngle) * MIN_CURSOR_CLEARANCE;
        s.velocityX *= 0.35;
        s.velocityY *= 0.35;
      }

      const speed = Math.hypot(s.velocityX, s.velocityY);
      const rotation = Math.atan2(s.velocityY, s.velocityX) + Math.PI / 2;
      const flapDelay = isChasing
        ? Math.max(2, 8 - Math.floor(speed * 0.45))
        : Math.max(9, 16 - Math.floor(speed * 0.35));

      if (containerRef.current && spriteRef.current) {
        containerRef.current.style.transform = `translate3d(${s.currentX - COMPANION_OFFSET}px, ${s.currentY - COMPANION_OFFSET}px, 0) rotate(${rotation}rad)`;
        s.frameTimer += 1;
        if (s.frameTimer >= flapDelay) {
          s.currentFrame = (s.currentFrame + 1) % TOTAL_FRAMES;
          spriteRef.current.style.backgroundPosition = `-${s.currentFrame * FRAME_WIDTH}px 0`;
          s.frameTimer = 0;
        }
      }

      const emissions = isHoveringControl || s.retreating ? 0 : isChasing && speed > 6 ? 1 : 0;
      for (let count = 0; count < emissions; count += 1) addParticle(speed);

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "screen";
      for (let index = s.particles.length - 1; index >= 0; index -= 1) {
        const particle = s.particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= particle.decay;
        if (particle.alpha <= 0) {
          s.particles.splice(index, 1);
          continue;
        }
        context.globalAlpha = particle.alpha;
        context.shadowBlur = 4;
        context.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
        context.fillStyle = `hsl(${particle.hue}, 100%, 80%)`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
    };

    const onPointerMove = (event: PointerEvent) => {
      state.current.targetX = event.clientX;
      state.current.targetY = event.clientY;
      state.current.shouldFollow = true;
      state.current.retreating = false;
      pointerMovedAt = performance.now();
      isHoveringControl = Boolean((event.target as HTMLElement).closest("a, button, input, [role='button']"));
    };

    const onVisibilityChange = () => { pageVisible = !document.hidden; };

    const start = () => {
      if (!mediaQuery.matches || isActive) return;
      const s = state.current;
      s.targetX = s.currentX = window.innerWidth / 2;
      s.targetY = s.currentY = window.innerHeight / 2;
      s.velocityX = s.velocityY = 0;
      resizeCanvas();
      isActive = true;
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      frameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      isActive = false;
      state.current.particles = [];
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };

    const onMediaChange = () => {
      stop();
      start();
    };

    start();
    mediaQuery.addEventListener("change", onMediaChange);
    return () => {
      stop();
      mediaQuery.removeEventListener("change", onMediaChange);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="butterfly-companion-canvas" aria-hidden="true" />
      <div ref={containerRef} className="butterfly-companion" aria-hidden="true">
        <div
          ref={spriteRef}
          className="butterfly-companion__sprite"
          style={{ backgroundImage: `url(${BUTTERFLY_ASSETS.sprite})` }}
        />
      </div>
    </>
  );
}
