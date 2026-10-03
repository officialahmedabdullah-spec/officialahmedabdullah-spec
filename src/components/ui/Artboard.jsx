import { useLayoutEffect, useRef } from "react";
import { useLayers } from "@/context/LayersContext";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cx, pad, reducedMotion } from "@/lib/utils";
import styles from "./Artboard.module.css";

/**
 * A section of a page, drawn as an artboard on the workspace: a file
 * label above, a paper sheet with print crop marks. It registers itself
 * with the Layers panel, which can highlight, jump to and hide it.
 *
 *   tone   paper (default) · ink · signal · clear (no sheet)
 *   pinned the section contains a pinned scroll scene — the entrance
 *          animation then avoids transforms (they would break pinning)
 */
export default function Artboard({ id, name, file, tone = "paper", pinned = false, className, sheetClassName, children }) {
  const ref = useRef(null);
  const sheetRef = useRef(null);
  const { register, hidden, setActive, layers } = useLayers();

  useLayoutEffect(() => register({ id, name, file, ref }), [id, name, file, register]);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(id),
      });
      if (reducedMotion() || tone === "clear") return;
      gsap.from(sheetRef.current, {
        ...(pinned ? {} : { y: 80 }),
        opacity: 0,
        duration: 1.2,
        scrollTrigger: { trigger: ref.current, start: "top 92%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  const index = layers.findIndex((layer) => layer.id === id);

  return (
    <section ref={ref} id={id} className={cx(styles.artboard, className)} hidden={hidden.has(id)} aria-label={name}>
      <p className={cx(styles.label, "mono")} aria-hidden="true">
        <span className={styles.n}>{pad(index + 1)}</span>
        {file}
      </p>
      <div ref={sheetRef} className={cx(styles.sheet, styles[tone], sheetClassName)} data-sheet>
        {tone !== "clear" && (
          <>
            <i className={cx(styles.crop, styles.tl)} />
            <i className={cx(styles.crop, styles.tr)} />
            <i className={cx(styles.crop, styles.bl)} />
            <i className={cx(styles.crop, styles.br)} />
          </>
        )}
        {children}
      </div>
    </section>
  );
}
