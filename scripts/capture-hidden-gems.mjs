// One-off: serve the local Hidden Gems static site and screenshot it.
// The repo lives outside our sandbox; we copy it into /tmp first, then serve
// from there over a local HTTP port and let Playwright capture the rendered
// page. Saves screenshots into public/work/matchmaking/.

import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const STATIC_DIR = "/tmp/matchmaking-static";
const PORT = 4321;
const OUT_DIR = path.join(root, "public", "work", "matchmaking");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === "/" ? "/index.html" : req.url;
  const safe = path.normalize(path.join(STATIC_DIR, urlPath));
  if (!safe.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(safe, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found: " + urlPath);
      return;
    }
    const ext = path.extname(safe);
    res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`serving ${STATIC_DIR} at http://localhost:${PORT}/`);

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

const shots = [
  { name: "hero", scroll: 0 },
  { name: "process", scroll: 900 },
  { name: "split", scroll: 1800 },
];

await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 30_000 });
try {
  await page.waitForLoadState("networkidle", { timeout: 30_000 });
} catch {}
await page.evaluate(() => document.fonts?.ready).catch(() => {});

// Wait for all images
await page
  .waitForFunction(
    () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
    { timeout: 20_000 },
  )
  .catch(() => {});

await page.waitForTimeout(2000);

// Force scroll pass to settle lazy effects
await page.evaluate(async () => {
  const max = document.documentElement.scrollHeight;
  for (let y = 0; y < max; y += 600) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});

await page.waitForTimeout(1500);

for (const shot of shots) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), shot.scroll);
  await page.waitForTimeout(800);
  const out = path.join(OUT_DIR, `${shot.name}.png`);
  await page.screenshot({ path: out, fullPage: false });
  console.log(`  ✓ ${out}`);
}

// Mobile shot too
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mobilePage = await mobile.newPage();
await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(2000);
const mobileOut = path.join(OUT_DIR, "mobile.png");
await mobilePage.screenshot({ path: mobileOut, fullPage: false });
console.log(`  ✓ ${mobileOut}`);

await browser.close();
server.close();
console.log("done");
