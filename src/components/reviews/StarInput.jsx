import { useId, useState } from "react";
import { cx } from "@/lib/utils";
import { STAR } from "./Stars";
import styles from "./Reviews.module.css";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Outstanding"];

/* Star picker built on real radio buttons: arrow keys, screen readers and
   forms all work. Hovering previews the rating; picking one pops it. */
export default function StarInput({ value, onChange, invalid }) {
  const [hover, setHover] = useState(0);
  const name = useId();
  const shown = hover || value;

  return (
    <fieldset className={cx(styles.starInput, invalid && styles.starInvalid)} onMouseLeave={() => setHover(0)}>
      <legend className="sr-only">Your rating</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className={cx(styles.starOption, n <= shown && styles.starOn, n === value && styles.starPicked)} onMouseEnter={() => setHover(n)}>
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="sr-only"
            aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n]}`}
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR} />
          </svg>
        </label>
      ))}
      <span className={cx(styles.starLabel, "mono")} aria-hidden="true">
        {shown ? LABELS[shown] : "Tap a star"}
      </span>
    </fieldset>
  );
}
