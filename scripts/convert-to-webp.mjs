import sharp from "sharp";
import { readdir, rename, unlink } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DIRS = [
  join(ROOT, "src/assets"),
  join(ROOT, "src/assets/catalog"),
];

const QUALITY = 82;

async function convertDir(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const src = join(dir, file);
    const name = basename(file, ext);
    const dest = join(dir, name + ".webp");

    const info = await sharp(src)
      .webp({ quality: QUALITY })
      .toFile(dest);

    const srcSize = (await import("fs")).statSync(src).size;
    const destSize = info.size;
    const saved = (((srcSize - destSize) / srcSize) * 100).toFixed(0);

    console.log(`${file} → ${name}.webp  ${(srcSize/1024).toFixed(0)}KB → ${(destSize/1024).toFixed(0)}KB  (-${saved}%)`);

    // Remove original
    await unlink(src);
  }
}

for (const dir of DIRS) {
  console.log(`\n📁 ${dir}`);
  await convertDir(dir);
}

console.log("\n✅ Done");
