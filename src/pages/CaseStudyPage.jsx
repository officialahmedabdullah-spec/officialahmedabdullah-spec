import { useCallback, useState } from "react";
import { Link, useParams } from "react-router";
import { caseStudies, getCaseStudy } from "@/data/portfolioData";
import { folderImages, projectImage } from "@/data/projectImages";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getLang, t } from "@/i18n";
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
  useDocumentTitle(study ? `${study.client} — ${study.category}` : t("common.notFound"));
  const [open, setOpen] = useState(null);

  const images = study ? (study.folder ? folderImages(study.folder) : study.images.map(projectImage).filter(Boolean)) : [];
  // key brand pieces (logo board, business card, brochure…) are shown large
  // first; everything else follows in the gallery. One lightbox covers both.
  const featureKeys = (study?.features ?? []).map((item) => item.key);
  const features = (study?.features ?? [])
    .map((item) => {
      const image = projectImage(item.key);
      return image && { ...image, caption: item.caption, wide: item.wide };
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
    [t("caseStudy.client"), study.client],
    [t("caseStudy.discipline"), study.category],
    [t("caseStudy.tools"), study.tools.join(getLang() === "ar" ? "، " : ", ")],
    [t("caseStudy.deliverables"), study.tags.join(" · ")],
  ];

  return (
    <div style={{ "--accent": study.accent }}>
      <PageHeader
        file={`${study.slug}.psd`}
        eyebrow={t("caseStudy.eyebrow", { n: pad(index + 1), category: study.category })}
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
            {t("caseStudy.allWork")}
          </TextLink>
        </div>
      </PageHeader>

      <Artboard id="cover" name={t("layer.cover")} file={`${study.slug}-cover.jpg`} sheetClassName={styles.coverSheet}>
        <div data-cmyk-group data-cursor="view" data-cursor-label={t("caseStudy.cmyk")}>
          <CmykImage src={cover?.src} alt={t("caseStudy.coverAlt", { client: study.client })} ratio="16 / 9" priority />
        </div>
      </Artboard>

      <Artboard id="story" name={t("layer.story")} file="notes.txt">
        <div className={styles.story}>
          {[
            [t("caseStudy.brief"), study.brief],
            [t("caseStudy.approach"), study.approach],
            [t("caseStudy.result"), study.outcome],
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
        <Artboard id="compare" name={t("layer.compare")} file="compare.psd">
          <p className={cx("eyebrow", "mono")}>{t("caseStudy.dragCompare")}</p>
          <RevealText className={cx("h-lg", styles.compareTitle)}>
            {t("caseStudy.compareTitle", { a: study.compare.labels[0].toLowerCase(), b: study.compare.labels[1].toLowerCase() })}
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
        <Artboard id="brand" name={t("layer.brandPieces")} file="brand-applications.psd">
          <p className={cx("eyebrow", "mono")}>{t("caseStudy.appliedEyebrow")}</p>
          <RevealText className={cx("h-lg", styles.compareTitle)}>{t("caseStudy.appliedTitle")}</RevealText>
          <ol className={styles.features}>
            {features.map((image, i) => {
              // "Business card — front, and a back…" → a title and a detail line
              const [name, ...detail] = image.caption.split(" — ");
              return (
                <li key={image.key} className={cx(styles.feature, image.wide && styles.wide)}>
                  <button type="button" className={styles.mat} onClick={() => setOpen(i)} data-cursor="view" data-cursor-label={t("common.zoom")}>
                    <img src={image.src} alt={image.title} loading="lazy" decoding="async" />
                  </button>
                  <p className={styles.featureCaption}>
                    <span className={cx(styles.featureN, "mono")}>{pad(i + 1)}</span>
                    <span>
                      <strong className={styles.featureName}>{name}</strong>
                      {detail.length > 0 && <span className={styles.featureDetail}>{detail.join(" — ")}</span>}
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>
        </Artboard>
      )}

      {rest.length > 0 && (
        <Artboard id="gallery" name={t("layer.gallery")} file="gallery.psd">
          <p className={cx("eyebrow", "mono")}>{t("caseStudy.gallery", { n: rest.length, campaign: features.length > 0 })}</p>
          <ul className={cx(styles.gallery, rest.length === 1 && styles.single)}>
            {rest.map((image, i) => (
              <li key={image.key}>
                <button
                  type="button"
                  className={styles.tile}
                  onClick={() => setOpen(features.length + i)}
                  data-cursor="view"
                  data-cursor-label={t("common.zoom")}
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

      <Artboard id="next" name={t("layer.nextProject")} file="next.psd" tone="ink" sheetClassName="on-ink">
        <Link to={`/work/${next.slug}`} className={styles.next} data-cmyk-group data-cursor="view" data-cursor-label={t("common.next")}>
          <div>
            <p className={cx("eyebrow", "mono")}>{t("caseStudy.nextEyebrow")}</p>
            <p className={cx("h-lg", styles.nextTitle)}>{next.client}</p>
            <p className={styles.nextSub}>{next.title}</p>
          </div>
          <CmykImage src={nextCover?.thumb} alt="" ratio="4 / 3" />
        </Link>
        <div className={styles.nextCta}>
          <Button to="/contact" variant="light">
            {t("caseStudy.startLike")}
          </Button>
        </div>
      </Artboard>
    </div>
  );
}
