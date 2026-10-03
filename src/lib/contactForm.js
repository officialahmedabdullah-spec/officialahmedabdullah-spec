/* Sends the contact brief straight to the inbox via Web3Forms
   (https://web3forms.com) — no backend, no mail app on the visitor's side.

   Setup: get a free access key at web3forms.com (it's emailed to the address
   that should receive messages), then put it in .env.local:
     VITE_WEB3FORMS_KEY=your-key
   The key is designed to be public; Web3Forms only ever delivers to the
   address it was created for. Without a key the form falls back to mailto. */

const ENDPOINT = "https://api.web3forms.com/submit";
const KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export const formConfigured = Boolean(KEY);

export async function sendBrief({ name, email, needs, budget, timeline, message, botcheck }) {
  const lines = [
    needs.length ? `Needs: ${needs.join(", ")}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `When: ${timeline}` : null,
    message ? `\n${message}` : null,
  ].filter(Boolean);

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: KEY,
      subject: `New project brief${needs.length ? ` — ${needs[0]}` : ""}${name ? ` from ${name}` : ""}`,
      from_name: "Portfolio contact form",
      name: name || "Not given",
      email, // Web3Forms sets this as the reply-to address
      needs: needs.join(", ") || "—",
      budget: budget || "—",
      timeline: timeline || "—",
      message: lines.join("\n") || "—",
      botcheck, // honeypot: real people leave it empty
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Could not send (status ${response.status})`);
  }
  return result;
}
