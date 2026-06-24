import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnergyGlow } from "./effects/EnergyGlow";
import { ParticleSystem } from "./effects/ParticleSystem";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { ArtifactState } from "./types";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  // Higher fidelity for the AI artifact, while the low-power tier remains bounded.
  gridResolution: 260,
  basePath: "/assets/hero/",
  assets: {
    face: [
      "Face/ai_01_awaken.webp",
      "Face/ai_02_left.webp",
      "Face/ai_03_right.webp",
      "Face/ai_04_energy.webp",
      "Face/ai_05_glitch.webp",
      "Face/ai_06_break.png",
    ],
    butterfly: [
      "Butterfly/butterfly_01_dust.webp",
      "Butterfly/butterfly_02_veins.webp",
      "Butterfly/butterfly_03_frame.webp",
      "Butterfly/butterfly_04_closed.png",
      "Butterfly/butterfly_05_half_left.webp",
      "Butterfly/butterfly_06_half_right.webp",
      "Butterfly/butterfly_07_open.webp",
      "Butterfly/butterfly_08_fly_left.webp",
      "Butterfly/butterfly_09_fly_right.webp",
      "Butterfly/butterfly_10_corrupt.webp",
    ],
    logo: [
      "Logo/d_01_blueprint.webp",
      "Logo/d_02_structure.webp",
      "Logo/d_03_core.webp",
      "Logo/d_04_final.webp",
    ],
  },
};

const vertexShader = `
  uniform float uTime;
  uniform float uDispersion;
  uniform float uStage;
  uniform float uGlitchIntensity;
  
  attribute vec2 aUv;
  attribute vec3 aRandom;
  
  varying vec2 vUv;
  varying vec3 vRandom; // Passing random values to color the galaxy cloud

  void main() {
      vUv = aUv;
      vRandom = aRandom; 
      
      vec3 faceLayout = vec3((aUv.x - 0.5) * 2.8, (aUv.y - 0.5) * 2.8, 0.0);
      vec3 bflyLayout = vec3((aUv.x - 0.5) * 2.8, (aUv.y - 0.5) * 2.8, 0.0);
      float flapWarp = sin(uTime * 14.0) * 0.45;
      bflyLayout.z = abs(bflyLayout.x) * flapWarp; 
      vec3 logoLayout = vec3((aUv.x - 0.5) * 2.8, (aUv.y - 0.5) * 2.8, 0.0);

      // Wider cloud radius to make the galaxy effect more massive
      float theta = aRandom.x * 6.28318 + uTime * 0.4;
      float radius = 0.15 + aRandom.y * 1.3; 
      vec3 cloudLayout = vec3(cos(theta) * radius, sin(theta) * radius * 0.5, aRandom.z * 0.6);

      vec3 basePos;
      if (uStage < 0.5) {
          basePos = faceLayout;
      } else if (uStage < 1.5) {
          basePos = bflyLayout;
      } else {
          basePos = logoLayout;
      }

      vec3 mixedPos = mix(basePos, cloudLayout, uDispersion);

      // Obvious, violently tearing mechanical glitch
      if (uGlitchIntensity > 0.1) {
          float scanlineNoise = fract(sin(floor(mixedPos.y * 30.0) + uTime * 10.0) * 43758.5453);
          if (scanlineNoise < uGlitchIntensity) {
              // Multiplied tear distance by uGlitchIntensity to make it aggressively obvious
              mixedPos.x += sin(uTime * 50.0) * (0.35 * uGlitchIntensity);
          }
      }

      mixedPos.y += sin(uTime * 1.2 + mixedPos.x) * 0.015;

      vec4 mvPosition = modelViewMatrix * vec4(mixedPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (6.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexFace;
  uniform sampler2D uTexButterfly;
  uniform sampler2D uTexLogo;
  uniform float uDispersion;
  uniform float uStage;
  uniform float uGlitchIntensity;
  
  varying vec2 vUv;
  varying vec3 vRandom;

  void main() {
      if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;

      vec4 baseColor;
      if (uStage < 0.5) {
          baseColor = texture2D(uTexFace, vUv);
      } else if (uStage < 1.5) {
          baseColor = texture2D(uTexButterfly, vUv);
      } else {
          baseColor = texture2D(uTexLogo, vUv);
      }

      if (baseColor.r > 0.92 && baseColor.g > 0.92 && baseColor.b > 0.92) baseColor.a = 0.0;
      if (baseColor.a < 0.1) discard;

      vec4 neonCloud;
      
      if (uStage < 0.5) {
          // GALAXY EFFECT: Mix Hot Pink, Cyan, and Deep Purple based on the particle's random seed
          vec3 col1 = vec3(1.0, 0.1, 0.7); // Hot Pink
          vec3 col2 = vec3(0.0, 0.8, 1.0); // Cyan
          vec3 col3 = vec3(0.4, 0.0, 1.0); // Deep Purple
          vec3 galaxyColor = mix(mix(col1, col2, vRandom.x), col3, vRandom.y);
          neonCloud = vec4(galaxyColor, baseColor.a);
      } else if (uStage < 1.5) {
          neonCloud = vec4(0.0, 0.55, 1.0, baseColor.a);
      } else {
          neonCloud = vec4(0.0, 0.8, 1.0, baseColor.a);
      }

      vec4 finalColor = mix(baseColor, neonCloud, uDispersion);
      finalColor.rgb *= 1.6; 

      if (uGlitchIntensity > 0.5) {
          finalColor.rgb += vec3(0.2, 0.0, 0.3); // Mechanical RGB shift
      }

      gl_FragColor = finalColor;
  }
`;

export function HeroArtifactSequence({
  scrollContainerRef,
  scrollTriggerRef,
}: {
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  scrollTriggerRef?: RefObject<HTMLDivElement | null>;
}) {
  const chamberRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<ArtifactState>({ progress: 0, glitch: 0, energy: 0.35 });
  const reducedMotion = useReducedMotion();

  const particlesRef = useRef<THREE.Points | null>(null);

  const uniformsRef = useRef({
    uTime: { value: 0.0 },
    uScrollProgress: { value: 0.0 },
    uStage: { value: 0.0 },
    uDispersion: { value: 0.0 },
    uGlitchIntensity: { value: 0.0 },
    uFaceFrame: { value: 0 },
    uBflyFrame: { value: 0 },
    uLogoFrame: { value: 0 },
    uTexFace: { value: null as THREE.Texture | null },
    uTexButterfly: { value: null as THREE.Texture | null },
    uTexLogo: { value: null as THREE.Texture | null },
  });

  const texturesRef = useRef({
    face: [] as Array<THREE.Texture | null>,
    butterfly: [] as Array<THREE.Texture | null>,
    logo: [] as Array<THREE.Texture | null>,
  });

  useEffect(() => {
    const chamber = chamberRef.current;
    const mountPoint = mountRef.current;
    const hero = document.querySelector<HTMLElement>("[data-hero-sequence]");
    const customScroller = scrollContainerRef?.current;
    const customTrigger = scrollTriggerRef?.current;

    if (!chamber || !mountPoint || (!hero && !customTrigger)) return;

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.8;
    const isMobile = Boolean(customScroller) || window.matchMedia("(max-width: 767px)").matches;
    const isLowPower =
      isMobile ||
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1 : 1.2));
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.maxWidth = "100%";
    renderer.domElement.style.maxHeight = "100%";
    renderer.domElement.style.objectFit = "contain";

    mountPoint.appendChild(renderer.domElement);
    const loadTextures = async () => {
      const loader = new THREE.TextureLoader();
      const loadTexture = (path: string) =>
        new Promise<THREE.Texture | null>((resolve) => {
          loader.load(
            CONFIG.basePath + path,
            (tex) => {
              tex.minFilter = tex.magFilter = THREE.LinearFilter;
              tex.generateMipmaps = false;
              resolve(tex);
            },
            undefined,
            () => resolve(null),
          );
        });
      const loadSet = async (key: keyof typeof texturesRef.current, paths: string[]) => {
        const result = await Promise.all(paths.map(loadTexture));
        texturesRef.current[key] = result;
        return result;
      };

      // Decode the three visible entry frames first. The remaining sequence is
      // fetched during idle time instead of competing with the first paint.
      const [face, butterfly, logo] = await Promise.all([
        loadTexture(CONFIG.assets.face[0]),
        loadTexture(CONFIG.assets.butterfly[0]),
        loadTexture(CONFIG.assets.logo[0]),
      ]);
      texturesRef.current.face = [face];
      texturesRef.current.butterfly = [butterfly];
      texturesRef.current.logo = [logo];
      uniformsRef.current.uTexFace.value = face;
      uniformsRef.current.uTexButterfly.value = butterfly;
      uniformsRef.current.uTexLogo.value = logo;

      buildPixelGrid();
      const preload = () => {
        void Promise.all([
          loadSet("face", CONFIG.assets.face),
          loadSet("butterfly", CONFIG.assets.butterfly),
          loadSet("logo", CONFIG.assets.logo),
        ]);
      };
      window.setTimeout(preload, 1500);
    };

    const buildPixelGrid = () => {
      const geometry = new THREE.BufferGeometry();
      const resolution = isMobile ? 190 : isLowPower ? 220 : CONFIG.gridResolution;
      const total = resolution * resolution;

      const positions = new Float32Array(total * 3);
      const uvs = new Float32Array(total * 2);
      const randoms = new Float32Array(total * 3);

      let i = 0;
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const u = x / (resolution - 1);
          const v = 1.0 - y / (resolution - 1);

          positions[i * 3] = (u - 0.5) * 2.8;
          positions[i * 3 + 1] = (v - 0.5) * 2.8;
          positions[i * 3 + 2] = 0.0;

          uvs[i * 2] = u;
          uvs[i * 2 + 1] = v;

          randoms[i * 3] = Math.random();
          randoms[i * 3 + 1] = Math.random();
          randoms[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

          i++;
        }
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aUv", new THREE.BufferAttribute(uvs, 2));
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsRef.current,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;
    };

    loadTextures();

    let chamberBounds = chamber.getBoundingClientRect();
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      chamberBounds = chamber.getBoundingClientRect();
    });
    resizeObserver.observe(mountPoint);

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        uniformsRef.current.uStage.value = 2.0;
        uniformsRef.current.uLogoFrame.value = 3;
        return;
      }

      gsap.to(mountPoint, {
        y: -6,
        rotateZ: 0.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: customTrigger ?? (isMobile ? chamber : hero),
          scroller: customScroller,
          start: "top top",
          end: customScroller ? "bottom bottom" : isMobile ? "+=1100%" : "+=1800%",
          pin: customScroller ? false : isMobile ? chamber : true,
          pinSpacing: !customScroller,
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            uniformsRef.current.uScrollProgress.value = self.progress;
            stateRef.current.progress = self.progress;
          },
        },
      });

      const u = uniformsRef.current;
      let t = 0;
      const holdDur = 1.5;
      const burstDur = 0.8;

      // ----------------------------------------------------
      // STAGE 1: THE AI FACE (Pixel Burst + Obvious Glitch)
      // ----------------------------------------------------
      timeline.set(u.uStage, { value: 0.0 }, t);

      for (let i = 1; i <= 5; i++) {
        t += holdDur;
        // Simultaneous violent glitch and pixel burst
        timeline.to(u.uDispersion, { value: 0.8, duration: burstDur, ease: "power2.in" }, t);
        timeline.to(u.uGlitchIntensity, { value: 0.9, duration: burstDur }, t);

        // Swap image while destroyed
        timeline.set(u.uFaceFrame, { value: i }, t + burstDur);

        // Reform into next frame
        timeline.to(
          u.uDispersion,
          { value: 0.0, duration: burstDur, ease: "power2.out" },
          t + burstDur,
        );
        timeline.to(u.uGlitchIntensity, { value: 0.0, duration: burstDur }, t + burstDur);
        t += burstDur * 2;
      }

      // ----------------------------------------------------
      // MAJOR TRANSITION: Face -> Butterfly (Massive Galaxy Cloud)
      // ----------------------------------------------------
      t += holdDur;
      const majorCloudDur = 5.0; // Lengthened significantly so the galaxy effect isn't short

      timeline.to(u.uDispersion, { value: 1.0, duration: majorCloudDur, ease: "power1.inOut" }, t);
      timeline.to(
        () => particlesRef.current?.rotation || {},
        { y: 0.5, duration: majorCloudDur },
        t,
      );

      timeline.set(u.uStage, { value: 1.0 }, t + majorCloudDur);
      timeline.set(u.uBflyFrame, { value: 0 }, t + majorCloudDur);

      timeline.to(
        u.uDispersion,
        { value: 0.0, duration: majorCloudDur, ease: "power1.inOut" },
        t + majorCloudDur,
      );
      t += majorCloudDur * 2;

      // ----------------------------------------------------
      // STAGE 2: THE BUTTERFLY (Crisp Mechanical Glitches Only)
      // ----------------------------------------------------
      for (let i = 1; i <= 9; i++) {
        t += holdDur;
        timeline.to(u.uGlitchIntensity, { value: 0.6, duration: 0.1 }, t);
        timeline.set(u.uBflyFrame, { value: i }, t + 0.1);
        timeline.to(u.uGlitchIntensity, { value: 0.0, duration: 0.1 }, t + 0.1);
        t += 0.2;
      }

      // ----------------------------------------------------
      // MAJOR TRANSITION: Butterfly -> Logo (Corrupt Glitch & Cloud)
      // ----------------------------------------------------
      t += holdDur;
      timeline.to(u.uGlitchIntensity, { value: 0.9, duration: 1.0 }, t);

      timeline.to(u.uDispersion, { value: 1.0, duration: 3.0, ease: "power2.inOut" }, t + 1.0);
      timeline.to(() => particlesRef.current?.rotation || {}, { y: 0.0, duration: 3.0 }, t + 1.0);

      timeline.set(u.uStage, { value: 2.0 }, t + 4.0);
      timeline.set(u.uLogoFrame, { value: 0 }, t + 4.0);

      timeline.to(u.uGlitchIntensity, { value: 0.0, duration: 1.0 }, t + 4.0);
      timeline.to(u.uDispersion, { value: 0.0, duration: 2.5, ease: "power2.inOut" }, t + 4.0);
      t += 6.5;

      // ----------------------------------------------------
      // STAGE 3: THE D PROTOCOL (Crisp Mechanical Glitches)
      // ----------------------------------------------------
      for (let i = 1; i <= 3; i++) {
        t += holdDur;
        timeline.to(u.uGlitchIntensity, { value: 0.6, duration: 0.1 }, t);
        timeline.set(u.uLogoFrame, { value: i }, t + 0.1);
        timeline.to(u.uGlitchIntensity, { value: 0.0, duration: 0.1 }, t + 0.1);
        t += 0.2;
      }

      timeline.to(glowRef.current, { autoAlpha: 0.4, scale: 1.05, duration: 2 }, t);
    }, chamber);

    let reqId = 0;
    let pageVisible = !document.hidden;
    let chamberVisible = true;
    let lastRender = 0;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        chamberVisible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(chamber);
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
    };
    const updateChamberBounds = () => {
      chamberBounds = chamber.getBoundingClientRect();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("scroll", updateChamberBounds, { passive: true });
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!pageVisible || !chamberVisible) return;
      const now = performance.now();
      if (isLowPower && now - lastRender < 33) return;
      lastRender = now;
      const delta = clock.getDelta();

      const u = uniformsRef.current;
      u.uTime.value += delta;

      const t = texturesRef.current;

      if (u.uStage.value < 0.5 && t.face.length > 0) {
        u.uTexFace.value = t.face[u.uFaceFrame.value] ?? t.face[0];
      } else if (u.uStage.value < 1.5 && t.butterfly.length > 0) {
        u.uTexButterfly.value = t.butterfly[u.uBflyFrame.value] ?? t.butterfly[0];
      } else if (t.logo.length > 0) {
        u.uTexLogo.value = t.logo[u.uLogoFrame.value] ?? t.logo[0];
      }

      renderer.render(scene, camera);
    };
    animate();

    // quickTo reuses one tween per axis rather than allocating a new GSAP tween
    // for every pointer event over the artifact.
    const rotateX = gsap.quickTo(mountPoint, "rotateX", { duration: 1.2, ease: "power2.out" });
    const rotateY = gsap.quickTo(mountPoint, "rotateY", { duration: 1.2, ease: "power2.out" });
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX - chamberBounds.left) / chamberBounds.width - 0.5;
      const y = (event.clientY - chamberBounds.top) / chamberBounds.height - 0.5;

      rotateX(y * -4);
      rotateY(x * 6);
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    chamber.addEventListener("pointermove", onMove, { passive: true });
    chamber.addEventListener("pointerleave", onLeave);

    return () => {
      chamber.removeEventListener("pointermove", onMove);
      chamber.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", updateChamberBounds);

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }

      renderer.dispose();
      Object.values(texturesRef.current)
        .flat()
        .forEach((texture) => texture?.dispose());
      ctx.revert();

      if (mountPoint.contains(renderer.domElement)) {
        mountPoint.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={chamberRef}
      className="artifact-chamber cinematic-artifact"
      aria-label="DEV DESIGN transformation artifact"
    >
      <div className="artifact-grid" aria-hidden="true" />
      <div className="artifact-vignette" aria-hidden="true" />

      <EnergyGlow glowRef={glowRef} />
      <ParticleSystem stateRef={stateRef} />

      <div
        ref={mountRef}
        className="artifact-object webgl-canvas-target"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "flex-start",
          transform: "translateX(-6%)",
          alignItems: "center",
        }}
      />

      <div className="artifact-corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="artifact-label artifact-label--top">ARCHIVE / LIVING OBJECT</div>
      <div className="artifact-label artifact-label--bottom">
        SCROLL TO DECRYPT <span>↓</span>
      </div>
    </div>
  );
}
