import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSound } from "@/context/SoundContext";
import { t } from "@/i18n";
import { gsap } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import styles from "./EasterEgg.module.css";

// brand + process inks
const INKS = ["#c1ee04", "#ff6d00", "#7c1034", "#fff2e2", "#00a3e0", "#e4007c"];

// each press says something (text in strings.js → egg.lines), in a colour
// that reads on the ink footer
const LINE_COLORS = ["var(--art)", "#c1ee04", "#ff6d00", "#ff5ab4", "#c1ee04"];

// how hard each press splashes: [drops, power]
const PRESSES = [null, [10, 0.8], [18, 1], [28, 1.2], [46, 1.6]];
const FINALE = 4;

const SVG = "http://www.w3.org/2000/svg";
const random = gsap.utils.random;

function circle(parent, x, y, r, fill) {
  const c = document.createElementNS(SVG, "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", r);
  c.setAttribute("fill", fill);
  parent.appendChild(c);
  return c;
}

/* Paint that lands on the "glass": a splat, a few satellite droplets and a
   drip that runs down. The goo filter melts them into one liquid shape. */
function splat(layer, x, y, r, color) {
  const g = document.createElementNS(SVG, "g");
  layer.appendChild(g);
  const main = circle(g, x, y, r, color);
  const satellites = Array.from({ length: Math.round(random(2, 4)) }, () => {
    const angle = random(0, Math.PI * 2);
    const distance = r * random(1.2, 1.9);
    return circle(g, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, r * random(0.18, 0.38), color);
  });
  const drip = circle(g, x + random(-r * 0.4, r * 0.4), y + r * 0.4, r * random(0.3, 0.45), color);

  gsap.from(main, { scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2.6)" });
  gsap.from(satellites, { scale: 0, transformOrigin: "50% 50%", duration: 0.3, delay: 0.05, stagger: 0.03, ease: "back.out(3)" });
  gsap.to(drip, { y: random(50, 170), duration: random(1.4, 2.4), ease: "power2.in" });
  gsap.to(g, { opacity: 0, delay: random(1.8, 2.8), duration: 0.9, onComplete: () => g.remove() });
}

/* Drops fly out of (x, y) under gravity, then splat where they stop. */
function burst(drops, splats, x, y, count, power) {
  for (let i = 0; i < count; i++) {
    const color = INKS[Math.floor(random(0, INKS.length))];
    const r = random(5, 12) * (0.8 + power * 0.3);
    const drop = circle(drops, x, y, r, color);
    gsap.fromTo(drop, { scale: 0.3, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25, ease: "back.out(3)" });
    gsap.to(drop, {
      physics2D: { velocity: random(360, 760) * power, angle: random(-168, -12), gravity: 1500 },
      duration: random(0.6, 1.25),
      onComplete: () => {
        const px = x + gsap.getProperty(drop, "x");
        const py = y + gsap.getProperty(drop, "y");
        drop.remove();
        splat(splats, px, py, r * random(1.4, 2.6), color);
      },
    });
  }
}

/**
 * "Don't press this" — every press builds ink pressure and splashes more
 * liquid paint; the fourth floods the screen. Anticipation (the pressure
 * meter), payoff (the splash), and a delight near the end (Peak–End rule).
 */
export default function EasterEgg({ compact = false }) {
  const [pokes, setPokes] = useState(0);
  const [finale, setFinale] = useState(false);
  const buttonRef = useRef(null);
  const dropsRef = useRef(null);
  const splatsRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    if (!finale) return undefined;
    const timer = setTimeout(() => setFinale(false), 2200);
    return () => clearTimeout(timer);
  }, [finale]);

  const press = () => {
    const next = pokes >= FINALE ? 1 : pokes + 1;
    setPokes(next);
    play("splash", next / FINALE);

    const button = buttonRef.current;
    if (reducedMotion()) {
      if (next === FINALE) setFinale(true);
      return;
    }

    // squash on press, wobble back like a water balloon
    gsap
      .timeline()
      .to(button, { scaleX: 1.18, scaleY: 0.78, duration: 0.12, ease: "power2.out" })
      .to(button, { scaleX: 1, scaleY: 1, duration: 0.9, ease: "elastic.out(1.3, 0.25)" });

    const rect = button.getBoundingClientRect();
    const [count, power] = PRESSES[next];
    burst(dropsRef.current, splatsRef.current, rect.left + rect.width / 2, rect.top + rect.height / 2, count, power);

    if (next === FINALE) {
      setFinale(true);
      // more paint from all over the screen
      for (let i = 0; i < 4; i++) {
        gsap.delayedCall(0.15 + i * 0.14, () => {
          burst(dropsRef.current, splatsRef.current, random(0.1, 0.9) * innerWidth, random(0.3, 0.9) * innerHeight, 18, 1.15);
          play("splash", 0.4);
        });
      }
    }
  };

  const line = { text: t("egg.lines")[pokes], color: LINE_COLORS[pokes] };
  // the small version stays quiet until someone actually presses it
  const showLine = !compact || pokes > 0;

  return (
    <div className={cx(styles.egg, compact && styles.compact)}>
      <div className={styles.stage}>
        <button ref={buttonRef} type="button" className={styles.button} onClick={press} data-cursor="drag" data-cursor-label={t("egg.cursor")}>
          {t("egg.button")}
        </button>

        <div className={styles.meter} aria-hidden="true">
          {Array.from({ length: FINALE }, (_, i) => (
            <i key={i} className={cx(styles.cell, i < pokes && styles.full)} style={{ "--fill": INKS[i] }} />
          ))}
          <span className="mono">{t("egg.meter")}</span>
        </div>
      </div>

      <div className={styles.messageBox} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {showLine && (
            <motion.p
              key={pokes}
              className={styles.message}
              style={{ color: line.color }}
              initial={{ opacity: 0, y: 26, rotate: -3, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 16 } }}
              exit={{ opacity: 0, y: -14, transition: { duration: 0.15 } }}
            >
              {line.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {createPortal(
        <>
          <svg className={styles.layer} aria-hidden="true">
            <defs>
              <filter id="ink-goo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g ref={splatsRef} filter="url(#ink-goo)" />
            <g ref={dropsRef} filter="url(#ink-goo)" />
          </svg>
          <AnimatePresence>
            {finale && (
              <motion.p
                className={styles.finale}
                role="status"
                initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -4, transition: { type: "spring", stiffness: 300, damping: 12 } }}
                exit={{ opacity: 0, scale: 1.25, filter: "blur(12px)", transition: { duration: 0.45 } }}
              >
                <span className={styles.finaleWord}>{t("egg.splash")}</span>
                <span className={styles.finaleSub}>{t("egg.splashSub")}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
