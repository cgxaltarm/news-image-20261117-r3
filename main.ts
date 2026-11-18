// news-image-20261117-r3 — sum up 17 November 2026's world news in one image.
//
// The entry is a newspaper front page for Tuesday 17 November 2026,
// "THE DAY IN WORLD NEWS": 50 stories across 7 regions and 13 fields.
// Three richly illustrated lead panels (Crimean Bridge strike, the
// Iran–US exchange over Bahrain and Qeshm, the Quad minerals deal in
// Manila), 10 grid stories 4–13 each with its own drawing, a BY THE
// NUMBERS strip, a dotted world map with numbered pins 1–13, an ALSO ON
// list of 37 more stories organised by region, a THE DAY BY FIELD bar
// chart totalling exactly 50, and a DATE CHECK box naming two stories
// left out on purpose because they did not happen on 17 November.
// Palette: navy masthead on cream paper, gold rules, red accents.
// Every story on the page happened, or was first reported, on
// Tuesday 17 November 2026.
//
// The image itself is produced by frontpage_v3.py (PIL, DejaVu fonts)
// and stored in this repo as entry.png. This program only places that
// exact image where make.fun expects it, so the judged artefact is
// byte-identical to the image in the repo.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// The source must be a real PNG, not a placeholder.
const sourceBytes = statSync(source).size;
if (sourceBytes > MAX_BYTES) {
  throw new Error(`Entry image is ${sourceBytes} bytes, over the 1 MiB limit`);
}
const head = readFileSync(source).subarray(0, PNG_MAGIC.length);
if (!head.equals(PNG_MAGIC)) {
  throw new Error(`Entry image is not a PNG: ${source}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const destination = join(outputDir, "entry.png");
copyFileSync(source, destination);

const bytes = statSync(destination).size;
if (bytes !== sourceBytes) {
  throw new Error(
    `Copy mismatch: wrote ${bytes} bytes, source is ${sourceBytes} bytes`,
  );
}
console.log(`Wrote ${destination} (${bytes} bytes)`);
