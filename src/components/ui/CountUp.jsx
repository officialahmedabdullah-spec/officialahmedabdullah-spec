import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";

/* A number that counts up from 0 the first time it scrolls into view. */
export default function CountUp({ value, suffix = "", prefix = "", className, duration = 1.6 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const number = ref.current.querySelector("[data-n]");
      const state = { v: 0 };
      number.textContent = "0";
      gsap.to(state, {
        v: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          number.textContent = Math.round(state.v);
        },
      });
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        <span data-n>{value}</span>
        {suffix}
      </span>
    </span>
  );
}
