import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const SITE = 'https://jfknowledge.com';
const SHELL_TITLE = 'JF Knowledge Centre | E-Learning, LMS & Digital Solutions';
const PROBE_404 = '/this-does-not-exist-xyz';

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripTags = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const canonicalFor = (route) => (route === '/' ? `${SITE}/` : `${SITE}${route}`);

const outputFile = (route) => {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.replace(/^\//, ''), 'index.html');
};

// Vite preview (and `try_files $uri.html`) resolve `/about` to `about.html`.
// The directory index above is what `/about/` already serves. Same document,
// same canonical, so slashless sitemap URLs are not rewritten to the homepage.
const flatFile = (route) => {
  if (route === '/') return null;
  const rel = route.replace(/^\//, '');
  if (!rel || rel.endsWith('/')) return null;
  return path.join(distDir, `${rel}.html`);
};

const readMeta = (html, attribute, key) => {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!new RegExp(`${attribute}=["']${key}["']`, 'i').test(tag)) continue;
    const content = tag.match(/content=["']([^"']*)["']/i);
    return content ? decode(content[1]) : '';
  }
  return null;
};

const readCanonical = (html) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/rel=["']canonical["']/i.test(tag)) continue;
    return tag.match(/href=["']([^"']+)["']/i)?.[1] || '';
  }
  return '';
};

const jsonLdTypes = (html) => {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.map((match) => {
    try {
      return JSON.parse(decode(match[1]))['@type'] || '';
    } catch {
      return '';
    }
  });
};

const sitemapRoutes = () => {
  const xml = readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => new URL(match[1].trim()).pathname);
};

const assetMap = () => {
  const candidates = [
    path.join(distDir, '.vite/manifest.json'),
    path.join(distDir, 'manifest.json'),
  ];
  const manifestPath = candidates.find((candidate) => existsSync(candidate));
  if (!manifestPath) throw new Error('Vite manifest is missing. Enable build.manifest.');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const map = new Map();
  for (const [key, value] of Object.entries(manifest)) {
    if (!value?.file) continue;
    const target = `/${value.file}`;
    for (const source of [key, `/${key}`, encodeURI(key), encodeURI(`/${key}`)]) {
      map.set(source, target);
    }
  }
  return map;
};

const rewriteAssets = (html, map) => {
  const entries = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  let out = html;
  for (const [from, to] of entries) {
    if (!from || from === to) continue;
    out = out.replaceAll(from, to);
  }
  return out;
};

const splitHead = (html) => {
  let rest = html.trimStart();
  const head = [];
  while (rest.length) {
    const match =
      rest.match(/^<title\b[^>]*>[\s\S]*?<\/title>/i) ||
      rest.match(/^<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i) ||
      rest.match(/^<(?:meta|link)\b[^>]*\/>/i) ||
      rest.match(/^<(?:meta|link)\b[^>]*>[\s\S]*?<\/(?:meta|link)>/i);
    if (!match) break;
    head.push(match[0]);
    rest = rest.slice(match[0].length).trimStart();
  }
  return { head: head.join('\n'), body: rest };
};

const stripShellHead = (html) =>
  html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\b[^>]*name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');

const inject = (template, rendered) => {
  const { head, body } = splitHead(rendered);
  if (!head.includes('<title')) throw new Error('Prerender did not emit a title.');
  if (!body.includes('<h1')) throw new Error('Prerender did not emit an H1.');
  let html = stripShellHead(template);
  html = html.replace('</head>', `${head}\n</head>`);
  if (!html.includes('<div id="root"></div>')) throw new Error('Shell is missing <div id="root"></div>.');
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
};

const verifyRoute = (route, html, seenTitles) => {
  const errors = [];
  const titleRaw = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  const title = decode(titleRaw);
  const description = readMeta(html, 'name', 'description');
  const canonical = readCanonical(html);
  const h1Raw = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '';
  const h1 = stripTags(h1Raw);
  const types = jsonLdTypes(html);
  const text = stripTags(html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] || '');

  if (!title || title === SHELL_TITLE) errors.push('missing unique title');
  if (titleRaw.length > 60) errors.push(`title is ${titleRaw.length} characters`);
  if (!description || description.length < 40) errors.push('missing description');
  if (canonical !== canonicalFor(route)) errors.push(`canonical is "${canonical}"`);
  if (!h1) errors.push('missing h1');
  if (text.length < 400) errors.push('missing body content');
  if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) errors.push('keywords meta is present');
  if (html.includes('ph5WU7qeQZgiBBE2-2f8v9qqDBu4xn3_lj0FxCtDWjg')) {
    errors.push('commented Search Console tag is present');
  }
  if (/127\.0\.0\.1|localhost:\d+|\/src\/assets\//.test(html)) errors.push('unresolved local asset URL');
  if (/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)) errors.push('unexpected noindex');
  if (!types.includes('BreadcrumbList')) errors.push('missing BreadcrumbList');
  if (route === '/' && !types.includes('Organization')) errors.push('missing Organization');
  if (/^\/services\/[^/]+$/.test(route) && !types.includes('Service')) errors.push('missing Service');
  if (/^\/blog\/[^/]+$/.test(route) && !types.includes('BlogPosting')) errors.push('missing BlogPosting');
  if (text.includes('Frequently Asked Questions') && !types.includes('FAQPage')) {
    errors.push('FAQ content is missing FAQPage');
  }
  if (!text.includes('Frequently Asked Questions') && types.includes('FAQPage')) {
    errors.push('FAQPage without FAQ content');
  }
  if (seenTitles.has(title)) errors.push(`duplicate title also used by ${seenTitles.get(title)}`);
  seenTitles.set(title, route);

  return { route, title, description, canonical, h1, errors };
};

const main = async () => {
  const templatePath = path.join(distDir, 'index.html');
  if (!existsSync(templatePath)) throw new Error('dist/index.html is missing. Run vite build first.');

  const template = await readFile(templatePath, 'utf8');
  const routes = sitemapRoutes();
  if (routes.length < 40) throw new Error(`Expected at least 40 sitemap routes, found ${routes.length}.`);
  const assets = assetMap();

  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'error',
  });

  const seenTitles = new Map();
  const reports = [];

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

    for (const route of routes) {
      const rendered = rewriteAssets(await render(route), assets);
      const document = inject(template, rendered);
      const file = outputFile(route);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, document);
      const flat = flatFile(route);
      if (flat) {
        await mkdir(path.dirname(flat), { recursive: true });
        await writeFile(flat, document);
      }
      reports.push(verifyRoute(route, document, seenTitles));
      process.stdout.write(`prerendered ${route}\n`);
    }

    const notFoundRendered = rewriteAssets(await render(PROBE_404), assets);
    const notFoundHtml = inject(template, notFoundRendered);
    await writeFile(path.join(distDir, '404.html'), notFoundHtml);

    const robots = readMeta(notFoundHtml, 'name', 'robots') || '';
    const notFoundErrors = [];
    if (!/noindex/i.test(robots)) notFoundErrors.push('404 is missing noindex');
    if (readCanonical(notFoundHtml)) notFoundErrors.push('404 still has a canonical');
    if (readMeta(notFoundHtml, 'property', 'og:url')) notFoundErrors.push('404 still has og:url');
    if (!/<h1\b/i.test(notFoundHtml)) notFoundErrors.push('404 is missing an h1');
    if (/127\.0\.0\.1|\/src\/assets\//.test(notFoundHtml)) notFoundErrors.push('unresolved local asset URL');
    reports.push({ route: PROBE_404, title: '404', errors: notFoundErrors });
  } finally {
    await vite.close();
  }

  const failed = reports.filter((report) => report.errors.length);
  if (failed.length) {
    for (const report of failed) {
      process.stderr.write(`${report.route}: ${report.errors.join('; ')}\n`);
    }
    process.exitCode = 1;
    return;
  }

  const descriptions = new Set(reports.filter((report) => report.description).map((report) => report.description));
  if (descriptions.size < routes.length) {
    throw new Error('Sitemap routes do not all have distinct meta descriptions.');
  }

  await rm(path.join(distDir, '.vite'), { recursive: true, force: true });
  process.stdout.write(`Prerendered ${routes.length} routes with unique titles, descriptions, canonicals, and content.\n`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
