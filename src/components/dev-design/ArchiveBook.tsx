import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./cinematic/hooks/useReducedMotion";

const BOOK_ASSET = "/assets/book/";

export function ArchiveBook() {
  const chamberRef = useRef<HTMLButtonElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<HTMLImageElement>(null);
  const closedAngleRef = useRef<HTMLImageElement>(null);
  const halfOpenRef = useRef<HTMLImageElement>(null);
  const pageFlipRef = useRef<HTMLImageElement>(null);
  const energyRef = useRef<HTMLImageElement>(null);
  const openRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLImageElement>(null);
  const hologramRef = useRef<HTMLImageElement>(null);
  const stateRef = useRef<"dormant" | "opening" | "open" | "closing">("dormant");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const chamber = chamberRef.current;
    const book = bookRef.current;
    const closed = closedRef.current;
    const closedAngle = closedAngleRef.current;
    const halfOpen = halfOpenRef.current;
    const pageFlip = pageFlipRef.current;
    const energy = energyRef.current;
    const open = openRef.current;
    const glow = glowRef.current;
    const hologram = hologramRef.current;

    if (
      !chamber ||
      !book ||
      !closed ||
      !closedAngle ||
      !halfOpen ||
      !pageFlip ||
      !energy ||
      !open ||
      !glow ||
      !hologram
    ) {
      return;
    }

    let corruptionTimer: number | undefined;
    const stopCorruption = () => {
      if (corruptionTimer !== undefined) {
        window.clearTimeout(corruptionTimer);
        corruptionTimer = undefined;
      }
    };
    const scheduleCorruption = () => {
      corruptionTimer = window.setTimeout(
        () => {
          if (stateRef.current === "open" && !document.hidden) {
            gsap
              .timeline()
              .to(book, { x: 1.5, duration: 0.05, ease: "steps(2)" })
              .to(book, { x: -1, duration: 0.04, ease: "steps(2)" })
              .to(book, { x: 0, duration: 0.05, ease: "steps(2)" });
            gsap.fromTo(
              hologram,
              { opacity: 0.9 },
              { opacity: 0.58, duration: 0.12, ease: "steps(2)" },
            );
          }
          scheduleCorruption();
        },
        10000 + Math.random() * 10000,
      );
    };

    let playSequence = () => {};
    const ctx = gsap.context(() => {
      gsap.set([closedAngle, halfOpen, pageFlip, energy, open, glow, hologram], { autoAlpha: 0 });

      if (reducedMotion) {
        playSequence = () => {
          const opening = stateRef.current === "dormant";
          stateRef.current = opening ? "open" : "dormant";
          chamber.dataset.archiveState = stateRef.current;
          gsap.set([closedAngle, halfOpen, pageFlip, energy], { autoAlpha: 0 });
          gsap.set(closed, { autoAlpha: opening ? 0 : 1 });
          gsap.set([open, glow, hologram], { autoAlpha: opening ? 1 : 0 });
        };
        return;
      }

      playSequence = () => {
        const isOpening = stateRef.current === "dormant";
        if (!isOpening && stateRef.current !== "open") return;

        stateRef.current = isOpening ? "opening" : "closing";
        chamber.disabled = true;
        chamber.dataset.archiveState = stateRef.current;

        if (!isOpening) {
          stopCorruption();
          gsap
            .timeline({
              defaults: { ease: "power3.inOut" },
              onComplete: () => {
                stateRef.current = "dormant";
                chamber.dataset.archiveState = "dormant";
                chamber.disabled = false;
              },
            })
            .to(hologram, { autoAlpha: 0, duration: 0.14 })
            .to(glow, { autoAlpha: 0, duration: 0.14 }, 0)
            .to(energy, { autoAlpha: 0.42, duration: 0.14 }, 0.04)
            .to(open, { autoAlpha: 0, scale: 0.99, duration: 0.18 }, 0.12)
            .to(pageFlip, { autoAlpha: 1, scale: 1.01, duration: 0.16 }, 0.17)
            .to(energy, { autoAlpha: 0, duration: 0.12 }, 0.25)
            .to(pageFlip, { autoAlpha: 0, duration: 0.14 }, 0.36)
            .to(halfOpen, { autoAlpha: 1, scale: 1.005, duration: 0.16 }, 0.36)
            .to(halfOpen, { autoAlpha: 0, duration: 0.14 }, 0.55)
            .to(closedAngle, { autoAlpha: 1, scale: 1, duration: 0.15 }, 0.55)
            .to(closedAngle, { autoAlpha: 0, duration: 0.11 }, 0.71)
            .to(closed, { autoAlpha: 1, scale: 1, duration: 0.18 }, 0.71);
          return;
        }

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              stateRef.current = "open";
              chamber.dataset.archiveState = "open";
              chamber.disabled = false;
              scheduleCorruption();
            },
          })
          .to(closed, { autoAlpha: 0, scale: 0.99, duration: 0.14 }, 0.08)
          .to(closedAngle, { autoAlpha: 1, scale: 1.005, duration: 0.14 }, 0.1)
          .to(closedAngle, { autoAlpha: 0, duration: 0.1 }, 0.26)
          .to(halfOpen, { autoAlpha: 1, scale: 1.01, duration: 0.2 }, 0.26)
          .to(halfOpen, { autoAlpha: 0, duration: 0.14 }, 0.52)
          .to(pageFlip, { autoAlpha: 1, scale: 1.015, duration: 0.18 }, 0.5)
          .to(energy, { autoAlpha: 0.55, scale: 1.03, duration: 0.24 }, 0.62)
          .to(pageFlip, { autoAlpha: 0, duration: 0.14 }, 0.68)
          .to(open, { autoAlpha: 1, scale: 1, duration: 0.28 }, 0.72)
          .to(glow, { autoAlpha: 0.58, duration: 0.25 }, 0.8)
          .to(hologram, { autoAlpha: 0.58, duration: 0.3 }, 0.88)
          .to(energy, { autoAlpha: 0.22, duration: 0.28 }, 0.86);
      };
    }, chamber);

    const rotateX = gsap.quickTo(book, "rotateX", { duration: 0.8, ease: "power2.out" });
    const rotateY = gsap.quickTo(book, "rotateY", { duration: 0.8, ease: "power2.out" });
    const onMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const rect = chamber.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      rotateX(y * -4);
      rotateY(x * 4);
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    chamber.addEventListener("pointermove", onMove);
    chamber.addEventListener("pointerleave", onLeave);
    chamber.addEventListener("click", playSequence);
    return () => {
      chamber.removeEventListener("pointermove", onMove);
      chamber.removeEventListener("pointerleave", onLeave);
      chamber.removeEventListener("click", playSequence);
      stopCorruption();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <button
      ref={chamberRef}
      type="button"
      className="archive-book"
      data-archive-state="dormant"
      aria-label="Open recovered DEV DESIGN archive artifact"
      title="Open archive artifact"
    >
      <div className="archive-book__dust" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div ref={bookRef} className="archive-book__object">
        <img
          ref={closedRef}
          className="archive-book__frame"
          src={`${BOOK_ASSET}book_closed.png`}
          alt=""
        />
        <img
          ref={closedAngleRef}
          className="archive-book__frame"
          src={`${BOOK_ASSET}book_closed_angle.png`}
          alt=""
        />
        <img
          ref={halfOpenRef}
          className="archive-book__frame"
          src={`${BOOK_ASSET}book_half_open.png`}
          alt=""
        />
        <img
          ref={pageFlipRef}
          className="archive-book__frame"
          src={`${BOOK_ASSET}book_page_flip.png`}
          alt=""
        />
        <img
          ref={energyRef}
          className="archive-book__frame archive-book__energy"
          src={`${BOOK_ASSET}book_energy.png`}
          alt=""
        />
        <img
          ref={openRef}
          className="archive-book__frame"
          src={`${BOOK_ASSET}book_open.png`}
          alt=""
        />
        <img
          ref={glowRef}
          className="archive-book__frame archive-book__glow"
          src={`${BOOK_ASSET}book_open_glow.png`}
          alt=""
        />
        <img
          ref={hologramRef}
          className="archive-book__frame archive-book__hologram"
          src={`${BOOK_ASSET}book_hologram.png`}
          alt=""
        />
      </div>
      <div className="archive-book__hud text-mono" aria-hidden="true">
        <span>DEV DESIGN</span>
        <span>ENTRY 001</span>
        <span>CLASSIFIED</span>
      </div>
    </button>
  );
}
