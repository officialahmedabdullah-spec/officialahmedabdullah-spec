/* Writes the static brand files from src/lib/brand.js:
   public/favicon.svg, public/images/logo.svg, public/brand/mark-*.svg
   Run after changing the mark:  node scripts/brand-files.mjs */
import { writeFileSync } from "node:fs";
import { BRAND, MARK_PATH } from "../src/lib/brand.js";

const mark = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1410 1410"><path fill="${fill}" fill-rule="evenodd" d="${MARK_PATH}"/></svg>\n`;

// favicon: burgundy mark on a cream tile
writeFileSync(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1410 1410"><rect width="1410" height="1410" rx="300" fill="${BRAND.cream}"/>` +
    `<g transform="translate(230 230) scale(.674)"><path fill="${BRAND.burgundy}" fill-rule="evenodd" d="${MARK_PATH}"/></g></svg>\n`
);
writeFileSync("public/images/logo.svg", mark(BRAND.burgundy));
writeFileSync("public/brand/mark-burgundy.svg", mark(BRAND.burgundy));
writeFileSync("public/brand/mark-lime.svg", mark(BRAND.lime));
console.log("brand files written");
