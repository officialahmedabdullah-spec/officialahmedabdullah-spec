/* ------------------------------------------------------------------
   npm run images

   Originals live in media-source/projects/<category>/… (any size, never
   bundled). This writes web versions the app imports:

     src/assets/projects/full/<category>/<name>.webp   ≤ 2000px, q78
     src/assets/projects/thumb/<category>/<name>.webp  ≤ 760px,  q72

   Unchanged files are skipped, removed originals are cleaned up.
   ------------------------------------------------------------------ */
import { existsSync } from "node:fs";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, "media-source", "projects");
const OUT = path.join(root, "src", "assets", "projects");
const SIZES = [
  { dir: "full", max: 2000, quality: 78 },
  { dir: "thumb", max: 760, quality: 72 },
];
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?|jfif)$/i;

sharp.cache(false);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return IMAGE.test(entry.name) ? [full] : [];
    })
  );
  return files.flat();
}

// "poster-designs (5).jpg" -> "poster-designs-5.webp" (URL- and import-friendly)
const outName = (rel) =>
  rel
    .replace(/\.[^.]+$/, "")
    .split(path.sep)
    .map((part) => part.trim().replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase())
    .join("/") + ".webp";

const sources = await walk(SRC);
const expected = new Set();
let made = 0;
let skipped = 0;

for (const file of sources) {
  const rel = path.relative(SRC, file);
  const name = outName(rel);
  const { mtimeMs } = await stat(file);

  for (const size of SIZES) {
    const target = path.join(OUT, size.dir, name);
    expected.add(target);
    if (existsSync(target) && (await stat(target)).mtimeMs >= mtimeMs) {
      skipped++;
      continue;
    }
    await mkdir(path.dirname(target), { recursive: true });
    await sharp(file, { limitInputPixels: false, failOn: "none" })
      .rotate()
      .resize({ width: size.max, height: size.max, fit: "inside", withoutEnlargement: true })
      .webp({ quality: size.quality, effort: 5 })
      .toFile(target);
    made++;
  }
  process.stdout.write(`✓ ${rel}\n`);
}

// drop outputs whose original was removed
async function prune(dir) {
  if (!existsSync(dir)) return;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await prune(full);
    else if (!expected.has(full)) await rm(full);
  }
}
await prune(OUT);

console.log(`\n${made} written, ${skipped} up to date, ${sources.length} originals.`);
