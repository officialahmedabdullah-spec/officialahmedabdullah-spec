import { useRef } from "react";
import { ticker } from "@/data/portfolioData";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./Ticker.module.css";

/* A strip of services across the workspace. It drifts on its own and
   speeds up — or reverses — with the speed and direction of your scroll. */
export default function Ticker() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const loop = gsap.to(`.${styles.track}`, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      let direction = 1;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          direction = self.direction;
          const boost = Math.min(6, 1 + Math.abs(self.getVelocity()) / 400);
          gsap.to(loop, { timeScale: boost * direction, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, overwrite: false });
        },
      });
    },
    { scope: ref }
  );

  const row = (copy) => (
    <div className={styles.row} key={copy} aria-hidden={copy > 0 || undefined}>
      {ticker.map((item) => (
        <span className={styles.item} key={item}>
          {item}
          <Icon name="spark" size={16} className={styles.mark} />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={styles.ticker}>
      <p className="sr-only">Services: {ticker.join(", ")}</p>
      <div className={styles.track} aria-hidden="true">
        {[0, 1].map(row)}
      </div>
    </div>
  );
}
