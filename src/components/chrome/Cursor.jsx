import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { setTool } from "@/lib/cursorStore";
import { cx, finePointer, reducedMotion } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./Cursor.module.css";

// data-cursor value -> icon shown + tool lit in the palette
const KINDS = {
  pen: { icon: "pen", tool: "pen" },
  eyedropper: { icon: "eyedropper", tool: "eyedropper" },
  hand: { icon: "hand", tool: "hand" },
  drag: { icon: "drag", tool: "drag" },
  text: { icon: "type", tool: "type" },
  view: { tool: "zoom" },
};

const INTERACTIVE = "a, button, [role='button'], label, select, summary";

/**
 * A cursor that picks up a tool depending on what it's over:
 * pen on headings, eyedropper on colours, hand on pannable canvases,
 * a big "View" disc on projects. Elements opt in with
 *   data-cursor="pen|eyedropper|hand|drag|text|view"
 *   data-cursor-label="…"  (optional tag next to the cursor)
 *   data-cursor-color="#hex" (eyedropper samples this colour)
 * Mouse only; touch devices and reduced motion keep the system cursor.
 */
export default function Cursor() {
  const ref = useRef(null);
  const iconRef = useRef(null);
  const labelRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return undefined;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    const el = ref.current;

    // Always on top: join the browser's top layer, and re-join it whenever
    // a modal <dialog> or popover opens (the newest top-layer element wins).
    const toTop = () => {
      if (!el.showPopover) return;
      try {
        if (el.matches(":popover-open")) el.hidePopover();
        el.showPopover();
      } catch {
        /* not connected yet */
      }
    };
    toTop();
    const layerWatch = new MutationObserver((records) => {
      if (records.some((r) => r.target !== el && (r.target.open || r.target.matches?.(":popover-open")))) toTop();
    });
    layerWatch.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open", "popover"] });
    const onToggle = (event) => event.target !== el && event.newState === "open" && toTop();
    document.addEventListener("toggle", onToggle, true);

    const xTo = gsap.quickTo(el, "x", { duration: 0.16, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.16, ease: "power3" });

    let last = null;

    const onMove = (event) => {
      // the browser can drop it from the top layer without an event (e.g.
      // around a modal opening); put it back before it's needed
      if (el.showPopover && !el.matches(":popover-open")) toTop();
      xTo(event.clientX);
      yTo(event.clientY);
      el.dataset.visible = "true";
    };

    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const host = target?.closest("[data-cursor]");
      const interactive = target?.closest(INTERACTIVE);
      const kind = host?.dataset.cursor ?? (interactive ? "link" : "default");
      const label = host?.dataset.cursorLabel ?? "";
      const key = `${kind}|${label}|${host?.dataset.cursorColor ?? ""}`;
      if (key === last) return;
      last = key;

      el.dataset.kind = kind;
      labelRef.current.textContent = label;
      el.dataset.hasLabel = label ? "true" : "false";
      dotRef.current.style.background = host?.dataset.cursorColor ?? "";
      iconRef.current.dataset.icon = KINDS[kind]?.icon ?? "";
      setTool(KINDS[kind]?.tool ?? "move");
    };

    const onLeave = () => {
      el.dataset.visible = "false";
    };
    const onDown = () => el.dataset.down = "true";
    const onUp = () => el.dataset.down = "false";

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-custom-cursor");
      layerWatch.disconnect();
      document.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ref} popover="manual" className={styles.cursor} data-kind="default" data-visible="false" aria-hidden="true">
      <span ref={dotRef} className={styles.dot} />
      <span ref={iconRef} className={styles.icon} data-icon="">
        {Object.entries(KINDS)
          .filter(([, kind]) => kind.icon)
          .map(([name, kind]) => (
            <Icon key={name} name={kind.icon} size={22} strokeWidth={1.8} className={cx(styles.glyph)} data-for={kind.icon} />
          ))}
      </span>
      <span ref={labelRef} className={cx(styles.label, "mono")} />
    </div>
  );
}
