/* Server side of the contact brief (runs on Vercel, never in the browser).

   POST /api/brief → validate → spam checks → save to Supabase `briefs` →
   email a copy to the inbox. The visitor's browser only ever talks to this
   site; no mail app opens and no third-party form service sees the data.

   Environment (Vercel → Settings → Environment Variables):
     SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY   set by the Supabase integration
     RESEND_API_KEY                             optional — email notifications
     BRIEF_TO_EMAIL                             optional — defaults to the site email
     BRIEF_FROM_EMAIL                           optional — a sender on a domain verified in Resend
   Briefs are stored even when email isn't configured, so nothing is lost. */
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const OWNER_EMAIL = "official.ahmedabdullah@gmail.com";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MINUTES = 10;
const MAX_PER_WINDOW = 3;

const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function clean(body) {
  const needs = Array.isArray(body?.needs) ? body.needs.map((n) => text(n, 60)).filter(Boolean).slice(0, 12) : [];
  return {
    name: text(body?.name, 100),
    email: text(body?.email, 200),
    needs,
    budget: text(body?.budget, 40),
    timeline: text(body?.timeline, 40),
    message: text(body?.message, 5000),
    lang: body?.lang === "ar" ? "ar" : "en",
    botcheck: text(body?.botcheck, 200),
  };
}

function validate(brief) {
  if (!EMAIL.test(brief.email)) return "invalid_email";
  if (brief.needs.length === 0 && !brief.message) return "empty";
  return null;
}

function database(env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

async function sendEmail(brief, env) {
  if (!env.RESEND_API_KEY) return false;
  const rows = [
    ["Name", brief.name || "Not given"],
    ["Email", brief.email],
    ["Needs", brief.needs.join(", ") || "—"],
    ["Budget", brief.budget || "—"],
    ["When", brief.timeline || "—"],
    ["Language", brief.lang === "ar" ? "Arabic" : "English"],
  ];
  const html = `
    <h2 style="font-family:sans-serif">New project brief</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join("")}
    </table>
    ${brief.message ? `<p style="font-family:sans-serif;white-space:pre-wrap;border-left:3px solid #ff5b2e;padding-left:12px">${escapeHtml(brief.message)}</p>` : ""}
    <p style="font-family:sans-serif;color:#666">Reply to this email to answer ${escapeHtml(brief.name || "them")} directly.</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.BRIEF_FROM_EMAIL || "Design Dynamo <onboarding@resend.dev>",
      to: [env.BRIEF_TO_EMAIL || OWNER_EMAIL],
      reply_to: brief.email,
      subject: `New project brief${brief.needs.length ? ` — ${brief.needs[0]}` : ""}${brief.name ? ` from ${brief.name}` : ""}`,
      html,
    }),
  });
  return response.ok;
}

/** Returns { status, body } — shared by the Vercel function and the dev server. */
export async function handleBrief(rawBody, { ip = "", env = process.env } = {}) {
  const brief = clean(rawBody);

  // bots fill the hidden field: pretend it worked, keep nothing
  if (brief.botcheck) return { status: 200, body: { ok: true } };

  const problem = validate(brief);
  if (problem) return { status: 400, body: { ok: false, error: problem } };

  const db = database(env);
  if (!db && !env.RESEND_API_KEY) return { status: 503, body: { ok: false, error: "not_configured" } };

  // only a one-way hash of the IP is kept, for the rate limit
  const ipHash = ip ? createHash("sha256").update(`${ip}|${env.SUPABASE_URL || "brief"}`).digest("hex") : null;

  if (db && ipHash) {
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await db.from("briefs").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_WINDOW) return { status: 429, body: { ok: false, error: "rate_limited" } };
  }

  let emailed = false;
  try {
    emailed = await sendEmail(brief, env);
  } catch {
    emailed = false;
  }

  let stored = false;
  if (db) {
    const { error } = await db.from("briefs").insert({
      name: brief.name || null,
      email: brief.email,
      needs: brief.needs,
      budget: brief.budget || null,
      timeline: brief.timeline || null,
      message: brief.message || null,
      lang: brief.lang,
      ip_hash: ipHash,
      emailed,
    });
    stored = !error;
  }

  if (!stored && !emailed) return { status: 502, body: { ok: false, error: "delivery_failed" } };
  return { status: 200, body: { ok: true } };
}

export function clientIp(headers) {
  const get = (name) => (typeof headers.get === "function" ? headers.get(name) : headers[name]);
  return String(get("x-forwarded-for") || get("x-real-ip") || "").split(",")[0].trim();
}
