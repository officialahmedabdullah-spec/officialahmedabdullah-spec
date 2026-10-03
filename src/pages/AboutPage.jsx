import { aboutIntro, site } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { asset, cx } from "@/lib/utils";
import ChatProcess from "@/components/sections/ChatProcess";
import History from "@/components/sections/History";
import PageHeader from "@/components/sections/PageHeader";
import Skills from "@/components/sections/Skills";
import Button from "@/components/ui/Button";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  useDocumentTitle("About");

  return (
    <>
      <PageHeader
        file="about.psd"
        eyebrow={`About · ${site.location}`}
        title={aboutIntro.title}
        lede={aboutIntro.summary}
        aside={
          <figure className={styles.photo} data-cursor="view" data-cursor-label="That's me">
            <img src={asset(site.aboutPhoto)} alt={`${site.name}, graphic and web designer`} width="801" height="820" />
            <span className={styles.halftone} aria-hidden="true" />
            <figcaption className={cx(styles.caption, "mono")}>{site.name} · {site.role}</figcaption>
          </figure>
        }
      >
        <div className={styles.actions}>
          <Button to="/contact">Work with me</Button>
          <Button href={`mailto:${site.email}?subject=CV%20request`} variant="ghost" icon={null}>
            Request full CV
          </Button>
        </div>
      </PageHeader>

      <History />
      <Skills />
      <ChatProcess />
    </>
  );
}
