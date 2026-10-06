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

/* footer.psd — four calm rows: the question and one action; how to reach
   me; the brand; the site map and small print. */
export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();
  const toast = useToast();
  const time = useLocalTime(site.timeZone);
  const [user, domain] = site.email.split("@");

  const copyEmail = async () => {
    const ok = await copyText(site.email);
    play("copy");
    toast(ok ? t("common.copied", { value: site.email }) : site.email);
  };

  const profiles = [{ id: "whatsapp", label: t("footer.whatsapp"), href: site.whatsappHref }, ...site.social];

  return (
    <Artboard id="footer" name={t("layer.footer")} file="footer.psd" tone="ink" sheetClassName="on-ink">
      <div className={styles.top}>
        <RevealText as="h2" className={cx("h-xl", styles.headline)}>
          {footer.headline[0]} <span className={styles.accent}>{footer.headline[1]}</span>
        </RevealText>
        <Button to="/contact">{t("common.startProject")}</Button>
      </div>

      <div className={styles.contact}>
        <div>
          <p className={styles.mailRow}>
            {/* if it has to wrap, wrap at the @ — never mid-word */}
            <a className={styles.mail} href={`mailto:${site.email}`} dir="ltr">
              {user}
              <wbr />@{domain}
            </a>
            <button type="button" className={styles.copy} onClick={copyEmail} aria-label={t("footer.copyEmail")}>
              <Icon name="copy" size={16} />
            </button>
          </p>
          <p className={cx(styles.status, "mono")}>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              {t("footer.available")} · {t("footer.localTime")}{" "}
              <time dateTime={time.iso} className={styles.clock} dir="ltr">
                {time.label}
              </time>
            </span>
          </p>
        </div>

        <ul className={styles.profiles}>
          {profiles.map((p) => (
            <li key={p.id}>
              <a className={styles.profile} href={p.href} target="_blank" rel="noopener noreferrer" title={p.label}>
                <BrandLogo id={p.id} size={19} />
                <span className="sr-only">
                  {p.label} {t("footer.newTab")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.brand}>
        <span className={styles.brandMark}>
          <BrandMark />
        </span>
        <img className={styles.wordmark} src={asset("brand/wordmark-on-dark.webp")} alt={site.studio} width="1200" height="193" loading="lazy" />
      </div>

      <div className={styles.bottom}>
        <nav aria-label={t("footer.nav")}>
          <ul className={styles.pages}>
            {footer.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cx(styles.legal, "mono")}>
          <span className={styles.group}>
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            {footer.legal.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </span>
          <span className={styles.group}>
            <section aria-label={t("footer.doNotPress")} className={styles.egg}>
              <EasterEgg compact />
            </section>
            <button type="button" className={styles.toTop} onClick={() => scrollTo(0)}>
              {t("footer.backToTop")} <Icon name="up" size={14} />
            </button>
          </span>
        </div>
      </div>
    </Artboard>
  );
}
