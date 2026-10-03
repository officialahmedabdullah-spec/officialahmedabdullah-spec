import { useSearchParams } from "react-router";
import { useReviews } from "@/context/ReviewsContext";
import { getCaseStudy, getService } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import PageHeader from "@/components/sections/PageHeader";
import ReviewForm from "@/components/reviews/ReviewForm";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";

/* /review — a link to send clients after a project. It can be pre-filled:
     /review?project=codespark-solutions
     /review?service=logo-design */
export default function ReviewPage() {
  useDocumentTitle("Leave a review");
  const { configured } = useReviews();
  const [params] = useSearchParams();
  const project = getCaseStudy(params.get("project") ?? "") ? params.get("project") : "";
  const service = getService(params.get("service") ?? "") ? params.get("service") : "";
  const study = project ? getCaseStudy(project) : null;

  return (
    <>
      <PageHeader
        file="review.psd"
        eyebrow="Leave a review"
        title={study ? `How was working on ${study.client}?` : "How was working together?"}
        lede="Two minutes, honest words. Your review appears on the portfolio once I've approved it — and it genuinely helps the next client decide."
      />
      <Artboard id="review-form" name="Review form" file="new-comment.psd">
        {configured ? (
          <ReviewForm initialProject={project} initialService={service} />
        ) : (
          <div>
            <p className="lede">Reviews aren't open just yet. Send your thoughts by email instead — thank you!</p>
            <div style={{ marginTop: 24 }}>
              <Button to="/contact">Contact me</Button>
            </div>
          </div>
        )}
      </Artboard>
    </>
  );
}
