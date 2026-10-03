import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { archiveCount, getArchive } from "@/data/projectImages";
import { t } from "@/i18n";
import { ScrollTrigger } from "@/lib/gsap";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import Lightbox from "@/components/ui/Lightbox";
import RevealText from "@/components/ui/RevealText";
import styles from "./Archive.module.css";

const ALL = "all";
const ease = [0.16, 1, 0.3, 1];

/* archive.psd — every project image, filterable by category. Filtering
   animates the grid with shared layout (cards glide to their new place);
   clicking opens the lightbox on whatever is currently shown. */
export default function Archive() {
  const [filter, setFilter] = useState(ALL);
  const [open, setOpen] = useState(null);
  const { play } = useSound();
  const archive = useMemo(getArchive, []);

  const items = useMemo(
    () => (filter === ALL ? archive.flatMap((c) => c.items) : archive.find((c) => c.id === filter)?.items ?? []),
    [filter, archive]
  );

  const filters = [{ id: ALL, title: t("archive.all"), count: archiveCount }, ...archive.map((c) => ({ id: c.id, title: c.title, count: c.items.length }))];

  const step = useCallback((dir) => setOpen((i) => (i == null ? i : (i + dir + items.length) % items.length)), [items.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <Artboard id="archive" name={t("layer.archive")} file="archive.psd">
      <div className={styles.head}>
        <div>
          <p className={cx("eyebrow", "mono")}>{t("archive.eyebrow", { n: archiveCount })}</p>
          <RevealText className="h-lg">{t("archive.title")}</RevealText>
        </div>
      </div>

      <LayoutGroup>
        <div className={styles.filters} role="group" aria-label={t("archive.filter")}>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.filter}
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id);
                play("tick");
              }}
            >
              {filter === item.id && <motion.span layoutId="archive-filter" className={styles.pill} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className={styles.filterText}>{item.title}</span>
              <span className={cx(styles.count, "mono")}>{item.count}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <p className="sr-only" aria-live="polite">
        {t("archive.shown", { n: items.length })}
      </p>

      <motion.ul layout className={styles.grid} onLayoutAnimationComplete={() => ScrollTrigger.refresh()}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.li
              key={item.key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease, delay: Math.min(i, 12) * 0.025 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ layout: { duration: 0.6, ease } }}
            >
              <button type="button" className={styles.thumb} onClick={() => setOpen(i)} data-cursor="view" data-cursor-label={t("common.zoom")}>
                <img src={item.thumb} alt={`${item.category}: ${item.title}`} loading="lazy" decoding="async" />
                <span className={cx(styles.caption, "mono")}>{item.title}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox items={items} index={open} onNavigate={step} onClose={close} />
    </Artboard>
  );
}
