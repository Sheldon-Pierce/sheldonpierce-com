import type { MetadataRoute } from "next";
import { getAllWork } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sheldonpierce.com";
  const now = new Date();
  const workEntries = getAllWork().map((w) => ({
    url: `${base}/work/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...workEntries,
  ];
}
