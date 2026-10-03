/* POST /api/brief — Vercel serverless function. Logic lives in _brief.js
   (files starting with "_" are not deployed as their own endpoints). */
import { clientIp, handleBrief } from "./_brief.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const { status, body: result } = await handleBrief(body ?? {}, { ip: clientIp(req.headers) });
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(result);
}
