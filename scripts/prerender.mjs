import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const shellName = '_shell.html';
const shellPath = path.join(distDir, shellName);
const SITE = 'https://jfknowledge.com';
const SHELL_TITLE = 'JF Knowledge Centre | E-Learning, LMS & Digital Solutions';
const PROBE_404 = '/this-does-not-exist-xyz';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripTags = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const canonicalFor = (route) => (route === '/' ? `${SITE}/` : `${SITE}${route}`);

const stripLocalOrigin = (html, port) =>
  html.replaceAll(`http://127.0.0.1:${port}`, '').replaceAll(`http://localhost:${port}`, '');

const outputFile = (route) => {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.replace(/^\//, ''), 'index.html');
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

const startServer = () =>
  new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://127.0.0.1');
        let pathname = decodeURIComponent(url.pathname);
        if (pathname.includes('\0') || pathname.includes('..')) {
          res.writeHead(400).end();
          return;
        }

        const relative = pathname.replace(/^\/+/, '');
        const requested = path.normalize(path.join(distDir, relative));
        if (!requested.startsWith(distDir)) {
          res.writeHead(403).end();
          return;
        }

        const candidates = [requested];
        if (!path.extname(requested)) candidates.push(path.join(requested, 'index.html'));

        for (const candidate of candidates) {
          if (!candidate.startsWith(distDir) || path.basename(candidate) === shellName) continue;
          if (existsSync(candidate) && statSync(candidate).isFile()) {
            const body = readFileSync(candidate);
            res.writeHead(200, {
              'Content-Type': MIME[path.extname(candidate)] || 'application/octet-stream',
              'Cache-Control': 'no-cache',
            });
            res.end(body);
            return;
          }
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(readFileSync(shellPath));
      } catch (error) {
        res.writeHead(500).end(String(error));
      }
    });

    server.listen(0, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });

const sitemapRoutes = () => {
  const xml = readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => new URL(match[1].trim()).pathname);
};

const snapshot = async (page, route) => {
  const target = canonicalFor(route);
  await page.goto(`http://127.0.0.1:${page.__port}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForFunction(
    (expected) => {
      const title = document.title || '';
      const description = document.head.querySelector('meta[name="description"]')?.content || '';
      const canonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const h1 = document.querySelector('h1')?.textContent?.trim() || '';
      const ld = document.head.querySelector('script[data-seo="true"]');
      const keywords = document.head.querySelector('meta[name="keywords"]');
      return Boolean(title && description && h1 && ld && !keywords && canonical === expected);
    },
    { timeout: 30000 },
    target,
  );
  return page.content();
};

const snapshot404 = async (page) => {
  await page.goto(`http://127.0.0.1:${page.__port}${PROBE_404}`, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForFunction(
    () => {
      const robots = document.head.querySelector('meta[name="robots"]')?.content || '';
      const canonical = document.head.querySelector('link[rel="canonical"]');
      const ogUrl = document.head.querySelector('meta[property="og:url"]');
      const h1 = document.querySelector('h1');
      return /noindex/i.test(robots) && !canonical && !ogUrl && Boolean(h1);
    },
    { timeout: 30000 },
  );
  return page.content();
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
  if (/127\.0\.0\.1|localhost:\d+/.test(html)) errors.push('local prerender origin leaked into HTML');
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
  if (!existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html is missing. Run vite build first.');
  }

  await writeFile(shellPath, await readFile(path.join(distDir, 'index.html')));
  const routes = sitemapRoutes();
  if (routes.length < 40) {
    throw new Error(`Expected at least 40 sitemap routes, found ${routes.length}.`);
  }

  const server = await startServer();
  const { port } = server.address();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const seenTitles = new Map();
  const reports = [];

  try {
    const page = await browser.newPage();
    page.__port = port;
    page.setDefaultTimeout(45000);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (/googletagmanager|google-analytics|clarity\.ms|fonts\.googleapis|fonts\.gstatic/i.test(url)) {
        request.abort();
        return;
      }
      request.continue();
    });

    for (const route of routes) {
      const html = stripLocalOrigin(await snapshot(page, route), port);
      const file = outputFile(route);
      await mkdir(path.dirname(file), { recursive: true });
      const document = html.startsWith('<!DOCTYPE') || html.startsWith('<!doctype')
        ? html
        : `<!DOCTYPE html>\n${html}`;
      await writeFile(file, document);
      reports.push(verifyRoute(route, document, seenTitles));
      process.stdout.write(`prerendered ${route}\n`);
    }

    const notFound = stripLocalOrigin(await snapshot404(page), port);
    const notFoundHtml = notFound.startsWith('<!DOCTYPE') || notFound.startsWith('<!doctype')
      ? notFound
      : `<!DOCTYPE html>\n${notFound}`;
    await writeFile(path.join(distDir, '404.html'), notFoundHtml);

    const robots = readMeta(notFoundHtml, 'name', 'robots') || '';
    const notFoundErrors = [];
    if (!/noindex/i.test(robots)) notFoundErrors.push('404 is missing noindex');
    if (readCanonical(notFoundHtml)) notFoundErrors.push('404 still has a canonical');
    if (readMeta(notFoundHtml, 'property', 'og:url')) notFoundErrors.push('404 still has og:url');
    if (!/<h1\b/i.test(notFoundHtml)) notFoundErrors.push('404 is missing an h1');
    if (/127\.0\.0\.1|localhost:\d+/.test(notFoundHtml)) notFoundErrors.push('local prerender origin leaked into 404');
    reports.push({ route: PROBE_404, title: '404', errors: notFoundErrors });
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await rm(shellPath, { force: true });
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

  process.stdout.write(`Prerendered ${routes.length} routes with unique titles, descriptions, canonicals, and content.\n`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
