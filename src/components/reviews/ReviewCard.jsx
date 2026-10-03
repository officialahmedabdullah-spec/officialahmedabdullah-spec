import { motion } from "motion/react";
import { Link } from "react-router";
import { getCaseStudy, getService } from "@/data/portfolioData";
import { t } from "@/i18n";
import { cx, timeAgo } from "@/lib/utils";
import Stars from "./Stars";
import styles from "./Reviews.module.css";

/* A review drawn as a Photoshop comment pinned to the artboard: numbered
   pin, avatar, stars, the words, and what it was for. */
export default function ReviewCard({ review, index, fresh }) {
  const project = review.project ? getCaseStudy(review.project) : null;
  const service = review.service ? getService(review.service) : null;
  const initials = review.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.li
      layout
      className={cx(styles.card, fresh && styles.fresh)}
      style={{ "--tilt": `${((index % 3) - 1) * 0.8}deg` }}
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    >
      <span className={cx(styles.pin, "mono")} aria-hidden="true">
        {index + 1}
      </span>
      <div className={styles.cardHead}>
        <span className={styles.avatar} aria-hidden="true">
          {review.photo_url ? <img src={review.photo_url} alt="" loading="lazy" /> : initials}
        </span>
        <div className={styles.who}>
          <strong>{review.name}</strong>
          {review.role && <span>{review.role}</span>}
        </div>
        {fresh ? <span className={cx(styles.badge, "mono")}>{t("common.justNow")}</span> : <time className="mono" dateTime={review.created_at}>{timeAgo(review.created_at)}</time>}
      </div>
      <Stars value={review.rating} />
      {/* reviews are written in either language: let the browser pick the direction */}
      <blockquote className={styles.body} dir="auto">
        {review.body}
      </blockquote>
      {(service || project) && (
        <p className={cx(styles.for, "mono")}>
          {service && <span>{service.title}</span>}
          {project && <Link to={`/work/${project.slug}`}>{project.client}</Link>}
        </p>
      )}
    </motion.li>
  );
}
