import { useInView } from "motion/react";
import { useRef } from "react";
import { cx } from "@/lib/utils";
import styles from "./SelectionBox.module.css";

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

/**
 * Photoshop's active selection: marching ants, eight transform handles
 * and a layer tag. Marks "the thing in focus" (Von Restorff effect).
 * Shows when scrolled into view, or when `active` is passed explicitly.
 */
export default function SelectionBox({ label, active, className, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const on = active ?? inView;

  return (
    <span ref={ref} className={cx(styles.sel, on && styles.on, className)}>
      {children}
      <span className={styles.ants} aria-hidden="true" />
      {HANDLES.map((handle, i) => (
        <i key={handle} className={cx(styles.handle, styles[handle])} style={{ "--d": `${i * 35}ms` }} aria-hidden="true" />
      ))}
      {label && (
        <span className={cx(styles.tag, "mono")} aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
