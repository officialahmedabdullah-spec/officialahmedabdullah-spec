import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useSound } from "@/context/SoundContext";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewDialog from "./ReviewDialog";
import ReviewTicker from "./ReviewTicker";
import styles from "./Reviews.module.css";

const FIRST = 6;

/* reviews.psd — real client reviews, live. Hidden entirely until the
   review database is connected (no placeholder reviews, ever). */
export default function ReviewsSection() {
  const { reviews, status, configured, freshIds } = useReviews();
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const { play } = useSound();

  if (!configured) return null;

  const visible = showAll ? reviews : reviews.slice(0, FIRST);

  return (
    <Artboard id="reviews" name={t("layer.reviews")} file="reviews.psd">
      <div className={styles.sectionHead}>
        <div>
          <p className={cx("eyebrow", "mono")}>
            {t("reviews.eyebrow")}
            <span className={styles.live}>
              <i aria-hidden="true" /> {t("common.live")}
            </span>
          </p>
          <RevealText className="h-lg">{t("reviews.title")}</RevealText>
        </div>
        <Button
          onClick={() => {
            setOpen(true);
            play("pop");
          }}
        >
          {t("reviews.leave")}
        </Button>
      </div>

      {status === "loading" && <p className={cx(styles.note, "mono")}>{t("reviews.loading")}</p>}
      {status === "error" && <p className={cx(styles.note, "mono")}>{t("reviews.error")}</p>}

      {status === "ready" && (
        <>
          <RatingSummary reviews={reviews} />
          <ReviewTicker reviews={reviews} freshIds={freshIds} />

          {reviews.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{t("reviews.emptyTitle")}</p>
              <p>{t("reviews.emptyText")}</p>
            </div>
          ) : (
            <ul className={styles.cards}>
              <AnimatePresence initial={false}>
                {visible.map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} fresh={freshIds.has(review.id)} />
                ))}
              </AnimatePresence>
            </ul>
          )}

          {reviews.length > FIRST && (
            <button type="button" className={styles.more} onClick={() => setShowAll((all) => !all)}>
              {showAll ? t("reviews.showFewer") : t("reviews.showAll", { n: reviews.length })}
            </button>
          )}
        </>
      )}

      <ReviewDialog open={open} onClose={() => setOpen(false)} />
    </Artboard>
  );
}
