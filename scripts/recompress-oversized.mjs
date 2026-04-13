import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const MAX_BYTES = 200 * 1024; // 200KB

const DIRS = [
  join(ROOT, "src/assets/catalog"),
  join(ROOT, "src/assets"),
];

async function recompressDir(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    if (extname(file) !== ".webp") continue;
    const src = join(dir, file);
    const size = (await stat(src)).size;
    if (size <= MAX_BYTES) continue;

    // Try lower quality until under 200KB
    let quality = 75;
    let buf;
    while (quality >= 50) {
      buf = await sharp(src).webp({ quality }).toBuffer();
      if (buf.length <= MAX_BYTES) break;
      quality -= 5;
    }

    if (buf && buf.length < size) {
      const { writeFile } = await import("fs/promises");
      await writeFile(src, buf);
      console.log(`${file}: ${(size/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB (q${quality})`);
    }
  }
}

for (const dir of DIRS) {
  await recompressDir(dir);
}
console.log("✅ Done");
