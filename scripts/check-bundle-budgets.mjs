import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST_ASSETS_DIR = path.join(process.cwd(), 'dist', 'assets');

const BUDGETS = {
  maxEntryJsBytes: 430 * 1024,
  maxLazyChunkJsBytes: 120 * 1024,
  maxCssBytes: 60 * 1024,
};

function pretty(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

async function run() {
  const entries = await readdir(DIST_ASSETS_DIR);
  const jsFiles = entries.filter((entry) => entry.endsWith('.js'));
  const cssFiles = entries.filter((entry) => entry.endsWith('.css'));

  const failures = [];

  const jsStats = await Promise.all(
    jsFiles.map(async (file) => {
      const filePath = path.join(DIST_ASSETS_DIR, file);
      const fileStat = await stat(filePath);
      return { file, size: fileStat.size };
    }),
  );

  const entryChunk = jsStats.find((item) => item.file.startsWith('index-'));
  if (!entryChunk) {
    failures.push('Missing main entry bundle (index-*.js).');
  } else if (entryChunk.size > BUDGETS.maxEntryJsBytes) {
    failures.push(
      `Entry bundle ${entryChunk.file} is ${pretty(entryChunk.size)} (budget: ${pretty(BUDGETS.maxEntryJsBytes)}).`,
    );
  }

  for (const chunk of jsStats) {
    if (chunk.file.startsWith('index-')) continue;
    if (chunk.size > BUDGETS.maxLazyChunkJsBytes) {
      failures.push(
        `Lazy chunk ${chunk.file} is ${pretty(chunk.size)} (budget: ${pretty(BUDGETS.maxLazyChunkJsBytes)}).`,
      );
    }
  }

  for (const cssFile of cssFiles) {
    const filePath = path.join(DIST_ASSETS_DIR, cssFile);
    const cssStat = await stat(filePath);
    if (cssStat.size > BUDGETS.maxCssBytes) {
      failures.push(
        `CSS bundle ${cssFile} is ${pretty(cssStat.size)} (budget: ${pretty(BUDGETS.maxCssBytes)}).`,
      );
    }
  }

  if (failures.length > 0) {
    console.error('Bundle budget check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('Bundle budget check passed.');
}

run().catch((error) => {
  console.error('Bundle budget check failed with unexpected error:', error);
  process.exit(1);
});
