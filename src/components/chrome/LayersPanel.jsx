import { useEffect } from "react";
import { useLayers } from "@/context/LayersContext";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { t } from "@/i18n";
import { ScrollTrigger } from "@/lib/gsap";
import { cx, pad } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./LayersPanel.module.css";

const byDocumentOrder = (a, b) =>
  a.ref.current && b.ref.current && a.ref.current.compareDocumentPosition(b.ref.current) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/* The Layers panel lists the sections (artboards) of the current page.
   Click a layer to jump to it; the eye hides it, like in Photoshop.
   Docked on wide screens, a drawer below 1180px. */
export default function LayersPanel({ open, onClose }) {
  const { layers, active, hidden, toggleHidden } = useLayers();
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();
  const sorted = [...layers].sort(byDocumentOrder);

  // re-measure scroll scenes after a section is hidden or shown
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [hidden]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside id="layers-panel" className={cx(styles.panel, open && styles.open)} aria-label={t("layersPanel.title")}>
      <div className={styles.head}>
        <strong>{t("layersPanel.title")}</strong>
        <span className="mono">{t("layersPanel.count", { n: sorted.length })}</span>
      </div>

      <ol className={styles.list}>
        {sorted.map((layer, i) => {
          const isHidden = hidden.has(layer.id);
          return (
            <li key={layer.id} className={cx(styles.layer, active === layer.id && styles.active, isHidden && styles.isHidden)}>
              <button
                type="button"
                className={styles.eye}
                aria-pressed={!isHidden}
                aria-label={t(isHidden ? "common.show" : "common.hide", { name: layer.name })}
                onClick={() => {
                  toggleHidden(layer.id);
                  play(isHidden ? "pop" : "nope");
                }}
              >
                <Icon name={isHidden ? "eyeOff" : "eye"} size={15} />
              </button>
              <span className={styles.thumb} aria-hidden="true" />
              <button
                type="button"
                className={styles.go}
                disabled={isHidden}
                onClick={() => {
                  scrollTo(layer.ref.current);
                  play("tick");
                  onClose();
                }}
              >
                <span>{layer.name}</span>
                <small className="mono">{pad(i + 1)}</small>
              </button>
            </li>
          );
        })}
      </ol>

      <p className={cx(styles.foot, "mono")}>{t("layersPanel.shortcuts")}</p>
    </aside>
  );
}
