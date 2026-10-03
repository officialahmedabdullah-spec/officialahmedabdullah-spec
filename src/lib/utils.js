// join class names, skipping falsy values
export const cx = (...names) => names.filter(Boolean).join(" ");

// "images/logo.svg" -> "/images/logo.svg", respecting Vite's base
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const pad = (n) => String(n).padStart(2, "0");

// "just now", "5 min ago", "3 days ago", "2 months ago"
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];
export function timeAgo(date) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  if (Math.abs(seconds) < 60) return "just now";
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// read a CSS custom property in px (e.g. --bar-h)
export function cssPx(name) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseFloat(value) || 0;
}

// where content starts below the fixed top bar + ruler
export const chromeTop = () => cssPx("--bar-h") + cssPx("--ruler") + 16;
