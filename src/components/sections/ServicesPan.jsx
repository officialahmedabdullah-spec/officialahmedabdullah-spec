import { useRef } from "react";
import { Link } from "react-router";
import { serviceFrames } from "@/data/portfolioData";
import { t } from "@/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, pad } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./ServicesPan.module.css";

/* services.psd — five frames on a wide canvas. On desktop the section pins
   and vertical scroll pans it sideways (the Hand tool); on phones and with
   reduced motion it's a normal swipeable row. */
export default function ServicesPan() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        const track = ref.current.querySelector(`.${styles.track}`);
        const viewport = ref.current.querySelector(`.${styles.viewport}`);
        const distance = () => track.scrollWidth - viewport.clientWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top+=88",
            end: () => `+=${distance()}`,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // each frame tilts slightly as it enters — secondary action
        gsap.utils.toArray(`.${styles.frame}`, track).forEach((frame) => {
          gsap.from(frame.querySelector(`.${styles.body}`), {
            rotate: 3,
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: frame, containerAnimation: tween, start: "left right", end: "left 55%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Artboard id="services-pan" name={t("layer.services")} file="services.psd" pinned sheetClassName={styles.sheet}>
      <div ref={ref} className={styles.pan}>
        <div className={styles.head}>
          <p className={cx("eyebrow", "mono")}>{t("servicesPan.eyebrow")}</p>
          <RevealText className="h-lg">{t("servicesPan.title")}</RevealText>
        </div>
        {/* the pan scrolls in screen direction (left → right) in both languages;
            each frame keeps the page's reading direction */}
        <div className={styles.viewport} data-cursor="hand" data-cursor-label={t("servicesPan.cursor")} dir="ltr">
          <ol className={styles.track}>
            {serviceFrames.map((frame, i) => (
              <li key={frame.title} className={styles.frame} dir={document.documentElement.dir}>
                <p className={cx(styles.frameLabel, "mono")}>
                  {t("servicesPan.frame")} {pad(i + 1)} · {frame.file}
                </p>
                <Link to={frame.to} className={styles.body} style={{ "--frame": frame.color }} data-cursor="view" data-cursor-label={t("common.open")}>
                  <h3 className={styles.title}>{frame.title}</h3>
                  <p className={styles.text}>{frame.text}</p>
                  <ul className={styles.tags}>
                    {frame.tags.map((tag) => (
                      <li key={tag} className="mono">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <span className={styles.number} aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <span className={styles.go} aria-hidden="true">
                    <Icon name="arrowUpRight" size={20} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Artboard>
  );
}
