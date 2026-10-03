import { createContext, Fragment, useCallback, useContext, useMemo, useState } from "react";
import { applyLanguage, getLang, LANGS } from "./index";

const LanguageContext = createContext(null);

function initialLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = localStorage.getItem("lang");
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

/* Holds the language and re-mounts everything below it when it changes,
   so every component, animation and text measurement starts fresh in the
   new language and direction. */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage);
  // content and <html lang/dir> must be switched before the children render
  if (getLang() !== lang || document.documentElement.lang !== lang) applyLanguage(lang);

  const setLang = useCallback((next) => {
    try {
      localStorage.setItem("lang", next);
    } catch {
      /* the switch still works for this visit */
    }
    // a shared ?lang= link shouldn't override the visitor's own choice later
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      window.history.replaceState(window.history.state, "", url);
    }
    setLangState(next);
  }, []);

  const value = useMemo(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle: () => setLang(lang === "ar" ? "en" : "ar") }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      <Fragment key={lang}>{children}</Fragment>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
