import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSound } from "@/context/SoundContext";
import { pages } from "@/data/portfolioData";
import { t } from "@/i18n";
import { useActiveTool } from "@/lib/cursorStore";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./ToolPalette.module.css";

/* Photoshop's tool palette. Each tool opens a page, with the real
   Photoshop shortcut (V, H, P, T, I). The tool the cursor is currently
   "holding" lights up as you move over the page. */
export default function ToolPalette() {
  const active = useActiveTool();
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target;
      if (target.closest?.("input, textarea, select, [contenteditable], dialog[open]")) return;
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
      <span className={cx(styles.tool, styles.passive, active === "zoom" && styles.holding)} aria-hidden="true">
        <Icon name="zoom" size={18} />
      </span>
      <span className={cx(styles.tool, styles.passive, active === "drag" && styles.holding)} aria-hidden="true">
        <Icon name="drag" size={18} />
      </span>
      <span className={styles.swatches} aria-hidden="true">
        <i className={styles.fg} />
        <i className={styles.bgSwatch} />
      </span>
    </nav>
  );
}
