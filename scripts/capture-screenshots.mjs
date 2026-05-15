// Capture screenshots of live deployments and save into public/work/<slug>/.
// Usage: node scripts/capture-screenshots.mjs
//
// Sites with no live URL (or private/internal) keep their gradient placeholder.

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const VIEWPORT = { width: 1600, height: 900 };

// slug -> { url, shots: [{ name, scroll?, wait? }] }
const targets = {
  "just-juice": {
    url: "https://just-juice.onrender.com/",
    waitFor: 25_000, // Render free tier cold-starts slowly
    shots: [
      { name: "hero", scroll: 0 },
      { name: "products", scroll: 700 },
      { name: "cart", scroll: 1400 },
    ],
  },
  "handyman-services": {
    url: "https://handyman-services-one.vercel.app/",
    waitFor: 4_000,
    shots: [
      { name: "hero", scroll: 0 },
      { name: "services", scroll: 800 },
      { name: "contact", scroll: 1800 },
    ],
  },
  "capital-finder": {
    url: "https://capital-finder-sheldon-pierce.vercel.app/",
    waitFor: 4_000,
    shots: [{ name: "hero", scroll: 0 }],
  },
};

async function capture(slug, cfg) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`[${slug}] navigating to ${cfg.url}`);
  try {
    await page.goto(cfg.url, {
      waitUntil: "networkidle",
      timeout: cfg.waitFor + 30_000,
    });
  } catch (err) {
    console.log(`[${slug}] networkidle timed out, falling back to domcontentloaded: ${err.message}`);
    await page.goto(cfg.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  }

  await page.waitForTimeout(cfg.waitFor ?? 2_000);

  for (const shot of cfg.shots) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), shot.scroll ?? 0);
    await page.waitForTimeout(500);
    const out = path.join(root, "public", "work", slug, `${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`[${slug}] wrote ${out}`);
  }

  await browser.close();
}

const which = process.argv[2];
const entries = which ? [[which, targets[which]]] : Object.entries(targets);
if (which && !targets[which]) {
  console.error(`No target named '${which}'. Known: ${Object.keys(targets).join(", ")}`);
  process.exit(1);
}

for (const [slug, cfg] of entries) {
  try {
    await capture(slug, cfg);
  } catch (err) {
    console.error(`[${slug}] FAILED:`, err.message);
  }
}

console.log("done.");
