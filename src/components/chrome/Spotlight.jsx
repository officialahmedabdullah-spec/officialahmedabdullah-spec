import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { finePointer, reducedMotion } from "@/lib/utils";
import styles from "./Workspace.module.css";

/* A soft light on the workspace that trails the pointer, behind the artboards. */
export default function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!finePointer() || reducedMotion()) return undefined;
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" });
    const onMove = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      el.dataset.on = "true";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <span ref={ref} className={styles.spot} aria-hidden="true" />;
}
