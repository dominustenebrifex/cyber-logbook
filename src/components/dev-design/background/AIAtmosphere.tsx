import { useEffect, useRef } from "react";
import * as THREE from "three";
// Using the relative path to bypass alias issues
import { useReducedMotion } from "../cinematic/hooks/useReducedMotion";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p); p = r * p * 2.0 + 100.0; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 pos = (vUv - 0.5) * aspect;
    vec2 mousePos = (uMouse - 0.5) * aspect;

    float stateGlitch = smoothstep(0.1, 0.3, uScroll) * smoothstep(0.5, 0.3, uScroll);
    float stateOrganic = smoothstep(0.4, 0.6, uScroll) * smoothstep(0.8, 0.6, uScroll);
    float stateStruct = smoothstep(0.75, 1.0, uScroll);

    float t = uTime * (0.015 + stateGlitch * 0.02 + stateOrganic * 0.005);

    vec2 cursorDist = pos - mousePos;
    float distToMouse = length(cursorDist);
    float mouseInfluence = exp(-distToMouse * distToMouse * 10.0); 
    
    vec2 streakWarp = uVelocity * mouseInfluence * 0.25;
    vec2 radialWarp = normalize(cursorDist + 0.0001) * mouseInfluence * 0.15;
    vec2 warpedPos = pos - streakWarp + radialWarp;

    float turbulence = mix(1.2, 2.5, stateGlitch);
    vec2 q = vec2(fbm(warpedPos * turbulence + t), fbm(warpedPos * turbulence - t + 10.0));
    vec2 r = vec2(fbm(warpedPos * 1.5 + q + t), fbm(warpedPos * 1.5 + q - t)); 
    
    if (stateStruct > 0.0) {
        float angle = atan(warpedPos.y, warpedPos.x);
        float rad = length(warpedPos);
        r += vec2(sin(angle * 3.0 - t * 2.0), cos(rad * 8.0 - t)) * stateStruct * 0.5;
    }

    float energyField = fbm(warpedPos * mix(1.2, 2.0, stateStruct) + r * 1.5) * 1.3;

    vec2 p1 = vec2(-0.7 * aspect.x, 0.5) + vec2(sin(t*1.2), cos(t*0.9))*0.15; 
    vec2 p2 = vec2(0.6 * aspect.x, 0.6) + vec2(cos(t*1.4), sin(t*1.1))*0.2;  
    vec2 p3 = vec2(-0.6 * aspect.x, -0.6) + vec2(sin(t*0.8), cos(t*1.5))*0.15;
    vec2 p4 = vec2(0.7 * aspect.x, -0.5) + vec2(cos(t*1.6), sin(t*1.3))*0.2; 
    
    float z1 = smoothstep(1.8, 0.0, length(warpedPos - p1));
    float z2 = smoothstep(2.0, 0.0, length(warpedPos - p2));
    float z3 = smoothstep(1.6, 0.0, length(warpedPos - p3));
    float z4 = smoothstep(2.2, 0.0, length(warpedPos - p4));
    
    float edgeL = smoothstep(1.2, 0.0, abs(warpedPos.x + 0.9 * aspect.x));
    float edgeR = smoothstep(1.2, 0.0, abs(warpedPos.x - 0.9 * aspect.x));

    float centerDarkness = smoothstep(0.0, 0.7, length(pos));
    
    float zoneMask = max(max(max(z1, z2), max(z3, z4)), max(edgeL, edgeR));
    float finalEnergy = energyField * zoneMask * centerDarkness;

    vec3 colCyan = vec3(0.0, 0.898, 1.0);
    vec3 colViolet = vec3(0.55, 0.15, 1.0);

    float violetDistribution = (z2 * 0.6 + z4 * 0.7) * energyField;
    violetDistribution += stateGlitch * 0.5; 
    vec3 color = mix(colCyan, colViolet, clamp(violetDistribution, 0.0, 1.0));

    float alpha = pow(finalEnergy, 1.1) * 0.7; 
    alpha += mouseInfluence * length(uVelocity) * 0.15;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.85));
  }
`;

export function AIAtmosphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    const isLowPower =
      window.matchMedia("(max-width: 767px)").matches ||
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1 : 1.2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    let frameId = 0;
    let visible = !document.hidden;
    let lastTime = performance.now();
    let lastRender = 0;
    let scrollProgress = 0;

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);
    const targetVel = new THREE.Vector2(0, 0);
    const currentVel = new THREE.Vector2(0, 0);
    let lastRawMouse = new THREE.Vector2(0.5, 0.5);
    let lastPointerTime = performance.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
      updateScrollProgress();
    };

    // Scroll position only changes on scroll. Reading layout on every shader frame
    // creates needless main-thread work while the atmosphere is otherwise idle.
    const updateScrollProgress = () => {
      const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = window.scrollY / scrollMax;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerTime);
      lastPointerTime = now;

      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;

      targetMouse.set(nx, ny);

      targetVel.set(((nx - lastRawMouse.x) / dt) * 1000, ((ny - lastRawMouse.y) / dt) * 1000);
      lastRawMouse.set(nx, ny);
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible && !reducedMotion) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(render);
      }
    };

    const render = (now: number) => {
      if (!visible) return;
      const frameInterval = isLowPower ? 33 : 1000 / 60;
      if (now - lastRender < frameInterval) {
        frameId = requestAnimationFrame(render);
        return;
      }
      lastRender = now;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      uniforms.uTime.value += dt;

      uniforms.uScroll.value = scrollProgress;

      currentMouse.lerp(targetMouse, dt * 6.0);
      currentVel.lerp(targetVel, dt * 4.0);

      if (now - lastPointerTime > 50) {
        targetVel.multiplyScalar(Math.max(0, 1 - dt * 10.0));
      }

      uniforms.uMouse.value.copy(currentMouse);
      uniforms.uVelocity.value.copy(currentVel);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    resize();
    updateScrollProgress();
    renderer.render(scene, camera);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!reducedMotion) frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scene.remove(plane);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.replaceChildren();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      // FIXED: Changed z-[-20] to z-0 so it doesn't get hidden behind the page body!
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
      aria-hidden="true"
    />
  );
}
