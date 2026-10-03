import { cx } from "@/lib/utils";
import styles from "./Reviews.module.css";

const STAR = "M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z";

/* Read-only star rating; supports fractions (4.6 → four and a bit). */
export default function Stars({ value, size = 16, className }) {
  return (
    <span className={cx(styles.stars, className)} role="img" aria-label={`${Math.round(value * 10) / 10} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR} fill="currentColor" opacity=".2" />
            <path d={STAR} fill="currentColor" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }} />
          </svg>
        );
      })}
    </span>
  );
}

export { STAR };
