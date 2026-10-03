import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { useTheme } from "@/context/ThemeContext";
import { pages, site } from "@/data/portfolioData";
import { t } from "@/i18n";
import { useLanguage } from "@/i18n/LanguageContext";
import { cx } from "@/lib/utils";
import BrandMark from "@/components/ui/BrandMark";
import { Icon } from "@/components/ui/Icon";
import SearchDialog, { shortcutLabel, useSearchShortcut } from "./SearchDialog";
import styles from "./Topbar.module.css";

export function currentFile(pathname) {
  if (pathname.startsWith("/work/")) return `${pathname.split("/")[2]}.psd`;
  if (pathname.startsWith("/services/")) return `${pathname.split("/")[2]}.ai`;
  if (pathname === "/legal") return "legal.txt";
  if (pathname === "/review") return "review.psd";
  return pages.find((page) => page.to === pathname)?.file ?? "untitled-1.psd";
}

function ChromeButton({ label, pressed, onClick, icon, children, ...props }) {
  return (
    <button type="button" className={styles.chip} aria-pressed={pressed} aria-label={label} title={label} onClick={onClick} {...props}>
      <Icon name={icon} size={15} />
      {children && <span className={styles.chipText}>{children}</span>}
    </button>
  );
}

/* Top application bar: logo, menu, the open "document" tab and controls. */
export default function Topbar({ layersOpen, onToggleLayers }) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const sound = useSound();
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();
  const { toggle: toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
    sound.play("pop");
  };
  useSearchShortcut(openSearch);

  useEffect(() => setMenuOpen(false), [pathname]);

  // while the menu sheet is open: Escape closes it and the page behind stays put
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    stopScroll();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, stopScroll, startScroll]);

  const controls = (
    <>
      <ChromeButton
        icon={sound.enabled ? "soundOn" : "soundOff"}
        label={sound.enabled ? t("topbar.turnSoundOff") : t("topbar.turnSoundOn")}
        pressed={sound.enabled}
        onClick={sound.toggle}
      >
        {sound.enabled ? t("topbar.soundOn") : t("topbar.soundOff")}
      </ChromeButton>
      <ChromeButton
        icon={theme === "dark" ? "sun" : "moon"}
        label={theme === "dark" ? t("topbar.toLight") : t("topbar.toDark")}
        onClick={() => {
          toggleTheme();
          sound.play("toggle");
        }}
      >
        {theme === "dark" ? t("topbar.lightUi") : t("topbar.darkUi")}
      </ChromeButton>
    </>
  );

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.app} aria-label={t("topbar.home", { name: site.name })}>
        <BrandMark className={styles.mark} />
      </Link>

      <nav className={styles.menu} aria-label={t("topbar.main")}>
        {pages.map((page) => (
          <NavLink key={page.to} to={page.to} end={page.to === "/"} className={styles.menuLink}>
            {page.label}
          </NavLink>
        ))}
      </nav>

      <span className={cx(styles.doc, "mono")} aria-hidden="true">
        {currentFile(pathname)} <span className={styles.docMeta}>@ 100% (RGB/8)</span>
        <span className={styles.docX}>×</span>
      </span>

      <span className={styles.spacer} />

      <button type="button" className={cx(styles.chip, styles.search)} onClick={openSearch} aria-label={t("search.open")} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K /">
        <Icon name="zoom" size={15} />
        <span className={styles.searchText}>{t("search.button")}</span>
        <kbd className={cx(styles.kbd, "mono")}>{shortcutLabel()}</kbd>
      </button>

      <div className={styles.controls}>{controls}</div>

      <button type="button" className={cx(styles.chip, styles.lang)} onClick={toggleLanguage} aria-label={t("topbar.languageLabel")} title={t("topbar.languageLabel")} lang={t("topbar.language") === "English" ? "en" : "ar"}>
        {t("topbar.language")}
      </button>

      <Link to="/contact" className={styles.cta}>
        {t("common.letsTalk")}
      </Link>

      <button
        type="button"
        className={cx(styles.chip, styles.layersBtn)}
        aria-expanded={layersOpen}
        aria-controls="layers-panel"
        onClick={onToggleLayers}
      >
        <Icon name="layers" size={15} />
        <span className={styles.chipText}>{t("topbar.layers")}</span>
      </button>

      <button
        type="button"
        className={cx(styles.chip, styles.menuBtn)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? t("topbar.closeMenu") : t("topbar.openMenu")}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? "close" : "menu"} size={18} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.sheet}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } }}
          >
            <nav aria-label={t("topbar.mobile")}>
              <ol className={styles.sheetList}>
                {pages.map((page, i) => (
                  <motion.li
                    key={page.to}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                  >
                    <NavLink to={page.to} end={page.to === "/"} className={styles.sheetLink}>
                      <span className="mono">{page.file}</span>
                      {page.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ol>
            </nav>
            <div className={styles.sheetControls}>{controls}</div>
            <a className={styles.sheetMail} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
