import { useRef } from "react";
import { Link, useParams } from "react-router";
import { getService, mailto } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset, cx, pad, reducedMotion } from "@/lib/utils";
import PageHeader from "@/components/sections/PageHeader";
import Steps from "@/components/sections/Steps";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";
import CmykImage from "@/components/ui/CmykImage";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import TextLink from "@/components/ui/TextLink";
import NotFoundPage from "./NotFoundPage";
import styles from "./ServiceDetailPage.module.css";

function Deliverables({ items }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(`.${styles.deliverable}`, {
        x: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 80%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );
  return (
    <ol ref={ref} className={styles.deliverables}>
      {items.map(([title, text], i) => (
        <li key={title} className={styles.deliverable}>
          <span className={cx(styles.dn, "mono")}>{pad(i + 1)}</span>
          <h3 className={styles.dTitle}>{title}</h3>
          <p className={styles.dText}>{text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getService(slug);
  useDocumentTitle(service?.title ?? "Not found");

  if (!service) return <NotFoundPage />;

  return (
    <>
      <PageHeader
        file={`${service.slug}.ai`}
        eyebrow={`Service ${service.number} / ${service.total} · ${service.group}`}
        title={service.heading.join(" ")}
        lede={service.lead}
        aside={
          <div data-cmyk-group data-cursor="view" data-cursor-label="Hover · CMYK">
            <CmykImage src={asset(service.image)} alt={`${service.title} — sample of the work`} ratio="4 / 5" />
            <p className={cx(styles.caption, "mono")}>{service.caption}</p>
          </div>
        }
      >
        <div className={styles.actions}>
          <Button to="/contact">Start this project</Button>
          <TextLink to={service.secondary.to}>{service.secondary.label}</TextLink>
        </div>
        <p className={styles.promise}>
          <span className="mono">Promise</span>
          {service.promise}
        </p>
      </PageHeader>

      <Artboard id="deliverables" name="Deliverables" file="deliverables.psd" tone="ink" sheetClassName="on-ink">
        <p className={cx("eyebrow", "mono")}>What lands in your folder</p>
        <RevealText className="h-lg">What you receive.</RevealText>
        <Deliverables items={service.deliverables} />
      </Artboard>

      <Steps title="Four steps, no surprises." steps={service.steps} />

      {service.pieces && (
        <Artboard id="pieces" name="Pieces" file="pieces.psd">
          <p className={cx("eyebrow", "mono")}>Selected pieces</p>
          <RevealText className={cx("h-lg", styles.piecesTitle)}>Made for the wall it lives on.</RevealText>
          <ul className={styles.pieces}>
            {service.pieces.map((piece) => (
              <li key={piece.title}>
                <a href={mailto(piece.subject)} className={styles.piece} data-cmyk-group data-cursor="view" data-cursor-label="Ask">
                  <CmykImage src={asset(piece.image)} alt={piece.alt} ratio="1" />
                  <strong>{piece.title}</strong>
                  <span className="mono">{piece.sub}</span>
                </a>
              </li>
            ))}
          </ul>
        </Artboard>
      )}

      <Artboard id="next-step" name="Next step" file="next-step.psd" tone="signal">
        <div className={styles.cta}>
          <RevealText className="h-xl">{service.cta.title.join(" ")}</RevealText>
          <p className={styles.ctaText}>{service.cta.text}</p>
          <div className={styles.actions}>
            <Button to="/contact" variant="dark">
              Start a project
            </Button>
            <Button href={mailto(`${service.title} enquiry`)} variant="ghost" icon={null}>
              Email directly
            </Button>
          </div>
        </div>
      </Artboard>

      <Artboard id="related" name="Related" file="related.psd">
        <p className={cx("eyebrow", "mono")}>Pairs well with</p>
        <p className={styles.relatedNote}>{service.otherNote}</p>
        <ul className={styles.related}>
          {service.related.map((relatedSlug) => {
            const related = getService(relatedSlug);
            return (
              <li key={relatedSlug}>
                <Link to={`/services/${relatedSlug}`} className={styles.chip}>
                  <Icon name={related.icon} size={16} />
                  {related.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </Artboard>
    </>
  );
}
