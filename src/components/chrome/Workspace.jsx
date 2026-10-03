import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { t } from "@/i18n";
import { legacyTarget } from "@/pages/NotFoundPage";
import PrintFilters from "@/components/ui/PrintFilters";
import Cursor from "./Cursor";
import LayersPanel from "./LayersPanel";
import PageTransition from "./PageTransition";
import Preloader from "./Preloader";
import Rulers from "./Rulers";
import StatusBar from "./StatusBar";
import ToolPalette from "./ToolPalette";
import Topbar from "./Topbar";
import styles from "./Workspace.module.css";

// /legal#terms, /services#pricing … land below the top bar once the
// target exists (it may still be mounting behind the page transition)
function useHashScroll() {
  const { hash, key } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!hash) return undefined;
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        scrollTo(target);
        return;
      }
      if (tries++ < 30) timer = setTimeout(attempt, 100);
    };
    timer = setTimeout(attempt, 50);
    return () => clearTimeout(timer);
  }, [hash, key, scrollTo]);
}

/* The app shell: a design-tool workspace around the page "artboards". */
export default function Workspace() {
  const [layersOpen, setLayersOpen] = useState(false);
  const closeLayers = useCallback(() => setLayersOpen(false), []);
  const { pathname, hash } = useLocation();
  useHashScroll();

  // old static-site addresses (/work.html, /logo-design.html) → new routes
  const legacy = legacyTarget(pathname);
  if (legacy) return <Navigate to={`${legacy}${hash}`} replace />;

  return (
    <>
      <a className="skip-link" href="#main">
        {t("workspace.skip")}
      </a>
      <PrintFilters />
      <Topbar layersOpen={layersOpen} onToggleLayers={() => setLayersOpen((open) => !open)} />
      <Rulers />
      <ToolPalette />
      <LayersPanel open={layersOpen} onClose={closeLayers} />
      <main id="main" className={styles.canvas} tabIndex={-1}>
        <PageTransition />
      </main>
      <StatusBar />
      <Cursor />
      <Preloader />
    </>
  );
}
