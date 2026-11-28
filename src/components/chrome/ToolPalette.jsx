import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useSound } from "@/context/SoundContext";
import { pages } from "@/data/portfolioData";
import { t } from "@/i18n";
import { useActiveTool } from "@/lib/cursorStore";
import { setStudio, STUDIO_TOOLS, swapColors, useStudio } from "@/lib/studioStore";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./ToolPalette.module.css";

/* Photoshop's tool palette. The top group opens pages (V, H, P, T, I);
   the tool the cursor is "holding" lights up as you move over the page.
   The bottom group are real drawing tools: they open /studio with that
   tool in hand (B, E, U, T, G, I, M there), and the colour chips set the
   foreground / background colours. */
export default function ToolPalette() {
  const active = useActiveTool();
  const navigate = useNavigate();
  const { play } = useSound();
  const studio = useStudio();
  const { pathname } = useLocation();
  const inStudio = pathname === "/studio";

  const pickTool = (id) => {
    setStudio({ tool: id });
    if (!inStudio) navigate("/studio");
    play("tick");
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target;
      if (target.closest?.("input, textarea, select, [contenteditable], dialog[open]")) return;
      // in the studio, Photoshop's drawing shortcuts win over page shortcuts
      if (window.location.pathname === "/studio") {
        const key = event.key.toUpperCase();
        if (key === "X") return swapColors();
        const tool = STUDIO_TOOLS.find((item) => item.key === key);
        if (tool) {
          setStudio({ tool: tool.id });
          play("tick");
          return;
        }
      }
      const page = pages.find((item) => item.key === event.key.toUpperCase());
      if (!page) return;
      navigate(page.to);
      play("tick");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, play]);

  return (
    <nav className={styles.palette} aria-label={t("tools.label")}>
      {pages.map((page) => (
        <NavLink
          key={page.to}
          to={page.to}
          end={page.to === "/"}
          className={({ isActive }) => cx(styles.tool, isActive && styles.current, active === page.tool && styles.holding)}
          aria-label={`${page.label} (${page.key})`}
          onClick={() => play("tick")}
        >
          <Icon name={page.tool} size={18} />
          <span className={styles.key}>{page.key}</span>
          <span className={styles.tip} role="tooltip">
            {page.label} <kbd>{page.key}</kbd>
          </span>
        </NavLink>
      ))}
      <span className={styles.sep} />
      {STUDIO_TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={cx(styles.tool, inStudio && studio.tool === tool.id && styles.holding)}
          aria-label={`${t(`studio.tool.${tool.id}`)} (${tool.key})`}
          aria-pressed={inStudio && studio.tool === tool.id}
          onClick={() => pickTool(tool.id)}
        >
          <Icon name={tool.icon} size={18} />
          <span className={styles.key}>{tool.key}</span>
          <span className={styles.tip} role="tooltip">
            {t(`studio.tool.${tool.id}`)} <kbd>{tool.key}</kbd>
          </span>
        </button>
      ))}
      <span className={styles.swatches}>
        <label className={styles.fg} style={{ background: studio.fg }} title={t("studio.fg")}>
          <input type="color" value={studio.fg} onChange={(event) => setStudio({ fg: event.target.value })} aria-label={t("studio.fg")} />
        </label>
        <label className={styles.bgSwatch} style={{ background: studio.bg }} title={t("studio.bg")}>
          <input type="color" value={studio.bg} onChange={(event) => setStudio({ bg: event.target.value })} aria-label={t("studio.bg")} />
        </label>
        <button type="button" className={styles.swap} onClick={swapColors} aria-label={t("studio.swap")} title={`${t("studio.swap")} (X)`}>
          <Icon name="swap" size={10} />
        </button>
      </span>
    </nav>
  );
}
