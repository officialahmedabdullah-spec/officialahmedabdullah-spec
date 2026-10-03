import { useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { chat } from "@/data/portfolioData";
import { t } from "@/i18n";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./ChatProcess.module.css";

const TYPING_MS = 750;
const GAP_MS = 380;

/* process-thread.psd — how a project runs, told as a chat that types
   itself out when it scrolls into view. My replies get a typing indicator
   first — anticipation before the message lands. */
export default function ChatProcess() {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => (reducedMotion() ? chat.length : 0));
  const [typing, setTyping] = useState(false);
  const { play } = useSound();
  const playRef = useRef(play);
  playRef.current = play;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const timers = [];
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          let at = 0;
          chat.forEach((entry, i) => {
            if (entry.from === "me") {
              timers.push(setTimeout(() => setTyping(true), at));
              at += TYPING_MS;
            }
            timers.push(
              setTimeout(() => {
                setTyping(false);
                setShown(i + 1);
                if (entry.from) playRef.current(entry.from === "me" ? "pop" : "tick");
              }, at)
            );
            at += entry.day ? 200 : GAP_MS;
          });
        },
      });
      return () => timers.forEach(clearTimeout);
    },
    { scope: ref }
  );

  return (
    <Artboard id="process" name={t("layer.process")} file="process-thread.psd">
      <div className={styles.layout}>
        <div>
          <p className={cx("eyebrow", "mono")}>{t("chat.eyebrow")}</p>
          <RevealText className="h-lg">{t("chat.title")}</RevealText>
          <p className={cx("lede", styles.lede)}>{t("chat.lede")}</p>
          <p className={cx(styles.disclaimer, "mono")}>{t("chat.disclaimer")}</p>
        </div>

        <div ref={ref} className={styles.window}>
          <div className={styles.head}>
            <strong>{t("chat.channel")}</strong>
            <span className="mono">
              <i className={styles.online} aria-hidden="true" /> {t("chat.online")}
            </span>
          </div>
          <ol className={styles.thread} aria-live="polite">
            {chat.slice(0, shown).map((entry, i) =>
              entry.day ? (
                <li key={i} className={cx(styles.day, "mono")}>
                  {entry.day}
                </li>
              ) : (
                <li key={i} className={cx(styles.msg, entry.from === "you" && styles.you)}>
                  <span className={styles.avatar} aria-hidden="true">
                    {entry.from === "you" ? t("chat.youInitial") : t("chat.meInitial")}
                  </span>
                  <div className={styles.bubble}>
                    <span className={cx(styles.who, "mono")}>
                      {entry.from === "you" ? t("chat.you") : t("chat.me")} · {entry.time}
                    </span>
                    <p>{entry.text}</p>
                    {entry.file && (
                      <span className={cx(styles.file, "mono")}>
                        <Icon name="paperclip" size={13} /> {entry.file}
                      </span>
                    )}
                  </div>
                </li>
              )
            )}
            {typing && (
              <li className={styles.msg} aria-label={t("chat.typing")}>
                <span className={styles.avatar} aria-hidden="true">
                  {t("chat.meInitial")}
                </span>
                <span className={styles.typing}>
                  <i />
                  <i />
                  <i />
                </span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </Artboard>
  );
}
