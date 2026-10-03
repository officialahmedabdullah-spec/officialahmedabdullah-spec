import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, pad, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import RevealText from "@/components/ui/RevealText";
import styles from "./Steps.module.css";

/* Four numbered steps on a line that draws itself as you scroll. */
export default function Steps({ id = "process", file = "process.psd", eyebrow = "The way it runs", title, steps }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(`.${styles.line}`, {
        scaleX: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: true },
      });
      gsap.from(`.${styles.step}`, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        scrollTrigger: { trigger: ref.current, start: "top 80%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <Artboard id={id} name="Process" file={file}>
      <p className={cx("eyebrow", "mono")}>{eyebrow}</p>
      <RevealText className="h-lg">{title}</RevealText>
      <div ref={ref} className={styles.wrap}>
        <span className={styles.line} aria-hidden="true" />
        <ol className={styles.steps}>
          {steps.map(([name, text], i) => (
            <li key={name} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={cx(styles.n, "mono")}>{pad(i + 1)}</span>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.text}>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Artboard>
  );
}
