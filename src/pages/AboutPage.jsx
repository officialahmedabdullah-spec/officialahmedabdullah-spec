import { aboutIntro, mailto, site } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import { asset, cx } from "@/lib/utils";
import ChatProcess from "@/components/sections/ChatProcess";
import History from "@/components/sections/History";
import PageHeader from "@/components/sections/PageHeader";
import Skills from "@/components/sections/Skills";
import Button from "@/components/ui/Button";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  useDocumentTitle(t("about.title"));

  return (
    <>
      <PageHeader
        file="about.psd"
        eyebrow={t("about.eyebrow", { location: site.location })}
        title={aboutIntro.title}
        lede={aboutIntro.summary}
        aside={
          <figure className={styles.photo} data-cursor="view" data-cursor-label={t("about.photoCursor")}>
            <img src={asset(site.aboutPhoto)} alt={t("hero.portraitAlt", { name: site.name })} width="801" height="820" />
            <span className={styles.halftone} aria-hidden="true" />
            <figcaption className={cx(styles.caption, "mono")}>{site.name} · {site.role}</figcaption>
          </figure>
        }
      >
        <div className={styles.actions}>
          <Button to="/contact">{t("about.workWithMe")}</Button>
          <Button href={mailto(t("about.cvSubject"))} variant="ghost" icon={null}>
            {t("about.requestCv")}
          </Button>
        </div>
      </PageHeader>

      <History />
      <Skills />
      <ChatProcess />
    </>
  );
}
