import { summarize } from "@/context/ReviewsContext";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import CountUp from "@/components/ui/CountUp";
import Stars from "./Stars";
import styles from "./Reviews.module.css";

/* Big average, total count and a 5→1 breakdown. Updates live as reviews
   are approved. */
export default function RatingSummary({ reviews }) {
  const { count, average, counts } = summarize(reviews);

  return (
    <div className={styles.summary}>
      <div className={styles.score}>
        <p className={styles.average}>
          {count ? (
            <>
              {average.toFixed(1)}
              <small>/5</small>
            </>
          ) : (
            t("reviews.new")
          )}
        </p>
        <Stars value={average} size={22} className={styles.summaryStars} />
        <p className={cx(styles.count, "mono")}>
          {count ? (
            <>
              <CountUp value={count} /> {t("reviews.verified", { n: count })}
            </>
          ) : (
            t("reviews.noneYet")
          )}
        </p>
      </div>
      <ul className={styles.bars} aria-label={t("reviews.breakdown")}>
        {counts.map(({ stars, n }) => (
          <li key={stars}>
            <span className="mono">{stars}★</span>
            <span className={styles.barTrack} aria-hidden="true">
              <span className={styles.barFill} style={{ transform: `scaleX(${count ? n / count : 0})` }} />
            </span>
            <span className={cx(styles.barN, "mono")}>
              {n}
              <span className="sr-only"> {t("reviews.withStars", { n, s: stars })}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
