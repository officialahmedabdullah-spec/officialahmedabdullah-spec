import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cx, finePointer, reducedMotion } from "@/lib/utils";
import styles from "./Magnetic.module.css";

/* Wrapper that leans towards the pointer and springs back (follow-through).
   It moves itself, so the child keeps its own transforms (e.g. squash). */
export default function Magnetic({ strength = 0.3, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return undefined;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const onMove = (event) => {
      const r = el.getBoundingClientRect();
      xTo((event.clientX - r.left - r.width / 2) * strength);
      yTo((event.clientY - r.top - r.height / 2) * strength * 1.3);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={cx(styles.magnetic, className)}>
      {children}
    </span>
  );
}
