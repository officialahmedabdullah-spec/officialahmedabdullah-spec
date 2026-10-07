import { archiveCategories, imageTitles } from "./portfolioData";

/* Web versions written by `npm run images` (see scripts/optimize-images.mjs).
   A key is the path below full/ without extension, e.g.
   "canvas-design/02/mockup". Titles and category names are looked up when
   asked for, so they follow the current language. */
const full = import.meta.glob("../assets/projects/full/**/*.webp", { eager: true, query: "?url", import: "default" });
const thumb = import.meta.glob("../assets/projects/thumb/**/*.webp", { eager: true, query: "?url", import: "default" });

const keyOf = (path, dir) => path.slice(path.indexOf(`/${dir}/`) + dir.length + 2).replace(/\.webp$/, "");
const byKey = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const thumbs = Object.fromEntries(Object.entries(thumb).map(([path, url]) => [keyOf(path, "thumb"), url]));

// "recent-projects/poster-designs-5" -> "Poster designs 5" (or the override in imageTitles)
const titleOf = (key) => {
  if (imageTitles[key]) return imageTitles[key];
  const name = key.slice(key.lastIndexOf("/") + 1).replace(/-/g, " ").trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const images = Object.entries(full)
  .map(([path, url]) => {
    const key = keyOf(path, "full");
    return { key, src: url, thumb: thumbs[key] ?? url, folder: key.split("/")[0] };
  })
  .sort((a, b) => byKey(a.key, b.key));

const index = new Map(images.map((image) => [image.key, image]));
const withTitle = (image) => image && { ...image, title: titleOf(image.key) };

export const projectImage = (key) => withTitle(index.get(key));

export const folderImages = (folder) => images.filter((image) => image.folder === folder).map(withTitle);

// grouped for the archive, in archiveCategories order; a category can also
// borrow images from another folder (`also`), e.g. a client's logo shown
// under Logo & Branding as well as under the client
export const getArchive = () =>
  archiveCategories
    .map((category) => ({
      ...category,
      items: [...folderImages(category.id), ...(category.also ?? []).map(projectImage).filter(Boolean)].map((image) => ({
        ...image,
        category: category.title,
      })),
    }))
    .filter((category) => category.items.length > 0);

export const archiveCount = images.filter((image) => archiveCategories.some((c) => c.id === image.folder)).length;
