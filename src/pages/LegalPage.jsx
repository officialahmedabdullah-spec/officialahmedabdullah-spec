import { legal } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cx } from "@/lib/utils";
import PageHeader from "@/components/sections/PageHeader";
import Artboard from "@/components/ui/Artboard";
import styles from "./LegalPage.module.css";

export default function LegalPage() {
  useDocumentTitle("Privacy, terms & cookies");

  return (
    <>
      <PageHeader file="legal.txt" eyebrow={`Last updated ${legal.updated}`} title="The small print, written plainly." />
      {legal.sections.map((section) => (
        <Artboard key={section.id} id={section.id} name={section.title} file={`${section.id}.txt`}>
          <div className={styles.body}>
            <h2 className={cx("h-md", styles.title)}>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </Artboard>
      ))}
    </>
  );
}
