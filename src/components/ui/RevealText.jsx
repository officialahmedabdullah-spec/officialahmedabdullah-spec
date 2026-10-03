import { Children, isValidElement, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import styles from "./RevealText.module.css";

/**
 * Heading whose words rise out of a mask one after another.
 * Strings are split into word spans by React; elements in children
 * (e.g. a <SelectionBox>) are kept whole as a single "word".
 *
 *   <RevealText as="h2" className="h-lg">Watch the mark get made.</RevealText>
 *   <RevealText play={ready}>…</RevealText>   // controlled: waits for `play`
 */
export default function RevealText({ as: Tag = "h2", children, className, play, delay = 0, stagger = 0.05, ...props }) {
  const ref = useRef(null);
  const controlled = play !== undefined;

  const parts = Children.toArray(children).flatMap((child) =>
    typeof child === "string" ? child.split(/(\s+)/).filter(Boolean) : [child]
  );

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const words = gsap.utils.toArray(`.${styles.inner}`, ref.current);
      const from = { yPercent: 110, rotate: 4, opacity: 0 };
      if (controlled) {
        gsap.set(words, from);
        return;
      }
      gsap.from(words, {
        ...from,
        duration: 1.1,
        stagger,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      if (!controlled || !play || reducedMotion()) return;
      gsap.to(gsap.utils.toArray(`.${styles.inner}`, ref.current), {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.15,
        stagger,
        delay,
      });
    },
    { scope: ref, dependencies: [play] }
  );

  return (
    <Tag ref={ref} className={className} {...props}>
      {parts.map((part, i) => {
        if (typeof part === "string") {
          if (/^\s+$/.test(part)) return " ";
          return (
            <span key={i} className={styles.word}>
              <span className={styles.inner}>{part}</span>
            </span>
          );
        }
        return (
          <span key={isValidElement(part) && part.key ? part.key : i} className={cx(styles.word, styles.element)}>
            <span className={styles.inner}>{part}</span>
          </span>
        );
      })}
    </Tag>
  );
}
