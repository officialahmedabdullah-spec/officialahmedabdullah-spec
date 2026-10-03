import { useSearchParams } from "react-router";
import { useReviews } from "@/context/ReviewsContext";
import { getCaseStudy, getService } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import PageHeader from "@/components/sections/PageHeader";
import ReviewForm from "@/components/reviews/ReviewForm";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";

/* /review — a link to send clients after a project. It can be pre-filled:
     /review?project=codespark-solutions
     /review?service=logo-design */
export default function ReviewPage() {
  useDocumentTitle(t("reviewPage.title"));
  const { configured } = useReviews();
  const [params] = useSearchParams();
  const project = getCaseStudy(params.get("project") ?? "") ? params.get("project") : "";
  const service = getService(params.get("service") ?? "") ? params.get("service") : "";
  const study = project ? getCaseStudy(project) : null;

  return (
    <>
      <PageHeader
        file="review.psd"
        eyebrow={t("reviewPage.title")}
        title={study ? t("reviewPage.headlineProject", { client: study.client }) : t("reviewPage.headline")}
        lede={t("reviewPage.lede")}
      />
      <Artboard id="review-form" name={t("layer.reviewForm")} file="new-comment.psd">
        {configured ? (
          <ReviewForm initialProject={project} initialService={service} />
        ) : (
          <div>
            <p className="lede">{t("reviewPage.closed")}</p>
            <div style={{ marginTop: 24 }}>
              <Button to="/contact">{t("common.contactMe")}</Button>
            </div>
          </div>
        )}
      </Artboard>
    </>
  );
}
