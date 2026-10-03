/* Reviews: real client reviews stored in Supabase, shown live.

   Setup (once): create a free project at supabase.com, run
   supabase/reviews.sql in its SQL Editor, then put the project's URL and
   anon key in .env.local:
     VITE_SUPABASE_URL=https://xxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJ…
   The anon key is designed to be public — the database rules in
   reviews.sql decide what it can do (submit unapproved, read approved).

   Dev only: VITE_REVIEWS_MOCK=true runs an in-memory stand-in so the flow
   can be tried before Supabase exists. It starts empty and "approves" your
   own test submissions after a few seconds. It is never part of a
   production build. */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MOCK = import.meta.env.DEV && import.meta.env.VITE_REVIEWS_MOCK === "true";

const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } }) : null;

export const reviewsConfigured = Boolean(supabase) || MOCK;

const COLUMNS = "id, created_at, name, role, service, project, rating, body, photo_url";

/* ---------- photo: shrink to a 256px WebP before uploading ---------- */

async function shrinkPhoto(file) {
  const bitmap = await createImageBitmap(file);
  const size = 256;
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h); // centre crop to a square
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not read that image."))), "image/webp", 0.82)
  );
}

/* ---------- dev-only stand-in ---------------------------------------- */

const mock = (() => {
  if (!MOCK) return null;
  const rows = [];
  const listeners = new Set();
  return {
    async list() {
      return rows.filter((row) => row.approved);
    },
    async insert(row) {
      const record = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString(), approved: false };
      rows.push(record);
      // pretend the owner approves it a moment later
      setTimeout(() => {
        record.approved = true;
        listeners.forEach((listener) => listener({ type: "upsert", review: record }));
      }, 3500);
    },
    async upload(blob) {
      return URL.createObjectURL(blob);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

/* ---------- public API ------------------------------------------------ */

export async function fetchReviews() {
  if (mock) return mock.list();
  if (!supabase) return [];
  const { data, error } = await supabase.from("reviews").select(COLUMNS).eq("approved", true).order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data;
}

/* Calls listener({ type: "upsert", review }) when a review is approved
   (or edited), and ({ type: "remove", id }) when one is unapproved or
   deleted. Returns an unsubscribe function. */
export function subscribeToReviews(listener) {
  if (mock) return mock.subscribe(listener);
  if (!supabase) return () => {};
  const channel = supabase
    .channel("public:reviews")
    .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, (payload) => {
      if (payload.eventType === "DELETE") {
        listener({ type: "remove", id: payload.old.id });
        return;
      }
      const row = payload.new;
      if (row.approved) listener({ type: "upsert", review: row });
      else listener({ type: "remove", id: row.id });
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function submitReview({ name, role, service, project, rating, body, photo }) {
  let photo_url = null;
  if (photo) {
    const blob = await shrinkPhoto(photo);
    if (mock) photo_url = await mock.upload(blob);
    else if (supabase) {
      const path = `${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from("review-photos").upload(path, blob, { contentType: "image/webp" });
      if (error) throw new Error("The photo couldn't be uploaded. Try again without it.");
      photo_url = supabase.storage.from("review-photos").getPublicUrl(path).data.publicUrl;
    }
  }

  const row = {
    name: name.trim(),
    role: role.trim() || null,
    service: service || null,
    project: project || null,
    rating,
    body: body.trim(),
    photo_url,
  };

  if (mock) return mock.insert(row);
  if (!supabase) throw new Error("Reviews aren't set up yet.");
  const { error } = await supabase.from("reviews").insert(row);
  if (error) throw new Error("Your review couldn't be sent. Please try again.");
}
