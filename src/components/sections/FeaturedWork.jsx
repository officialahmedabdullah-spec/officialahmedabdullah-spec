import { caseStudies } from "@/data/portfolioData";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import RevealText from "@/components/ui/RevealText";
import TextLink from "@/components/ui/TextLink";
import styles from "./FeaturedWork.module.css";

/* work.psd — selected case studies. Hover a card to pull its inks apart. */
export default function FeaturedWork({ limit = caseStudies.length }) {
  const [first, ...rest] = caseStudies.slice(0, limit);

  return (
    <Artboard id="work" name={t("layer.selectedWork")} file="selected-work.psd">
      <div className={styles.head}>
        <div>
          <p className={cx("eyebrow", "mono")}>{t("featured.eyebrow")}</p>
          <RevealText className="h-lg">{t("featured.title")}</RevealText>
        </div>
        <TextLink to="/work">{t("featured.all")}</TextLink>
      </div>

      <div className={styles.grid}>
        <div className={styles.feature}>
          <CaseStudyCard study={first} index={0} large />
        </div>
        {rest.map((study, i) => (
          <CaseStudyCard key={study.slug} study={study} index={i + 1} />
        ))}
      </div>
    </Artboard>
  );
}
