import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { Icon } from "@/components/ui/Icon";
import ReviewForm from "./ReviewForm";
import styles from "./Reviews.module.css";

/* "Leave a review" in a native modal dialog (focus trap + Escape built in). */
export default function ReviewDialog({ open, onClose, initialProject }) {
  const ref = useRef(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      dialog.showModal();
      stop();
    }
    if (!open && dialog.open) dialog.close();
    if (!open) start();
  }, [open, stop, start]);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="review-dialog-title" onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialogPanel}>
        <div className={styles.dialogHead}>
          <div>
            <p className="mono">review.psd · new comment</p>
            <h2 id="review-dialog-title">Leave a review</h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        {/* remount on every open so the form starts fresh */}
        {open && <ReviewForm initialProject={initialProject} onDone={onClose} />}
      </div>
    </dialog>
  );
}
