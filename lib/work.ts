import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface WorkFrontmatter {
  slug: string;
  title: string;
  year: number;
  featured?: boolean;
  role: string;
  stack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  heroImage: string;
  gallery?: string[];
  summary: string;
}

export interface WorkEntry extends WorkFrontmatter {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

function readEntry(filename: string): WorkEntry {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as WorkFrontmatter;
  return { ...fm, body: content };
}

export function getAllWork(): WorkEntry[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const entries = files.map(readEntry);
  return entries.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });
}

export function getWorkBySlug(slug: string): WorkEntry | null {
  try {
    const file = `${slug}.mdx`;
    if (!fs.existsSync(path.join(CONTENT_DIR, file))) return null;
    return readEntry(file);
  } catch {
    return null;
  }
}
