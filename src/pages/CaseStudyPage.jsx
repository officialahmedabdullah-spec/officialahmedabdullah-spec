import { useCallback, useState } from "react";
import { Link, useParams } from "react-router";
import { caseStudies, getCaseStudy } from "@/data/portfolioData";
import { folderImages, projectImage } from "@/data/projectImages";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cx, pad } from "@/lib/utils";
import ProjectReviews from "@/components/reviews/ProjectReviews";
import PageHeader from "@/components/sections/PageHeader";
import Artboard from "@/components/ui/Artboard";
import BeforeAfter from "@/components/ui/BeforeAfter";
import Button from "@/components/ui/Button";
import CmykImage from "@/components/ui/CmykImage";
import Lightbox from "@/components/ui/Lightbox";
import RevealText from "@/components/ui/RevealText";
import TextLink from "@/components/ui/TextLink";
import NotFoundPage from "./NotFoundPage";
import styles from "./CaseStudyPage.module.css";

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  useDocumentTitle(study ? `${study.client} — ${study.category}` : "Not found");
  const [open, setOpen] = useState(null);

  const images = study ? (study.folder ? folderImages(study.folder) : study.images.map(projectImage).filter(Boolean)) : [];
  // key brand pieces (logo board, business card, brochure…) are shown large
  // first; everything else follows in the gallery. One lightbox covers both.
  const featureKeys = (study?.features ?? []).map((item) => item.key);
  const features = (study?.features ?? [])
    .map((item) => {
      const image = projectImage(item.key);
      return image && { ...image, caption: item.caption };
    })
    .filter(Boolean);
  const rest = images.filter((image) => !featureKeys.includes(image.key));
  const gallery = [...features, ...rest];
  const step = useCallback((dir) => setOpen((i) => (i == null ? i : (i + dir + gallery.length) % gallery.length)), [gallery.length]);
  const close = useCallback(() => setOpen(null), []);

  if (!study) return <NotFoundPage />;

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const cover = projectImage(study.cover);
  const nextCover = projectImage(next.cover);

  const facts = [
    ["Client", study.client],
    ["Discipline", study.category],
    ["Tools", study.tools.join(", ")],
    ["Deliverables", study.tags.join(" · ")],
  ];

  return (
    <div style={{ "--accent": study.accent }}>
      <PageHeader
        file={`${study.slug}.psd`}
        eyebrow={`Case study ${pad(index + 1)} · ${study.category}`}
        title={study.title}
        lede={study.summary}
        aside={
          <dl className={styles.facts}>
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="mono">{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className={styles.back}>
          <TextLink to="/work" arrow={false}>
            ← All work
          </TextLink>
        </div>
      </PageHeader>

      <Artboard id="cover" name="Cover" file={`${study.slug}-cover.jpg`} sheetClassName={styles.coverSheet}>
        <div data-cmyk-group data-cursor="view" data-cursor-label="Hover · CMYK">
          <CmykImage src={cover?.src} alt={`${study.client} — cover`} ratio="16 / 9" priority />
        </div>
      </Artboard>

      <Artboard id="story" name="Story" file="notes.txt">
        <div className={styles.story}>
          {[
            ["The brief", study.brief],
            ["The approach", study.approach],
            ["The result", study.outcome],
          ].map(([title, text], i) => (
            <section key={title} className={styles.chapter}>
              <p className={cx(styles.chapterN, "mono")}>{pad(i + 1)}</p>
              <h2 className="h-md">{title}</h2>
              <p className={styles.chapterText}>{text}</p>
            </section>
          ))}
        </div>
      </Artboard>

      {study.compare && (
        <Artboard id="compare" name="Before / after" file="compare.psd">
          <p className={cx("eyebrow", "mono")}>Drag to compare</p>
          <RevealText className={cx("h-lg", styles.compareTitle)}>
            {`From ${study.compare.labels[0].toLowerCase()} to ${study.compare.labels[1].toLowerCase()}.`}
          </RevealText>
          <BeforeAfter
            before={projectImage(study.compare.before)?.src}
            after={projectImage(study.compare.after)?.src}
            labels={study.compare.labels}
            alt={study.client}
          />
        </Artboard>
      )}

      {features.length > 0 && (
        <Artboard id="brand" name="Brand pieces" file="brand-applications.psd">
          <p className={cx("eyebrow", "mono")}>The identity, applied · click to zoom</p>
          <RevealText className={cx("h-lg", styles.compareTitle)}>From the logo to everything it's printed on.</RevealText>
          <ol className={styles.features}>
            {features.map((image, i) => (
              <li key={image.key} className={styles.feature}>
                <button type="button" className={styles.tile} onClick={() => setOpen(i)} data-cursor="view" data-cursor-label="Zoom">
                  <img src={image.src} alt={image.title} loading="lazy" decoding="async" />
                </button>
                <p className={styles.featureCaption}>
                  <span className="mono">{pad(i + 1)}</span>
                  {image.caption}
                </p>
              </li>
            ))}
          </ol>
        </Artboard>
      )}

      {rest.length > 0 && (
        <Artboard id="gallery" name="Gallery" file="gallery.psd">
          <p className={cx("eyebrow", "mono")}>
            {rest.length} {rest.length === 1 ? "board" : "pieces"}
            {features.length > 0 ? " from the campaign" : ""} · click to zoom
          </p>
          <ul className={cx(styles.gallery, rest.length === 1 && styles.single)}>
            {rest.map((image, i) => (
              <li key={image.key}>
                <button
                  type="button"
                  className={styles.tile}
                  onClick={() => setOpen(features.length + i)}
                  data-cursor="view"
                  data-cursor-label="Zoom"
                >
                  <img src={rest.length === 1 ? image.src : image.thumb} alt={image.title} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </Artboard>
      )}

      <ProjectReviews slug={study.slug} client={study.client} />

      {gallery.length > 0 && (
        <Lightbox items={gallery.map((image) => ({ ...image, category: study.client }))} index={open} onNavigate={step} onClose={close} />
      )}

      <Artboard id="next" name="Next project" file="next.psd" tone="ink" sheetClassName="on-ink">
        <Link to={`/work/${next.slug}`} className={styles.next} data-cmyk-group data-cursor="view" data-cursor-label="Next">
          <div>
            <p className={cx("eyebrow", "mono")}>Next case study</p>
            <p className={cx("h-lg", styles.nextTitle)}>{next.client}</p>
            <p className={styles.nextSub}>{next.title}</p>
          </div>
          <CmykImage src={nextCover?.thumb} alt="" ratio="4 / 3" />
        </Link>
        <div className={styles.nextCta}>
          <Button to="/contact" variant="light">
            Start something like this
          </Button>
        </div>
      </Artboard>
    </div>
  );
}
