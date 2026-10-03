import { useId, useState } from "react";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import { STAR } from "./Stars";
import styles from "./Reviews.module.css";

/* Star picker built on real radio buttons: arrow keys, screen readers and
   forms all work. Hovering previews the rating; picking one pops it. */
export default function StarInput({ value, onChange, invalid }) {
  const [hover, setHover] = useState(0);
  const name = useId();
  const shown = hover || value;
  const LABELS = t("reviews.starLabels");

  return (
    <fieldset className={cx(styles.starInput, invalid && styles.starInvalid)} onMouseLeave={() => setHover(0)}>
      <legend className="sr-only">{t("reviews.yourRating")}</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className={cx(styles.starOption, n <= shown && styles.starOn, n === value && styles.starPicked)} onMouseEnter={() => setHover(n)}>
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="sr-only"
            aria-label={t("reviews.starAria", { n, label: LABELS[n] })}
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR} />
          </svg>
        </label>
      ))}
      <span className={cx(styles.starLabel, "mono")} aria-hidden="true">
        {shown ? LABELS[shown] : t("reviews.tapStar")}
      </span>
    </fieldset>
  );
}
