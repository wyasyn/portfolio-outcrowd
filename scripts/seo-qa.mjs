import { access, readFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.join(process.cwd(), "dist");

async function fileMustExist(relativePath) {
  const fullPath = path.join(DIST_DIR, relativePath);
  await access(fullPath);
  return fullPath;
}

function assertMatch(content, pattern, message, errors) {
  if (!pattern.test(content)) {
    errors.push(message);
  }
}

async function run() {
  const errors = [];

  const indexPath = await fileMustExist("index.html").catch(() => null);
  const sitemapPath = await fileMustExist("sitemap.xml").catch(() => null);

  if (!indexPath) errors.push("Missing dist/index.html. Run build before SEO QA.");
  if (!sitemapPath) errors.push("Missing dist/sitemap.xml. Ensure seo:generate runs before build.");

  if (indexPath) {
    const html = await readFile(indexPath, "utf8");

    assertMatch(html, /<title>[^<]+<\/title>/i, "Missing HTML title.", errors);
    assertMatch(
      html,
      /<meta\s+name="description"\s+content="[^"]+"/i,
      "Missing meta description.",
      errors,
    );
    assertMatch(html, /<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/i, "Missing canonical URL.", errors);
    assertMatch(html, /property="og:title"\s+content="[^"]+"/i, "Missing og:title.", errors);
    assertMatch(html, /property="og:description"\s+content="[^"]+"/i, "Missing og:description.", errors);
    assertMatch(html, /property="og:image"\s+content="https?:\/\/[^"]+"/i, "Missing og:image.", errors);
    assertMatch(html, /name="twitter:card"\s+content="summary_large_image"/i, "Missing twitter:card.", errors);
    assertMatch(html, /"@type"\s*:\s*"Person"/i, "Missing Person JSON-LD.", errors);
    assertMatch(html, /"@type"\s*:\s*"Organization"/i, "Missing Organization JSON-LD.", errors);
    assertMatch(html, /"@type"\s*:\s*"WebSite"/i, "Missing WebSite JSON-LD.", errors);

    if (/%VITE_SITE_URL%/.test(html)) {
      errors.push("Unresolved %VITE_SITE_URL% placeholder in dist/index.html.");
    }
  }

  if (sitemapPath) {
    const sitemap = await readFile(sitemapPath, "utf8");
    assertMatch(sitemap, /<urlset/i, "sitemap.xml missing urlset root.", errors);
    assertMatch(sitemap, /<loc>https?:\/\/[^<]+<\/loc>/i, "sitemap.xml missing absolute <loc> URL.", errors);
  }

  if (errors.length > 0) {
    console.error("SEO QA failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("SEO QA passed.");
}

run().catch((error) => {
  console.error("SEO QA failed with an unexpected error:", error);
  process.exit(1);
});
