import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import styles from "./CmykImage.module.css";

const OFFSETS = [
  { x: -7, y: -4 },
  { x: 6, y: 3 },
  { x: 2, y: -6 },
];

/**
 * An image printed as three ink plates (cyan, magenta, yellow) that
 * register perfectly at rest. On hover the plates slip apart, a halftone
 * screen fades in and registration marks appear — print misregistration
 * as a hover state.
 *
 * Hover is read from the nearest [data-cmyk-group] (e.g. a whole card),
 * or the image itself.
 */
export default function CmykImage({ src, alt = "", ratio = "4 / 3", className, sizes, priority = false }) {
  const ref = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      if (reducedMotion()) return undefined;
      const plates = gsap.utils.toArray(`.${styles.plate}`, ref.current);
      const host = ref.current.closest("[data-cmyk-group]") || ref.current;

      const enter = contextSafe(() => {
        plates.forEach((plate, i) =>
          gsap.to(plate, { ...OFFSETS[i], scale: 1.04, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: true })
        );
      });
      const leave = contextSafe(() => {
        gsap.to(plates, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "expo.out", overwrite: true });
      });

      host.addEventListener("pointerenter", enter);
      host.addEventListener("pointerleave", leave);
      host.addEventListener("focusin", enter);
      host.addEventListener("focusout", leave);
      return () => {
        host.removeEventListener("pointerenter", enter);
        host.removeEventListener("pointerleave", leave);
        host.removeEventListener("focusin", enter);
        host.removeEventListener("focusout", leave);
      };
    },
    { scope: ref }
  );

  const loading = priority ? "eager" : "lazy";

  return (
    <div ref={ref} className={cx(styles.frame, className)} style={{ aspectRatio: ratio }}>
      <img className={cx(styles.plate, styles.c)} src={src} alt="" loading={loading} decoding="async" sizes={sizes} />
      <img className={cx(styles.plate, styles.m)} src={src} alt="" loading={loading} decoding="async" sizes={sizes} />
      <img className={cx(styles.plate, styles.y)} src={src} alt={alt} loading={loading} decoding="async" sizes={sizes} />
      <span className={styles.halftone} aria-hidden="true" />
      <span className={cx(styles.reg, styles.regA)} aria-hidden="true" />
      <span className={cx(styles.reg, styles.regB)} aria-hidden="true" />
      <span className={styles.inks} aria-hidden="true">
        <i style={{ background: "var(--cyan)" }} />
        <i style={{ background: "var(--magenta)" }} />
        <i style={{ background: "var(--yellow)" }} />
        <i style={{ background: "var(--ink)" }} />
      </span>
    </div>
  );
}
