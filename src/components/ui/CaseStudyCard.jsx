import { Link } from "react-router";
import { projectImage } from "@/data/projectImages";
import { cx, pad } from "@/lib/utils";
import CmykImage from "./CmykImage";
import { Icon } from "./Icon";
import styles from "./CaseStudyCard.module.css";

/* A case-study tile: CMYK-split cover on hover and a "View" cursor. */
export default function CaseStudyCard({ study, index, large = false }) {
  const cover = projectImage(study.cover);

  return (
    <Link
      to={`/work/${study.slug}`}
      className={cx(styles.card, large && styles.large)}
      style={{ "--accent": study.accent }}
      data-cmyk-group
      data-cursor="view"
      data-cursor-label="View case"
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
