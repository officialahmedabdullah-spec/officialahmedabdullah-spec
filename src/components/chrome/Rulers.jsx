import { useEffect, useRef } from "react";
import { finePointer } from "@/lib/utils";
import styles from "./Rulers.module.css";

const TICKS_X = Array.from({ length: 40 }, (_, i) => i * 100);
const TICKS_Y = Array.from({ length: 20 }, (_, i) => i * 100);

/* Top and left rulers. Their blue markers follow the pointer, the way
   Photoshop's rulers track the cursor. Updated directly on the DOM —
   no React render per mouse move. */
export default function Rulers() {
  const markX = useRef(null);
  const markY = useRef(null);
  const rulerX = useRef(null);
  const rulerY = useRef(null);

  useEffect(() => {
    if (!finePointer()) return undefined;
    let frame = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      frame = 0;
      const rx = rulerX.current.getBoundingClientRect();
      const ry = rulerY.current.getBoundingClientRect();
      markX.current.style.transform = `translateX(${x - rx.left}px)`;
      markY.current.style.transform = `translateY(${y - ry.top}px)`;
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className={styles.corner} />
      <div ref={rulerX} className={styles.x}>
        {TICKS_X.map((n) => (
          <span key={n} style={{ left: n }}>
            {n}
          </span>
        ))}
        <i ref={markX} className={styles.markX} />
      </div>
      <div ref={rulerY} className={styles.y}>
        {TICKS_Y.map((n) => (
          <span key={n} style={{ top: n }}>
            {n}
          </span>
        ))}
        <i ref={markY} className={styles.markY} />
      </div>
    </div>
  );
}
