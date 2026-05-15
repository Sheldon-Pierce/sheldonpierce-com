// Capture screenshots of live deployments and save into public/work/<slug>/.
// Usage: node scripts/capture-screenshots.mjs              # all
//        node scripts/capture-screenshots.mjs <slug>        # just one
//
// Each shot can specify:
//   - path: navigate to that URL
//   - scroll: scroll position on the current page
//   - mobile: capture at mobile viewport
//   - before: async function to run before the screenshot (e.g., add to cart)

import { chromium, devices } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DESKTOP = { width: 1600, height: 900 };
const MOBILE = { width: 390, height: 844 }; // iPhone 14 Pro-ish

const targets = {
  "just-juice": {
    base: "https://just-juice.onrender.com",
    warmup: true,
    readySelectors: ["h2.chakra-heading, .chakra-text"],
    settleMs: 4000,
    shots: [
      { name: "hero", path: "/" },
      { name: "products", path: "/products" },
      {
        name: "cart",
        path: "/products",
        // Add one product to the cart, then nav to /cart for the shot
        before: async (page) => {
          await page.waitForTimeout(1500);
          // The product cards each have an Add-to-Cart icon button.
          // Pick the second product (more visually balanced page state).
          const addButtons = await page.$$("button[aria-label*='cart' i], button:has-text('Add')");
          if (addButtons.length > 0) {
            await addButtons[1 % addButtons.length].click().catch(() => {});
            await page.waitForTimeout(800);
            await addButtons[0].click().catch(() => {});
            await page.waitForTimeout(800);
          } else {
            // Fall back: any small cart icon button on a product card
            const cartIcons = await page.$$("svg[aria-label*='cart' i], button svg");
            for (const icon of cartIcons.slice(0, 2)) {
              await icon.click({ force: true }).catch(() => {});
              await page.waitForTimeout(500);
            }
          }
          // Navigate to the cart page
          await page.goto("https://just-juice.onrender.com/cart", { waitUntil: "networkidle" });
          await page.waitForTimeout(2000);
        },
      },
    ],
  },
  "handyman-services": {
    base: "https://handyman-services-one.vercel.app",
    warmup: false,
    readySelectors: ["h1, h2"],
    settleMs: 2000,
    shots: [
      { name: "hero", path: "/", scroll: 0 },
      // Mobile view: shows responsive design as a portfolio shot
      { name: "mobile", path: "/", scroll: 0, mobile: true },
    ],
  },
};

async function waitForAllImages(page, timeoutMs = 30_000) {
  return page.waitForFunction(
    () => {
      const imgs = Array.from(document.images);
      if (imgs.length === 0) return true;
      return imgs.every((i) => i.complete && i.naturalWidth > 0);
    },
    { timeout: timeoutMs },
  );
}

async function gotoAndSettle(page, url, cfg) {
  console.log(`  → navigating to ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });

  try {
    await page.waitForLoadState("networkidle", { timeout: 60_000 });
  } catch {
    console.log(`  ⚠ networkidle timed out`);
  }

  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  try {
    await waitForAllImages(page, 30_000);
  } catch {
    console.log(`  ⚠ image wait timed out`);
  }

  for (const sel of cfg.readySelectors ?? []) {
    try {
      await page.waitForSelector(sel, { state: "visible", timeout: 20_000 });
    } catch {
      console.log(`  ⚠ ready selector "${sel}" not found`);
    }
  }

  await page.waitForTimeout(cfg.settleMs ?? 2000);

  // Scroll pass to trigger lazy loads
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  try {
    await waitForAllImages(page, 15_000);
  } catch {}

  await page.waitForTimeout(1500);
}

async function warmupHost(url) {
  console.log(`  [warmup] hitting ${url}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(8_000);
  } catch (err) {
    console.log(`  [warmup] ${err.message}`);
  }
  await browser.close();
}

async function capture(slug, cfg) {
  console.log(`\n[${slug}] ${cfg.base}`);
  if (cfg.warmup) await warmupHost(cfg.base + "/");

  for (const shot of cfg.shots) {
    const browser = await chromium.launch();
    const viewport = shot.mobile ? MOBILE : DESKTOP;
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
      ...(shot.mobile ? devices["iPhone 13"] : {}),
    });
    const page = await context.newPage();

    const url = cfg.base + (shot.path ?? "/");
    await gotoAndSettle(page, url, cfg);

    if (shot.before) {
      console.log(`  ▶ running before-hook`);
      await shot.before(page);
    }

    if (typeof shot.scroll === "number") {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), shot.scroll);
      await page.waitForTimeout(800);
    }

    const out = path.join(root, "public", "work", slug, `${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`  ✓ wrote ${out} (${shot.mobile ? "mobile" : "desktop"})`);

    await browser.close();
  }
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

console.log("\ndone.");
