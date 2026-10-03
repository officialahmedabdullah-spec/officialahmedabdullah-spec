import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { Icon } from "./Icon";
import styles from "./Lightbox.module.css";

/**
 * Full-screen viewer on the native <dialog> (focus trap, Escape and the
 * top layer for free). ← / → and swipes step through `items`.
 *   items: [{ key, src, title, category? }] · index: number | null
 */
export default function Lightbox({ items, index, onNavigate, onClose }) {
  const dialogRef = useRef(null);
  const touchX = useRef(null);
  const { stop, start } = useSmoothScroll();
  const { play } = useSound();
  const open = index != null && items[index] != null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
      stop();
      play("pop");
    }
    if (!open && dialog.open) dialog.close();
    if (!open) start();
  }, [open, stop, start, play]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onNavigate]);

  const closeOnBackdrop = (event) => event.target === event.currentTarget && onClose();

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={item ? item.title : "Image viewer"}
      onClose={onClose}
      onClick={closeOnBackdrop}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current == null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) onNavigate(dx < 0 ? 1 : -1);
      }}
    >
      {item && (
        <div className={styles.layout} onClick={closeOnBackdrop}>
          <header className={styles.bar}>
            <p className="mono">
              {item.category && <span>{item.category} · </span>}
              {index + 1} / {items.length}
            </p>
            <button type="button" className={styles.round} onClick={onClose} aria-label="Close viewer">
              <Icon name="close" size={20} />
            </button>
          </header>

          <figure className={styles.figure}>
            <div className={styles.stage} onClick={closeOnBackdrop}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={item.key}
                  className={styles.image}
                  src={item.src}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              {items.length > 1 && (
                <>
                  <button type="button" className={`${styles.round} ${styles.prev}`} onClick={() => onNavigate(-1)} aria-label="Previous image">
                    <Icon name="chevLeft" size={20} />
                  </button>
                  <button type="button" className={`${styles.round} ${styles.next}`} onClick={() => onNavigate(1)} aria-label="Next image">
                    <Icon name="chevRight" size={20} />
                  </button>
                </>
              )}
            </div>
            <figcaption className={styles.caption}>{item.title}</figcaption>
          </figure>
        </div>
      )}
    </dialog>
  );
}
