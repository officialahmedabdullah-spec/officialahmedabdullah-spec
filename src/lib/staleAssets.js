/* Images are fingerprinted (name-<hash>.webp) and every deploy renames them.
   A tab opened before a deploy still asks for the old names, so lazy images
   further down the page 404 and show the browser's broken-image icon.

   One listener for every <img> on the site: a failed image is retried once
   (a dropped request on a slow network or VPN looks the same); if it fails
   again and it's one of our assets, check whether a newer build is live
   and, if so, reload once to pick it up.
   Anything that still fails is marked so CSS hides the broken icon and the
   tile's own background shows instead. */
const GUARD = "dd:stale-reload";
const currentEntry = () => document.querySelector('script[type="module"][src*="/assets/"]')?.getAttribute("src");

let checking = null;

async function newerBuildLive() {
  const mine = currentEntry();
  if (!mine) return false; // dev server: no fingerprinted entry
  const html = await fetch("/", { cache: "no-store" }).then((r) => r.text());
  return !html.includes(mine);
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(GUARD) || 0);
    if (Date.now() - last < 60_000) return false; // already tried a minute ago
    sessionStorage.setItem(GUARD, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

export function watchStaleAssets() {
  window.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      const src = img.currentSrc || img.src;
      // a dropped request (slow network, VPN): try once more, uncached
      if (!("retried" in img.dataset)) {
        img.dataset.retried = "";
        img.src = src + (src.includes("?") ? "&" : "?") + "retry=1";
        return;
      }
      img.dataset.broken = "";
      if (!src.startsWith(window.location.origin + "/assets/")) return;
      checking ??= newerBuildLive()
        .then((stale) => stale && reloadOnce())
        .catch(() => false)
        .finally(() => {
          checking = null;
        });
    },
    true // image errors don't bubble; catch them on the way down
  );
}
