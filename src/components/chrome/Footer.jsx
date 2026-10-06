import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { useToast } from "@/context/ToastContext";
import { footer, site } from "@/data/portfolioData";
import { locale, t } from "@/i18n";
import { asset, copyText, cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import BrandLogo from "@/components/ui/BrandLogo";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import EasterEgg from "@/components/ui/EasterEgg";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./Footer.module.css";

// the time where I am, so a visitor knows whether I'm likely awake
function useLocalTime(timeZone) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return {
    iso: now.toISOString(),
    label: new Intl.DateTimeFormat(locale(), { timeZone, hour: "2-digit", minute: "2-digit" }).format(now),
  };
}

const NewTab = () => <span className="sr-only"> {t("footer.newTab")}</span>;

/* footer.psd — contact-first: the question, one primary action, then three
   ways to reach me as equal cards (email · WhatsApp · call), then the
   site map, the brand and the small print. */
export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();
  const toast = useToast();
  const time = useLocalTime(site.timeZone);

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

      <p className={cx(styles.status, "mono")}>
        <span className={styles.dot} aria-hidden="true" />
        <span>{t("footer.available")}</span>
        <span className={styles.sep} aria-hidden="true">·</span>
        <span>{t("footer.replies")}</span>
        <span className={styles.sep} aria-hidden="true">·</span>
        <span>
          {t("footer.localTime")}{" "}
          <time dateTime={time.iso} className={styles.clock} dir="ltr">
            {time.label}
          </time>
        </span>
      </p>

      <ul className={styles.contacts} aria-label={t("footer.contact")}>
        <li className={styles.card}>
          <span className={styles.cardIcon} aria-hidden="true">
            <Icon name="mail" size={20} />
          </span>
          <span className={cx(styles.cardKicker, "mono")}>{t("footer.email")}</span>
          {/* if it has to wrap, wrap at the @ — never in the middle of a word */}
          <a className={cx(styles.cardValue, styles.cardLink, styles.emailValue)} href={`mailto:${site.email}`} dir="ltr">
            <span>
              {site.email.split("@")[0]}
              <wbr />@{site.email.split("@")[1]}
            </span>
          </a>
          <button type="button" className={styles.copy} onClick={copyEmail} aria-label={t("footer.copyEmail")}>
            <Icon name="copy" size={15} />
            <span className="mono">{t("common.copy")}</span>
          </button>
        </li>

        <li className={styles.card}>
          <span className={cx(styles.cardIcon, styles.whatsapp)} aria-hidden="true">
            <BrandLogo id="whatsapp" size={20} />
          </span>
          <span className={cx(styles.cardKicker, "mono")}>{t("footer.whatsapp")}</span>
          <a className={cx(styles.cardValue, styles.cardLink)} href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
            {t("footer.whatsappValue")}
            <Icon name="arrowUpRight" size={16} className={styles.cardArrow} />
            <NewTab />
          </a>
          <span className={cx(styles.cardNote, "mono")} dir="ltr">
            {site.phone}
          </span>
        </li>

        <li className={styles.card}>
          <span className={styles.cardIcon} aria-hidden="true">
            <Icon name="phone" size={20} />
          </span>
          <span className={cx(styles.cardKicker, "mono")}>{t("footer.call")}</span>
          <a className={cx(styles.cardValue, styles.cardLink)} href={site.phoneHref} dir="ltr">
            {site.phone}
          </a>
          <span className={cx(styles.cardNote, "mono")}>{t("footer.callNote")}</span>
        </li>
      </ul>

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
                  <BrandLogo id={link.id} size={17} className={styles.social} />
                  {link.label}
                  <Icon name="arrowUpRight" size={14} className={styles.external} />
                  <NewTab />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.studio}>
          <p className={cx(styles.title, "mono")}>{t("footer.studio")}</p>
          <p className={styles.meta}>
            {site.location}
            <br />
            <span className={styles.metaDim}>{site.availability}</span>
          </p>
        </div>
      </div>

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
        <section className={styles.egg} aria-label={t("footer.doNotPress")}>
          <EasterEgg compact />
        </section>
        <button type="button" className={styles.toTop} onClick={() => scrollTo(0)}>
          {t("footer.backToTop")} <Icon name="up" size={14} />
        </button>
      </div>
    </Artboard>
  );
}
