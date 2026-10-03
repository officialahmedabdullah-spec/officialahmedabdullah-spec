import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import styles from "./BeforeAfter.module.css";

/**
 * Drag to compare two images. A real range input sits over the whole
 * image, so it works with mouse, touch and arrow keys. When it first
 * scrolls into view the handle nudges left and springs back — a hint
 * that it can be moved (signifier).
 */
export default function BeforeAfter({ before, after, labels = ["Before", "After"], alt, ratio = "16 / 10", className }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(50);
  const id = useId();

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const state = { v: 50 };
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } })
        .to(state, { v: 22, duration: 0.7, ease: "power2.inOut", onUpdate: () => setPos(state.v) })
        .to(state, { v: 50, duration: 1.2, ease: "elastic.out(1, 0.5)", onUpdate: () => setPos(state.v) });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cx(styles.compare, className)} style={{ aspectRatio: ratio, "--pos": `${pos}%` }} data-cursor="drag" data-cursor-label="Drag">
      <img className={styles.img} src={after} alt={alt ? `${alt} — ${labels[1]}` : ""} loading="lazy" decoding="async" />
      <img className={cx(styles.img, styles.before)} src={before} alt={alt ? `${alt} — ${labels[0]}` : ""} loading="lazy" decoding="async" />
      <label className="sr-only" htmlFor={id}>
        Compare {labels[0]} and {labels[1]}
      </label>
      <input
        id={id}
        className={styles.range}
        type="range"
        min="0"
        max="100"
        step="0.5"
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
      />
      <span className={styles.handle} aria-hidden="true">
        <span className={styles.knob}>‹ ›</span>
      </span>
      <span className={cx(styles.label, styles.left, "mono")}>{labels[0]}</span>
      <span className={cx(styles.label, styles.right, "mono")}>{labels[1]}</span>
    </div>
  );
}
