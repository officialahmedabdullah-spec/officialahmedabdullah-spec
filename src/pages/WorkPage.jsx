import { caseStudies } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Archive from "@/components/sections/Archive";
import PageHeader from "@/components/sections/PageHeader";
import Artboard from "@/components/ui/Artboard";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import styles from "./WorkPage.module.css";

export default function WorkPage() {
  useDocumentTitle(t("workPage.title"));

  return (
    <>
      <PageHeader file="work.psd" eyebrow={t("workPage.eyebrow")} title={t("workPage.headline")} lede={t("workPage.lede")} />

      <Artboard id="case-studies" name={t("layer.caseStudies")} file="case-studies.psd">
        <p className={cx("eyebrow", "mono")}>{t("workPage.count", { n: caseStudies.length })}</p>
        <div className={styles.grid}>
          {caseStudies.map((study, i) => (
            <div key={study.slug} className={i === 0 ? styles.wide : undefined}>
              <CaseStudyCard study={study} index={i} large={i === 0} />
            </div>
          ))}
        </div>
      </Artboard>

      <Archive />
    </>
  );
}
