import { useEffect, useRef } from "react";
import { useLayers } from "@/context/LayersContext";
import { site } from "@/data/portfolioData";
import { t } from "@/i18n";
import { ScrollTrigger } from "@/lib/gsap";
import { cx } from "@/lib/utils";
import styles from "./StatusBar.module.css";

/* Photoshop's status bar: availability, cursor position, current layer
   and how far through the document you are. Numbers update directly on
   the DOM so pointer and scroll don't re-render React. */
export default function StatusBar() {
  const { layers, active } = useLayers();
  const xRef = useRef(null);
  const yRef = useRef(null);
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const activeName = layers.find((layer) => layer.id === active)?.name ?? "—";

  useEffect(() => {
    const onMove = (event) => {
      xRef.current.textContent = Math.round(event.clientX);
      yRef.current.textContent = Math.round(event.clientY + window.scrollY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        pctRef.current.textContent = pct;
        barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      progress.kill();
    };
  }, []);

  return (
    <footer className={cx(styles.status, "mono")} aria-label={t("status.label")}>
      <span className={styles.item}>
        <i className={styles.dot} aria-hidden="true" />
        <b>{site.availability}</b>
      </span>
      <span className={cx(styles.item, styles.wide)}>
        {t("status.zoom")} <b>100%</b>
      </span>
      <span className={cx(styles.item, styles.wide)} aria-hidden="true">
        X <b ref={xRef}>0</b> Y <b ref={yRef}>0</b>
      </span>
      <span className={styles.item}>
        {t("status.layer")} <b>{activeName}</b>
      </span>
      <span className={styles.spacer} />
      <span className={styles.track} aria-hidden="true">
        <i ref={barRef} />
      </span>
      <span className={styles.item} aria-hidden="true">
        <b ref={pctRef}>0</b>%
      </span>
    </footer>
  );
}
