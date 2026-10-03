/* The site's content, in the current language.

   Components keep importing { services, site, … } from here. The values
   are live bindings: setContentLanguage("ar") swaps every export to the
   Arabic text (content.ar.js layered over content.en.js), and the app
   re-mounts so the next render reads the new language. */
import * as en from "./content.en.js";
import ar from "./content.ar.js";

/* Lay Arabic text over the English structure: objects merge by key,
   arrays by position, anything not given in Arabic stays as in English
   (slugs, images, colours, numbers). */
function overlay(base, top) {
  if (top === undefined || top === null) return base;
  if (Array.isArray(base)) return Array.isArray(top) ? base.map((item, i) => overlay(item, top[i])) : base;
  if (base && typeof base === "object" && typeof top === "object") {
    const out = { ...base };
    for (const key of Object.keys(top)) out[key] = overlay(base[key], top[key]);
    return out;
  }
  return top;
}

const EN = { ...en };
const AR = Object.fromEntries(Object.keys(en).map((key) => [key, overlay(en[key], ar[key])]));

export let site = EN.site;
export let pages = EN.pages;
export let services = EN.services;
export let menuServices = EN.services.filter((service) => service.inMenu);
export let servicesIntro = EN.servicesIntro;
export let workProcess = EN.workProcess;
export let hero = EN.hero;
export let ticker = EN.ticker;
export let statement = EN.statement;
export let serviceFrames = EN.serviceFrames;
export let logoBuild = EN.logoBuild;
export let aboutIntro = EN.aboutIntro;
export let skills = EN.skills;
export let achievements = EN.achievements;
export let history = EN.history;
export let chat = EN.chat;
export let packages = EN.packages;
export let archiveCategories = EN.archiveCategories;
export let imageTitles = EN.imageTitles;
export let caseStudies = EN.caseStudies;
export let contact = EN.contact;
export let legal = EN.legal;
export let footer = EN.footer;
export let searchFacts = EN.searchFacts;

export function setContentLanguage(lang) {
  const c = lang === "ar" ? AR : EN;
  site = c.site;
  pages = c.pages;
  services = c.services;
  menuServices = c.services.filter((service) => service.inMenu);
  servicesIntro = c.servicesIntro;
  workProcess = c.workProcess;
  hero = c.hero;
  ticker = c.ticker;
  statement = c.statement;
  serviceFrames = c.serviceFrames;
  logoBuild = c.logoBuild;
  aboutIntro = c.aboutIntro;
  skills = c.skills;
  achievements = c.achievements;
  history = c.history;
  chat = c.chat;
  packages = c.packages;
  archiveCategories = c.archiveCategories;
  imageTitles = c.imageTitles;
  caseStudies = c.caseStudies;
  contact = c.contact;
  legal = c.legal;
  footer = c.footer;
  searchFacts = c.searchFacts;
}

/** All content in one language, whatever is currently shown (used by search). */
export const contentFor = (lang) => (lang === "ar" ? AR : EN);

export const getService = (slug) => services.find((service) => service.slug === slug);
export const getCaseStudy = (slug) => caseStudies.find((study) => study.slug === slug);

export const mailto = (subject, body) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${query ? `?${query}` : ""}`;
};
