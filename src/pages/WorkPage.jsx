import { caseStudies } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cx } from "@/lib/utils";
import Archive from "@/components/sections/Archive";
import PageHeader from "@/components/sections/PageHeader";
import Artboard from "@/components/ui/Artboard";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import styles from "./WorkPage.module.css";

export default function WorkPage() {
  useDocumentTitle("Work");

  return (
    <>
      <PageHeader
        file="work.psd"
        eyebrow="Selected work"
        title="Proof, not promises."
        lede="Case studies from brand identities, social campaigns, canvas art and wall decals — then the full archive of everything else."
      />

      <Artboard id="case-studies" name="Case studies" file="case-studies.psd">
        <p className={cx("eyebrow", "mono")}>{caseStudies.length} case studies · hover to misregister</p>
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
