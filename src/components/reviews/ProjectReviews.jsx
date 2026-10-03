import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import RevealText from "@/components/ui/RevealText";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewDialog from "./ReviewDialog";
import styles from "./Reviews.module.css";

/* Reviews left for one case study. Shows a small invite when there are
   none yet (only once the review database is connected). */
export default function ProjectReviews({ slug, client }) {
  const { reviews, status, configured, freshIds } = useReviews();
  const [open, setOpen] = useState(false);

  if (!configured || status !== "ready") return null;
  const mine = reviews.filter((review) => review.project === slug);

  return (
    <Artboard id="project-reviews" name={t("layer.clientReview")} file="client-review.psd">
      <p className={cx("eyebrow", "mono")}>
        {t("reviews.projectEyebrow", { client })}
        <span className={styles.live}>
          <i aria-hidden="true" /> {t("common.live")}
        </span>
      </p>
      {mine.length > 0 ? (
        <>
          <RevealText className={cx("h-lg", styles.projectTitle)}>{t("reviews.projectTitle")}</RevealText>
          {mine.length > 1 && <RatingSummary reviews={mine} />}
          <ul className={styles.cards}>
            <AnimatePresence initial={false}>
              {mine.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} fresh={freshIds.has(review.id)} />
              ))}
            </AnimatePresence>
          </ul>
        </>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t("reviews.projectEmpty")}</p>
          <p>
            {t("reviews.areYouFrom", { client })}{" "}
            <button type="button" className={styles.linkButton} onClick={() => setOpen(true)}>
              {t("reviews.leave")}
            </button>
          </p>
        </div>
      )}
      <ReviewDialog open={open} onClose={() => setOpen(false)} initialProject={slug} />
    </Artboard>
  );
}
