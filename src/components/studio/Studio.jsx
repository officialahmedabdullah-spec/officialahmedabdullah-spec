import { useCallback, useEffect, useId, useRef, useState } from "react";
import { designsConfigured, submitDesign } from "@/lib/designs";
import { setStudio, STUDIO_TOOLS, swapColors, useStudio } from "@/lib/studioStore";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import form from "@/components/reviews/Reviews.module.css";
import styles from "./Studio.module.css";

// the artboard is a fixed-size bitmap, shown scaled to fit
const W = 1600;
const H = 1000;
const PAPER = "#ffffff";
const HISTORY = 20; // undo steps (each is a full 6 MB snapshot)
const DRAFT = "dd:studio-draft";
const MAX_UPLOAD = 15 * 1024 * 1024;

const VARIANTS = { brush: ["brush", "pencil"], shape: ["rect", "ellipse", "line", "arrow"] };

const fontPx = (size) => 16 + size * 2.5;
const hex = (r, g, b) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const rgb = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));

/* Flood fill from (x, y) with `color`, spreading over pixels within a small
   tolerance of the clicked one (so anti-aliased edges fill too). */
export function floodFill(data, width, height, x, y, color, tolerance = 40) {
  const start = (y * width + x) * 4;
  const target = data.slice(start, start + 4);
  const [r, g, b] = color;
  if (target[0] === r && target[1] === g && target[2] === b && target[3] === 255) return false;
  const near = (i) =>
    Math.abs(data[i] - target[0]) <= tolerance &&
    Math.abs(data[i + 1] - target[1]) <= tolerance &&
    Math.abs(data[i + 2] - target[2]) <= tolerance &&
    Math.abs(data[i + 3] - target[3]) <= tolerance;
  const seen = new Uint8Array(width * height);
  const stack = [y * width + x];
  seen[stack[0]] = 1;
  const visit = (p) => {
    if (!seen[p]) {
      seen[p] = 1;
      stack.push(p);
    }
  };
  while (stack.length) {
    const p = stack.pop();
    const i = p * 4;
    if (!near(i)) continue;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
    const px = p % width;
    if (px > 0) visit(p - 1);
    if (px < width - 1) visit(p + 1);
    if (p >= width) visit(p - width);
    if (p < width * (height - 1)) visit(p + width);
  }
  return true;
}

function drawShape(ctx, kind, a, b, color, size) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (kind === "rect") ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
  else if (kind === "ellipse") ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
  else {
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
  ctx.stroke();
  if (kind === "arrow") {
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const head = Math.max(14, size * 3);
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - head * Math.cos(angle - 0.45), b.y - head * Math.sin(angle - 0.45));
    ctx.lineTo(b.x - head * Math.cos(angle + 0.45), b.y - head * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
  }
}

/* /studio — a small Photoshop on the page: brush, pencil, eraser, shapes,
   text, fill, eyedropper and placed images, with undo. Work in progress is
   kept in this browser; "Send" stores it for approval (lib/designs.js). */
export default function Studio() {
  const studio = useStudio();
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const fileRef = useRef(null);
  const history = useRef({ stack: [], index: -1 });
  const stroke = useRef(null);
  const imageAt = useRef(null);
  const saveTimer = useRef(0);
  const [steps, setSteps] = useState({ undo: false, redo: false, dirty: false });
  const [text, setText] = useState(null); // { x, y, left, top, size }
  const [notice, setNotice] = useState("");
  const textRef = useRef(null);
  textRef.current = text;

  const ctx = () => canvasRef.current.getContext("2d", { willReadFrequently: true });

  const sync = useCallback((dirty = true) => {
    const { stack, index } = history.current;
    setSteps((prev) => ({ undo: index > 0, redo: index < stack.length - 1, dirty: prev.dirty || dirty }));
  }, []);

  const saveDraft = () => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT, canvasRef.current.toDataURL("image/webp", 0.85));
      } catch {
        // storage full or blocked: the draft just isn't kept
      }
    }, 600);
  };

  const commit = useCallback(
    (dirty = true) => {
      const h = history.current;
      h.stack = h.stack.slice(0, h.index + 1);
      h.stack.push(ctx().getImageData(0, 0, W, H));
      if (h.stack.length > HISTORY) h.stack.shift();
      h.index = h.stack.length - 1;
      sync(dirty);
      if (dirty) saveDraft();
    },
    [sync]
  );

  const restore = (index) => {
    const h = history.current;
    if (index < 0 || index >= h.stack.length) return;
    h.index = index;
    ctx().putImageData(h.stack[index], 0, 0);
    sync();
    saveDraft();
  };
  const undo = () => restore(history.current.index - 1);
  const redo = () => restore(history.current.index + 1);

  const clear = () => {
    const c = ctx();
    c.fillStyle = PAPER;
    c.fillRect(0, 0, W, H);
    commit();
  };

  // paper + the draft left in this browser last time
  useEffect(() => {
    history.current = { stack: [], index: -1 };
    const c = ctx();
    c.fillStyle = PAPER;
    c.fillRect(0, 0, W, H);
    const draft = localStorage.getItem(DRAFT);
    if (!draft) {
      commit(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      c.drawImage(img, 0, 0, W, H);
      commit(false);
      setSteps((prev) => ({ ...prev, dirty: true }));
    };
    img.onerror = () => commit(false);
    img.src = draft;
    return () => clearTimeout(saveTimer.current);
  }, [commit]);

  // Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const onKey = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.target.closest?.("input, textarea")) return;
      const key = event.key.toLowerCase();
      if (key === "z" && !event.shiftKey) undo();
      else if (key === "y" || (key === "z" && event.shiftKey)) redo();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const point = (event) => {
    const r = canvasRef.current.getBoundingClientRect();
    const clamp = (v, max) => Math.min(Math.max(Math.round(v), 0), max - 1);
    return {
      x: clamp(((event.clientX - r.left) * W) / r.width, W),
      y: clamp(((event.clientY - r.top) * H) / r.height, H),
      scale: r.width / W,
    };
  };

  const placeImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_UPLOAD) {
      setNotice(t("studio.badImage"));
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const fit = Math.min(1, (W * 0.6) / bitmap.width, (H * 0.6) / bitmap.height);
      const w = bitmap.width * fit;
      const h = bitmap.height * fit;
      const at = imageAt.current ?? { x: W / 2, y: H / 2 };
      const x = Math.min(Math.max(at.x - w / 2, 0), W - w);
      const y = Math.min(Math.max(at.y - h / 2, 0), H - h);
      ctx().drawImage(bitmap, x, y, w, h);
      commit();
      setNotice("");
    } catch {
      setNotice(t("studio.badImage"));
    } finally {
      imageAt.current = null;
      fileRef.current.value = "";
    }
  };

  // Enter, click-away and blur can all fire for one edit: only the first draws
  const commitText = () => {
    const text = textRef.current;
    if (!text) return;
    textRef.current = null;
    const value = text.value.trim();
    if (value) {
      const c = ctx();
      c.fillStyle = studio.fg;
      c.font = `600 ${fontPx(text.size)}px "Bricolage Grotesque Variable", system-ui, sans-serif`;
      c.textBaseline = "top";
      value.split("\n").forEach((line, i) => c.fillText(line, text.x, text.y + i * fontPx(text.size) * 1.15));
      commit();
    }
    setText(null);
  };

  const onDown = (event) => {
    if (event.button !== 0) return;
    const p = point(event);
    const { tool, size, fg, bg, pen, shape } = studio;

    if (tool === "text") {
      if (text) return; // this click blurs the open text box, which commits it
      setText({ x: p.x, y: p.y, left: (p.x / W) * 100, top: (p.y / H) * 100, size, scale: p.scale, value: "" });
      return;
    }
    if (tool === "picker") {
      const [r, g, b] = ctx().getImageData(p.x, p.y, 1, 1).data;
      setStudio({ fg: hex(r, g, b) });
      return;
    }
    if (tool === "fill") {
      const c = ctx();
      const image = c.getImageData(0, 0, W, H);
      if (floodFill(image.data, W, H, p.x, p.y, rgb(fg))) {
        c.putImageData(image, 0, 0);
        commit();
      }
      return;
    }
    if (tool === "image") {
      imageAt.current = p;
      fileRef.current.click();
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === "shape") {
      stroke.current = { start: p, shape };
      return;
    }
    // brush, pencil, eraser: dot now, smooth curve through the midpoints as it moves
    const c = ctx();
    const pencil = tool === "brush" && pen === "pencil";
    c.strokeStyle = c.fillStyle = tool === "eraser" ? bg : fg;
    c.lineWidth = tool === "eraser" ? size * 2 : pencil ? Math.max(1, size / 3) : size;
    c.lineCap = c.lineJoin = pencil ? "square" : "round";
    c.beginPath();
    c.arc(p.x, p.y, c.lineWidth / 2, 0, Math.PI * 2);
    c.fill();
    stroke.current = { last: p, mid: p, free: true };
  };

  const onMove = (event) => {
    const s = stroke.current;
    if (!s) return;
    const p = point(event);
    if (s.free) {
      const c = ctx();
      const mid = { x: (s.last.x + p.x) / 2, y: (s.last.y + p.y) / 2 };
      c.beginPath();
      c.moveTo(s.mid.x, s.mid.y);
      c.quadraticCurveTo(s.last.x, s.last.y, mid.x, mid.y);
      c.stroke();
      s.last = p;
      s.mid = mid;
      return;
    }
    // shapes: live preview on the overlay; Shift keeps squares, circles and 45° lines
    let end = p;
    if (event.shiftKey) {
      const dx = p.x - s.start.x;
      const dy = p.y - s.start.y;
      if (s.shape === "rect" || s.shape === "ellipse") {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        end = { x: s.start.x + Math.sign(dx || 1) * d, y: s.start.y + Math.sign(dy || 1) * d };
      } else {
        const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
        const len = Math.hypot(dx, dy);
        end = { x: s.start.x + Math.cos(angle) * len, y: s.start.y + Math.sin(angle) * len };
      }
    }
    s.end = end;
    const preview = previewRef.current.getContext("2d");
    preview.clearRect(0, 0, W, H);
    drawShape(preview, s.shape, s.start, end, studio.fg, studio.size);
  };

  const onUp = () => {
    const s = stroke.current;
    stroke.current = null;
    if (!s) return;
    if (!s.free) {
      previewRef.current.getContext("2d").clearRect(0, 0, W, H);
      if (!s.end) return;
      drawShape(ctx(), s.shape, s.start, s.end, studio.fg, studio.size);
    }
    commit();
  };

  const download = () => {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "design-dynamo-studio.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  const variant = VARIANTS[studio.tool];
  const variantKey = studio.tool === "brush" ? "pen" : "shape";

  return (
    <div className={styles.studio} dir="ltr">
      <div className={styles.bar} role="toolbar" aria-label={t("studio.toolbar")}>
        <div className={styles.group}>
          {STUDIO_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={cx(styles.btn, studio.tool === tool.id && styles.on)}
              aria-pressed={studio.tool === tool.id}
              title={`${t(`studio.tool.${tool.id}`)} (${tool.key})`}
              onClick={() => setStudio({ tool: tool.id })}
            >
              <Icon name={tool.icon} size={17} />
              <span className="sr-only">{t(`studio.tool.${tool.id}`)}</span>
            </button>
          ))}
        </div>

        {variant && (
          <div className={styles.group}>
            {variant.map((id) => (
              <button
                key={id}
                type="button"
                className={cx(styles.btn, studio[variantKey] === id && styles.on)}
                aria-pressed={studio[variantKey] === id}
                title={t(`studio.variant.${id}`)}
                onClick={() => setStudio({ [variantKey]: id })}
              >
                <Icon name={id === "arrow" ? "arrowUpRight" : id} size={17} />
                <span className="sr-only">{t(`studio.variant.${id}`)}</span>
              </button>
            ))}
          </div>
        )}

        {studio.tool === "image" && (
          <button type="button" className={cx(styles.btn, styles.wide)} onClick={() => fileRef.current.click()}>
            <Icon name="image" size={16} /> {t("studio.chooseImage")}
          </button>
        )}

        <label className={cx(styles.size, "mono")}>
          {t("studio.size")}
          <input type="range" min="1" max="60" step="1" value={studio.size} onChange={(event) => setStudio({ size: Number(event.target.value) })} />
          <output>{studio.size}</output>
        </label>

        <div className={styles.group}>
          <label className={styles.chip} style={{ background: studio.fg }} title={t("studio.fg")}>
            <input type="color" value={studio.fg} onChange={(event) => setStudio({ fg: event.target.value })} aria-label={t("studio.fg")} />
          </label>
          <button type="button" className={styles.btn} onClick={swapColors} title={`${t("studio.swap")} (X)`}>
            <Icon name="swap" size={15} />
            <span className="sr-only">{t("studio.swap")}</span>
          </button>
          <label className={styles.chip} style={{ background: studio.bg }} title={t("studio.bg")}>
            <input type="color" value={studio.bg} onChange={(event) => setStudio({ bg: event.target.value })} aria-label={t("studio.bg")} />
          </label>
        </div>

        <div className={cx(styles.group, styles.end)}>
          <button type="button" className={styles.btn} onClick={undo} disabled={!steps.undo} title={`${t("studio.undo")} (Ctrl+Z)`}>
            <Icon name="undo" size={17} />
            <span className="sr-only">{t("studio.undo")}</span>
          </button>
          <button type="button" className={styles.btn} onClick={redo} disabled={!steps.redo} title={`${t("studio.redo")} (Ctrl+Shift+Z)`}>
            <Icon name="redo" size={17} />
            <span className="sr-only">{t("studio.redo")}</span>
          </button>
          <button type="button" className={styles.btn} onClick={clear} title={t("studio.clear")}>
            <Icon name="trash" size={17} />
            <span className="sr-only">{t("studio.clear")}</span>
          </button>
          <button type="button" className={styles.btn} onClick={download} title={t("studio.download")}>
            <Icon name="download" size={17} />
            <span className="sr-only">{t("studio.download")}</span>
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.canvas}
          data-cursor="native"
          data-tool={studio.tool}
          aria-label={t("studio.canvasLabel")}
          role="img"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        <canvas ref={previewRef} width={W} height={H} className={styles.preview} aria-hidden="true" />
        {text && (
          <textarea
            autoFocus
            className={styles.text}
            style={{ left: `${text.left}%`, top: `${text.top}%`, color: studio.fg, fontSize: fontPx(text.size) * text.scale }}
            value={text.value}
            placeholder={t("studio.textHint")}
            onChange={(event) => setText({ ...text, value: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                commitText();
              } else if (event.key === "Escape") setText(null);
            }}
            onBlur={commitText}
            rows={Math.max(1, text.value.split("\n").length)}
            aria-label={t("studio.tool.text")}
          />
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(event) => placeImage(event.target.files?.[0])} />
      <p className={cx(styles.hint, "mono")} role="status">
        {notice || t(`studio.hint.${studio.tool}`)}
      </p>

      <SendDesign canvasRef={canvasRef} dirty={steps.dirty} />
    </div>
  );
}

/* Send for approval: a 1200×750 WebP, the visitor's name and a title. */
function SendDesign({ canvasRef, dirty }) {
  const id = useId();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState("idle"); // idle · sending · sent · error
  const [error, setError] = useState("");

  if (!designsConfigured) return <p className={styles.closed}>{t("studio.send.closed")}</p>;

  if (status === "sent")
    return (
      <div className={styles.send} role="status">
        <p className="lede">{t("studio.send.sent")}</p>
        <button type="button" className={form.linkButton} onClick={() => setStatus("idle")}>
          {t("studio.send.again")}
        </button>
      </div>
    );

  const submit = async (event) => {
    event.preventDefault();
    if (trap) return setStatus("sent"); // bots fill the hidden field
    if (!dirty) return setError(t("studio.send.empty"));
    if (name.trim().length < 2) return setError(t("studio.send.needName"));
    setError("");
    setStatus("sending");
    try {
      const out = document.createElement("canvas");
      out.width = 1200;
      out.height = 750;
      out.getContext("2d").drawImage(canvasRef.current, 0, 0, 1200, 750);
      const blob = await new Promise((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error())), "image/webp", 0.85));
      await submitDesign({ name, title, blob });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || t("studio.send.error"));
    }
  };

  return (
    <form className={cx(form.form, styles.send)} onSubmit={submit} noValidate>
      <p className={cx(form.label, "mono")}>{t("studio.send.title")}</p>
      <div className={form.formRow}>
        <div className={form.field}>
          <label className={cx(form.label, "mono")} htmlFor={`${id}-name`}>
            {t("studio.send.name")}
          </label>
          <input id={`${id}-name`} className={form.input} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </div>
        <div className={form.field}>
          <label className={cx(form.label, "mono")} htmlFor={`${id}-title`}>
            {t("studio.send.designTitle")}
          </label>
          <input id={`${id}-title`} className={form.input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        </div>
      </div>
      <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} placeholder={t("common.leaveEmpty")} />
      {error && (
        <p className={form.fieldError} role="alert">
          {error}
        </p>
      )}
      <div>
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? t("studio.send.sending") : t("studio.send.submit")}
        </Button>
      </div>
    </form>
  );
}
