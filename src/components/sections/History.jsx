import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSound } from "@/context/SoundContext";
import { achievements, history } from "@/data/portfolioData";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./History.module.css";

/* history.psd — experience and education as Photoshop's History panel.
   Each "state" is a step of the CV; pick one to see its details.
   One thing at a time (Hick's law). */
export default function History({ showAchievements = true }) {
  const [current, setCurrent] = useState("graphic");
  const { play } = useSound();
  const item = history.find((state) => state.id === current);
  const currentIndex = history.indexOf(item);

  return (
    <Artboard id="history" name={t("layer.experience")} file="history.psd">
      <p className={cx("eyebrow", "mono")}>{t("history.eyebrow")}</p>
      <RevealText className={cx("h-lg", styles.title)}>{t("history.title")}</RevealText>

      <div className={styles.layout}>
        <div className={styles.panel}>
          <p className={cx(styles.panelHead, "mono")}>{t("history.panel")}</p>
          <ol>
            {history.map((state, i) => (
              <li key={state.id}>
                <button
                  type="button"
                  className={cx(styles.state, state.id === current && styles.active, i > currentIndex && styles.future)}
                  aria-pressed={state.id === current}
                  onClick={() => {
                    setCurrent(state.id);
                    play("tick", 1 + i * 0.08);
                  }}
                >
                  <Icon name={state.icon} size={16} />
                  <span className={styles.action}>{state.action}</span>
                  <span className={styles.stateTitle}>{state.title}</span>
                  <span className={cx(styles.when, "mono")}>{state.when}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.detail} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              <p className={cx(styles.detailWhen, "mono")}>
                {item.when} · {item.place}
              </p>
              <h3 className={cx("h-md", styles.detailTitle)}>{item.title}</h3>
              <ul className={styles.points}>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showAchievements && (
        <div className={styles.achievements}>
          <p className={cx("eyebrow", "mono")}>{t("history.achievements")}</p>
          <ol className={styles.wins}>
            {achievements.map((text, i) => (
              <li key={text}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Artboard>
  );
}
