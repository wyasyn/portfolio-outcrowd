import { loadEnv } from 'vite';

const mode = 'production';
const env = loadEnv(mode, process.cwd(), '');

const value = env.VITE_SITE_URL?.trim();

if (!value) {
  console.error('Missing required env: VITE_SITE_URL (production check).');
  process.exit(1);
}

let normalized;
try {
  normalized = new URL(value);
} catch {
  console.error('Invalid VITE_SITE_URL: must be a valid absolute URL.');
  process.exit(1);
}

if (normalized.protocol !== 'https:') {
  console.error('Invalid VITE_SITE_URL: only https URLs are allowed in production.');
  process.exit(1);
}

console.log(`Environment check passed: VITE_SITE_URL=${normalized.toString().replace(/\/$/, '')}`);
