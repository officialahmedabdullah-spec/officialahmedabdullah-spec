/* Sends the contact brief to this site's own server (api/brief.js), which
   saves it and emails it to the inbox. The visitor never leaves the page
   and no mail app opens. */

export class BriefError extends Error {
  constructor(code) {
    super(code);
    this.code = code; // invalid_email · empty · rate_limited · not_configured · delivery_failed · network
  }
}

export async function sendBrief({ name, email, needs, budget, timeline, message, botcheck, lang }) {
  let response;
  try {
    response = await fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, needs, budget, timeline, message, botcheck, lang }),
    });
  } catch {
    throw new BriefError("network");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new BriefError(result.error || "delivery_failed");
  return result;
}
