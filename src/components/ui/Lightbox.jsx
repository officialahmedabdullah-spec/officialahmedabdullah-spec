import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { storyFor } from "@/data/postStories";
import { t } from "@/i18n";
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
  const story = item ? storyFor(item.key) : null;
  const pad = (n) => String(n).padStart(2, "0");

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
      aria-label={item ? item.title : t("lightbox.viewer")}
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
              {item.category && <span>{item.category}</span>}
              {!story && <span>{item.category && " · "}{pad(index + 1)} / {pad(items.length)}</span>}
            </p>
            <button type="button" className={styles.round} onClick={onClose} aria-label={t("lightbox.close")}>
              <Icon name="close" size={20} />
            </button>
          </header>

          <div className={story ? styles.split : styles.solo}>
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
                  <button type="button" className={`${styles.round} ${styles.prev}`} onClick={() => onNavigate(-1)} aria-label={t("lightbox.prev")}>
                    <Icon name="chevLeft" size={20} />
                  </button>
                  <button type="button" className={`${styles.round} ${styles.next}`} onClick={() => onNavigate(1)} aria-label={t("lightbox.next")}>
                    <Icon name="chevRight" size={20} />
                  </button>
                </>
              )}
            </div>
            {!story && <figcaption className={styles.caption}>{item.title}</figcaption>}
          </figure>
          {story && (
            <aside className={styles.story} key={item.key} aria-label={t("lightbox.story")}>
              <p className={`mono ${styles.count}`}>
                {pad(index + 1)} <span>/ {pad(items.length)}</span>
              </p>
              <h2 className={styles.title}>{/^[\d\s]+$/.test(item.title) && item.category ? item.category : item.title}</h2>
              <dl className={styles.facts}>
                <dt className="mono">{t("lightbox.goal")}</dt>
                <dd>{story.goal}</dd>
                <dt className="mono">{t("lightbox.idea")}</dt>
                <dd>{story.idea}</dd>
                <dt className="mono">{t("lightbox.process")}</dt>
                <dd>
                  <ol className={styles.steps}>
                    {story.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </dd>
                <dt className="mono">{t("lightbox.tools")}</dt>
                <dd className={styles.tools}>
                  {story.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </dd>
              </dl>
            </aside>
          )}
          </div>
        </div>
      )}
    </dialog>
  );
}
