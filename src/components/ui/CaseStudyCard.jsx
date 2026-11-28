import { useRef } from "react";
import { Link } from "react-router";
import { gsap, useGSAP } from "@/lib/gsap";
import { projectImage } from "@/data/projectImages";
import { t } from "@/i18n";
import { cx, pad, reducedMotion } from "@/lib/utils";
import CmykImage from "./CmykImage";
import { Icon } from "./Icon";
import styles from "./CaseStudyCard.module.css";

/* A case-study tile: CMYK-split cover on hover and a "View" cursor. */
export default function CaseStudyCard({ study, index, large = false }) {
  const cover = projectImage(study.cover);
  const ref = useRef(null);

  // the cover opens out of an inset as it scrolls in; the picture drifts inside it
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const frame = ref.current.firstElementChild;
      const scrollTrigger = (end) => ({ trigger: ref.current, start: "top 95%", end, scrub: true });
      gsap.fromTo(frame, { clipPath: "inset(14% 10% round 4px)" }, { clipPath: "inset(0% 0% round 0px)", ease: "none", scrollTrigger: scrollTrigger("top 50%") });
      gsap.fromTo(frame, { "--py": "20%" }, { "--py": "80%", ease: "none", scrollTrigger: scrollTrigger("bottom top") });
    },
    { scope: ref }
  );

  return (
    <Link
      ref={ref}
      to={`/work/${study.slug}`}
      className={cx(styles.card, large && styles.large)}
      style={{ "--accent": study.accent }}
      data-cmyk-group
      data-cursor="view"
      data-cursor-label={t("common.viewCase")}
    >
      <CmykImage src={large ? cover?.src : cover?.thumb} alt={`${study.client} — ${study.category}`} ratio={large ? "16 / 10" : "4 / 3"} />
      <div className={styles.meta}>
        <span className={cx(styles.n, "mono")}>{pad(index + 1)}</span>
        <div>
          <p className={cx(styles.category, "mono")}>
            <i aria-hidden="true" />
            {study.category} · {study.client}
          </p>
          <h3 className={styles.title}>{study.title}</h3>
        </div>
        <span className={styles.go} aria-hidden="true">
          <Icon name="arrowUpRight" size={18} />
        </span>
      </div>
    </Link>
  );
}
