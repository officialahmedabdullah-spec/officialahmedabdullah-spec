import { useRef } from "react";
import { statement } from "@/data/portfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import CountUp from "@/components/ui/CountUp";
import styles from "./Statement.module.css";

/* statement.txt — the CV summary, inked in word by word as you scroll,
   then four numbers from the CV that count up. */
export default function Statement() {
  const ref = useRef(null);
  const words = statement.text.split(" ");

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        `.${styles.word}`,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: `.${styles.text}`, start: "top 78%", end: "bottom 42%", scrub: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Artboard id="statement" name="Statement" file="statement.txt">
      <div ref={ref}>
        <p className={cx("eyebrow", "mono")}>What's up</p>
        <p className={styles.text} data-cursor="text" data-cursor-label="Fraunces · 48pt">
          {words.map((word, i) => (
            <span key={i} className={styles.word}>
              {word}{" "}
            </span>
          ))}
        </p>

        <dl className={styles.metrics}>
          {statement.metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <dt className={cx(styles.label, "mono")}>{metric.label}</dt>
              <dd className={styles.value}>
                <CountUp value={metric.value} suffix={metric.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Artboard>
  );
}
