import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchReviews, reviewsConfigured, subscribeToReviews } from "@/lib/reviews";

const ReviewsContext = createContext({ reviews: [], status: "off", configured: false, freshIds: new Set() });

const newestFirst = (a, b) => new Date(b.created_at) - new Date(a.created_at);

/* Loads approved reviews once and keeps them live: when a review is
   approved in Supabase it's pushed to every open page. `freshIds` marks
   reviews that arrived while the visitor was here ("just now" badge). */
export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState(reviewsConfigured ? "loading" : "off"); // off · loading · ready · error
  const [freshIds, setFreshIds] = useState(() => new Set());

  useEffect(() => {
    if (!reviewsConfigured) return undefined;
    let alive = true;

    fetchReviews()
      .then((rows) => {
        if (!alive) return;
        setReviews(rows.sort(newestFirst));
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));

    const unsubscribe = subscribeToReviews((event) => {
      if (event.type === "remove") {
        setReviews((list) => list.filter((review) => review.id !== event.id));
        return;
      }
      setReviews((list) => [event.review, ...list.filter((review) => review.id !== event.review.id)].sort(newestFirst));
      setFreshIds((ids) => new Set(ids).add(event.review.id));
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ reviews, status, configured: reviewsConfigured, freshIds }), [reviews, status, freshIds]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export const useReviews = () => useContext(ReviewsContext);

export function summarize(reviews) {
  const count = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((stars) => ({ stars, n: reviews.filter((review) => review.rating === stars).length }));
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  return { count, average, counts };
}
