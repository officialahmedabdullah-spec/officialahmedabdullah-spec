/* Studio designs: visitors send what they made on /studio; it is stored
   unapproved in Supabase and only shows in the gallery once you tick
   `approved` (Table Editor → designs). Run supabase/designs.sql once.
   Same client and dev mock switch as reviews (see lib/reviews.js). */
import { MOCK, supabase } from "./reviews";

export const designsConfigured = Boolean(supabase) || MOCK;

const COLUMNS = "id, created_at, name, title, image_url";

// dev-only stand-in: your own test sends get "approved" after a few seconds
const mockRows = [];

export async function fetchDesigns() {
  if (MOCK) return mockRows.filter((row) => row.approved);
  if (!supabase) return [];
  const { data, error } = await supabase.from("designs").select(COLUMNS).eq("approved", true).order("created_at", { ascending: false }).limit(60);
  if (error) throw error;
  return data;
}

export async function submitDesign({ name, title, blob }) {
  const row = { name: name.trim(), title: title.trim() || null };
  if (MOCK) {
    const record = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString(), image_url: URL.createObjectURL(blob), approved: false };
    mockRows.push(record);
    setTimeout(() => (record.approved = true), 3500);
    return;
  }
  if (!supabase) throw new Error("Saving isn't set up yet.");
  const path = `${crypto.randomUUID()}.webp`;
  const upload = await supabase.storage.from("designs").upload(path, blob, { contentType: "image/webp" });
  if (upload.error) throw new Error("Your design couldn't be uploaded. Please try again.");
  const image_url = supabase.storage.from("designs").getPublicUrl(path).data.publicUrl;
  const { error } = await supabase.from("designs").insert({ ...row, image_url });
  if (error) throw new Error("Your design couldn't be saved. Please try again.");
}
