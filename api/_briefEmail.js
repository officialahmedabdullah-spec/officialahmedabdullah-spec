/* The "new brief" notification email, styled like the site: a dark
   Photoshop-style title bar, a cream artboard, an orange reply button and
   the brief's fields as a Layers panel.

   Email clients ignore <style> blocks and external CSS, so everything is
   inline and laid out with tables. Web fonts load in Apple Mail and iOS;
   Gmail and Outlook fall back to Arial / Georgia / Courier. Values typed by
   the visitor are escaped and marked dir="auto" so Arabic reads right to left. */

const SITE = "https://www.designdynamo.art";

const C = {
  desk: "#1c1c1e",
  chrome: "#2b2b2e",
  chromeLine: "#3a3a3e",
  chromeText: "#a29f97",
  art: "#f5f1e8",
  ink: "#1a1814",
  inkDim: "#5c574e",
  signal: "#ff5b2e",
  label: "#31a8ff",
  panelText: "#e8e6e1",
  lime: "#c1ee04",
};

const F = {
  display: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  serif: "Fraunces, Georgia, 'Times New Roman', serif",
  mono: "'IBM Plex Mono', 'Courier New', Courier, monospace",
};

// one swatch per layer, like the thumbnails in the Layers panel
const SWATCHES = ["#ff5b2e", "#7c1034", "#00a3e0", "#e4007c", "#31a8ff", "#ffe600"];

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const received = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date) + " (Riyadh)";

function layerRow(label, valueHtml, swatch, last) {
  const border = last ? "" : `border-bottom:1px solid ${C.chromeLine};`;
  return `
    <tr>
      <td width="34" style="padding:12px 0 12px 14px;${border}vertical-align:top">
        <div style="width:22px;height:16px;border:2px solid #ffffff;border-radius:3px;background:${swatch};font-size:0;line-height:0">&nbsp;</div>
      </td>
      <td width="96" style="padding:12px 10px;${border}vertical-align:top;font:600 11px/20px ${F.mono};letter-spacing:.08em;text-transform:uppercase;color:${C.chromeText}">${label}</td>
      <td dir="auto" style="padding:12px 14px 12px 0;${border}vertical-align:top;font:600 15px/20px ${F.display};color:${C.panelText}">${valueHtml}</td>
    </tr>`;
}

const chip = (text) =>
  `<span dir="auto" style="display:inline-block;margin:0 6px 6px 0;padding:3px 10px;border:1px solid #55555b;border-radius:999px;font:500 13px/18px ${F.display};color:${C.panelText}">${escapeHtml(text)}</span>`;

/** Builds { subject, html, text } for a cleaned brief. */
export function briefEmail(brief, { now = new Date() } = {}) {
  const name = brief.name || "Someone";
  const first = brief.name ? brief.name.split(/\s+/)[0] : "them";
  const subject = `New project brief${brief.needs.length ? ` — ${brief.needs[0]}` : ""}${brief.name ? ` from ${brief.name}` : ""}`;
  const replyHref = `mailto:${encodeURIComponent(brief.email)}?subject=${encodeURIComponent("Re: your project brief — Design Dynamo")}`;

  const layers = [
    ["Name", escapeHtml(name)],
    ["Email", `<a href="mailto:${escapeHtml(brief.email)}" style="color:${C.panelText};text-decoration:underline">${escapeHtml(brief.email)}</a>`],
    ["Needs", brief.needs.length ? brief.needs.map(chip).join("") : "—"],
    ["Budget", escapeHtml(brief.budget || "—")],
    ["Timeline", escapeHtml(brief.timeline || "—")],
    ["Language", brief.lang === "ar" ? "Arabic · عربي" : "English"],
  ];

  const message = brief.message
    ? `
      <tr><td style="padding:28px 0 10px;font:600 11px/16px ${F.mono};letter-spacing:.14em;text-transform:uppercase;color:${C.inkDim}">Message.txt</td></tr>
      <tr><td dir="auto" style="padding:4px 0 4px 16px;border-left:3px solid ${C.signal};font:400 16px/26px ${F.serif};color:${C.ink};white-space:pre-wrap">${escapeHtml(brief.message)}</td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Fraunces:wght@400&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.desk}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(`${name} sent a brief${brief.needs.length ? ` for ${brief.needs.join(", ")}` : ""}. Reply to answer directly.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.desk}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

    <!-- title bar: logo, name, open document tab -->
    <tr><td style="background:${C.chrome};border-radius:12px 12px 0 0;padding:12px 16px;border-bottom:1px solid ${C.chromeLine}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="34" style="vertical-align:middle"><a href="${SITE}"><img src="${SITE}/brand/email-mark.png" width="28" height="28" alt="Design Dynamo" style="display:block;border:0;border-radius:7px"></a></td>
        <td style="vertical-align:middle;font:700 15px/20px ${F.display};color:#ffffff">Design Dynamo</td>
        <td align="right" style="vertical-align:middle">
          <span style="display:inline-block;padding:6px 12px;border-radius:7px 7px 0 0;background:${C.desk};font:500 11px/14px ${F.mono};color:#ffffff;white-space:nowrap">BRIEF.PSD <span style="color:${C.chromeText}">@ 100%</span></span>
        </td>
      </tr></table>
    </td></tr>

    <!-- artboard label -->
    <tr><td style="background:${C.desk};padding:18px 28px 10px;font:500 11px/14px ${F.mono};letter-spacing:.06em;color:${C.chromeText}">
      <span style="color:${C.label}">01</span>&nbsp; NEW-BRIEF.PSD
    </td></tr>

    <!-- the artboard -->
    <tr><td style="background:${C.art};padding:36px 32px 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font:600 12px/16px ${F.mono};letter-spacing:.14em;text-transform:uppercase;color:${C.inkDim}">
          <span style="color:${C.signal}">&#9679;</span>&nbsp; New project brief
        </td></tr>
        <tr><td dir="auto" style="padding:14px 0 10px;font:800 36px/40px ${F.display};letter-spacing:-1px;color:${C.ink}">
          A brief from <span style="color:${C.signal}">${escapeHtml(name)}</span>.
        </td></tr>
        <tr><td style="font:400 15px/22px ${F.serif};color:${C.inkDim}">
          ${received(now)} · via designdynamo.art
        </td></tr>
        <tr><td style="padding:24px 0 30px">
          <a href="${replyHref}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:${C.signal};font:700 15px/18px ${F.display};color:${C.ink};text-decoration:none">Reply to ${escapeHtml(first)} &rarr;</a>
        </td></tr>

        <!-- Layers panel -->
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.chrome};border-radius:10px">
            <tr><td colspan="3" style="padding:12px 14px;border-bottom:1px solid ${C.chromeLine}">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="font:500 11px/14px ${F.mono};letter-spacing:.1em;color:${C.chromeText}">LAYERS</td>
                <td align="right" style="font:500 11px/14px ${F.mono};letter-spacing:.1em;color:${C.chromeText}">${layers.length} LAYERS</td>
              </tr></table>
            </td></tr>
            ${layers.map(([label, value], i) => layerRow(label, value, SWATCHES[i % SWATCHES.length], i === layers.length - 1)).join("")}
          </table>
        </td></tr>
        ${message}
      </table>
    </td></tr>

    <!-- status bar -->
    <tr><td style="background:${C.chrome};border-radius:0 0 12px 12px;padding:12px 16px;border-top:1px solid ${C.chromeLine}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font:500 11px/16px ${F.mono};letter-spacing:.06em;color:${C.chromeText}">
          <span style="color:#34c759">&#9679;</span>&nbsp; OPEN FOR PROJECTS · 2026
        </td>
        <td align="right" style="font:500 11px/16px ${F.mono};letter-spacing:.06em"><a href="${SITE}" style="color:${C.lime};text-decoration:none">DESIGNDYNAMO.ART</a></td>
      </tr></table>
    </td></tr>

    <tr><td align="center" style="padding:18px 16px 0;font:400 12px/18px ${F.serif};color:#7d7a73">
      Replying to this email answers ${escapeHtml(first)} directly. · Riyadh, KSA
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `New project brief — ${name}`,
    received(now),
    "",
    `Name:     ${name}`,
    `Email:    ${brief.email}`,
    `Needs:    ${brief.needs.join(", ") || "—"}`,
    `Budget:   ${brief.budget || "—"}`,
    `Timeline: ${brief.timeline || "—"}`,
    `Language: ${brief.lang === "ar" ? "Arabic" : "English"}`,
    ...(brief.message ? ["", "Message:", brief.message] : []),
    "",
    `Reply to this email to answer ${first} directly.`,
    SITE,
  ].join("\n");

  return { subject, html, text };
}
