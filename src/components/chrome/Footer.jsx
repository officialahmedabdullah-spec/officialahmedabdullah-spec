import { Link } from "react-router";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { useToast } from "@/context/ToastContext";
import { footer, site } from "@/data/portfolioData";
import { t } from "@/i18n";
import { asset, copyText, cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import EasterEgg from "@/components/ui/EasterEgg";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./Footer.module.css";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();
  const toast = useToast();

  const copyEmail = async () => {
    const ok = await copyText(site.email);
    play("copy");
    toast(ok ? t("common.copied", { value: site.email }) : site.email);
  };

  return (
    <Artboard id="footer" name={t("layer.footer")} file="footer.psd" tone="ink" sheetClassName="on-ink">
      <div className={styles.top}>
        <RevealText as="h2" className={cx("h-xl", styles.headline)}>
          {footer.headline[0]} <span className={styles.accent}>{footer.headline[1]}</span>
        </RevealText>
        <div className={styles.cta}>
          <Button to="/contact">{t("common.startProject")}</Button>
        </div>
      </div>

      <div className={styles.mail}>
        <a className={styles.mailLink} href={`mailto:${site.email}`} dir="ltr">
          {site.email}
        </a>
        <button type="button" className={styles.copy} onClick={copyEmail} aria-label={t("footer.copyEmail")}>
          <Icon name="copy" size={16} />
          <span className="mono">{t("common.copy")}</span>
        </button>
      </div>

      <div className={styles.grid}>
        <nav aria-label={t("footer.nav")}>
          <p className={cx(styles.title, "mono")}>{t("footer.pages")}</p>
          <ul className={styles.list}>
            {footer.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className={cx(styles.title, "mono")}>{t("footer.elsewhere")}</p>
          <ul className={styles.list}>
            {site.social.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={cx(styles.title, "mono")}>{t("footer.studio")}</p>
          <p className={styles.meta}>
            {site.location}
            <br />
            <a href={site.phoneHref} dir="ltr">
              {site.phone}
            </a>
          </p>
        </div>
      </div>

      <section className={styles.eggRow} aria-label={t("footer.doNotPress")}>
        <p className={cx(styles.title, "mono")}>{t("footer.doNotPressSeriously")}</p>
        <EasterEgg />
      </section>

      <div className={styles.brand}>
        <span className={styles.brandMark}>
          <BrandMark />
        </span>
        <img className={styles.wordmark} src={asset("brand/wordmark-on-dark.webp")} alt={site.studio} width="1200" height="193" loading="lazy" />
      </div>

      <div className={cx(styles.legal, "mono")}>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className={styles.legalLinks}>
          {footer.legal.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </span>
        <button type="button" className={styles.top2} onClick={() => scrollTo(0)}>
          {t("footer.backToTop")} <Icon name="up" size={14} />
        </button>
      </div>
    </Artboard>
  );
}
