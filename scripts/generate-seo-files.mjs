import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

function normalizeSiteUrl(value) {
  const fallback = "https://example.com";
  const raw = (value || fallback).trim();
  try {
    const normalized = new URL(raw).toString().replace(/\/$/, "");
    return normalized;
  } catch {
    return fallback;
  }
}

async function run() {
  const mode = process.env.NODE_ENV === "production" ? "production" : "development";
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);
  const today = new Date().toISOString().slice(0, 10);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  const publicDir = path.join(process.cwd(), "public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");

  if (siteUrl === "https://example.com") {
    console.warn("SEO warning: set VITE_SITE_URL in .env to your real domain.");
  }
}

run().catch((error) => {
  console.error("Failed to generate SEO files:", error);
  process.exit(1);
});
