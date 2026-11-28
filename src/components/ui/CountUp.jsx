import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import styles from "./CountUp.module.css";

/* A number that counts up from 0 the first time it scrolls into view.
   ink: print it as CMYK plates that misregister when its [data-cmyk-group] is hovered. */
export default function CountUp({ value, suffix = "", prefix = "", className, duration = 1.6, ink = false }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const number = ref.current.querySelector("[data-n]");
      const shown = number.parentElement;
      const state = { v: 0 };
      number.textContent = "0";
      gsap.to(state, {
        v: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          number.textContent = Math.round(state.v);
          if (ink) shown.dataset.t = shown.textContent;
        },
      });
    },
    { scope: ref, dependencies: [value, ink] }
  );

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden="true" className={cx(ink && styles.ink)} data-t={ink ? `${prefix}${value}${suffix}` : undefined}>
        {prefix}
        <span data-n>{value}</span>
        {suffix}
      </span>
    </span>
  );
}
