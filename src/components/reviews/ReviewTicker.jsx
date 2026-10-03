import { useRef } from "react";
import { isRtl, t } from "@/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import Stars from "./Stars";
import styles from "./Reviews.module.css";

const clip = (text, n = 90) => (text.length > n ? `${text.slice(0, n).trimEnd()}…` : text);

/* A strip of short quotes that drifts sideways; new reviews join it live
   with a "just now" tag. Pauses on hover so a quote can be read. */
export default function ReviewTicker({ reviews, freshIds }) {
  const ref = useRef(null);
  const latest = reviews.slice(0, 12);
  // laid out right-to-left in Arabic so the newest still comes first
  const items = isRtl() ? [...latest].reverse() : latest;

  useGSAP(
    () => {
      if (reducedMotion() || items.length === 0) return undefined;
      const duration = Math.max(24, items.length * 9);
      // quotes arrive start-first: leftwards in English, rightwards in Arabic
      const tween = isRtl()
        ? gsap.fromTo(`.${styles.tickerTrack}`, { xPercent: -50 }, { xPercent: 0, duration, ease: "none", repeat: -1 })
        : gsap.to(`.${styles.tickerTrack}`, { xPercent: -50, duration, ease: "none", repeat: -1 });
      const el = ref.current;
      const pause = () => tween.pause();
      const play = () => tween.play();
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", play);
      return () => {
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", play);
      };
    },
    { scope: ref, dependencies: [items.length], revertOnUpdate: true }
  );

  if (items.length === 0) return null;

  // two copies so the -50% loop is seamless
  const row = (copy) => (
    <ul className={styles.tickerRow} key={copy} aria-hidden={copy > 0 || undefined}>
      {items.map((review) => (
        <li key={review.id} className={styles.tickerItem}>
          {freshIds.has(review.id) && <span className={cx(styles.badge, "mono")}>{t("common.justNow")}</span>}
          <Stars value={review.rating} size={13} />
          <q dir="auto">{clip(review.body)}</q>
          <span className="mono">— {review.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className={styles.ticker}>
      <div className={styles.tickerTrack} dir="ltr">
        {[0, 1].map(row)}
      </div>
    </div>
  );
}
