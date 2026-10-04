import { Fragment, useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { skills } from "@/data/portfolioData";
import { t } from "@/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./Skills.module.css";

/* skills.psd — skill levels shown as a Photoshop Layers panel, where each
   skill is a layer and its level is the layer's opacity. Eye toggles work. */
export default function Skills({ showAttributes = true }) {
  const ref = useRef(null);
  const { play } = useSound();
  const [off, setOff] = useState(() => new Set());

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(`.${styles.fill}`, {
        scaleX: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${styles.panel}`, start: "top 80%", toggleActions: "play none none reverse" },
      });
      // explicit end values: the tiles' CSS hover transition on `transform`
      // makes a plain .from() read its start pose back as the end pose
      gsap.fromTo(
        `.${styles.app}`,
        { y: 30, rotate: -12, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(2)",
          clearProps: "transform,translate,rotate,scale",
          scrollTrigger: { trigger: `.${styles.apps}`, start: "top 90%" },
        }
      );
    },
    { scope: ref }
  );

  const toggle = (name) => {
    setOff((set) => {
      const next = new Set(set);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
    play("tick");
  };

  return (
    <Artboard id="skills" name={t("layer.skills")} file="skills.psd">
      <div ref={ref} className={styles.wrap}>
        <div className={styles.intro}>
          <p className={cx("eyebrow", "mono")}>{t("skills.eyebrow")}</p>
          <RevealText className="h-lg">{t("skills.title")}</RevealText>

          {[
            ["skills.software", skills.software],
            ["skills.ai", skills.ai],
          ].map(([label, apps]) => (
            <Fragment key={label}>
              <p className={cx(styles.subhead, "mono")}>{t(label)}</p>
              <ul className={styles.apps}>
                {apps.map((app) => (
                  <li key={app.id} className={styles.app} style={{ background: app.bg, color: app.fg }} title={app.name}>
                    <span aria-hidden="true">{app.label}</span>
                    <span className="sr-only">{app.name}</span>
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}

          <p className={cx(styles.subhead, "mono")}>{t("skills.languages")}</p>
          <ul className={styles.langs}>
            {skills.languages.map((language) => (
              <li key={language.name}>
                <strong>{language.name}</strong>
                <span>{language.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panel} role="group" aria-label={t("skills.levels")}>
          <div className={cx(styles.panelHead, "mono")}>
            <span>{t("skills.layers")}</span>
            <span>{t("skills.opacity")}</span>
          </div>
          <ul>
            {skills.layers.map((layer) => {
              const hidden = off.has(layer.name);
              return (
                <li key={layer.name} className={cx(styles.layer, hidden && styles.hidden)}>
                  <button
                    type="button"
                    className={styles.eye}
                    aria-pressed={!hidden}
                    aria-label={t(hidden ? "common.show" : "common.hide", { name: layer.name })}
                    onClick={() => toggle(layer.name)}
                  >
                    <Icon name={hidden ? "eyeOff" : "eye"} size={15} />
                  </button>
                  <span className={styles.thumb} style={{ background: layer.color }} aria-hidden="true" />
                  <span className={styles.name}>{layer.name}</span>
                  <span className={styles.meter}>
                    <span className={styles.track} aria-hidden="true">
                      <span className={styles.fill} style={{ width: `${layer.value}%`, background: layer.color }} />
                    </span>
                    <span className={cx(styles.value, "mono")}>{layer.value}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className={cx(styles.panelFoot, "mono")} aria-hidden="true">
            <span>fx</span>
            <span>◐</span>
            <span>▢</span>
            <span>＋</span>
          </p>
        </div>
      </div>

      {showAttributes && (
        <ul className={styles.attributes}>
          {skills.attributes.map((item) => (
            <li key={item.title}>
              <span className={styles.attrIcon}>
                <Icon name={item.icon} size={20} />
              </span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Artboard>
  );
}
