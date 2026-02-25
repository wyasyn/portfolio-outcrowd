import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const FALLBACK_SITE_URL = 'https://example.com';

function normalizeSiteUrl(value) {
  const raw = (value || FALLBACK_SITE_URL).trim();
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return FALLBACK_SITE_URL;
  }
}

function assertProductionSiteUrl(mode, envSiteUrl, normalizedSiteUrl) {
  if (mode !== 'production') return;
  if (!envSiteUrl || normalizedSiteUrl === FALLBACK_SITE_URL) {
    throw new Error('VITE_SITE_URL must be a valid https URL in production builds.');
  }

  const parsed = new URL(normalizedSiteUrl);
  if (parsed.protocol !== 'https:') {
    throw new Error('VITE_SITE_URL must use https in production builds.');
  }
}

async function run() {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);
  assertProductionSiteUrl(mode, env.VITE_SITE_URL, siteUrl);
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

  const publicDir = path.join(process.cwd(), 'public');
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

  if (siteUrl === FALLBACK_SITE_URL) {
    console.warn('SEO warning: set VITE_SITE_URL in .env to your real domain.');
  }
}

run().catch((error) => {
  console.error('Failed to generate SEO files:', error);
  process.exit(1);
});
