import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

// Warmup
console.log("warmup...");
await page.goto("https://just-juice.onrender.com/", { waitUntil: "domcontentloaded", timeout: 90_000 });
await page.waitForTimeout(8_000);
console.log("real load...");
await page.goto("https://just-juice.onrender.com/", { waitUntil: "networkidle", timeout: 60_000 });
await page.waitForTimeout(3_000);

const info = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll("a"))
    .map((a) => ({ text: a.textContent?.trim().slice(0, 40), href: a.getAttribute("href") }))
    .filter((l) => l.href && l.text)
    .filter((l) => !l.href.startsWith("http") || l.href.includes("just-juice"));
  const sections = Array.from(document.querySelectorAll("section, [class*='section'], h1, h2"))
    .slice(0, 20)
    .map((el) => ({ tag: el.tagName.toLowerCase(), id: el.id || null, class: (el.className || "").slice(0, 60), text: el.textContent?.trim().slice(0, 60) }));
  return {
    title: document.title,
    height: document.documentElement.scrollHeight,
    links: links.slice(0, 30),
    sections,
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
