import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { ArtifactState } from "../types";

type Point = { seed: number; angle: number; radius: number; drift: number };

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function transition(
  progress: number,
  from: [number, number],
  to: [number, number],
  start: number,
  end: number,
) {
  const amount = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return [mix(from[0], to[0], amount), mix(from[1], to[1], amount)] as [number, number];
}

function facePoint(point: Point): [number, number] {
  const band = point.seed < 0.68 ? 0.78 : 0.48;
  return [Math.cos(point.angle) * point.radius * band, Math.sin(point.angle) * point.radius * 1.06];
}

function cloudPoint(point: Point): [number, number] {
  const orbit = point.angle * 2.8 + point.seed * 18;
  const radius = 0.15 + point.radius * 1.35;
  return [Math.cos(orbit) * radius, Math.sin(orbit) * radius * 0.55];
}

function butterflyPoint(point: Point): [number, number] {
  const side = point.seed > 0.5 ? 1 : -1;
  const wing = (point.seed * 2) % 1;
  const x = side * (0.08 + wing * 0.72);
  const y = -0.05 + Math.sin(wing * Math.PI) * 0.52 - wing * 0.28 + (point.radius - 0.5) * 0.12;
  return [x, y];
}

function protocolPoint(point: Point): [number, number] {
  const segment = Math.floor(point.seed * 4);
  const local = (point.seed * 4) % 1;
  if (segment === 0) return [-0.35, -0.64 + local * 1.28];
  if (segment === 1)
    return [
      -0.35 + Math.cos(local * Math.PI * 0.5) * 0.62,
      -0.64 + Math.sin(local * Math.PI * 0.5) * 0.64,
    ];
  if (segment === 2)
    return [
      -0.35 + Math.cos(Math.PI * 0.5 + local * Math.PI * 0.5) * 0.62,
      0.64 + Math.sin(Math.PI * 0.5 + local * Math.PI * 0.5) * 0.64,
    ];
  return [-0.35 + local * 0.5, (point.radius - 0.5) * 0.12];
}

function targetPoint(point: Point, progress: number): [number, number] {
  const face = facePoint(point);
  const cloud = cloudPoint(point);
  const butterfly = butterflyPoint(point);
  const protocol = protocolPoint(point);
  if (progress < 0.24) return face;
  if (progress < 0.42) return transition(progress, face, cloud, 0.24, 0.42);
  if (progress < 0.56) return cloud;
  if (progress < 0.7) return transition(progress, cloud, butterfly, 0.56, 0.7);
  if (progress < 0.82) return butterfly;
  return transition(progress, butterfly, protocol, 0.82, 0.98);
}

export function ParticleSystem({ stateRef }: { stateRef: MutableRefObject<ArtifactState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isLowPower = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    // Canvas particles are an accent beneath the WebGL object, not its primary detail.
    // Keeping this bounded prevents a second full-resolution particle renderer.
    const points: Point[] = Array.from({ length: isMobile ? 260 : isLowPower ? 420 : 720 }, (_, index) => {
      const seed = (index * 0.61803398875) % 1;
      return {
        seed,
        angle: seed * Math.PI * 12,
        radius: Math.sqrt((index * 0.38196601125) % 1),
        drift: (seed - 0.5) * 0.45,
      };
    });
    let frame = 0;
    let visible = !document.hidden;
    let inView = true;
    let lastDraw = 0;
    let width = 0;
    let height = 0;
    const ratio = Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.25);
    const start = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    }, { threshold: 0.01 });
    intersectionObserver.observe(canvas);
    const onVisibilityChange = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || !inView || now - lastDraw < (isLowPower ? 33 : 22)) return;
      lastDraw = now;
      context.clearRect(0, 0, width, height);

      const time = (now - start) / 1000;
      const { progress, glitch, energy } = stateRef.current;
      const scale = Math.min(width, height) * 0.47;
      const centerX = width / 2;
      const centerY = height / 2;
      const cloudIntensity = progress > 0.24 && progress < 0.7 ? 1 : 0.58;

      for (const point of points) {
        const [targetX, targetY] = targetPoint(point, progress);
        const flutter = Math.sin(time * 1.4 + point.angle) * 0.012;
        const x =
          centerX +
          (targetX + flutter + point.drift * Math.sin(time * 0.8 + point.angle) * 0.12) * scale;
        const y =
          centerY + (targetY + point.drift * Math.cos(time * 0.9 + point.angle) * 0.08) * scale;
        const tear = glitch * (Math.sin(point.angle * 9 + time * 35) > 0.7 ? 11 : 0);
        const hue = 192 + point.seed * 85;
        const alpha = (0.16 + ((point.seed * 11) % 1) * 0.42) * cloudIntensity;
        const size = 0.45 + point.seed * 1.15 + energy * 0.5;

        context.fillStyle = `hsla(${hue}, 100%, 72%, ${alpha})`;
        context.fillRect(x + tear, y, size, size);
        if (point.seed > 0.82 && cloudIntensity > 0.7) {
          context.fillStyle = `hsla(${hue}, 100%, 72%, ${alpha * 0.15})`;
          context.fillRect(x - point.drift * 30, y + point.drift * 14, size * 0.75, size * 0.75);
        }
      }
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [stateRef]);

  return <canvas ref={canvasRef} className="artifact-particles" aria-hidden="true" />;
}
