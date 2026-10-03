import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { pages } from "@/data/portfolioData";
import { t } from "@/i18n";
import { highlight, search } from "@/lib/search";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./SearchDialog.module.css";

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const shortcutLabel = () => (isMac() ? "⌘ K" : "Ctrl K");

/** Ctrl/⌘ + K anywhere, or "/" when not typing, opens search. */
export function useSearchShortcut(open) {
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    const onKey = (event) => {
      const typing = event.target.closest?.("input, textarea, select, [contenteditable]");
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openRef.current();
      } else if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !document.querySelector("dialog[open]")) {
        event.preventDefault();
        openRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

function Marked({ text, words }) {
  return highlight(text, words).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : part.text));
}

/* Search as a command palette on the native <dialog>: instant results while
   typing, grouped by kind, matches highlighted, full keyboard control
   (↑ ↓ Enter Esc), suggestions before you type and when nothing matches.
   Follows the ARIA combobox + listbox pattern. */
export default function SearchDialog({ open, onClose }) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { stop, start } = useSmoothScroll();
  const { play } = useSound();
  const id = useId();

  const { words, results, total } = useMemo(() => search(query), [query]);
  const flat = useMemo(() => results.flatMap((group) => group.items), [results]);
  const showingHome = query.trim() === "";
  const homeItems = useMemo(() => pages.map((page) => ({ id: `home:${page.to}`, title: page.label, text: page.file, to: page.to, icon: page.tool })), []);
  const options = showingHome ? homeItems : flat;

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      dialog.showModal();
      stop();
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
    if (!open) start();
  }, [open, stop, start]);

  useEffect(() => setActive(0), [query]);

  // keep the highlighted option in view
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item) => {
    if (!item) return;
    play("tick");
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (options.length ? (i + 1) % options.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (options.length ? (i - 1 + options.length) % options.length : 0));
    } else if (event.key === "Home" && event.ctrlKey) {
      setActive(0);
    } else if (event.key === "End" && event.ctrlKey) {
      setActive(Math.max(0, options.length - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(options[active]);
    }
  };

  const optionId = (i) => `${id}-opt-${i}`;
  let index = -1;
  const option = (item, words) => {
    index += 1;
    const i = index;
    return (
      <li
        key={item.id}
        id={optionId(i)}
        role="option"
        aria-selected={i === active}
        data-index={i}
        className={cx(styles.option, i === active && styles.active)}
        onPointerMove={() => i !== active && setActive(i)}
        onClick={() => go(item)}
      >
        <span className={styles.icon} aria-hidden="true">
          <Icon name={item.icon || "file"} size={16} />
        </span>
        <span className={styles.texts}>
          <span className={styles.title}>
            <Marked text={item.title} words={words} />
          </span>
          {item.text && (
            <span className={styles.sub}>
              <Marked text={item.text} words={words} />
            </span>
          )}
        </span>
        <Icon name="arrow" size={15} className={styles.enter} />
      </li>
    );
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={t("search.open")}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.panel}>
        <div className={styles.field}>
          <Icon name="zoom" size={20} className={styles.fieldIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("search.placeholder")}
            role="combobox"
            aria-expanded={options.length > 0}
            aria-controls={`${id}-list`}
            aria-activedescendant={options.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="go"
          />
          <button type="button" className={cx(styles.esc, "mono")} onClick={onClose} aria-label={t("search.close")}>
            Esc
          </button>
        </div>

        <div className={styles.body} data-lenis-prevent>
          <p className="sr-only" aria-live="polite">
            {showingHome ? "" : total ? t("search.count", { n: total }) : t("search.empty", { q: query.trim() })}
          </p>

          {showingHome ? (
            <>
              <div className={styles.suggest}>
                <span className={cx(styles.groupLabel, "mono")}>{t("search.try")}</span>
                <div className={styles.chips}>
                  {t("search.suggestions").map((word) => (
                    <button key={word} type="button" className={styles.chip} onClick={() => setQuery(word)}>
                      {word}
                    </button>
                  ))}
                </div>
              </div>
              <p className={cx(styles.groupLabel, "mono")}>{t("search.groups.pages")}</p>
              <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={t("search.groups.pages")} className={styles.list}>
                {homeItems.map((item) => option(item, []))}
              </ul>
            </>
          ) : total === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{t("search.empty", { q: query.trim() })}</p>
              <p>{t("search.emptyHint")}</p>
              <div className={styles.chips}>
                {t("search.suggestions").map((word) => (
                  <button key={word} type="button" className={styles.chip} onClick={() => setQuery(word)}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={t("search.open")} className={styles.list}>
              {results.map((group) => (
                <li key={group.group} role="presentation" className={styles.group}>
                  <p className={cx(styles.groupLabel, "mono")} aria-hidden="true">
                    {t(`search.groups.${group.group}`)}
                  </p>
                  <ul role="group" aria-label={t(`search.groups.${group.group}`)}>
                    {group.items.map((item) => option(item, words))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={cx(styles.foot, "mono")} aria-hidden="true">
          <span>{t("search.keys")}</span>
          {!showingHome && total > 0 && <span>{t("search.count", { n: total })}</span>}
        </p>
      </div>
    </dialog>
  );
}
