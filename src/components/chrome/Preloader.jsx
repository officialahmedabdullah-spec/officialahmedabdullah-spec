import { useRef, useState } from "react";
import { useIntro } from "@/context/IntroContext";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { MARK_PATH } from "@/lib/brand";
import { gsap, useGSAP } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import styles from "./Preloader.module.css";

/* First visit of a session: a % counter while the logo strokes itself in,
   a squash-and-pop (anticipation), then the screen wipes up into the page.
   Waits for the fonts so the hero never reflows behind it. */
export default function Preloader() {
  const { ready, finish } = useIntro();
  const { stop, start } = useSmoothScroll();
  const { play } = useSound();
  const [gone, setGone] = useState(ready);
  const ref = useRef(null);
  const timeline = useRef(null);

  useGSAP(
    () => {
      if (gone) return undefined;
      // StrictMode runs this twice; the first run must not play once fonts resolve
      let alive = true;
      stop();
      const done = () => {
        start();
        finish();
        setGone(true);
      };
      if (reducedMotion()) {
        document.fonts.ready.then(() => alive && done());
        return () => {
          alive = false;
        };
      }
      const count = { v: 0 };
      const number = ref.current.querySelector("[data-count]");
      const tl = gsap.timeline({ paused: true, onComplete: done });
      // the DD outline is traced (outer shape, then both counters), fills in,
      // then the wings fold in and spring open — anticipation + follow-through
      tl.to(count, { v: 100, duration: 2, ease: "power2.inOut", onUpdate: () => (number.textContent = Math.round(count.v)) }, 0)
        .to("[data-mark]", { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0)
        .to("[data-mark]", { fillOpacity: 1, strokeOpacity: 0, duration: 0.45, ease: "none" }, 1.5)
        .to("[data-logo]", { scaleX: 0.78, duration: 0.18, ease: "power2.in" }, 2)
        .to("[data-logo]", { scaleX: 1, scale: 1.08, duration: 0.45, ease: "back.out(3)", onStart: () => play("pop") }, 2.18)
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 2.45);
      timeline.current = tl;
      document.fonts.ready.then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    },
    { scope: ref }
  );

  if (gone) return null;

  return (
    <div ref={ref} className={styles.preloader} role="status" aria-label="Loading">
      <div className={styles.box}>
        <svg className={styles.logo} viewBox="-30 -30 1470 1470" data-logo aria-hidden="true">
          <path className={styles.mark} data-mark d={MARK_PATH} pathLength="1" />
        </svg>
        <p className={styles.count} aria-hidden="true">
          <span data-count>0</span>
          <small>%</small>
        </p>
        <p className="mono">Design Dynamo · opening portfolio.psd</p>
      </div>
      <button type="button" className={styles.skip} onClick={() => timeline.current?.progress(1)}>
        Skip intro
      </button>
    </div>
  );
}
