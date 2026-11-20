import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// dist/404.html must be the built app, not public/404.html. Vite copies
// public/ through unchanged, and the old stub pointed at /src/main.jsx,
// which does not exist after `vite build`. Nginx `error_page 404 /404.html`
// serves this file with a real 404 status.
const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const indexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf8');
const robots = '<meta name="robots" content="noindex">';

if (indexHtml.includes('/src/main.jsx')) {
  console.error('dist/index.html still references the Vite dev entry /src/main.jsx');
  process.exit(1);
}

if (!indexHtml.includes('<head>')) {
  console.error('dist/index.html is missing <head>');
  process.exit(1);
}

const html = indexHtml.includes('name="robots"')
  ? indexHtml
  : indexHtml.replace('<head>', `<head>\n    ${robots}`);

if (!html.includes(robots) || !html.includes('/assets/')) {
  console.error('Refusing to write dist/404.html without the robots meta and built assets');
  process.exit(1);
}

writeFileSync(resolve(distDir, '404.html'), html);
console.log('Wrote dist/404.html');
