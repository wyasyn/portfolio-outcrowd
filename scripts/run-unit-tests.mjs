import { rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';

try {
  execSync('tsc -p tsconfig.tests.json', { stdio: 'inherit' });
  execSync('node --test .tmp-tests/tests/*.test.js', { stdio: 'inherit' });
} finally {
  await rm('.tmp-tests', { recursive: true, force: true });
}
