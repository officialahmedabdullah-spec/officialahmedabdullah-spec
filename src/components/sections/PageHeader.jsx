import { useIntro } from "@/context/IntroContext";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import RevealText from "@/components/ui/RevealText";
import styles from "./PageHeader.module.css";

/* The first artboard of an inner page: eyebrow, big h1, lede, optional aside. */
export default function PageHeader({ id = "intro", name = "Intro", file, eyebrow, title, lede, aside, children }) {
  const { ready } = useIntro();
  return (
    <Artboard id={id} name={name} file={file}>
      <div className={cx(styles.header, aside && styles.withAside)}>
        <div>
          {eyebrow && <p className={cx("eyebrow", "mono")}>{eyebrow}</p>}
          <RevealText as="h1" className={cx("h-xl", styles.title)} play={ready} delay={0.3} data-cursor="pen">
            {title}
          </RevealText>
          {lede && <p className={cx("lede", styles.lede)}>{lede}</p>}
          {children}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </Artboard>
  );
}
