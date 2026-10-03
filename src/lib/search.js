/* Site search — runs entirely in the browser (nothing is sent anywhere).

   The index is built from the same content the pages render, in the current
   language, plus the other language's words for everything — so "logo"
   finds «تصميم الشعارات» on the Arabic site and «شعار» finds Logo Design
   on the English one.

   Matching, in order of strength: whole word → word start → inside a word →
   one typo away (for words of 4+ letters). Every meaningful query word has
   to match (filler words like "the", "how", «في» are ignored); if that finds
   nothing, results matching most of the words are shown instead. A hit in a
   title counts more than one in a tag, which counts more than body text. */
import {
  achievements,
  archiveCategories,
  caseStudies,
  contentFor,
  history,
  legal,
  packages,
  pages,
  searchFacts,
  services,
  skills,
} from "@/data/portfolioData";
import { getLang, t } from "@/i18n";

const STOP = new Set(
  (
    "a an the is are was be to of in on at for and or with by from as it its this that " +
    "i me my you your he him his she her we our they them what where when who whom which how why " +
    "do does did can could will would should much many any some about tell show find me please " +
    "في من على إلى الى عن ما ماذا كيف أين اين هل كم هو هي انت أنت مع و او أو هذا هذه ذلك التي الذي لدى عند"
  )
    .split(" ")
    .map((word) => normalize(word))
);

/** Lower-case, strip accents and Arabic diacritics, unify letter variants. */
export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // Latin accents
    .replace(/[ً-ٰٟـ]/g, "") // Arabic tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}$+#]+/gu, " ")
    .trim();
}

// Arabic attaches "the" (ال) and "and" (و) to words: match both forms
const variants = (word) => {
  const out = [word];
  if (/^[؀-ۿ]/.test(word)) {
    if (word.startsWith("وال") && word.length > 4) out.push(word.slice(3));
    else if (word.startsWith("ال") && word.length > 3) out.push(word.slice(2));
    else if (word.startsWith("و") && word.length > 3) out.push(word.slice(1));
  }
  return out;
};

const tokenize = (text) => normalize(text).split(" ").filter(Boolean).flatMap(variants);

// edit distance ≤ 1 (insert, delete, substitute or swap two neighbours)
function oneEditAway(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // substitute
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swap
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

const WEIGHT = { title: 3, keys: 2, text: 1 };

function scoreWord(word, fields) {
  let best = 0;
  for (const [field, tokens] of fields) {
    const w = WEIGHT[field];
    for (const token of tokens) {
      let s = 0;
      if (token === word) s = 3;
      else if (token.startsWith(word)) s = word.length >= 2 ? 2.2 : 0;
      else if (word.length >= 3 && token.includes(word)) s = 1.2;
      else if (word.length >= 4 && token.length >= 4 && oneEditAway(word, token)) s = 1;
      if (s * w > best) best = s * w;
    }
  }
  return best;
}

const clip = (text, n = 120) => {
  const s = String(text ?? "").replace(/\s+/g, " ").trim();
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
};

/* ---------- index ---------------------------------------------------- */

let cache = null;

export function buildIndex() {
  const lang = getLang();
  if (cache?.lang === lang) return cache.items;

  // the same content in the other language, so either language finds it
  const other = contentFor(lang === "ar" ? "en" : "ar");
  const enServices = Object.fromEntries(other.services.map((s) => [s.slug, s]));
  const enStudies = Object.fromEntries(other.caseStudies.map((s) => [s.slug, s]));
  const items = [];
  const add = (group, item) => {
    const fields = [
      ["title", tokenize(item.title)],
      ["keys", tokenize([item.keys, item.altKeys].filter(Boolean).join(" "))],
      ["text", tokenize(item.body ?? item.text)],
    ];
    items.push({ group, icon: "file", ...item, id: `${group}:${items.length}`, fields });
  };

  searchFacts.forEach((fact, i) =>
    add("facts", { title: fact.title, text: fact.text, keys: fact.terms, altKeys: `${other.searchFacts[i]?.title} ${other.searchFacts[i]?.terms}`, to: fact.to, icon: "spark" })
  );

  pages.forEach((page, i) => add("pages", { title: page.label, text: page.file, keys: page.file, altKeys: other.pages[i]?.label, to: page.to, icon: page.tool }));

  services.forEach((service) => {
    const e = enServices[service.slug];
    add("services", {
      title: service.title,
      text: service.short,
      keys: [service.group, service.promise, ...service.deliverables.map(([d]) => d)].join(" "),
      altKeys: e && [e.title, e.short, e.group, ...e.deliverables.map(([d]) => d)].join(" "),
      body: [service.lead, ...service.deliverables.map(([, d]) => d)].join(" "),
      to: `/services/${service.slug}`,
      icon: service.icon,
    });
  });

  caseStudies.forEach((study) => {
    const e = enStudies[study.slug];
    add("work", {
      title: study.client === study.title ? study.title : `${study.client} — ${study.title}`,
      text: study.category,
      keys: [study.client, ...study.tags, ...study.tools].join(" "),
      altKeys: e && [e.client, e.category, ...e.tags, ...e.tools].join(" "),
      body: [study.summary, study.brief, study.approach, study.outcome].join(" "),
      to: `/work/${study.slug}`,
      icon: "frame",
    });
  });

  history.forEach((step, i) => {
    const e = other.history[i];
    add("about", {
      title: step.title,
      text: `${step.when} · ${step.place}`,
      keys: `${step.place} ${step.when}`,
      altKeys: e && `${e.title} ${e.place}`,
      body: step.points.join(" "),
      to: "/about#history",
      icon: step.icon,
    });
  });
  skills.layers.forEach((layer, i) =>
    add("about", { title: layer.name, text: `${t("skills.layers")} · ${layer.value}%`, keys: t("skills.eyebrow"), altKeys: `${other.skills.layers[i]?.name} skill`, to: "/about#skills", icon: "layers" })
  );
  skills.software.forEach((app, i) =>
    add("about", { title: app.name, text: t("skills.software"), keys: `${app.label} ${t("skills.software")}`, altKeys: `${other.skills.software[i]?.name} software`, to: "/about#skills", icon: "pen" })
  );
  achievements.forEach((text, i) => add("about", { title: clip(text, 80), text: t("history.achievements"), body: text, altKeys: other.achievements[i], to: "/about#history", icon: "target" }));

  packages.plans.forEach((plan, i) => {
    const e = other.packages.plans[i];
    add("pricing", {
      title: `${plan.name} · $${plan.min}–$${plan.max}`,
      text: plan.description,
      keys: `${plan.tier} ${t("pricing.eyebrow")} ${t("pricing.keywords")}`,
      altKeys: e && `${e.name} ${e.tier} price plan monthly`,
      body: plan.features.join(" "),
      to: "/services#pricing",
      icon: "chart",
    });
  });

  archiveCategories.forEach((category, i) =>
    add("archive", { title: category.title, text: t("layer.archive"), keys: category.id.replace(/-/g, " "), altKeys: other.archiveCategories[i]?.title, to: "/work#archive", icon: "layers" })
  );

  legal.sections.forEach((section, i) =>
    add("legal", { title: section.title, text: clip(section.paragraphs[0]), body: [...section.paragraphs, ...(section.list ?? [])].join(" "), altKeys: other.legal.sections[i]?.title, to: `/legal#${section.id}`, icon: "file" })
  );

  cache = { lang, items };
  return items;
}

/* ---------- query ---------------------------------------------------- */

export const GROUP_ORDER = ["facts", "pages", "services", "work", "about", "pricing", "archive", "legal"];
const PER_GROUP = 4;

/** Returns { words, results: [{ group, items: [...] }], total }. */
export function search(query) {
  const raw = normalize(query).split(" ").filter(Boolean);
  if (raw.length === 0) return { words: [], results: [], total: 0 };
  const meaningful = raw.filter((word) => !STOP.has(word));
  // each query word with its Arabic forms («السعر» → also «سعر»): any form may match
  const groups = [...new Set(meaningful.length ? meaningful : raw)].map(variants);
  const words = groups.flat();
  const phrase = normalize(query);

  const scored = [];
  for (const item of buildIndex()) {
    let score = 0;
    let hits = 0;
    for (const group of groups) {
      const s = Math.max(...group.map((word) => scoreWord(word, item.fields)));
      if (s > 0) {
        hits++;
        score += s;
      }
    }
    if (hits === 0) continue;
    if (phrase.length > 2 && normalize(item.title).includes(phrase)) score += 6;
    scored.push({ item, score, hits });
  }

  // every word must match; if nothing does, accept most of the words
  let matches = scored.filter((r) => r.hits === groups.length);
  if (matches.length === 0 && groups.length > 1) matches = scored.filter((r) => r.hits >= Math.ceil(groups.length / 2));

  matches.sort((a, b) => b.score - a.score);
  const results = GROUP_ORDER.map((group) => ({
    group,
    items: matches.filter((r) => r.item.group === group).slice(0, PER_GROUP).map((r) => r.item),
  })).filter((g) => g.items.length > 0);

  // the best-scoring group leads, the rest keep their usual order
  if (results.length > 1 && matches[0]) {
    const lead = results.findIndex((g) => g.group === matches[0].item.group);
    if (lead > 0) results.unshift(...results.splice(lead, 1));
  }

  return { words, results, total: results.reduce((n, g) => n + g.items.length, 0) };
}

/** Splits text into [{ text, hit }] so matched words can be highlighted. */
export function highlight(text, words) {
  const source = String(text ?? "");
  if (!words.length) return [{ text: source, hit: false }];
  const parts = source.split(/(\s+)/);
  return parts.map((part) => {
    const norm = normalize(part);
    const hit = norm && words.some((w) => w.length >= 2 && variants(norm).some((v) => v.startsWith(w) || (w.length >= 3 && v.includes(w))));
    return { text: part, hit: Boolean(hit) };
  });
}
