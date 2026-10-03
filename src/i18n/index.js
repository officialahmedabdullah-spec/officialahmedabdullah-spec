/* Tiny i18n: English and Arabic.

   - UI strings live in ./strings.js, looked up with t("brief.send").
   - Content (services, case studies…) lives in src/data/content.*.js and is
     swapped behind the same imports by setContentLanguage().
   - Switching language re-mounts the app (see LanguageContext), so plain
     module reads like t() and `services` are always current while rendering. */
import { setContentLanguage } from "@/data/portfolioData";
import { strings } from "./strings";

export const LANGS = ["en", "ar"];
let current = "en";

export const getLang = () => current;
export const isRtl = () => current === "ar";

export function applyLanguage(lang) {
  current = LANGS.includes(lang) ? lang : "en";
  setContentLanguage(current);
  const root = document.documentElement;
  root.lang = current;
  root.dir = current === "ar" ? "rtl" : "ltr";
  return current;
}

const lookup = (table, key) => key.split(".").reduce((node, part) => (node == null ? node : node[part]), table);

/** t("reviews.showAll", { n: 8 }) → "Show all 8 reviews". Falls back to English, then the key. */
export function t(key, vars) {
  let value = lookup(strings[current], key);
  if (value == null) value = lookup(strings.en, key);
  if (value == null) return key;
  if (typeof value === "function") return value(vars ?? {});
  if (!vars || typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

// numbers and dates in the current language (Western digits in both)
export const locale = () => (current === "ar" ? "ar-SA-u-nu-latn" : "en");
