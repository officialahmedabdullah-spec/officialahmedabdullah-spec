import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useSound } from "@/context/SoundContext";
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
    <Artboard id="reviews" name="Reviews" file="reviews.psd">
      <div className={styles.sectionHead}>
        <div>
          <p className={cx("eyebrow", "mono")}>
            Client reviews
            <span className={styles.live}>
              <i aria-hidden="true" /> Live
            </span>
          </p>
          <RevealText className="h-lg">Comments left on the artboard.</RevealText>
        </div>
        <Button
          onClick={() => {
            setOpen(true);
            play("pop");
          }}
        >
          Leave a review
        </Button>
      </div>

      {status === "loading" && <p className={cx(styles.note, "mono")}>Loading reviews…</p>}
      {status === "error" && <p className={cx(styles.note, "mono")}>Reviews couldn't load right now.</p>}

      {status === "ready" && (
        <>
          <RatingSummary reviews={reviews} />
          <ReviewTicker reviews={reviews} freshIds={freshIds} />

          {reviews.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No reviews yet.</p>
              <p>Worked with me? Yours could be the first comment on this artboard.</p>
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
              {showAll ? "Show fewer" : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}

      <ReviewDialog open={open} onClose={() => setOpen(false)} />
    </Artboard>
  );
}
