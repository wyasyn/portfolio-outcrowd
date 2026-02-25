# Yasin Walum Portfolio

Modern single-page portfolio built with React, TypeScript, and Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand (window/navigation state)
- Motion (animations)
- React Hook Form + Zod (contact form validation)

## Features

- Desktop-inspired portfolio layout with About, Projects, and Contact windows
- Responsive navigation with mobile drawer
- Contact form integration via FormSubmit endpoint
- Local optimized font loading (`woff2`)
- SEO-ready metadata:
  - Open Graph + Twitter cards
  - JSON-LD (`Person`, `Organization`, `WebSite`)
  - `robots.txt` and `sitemap.xml` generation
  - SEO QA validation script for CI

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set values:

```env
VITE_SITE_URL=https://your-domain.com

VITE_CONTACT_EMAIL=you@example.com
VITE_CONTACT_PHONE_DISPLAY=+256 700 000000
VITE_CONTACT_WHATSAPP=256700000000
VITE_CONTACT_LOCATION_LABEL=Kampala, Uganda
VITE_CONTACT_LOCATION_QUERY=Kampala, Uganda
VITE_CONTACT_FORM_ENDPOINT=https://formsubmit.co/ajax/you@example.com
```

### 3. Run development server

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - start local dev server
- `pnpm lint` - run ESLint
- `pnpm seo:generate` - generate `public/robots.txt` and `public/sitemap.xml`
- `pnpm build` - generate SEO files, type-check, and build production assets
- `pnpm seo:qa` - validate SEO-critical output in `dist/`
- `pnpm env:check:prod` - validate required production environment variables
- `pnpm format` - format files with Prettier
- `pnpm format:check` - verify Prettier formatting
- `pnpm ci:seo` - run env check + build + SEO QA (CI-friendly)
- `pnpm preview` - preview production build locally

## SEO Notes

- `VITE_SITE_URL` is required for canonical URLs, OG URL, JSON-LD URL, sitemap, and robots sitemap path.
- If `VITE_SITE_URL` is missing/invalid, SEO generation falls back to `https://example.com` and logs a warning.
- Open Graph image is served from Cloudinary:
  - `https://res.cloudinary.com/dkdteb9m5/image/upload/v1739381052/qnsyneuzwomdka0oqvws.jpg`

## Deployment

1. Set production env vars (especially `VITE_SITE_URL`) in your hosting platform.
2. Run:

```bash
pnpm ci:seo
```

3. Deploy the generated `dist/` output.

### Security headers

- `public/_headers` is included for Netlify-style static hosting.
- `vercel.json` includes the equivalent headers for Vercel.
- For best Lighthouse Best Practices score, add a strict `Content-Security-Policy` at your host level using nonces or hashes for inline JSON-LD scripts.

## License

Personal portfolio project. Update license terms as needed.
