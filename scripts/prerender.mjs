import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const serverHref = pathToFileURL(path.join(dist, 'server', 'entry-server.js')).href;
const { render, prerenderPaths, sitemapEntries } = await import(serverHref);

const ORIGIN = 'https://jfknowledge.com';

function canonicalFor(route) {
  return route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`;
}

function extractHoisted(html) {
  let rest = html;
  const parts = [];
  while (rest.length) {
    const trimmed = rest.trimStart();
    const isTitle = trimmed.startsWith('<title');
    const isMeta = trimmed.startsWith('<meta');
    const isLink = trimmed.startsWith('<link');
    if (!isTitle && !isMeta && !isLink) {
      return { head: parts.join('\n'), body: trimmed };
    }
    const endToken = isTitle ? '</title>' : '>';
    const end = trimmed.indexOf(endToken);
    if (end === -1) break;
    const chunk = trimmed.slice(0, end + endToken.length);
    parts.push(chunk);
    rest = trimmed.slice(chunk.length);
  }
  return { head: parts.join('\n'), body: rest.trimStart() };
}

function applyTemplate(head, body, route) {
  const withHead = template.replace(
    /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
    () => `<!--seo:start-->\n${head}\n<!--seo:end-->`,
  );
  if (withHead === template) {
    throw new Error('index.html is missing the <!--seo:start--> block');
  }
  const attr = route == null ? '' : ` data-prerender-path="${route}"`;
  const replaced = withHead.replace(
    '<div id="root"></div>',
    () => `<div id="root"${attr}>${body}</div>`,
  );
  if (replaced === withHead) {
    throw new Error('index.html is missing <div id="root"></div>');
  }
  return replaced;
}

function assertPage(route, html) {
  const titleMatches = html.match(/<title>([^<]*)<\/title>/g) || [];
  if (titleMatches.length !== 1) {
    throw new Error(`${route} has ${titleMatches.length} title tags`);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  const expected = canonicalFor(route);
  if (!canonical || canonical[1] !== expected) {
    throw new Error(`${route} canonical is ${canonical?.[1] || 'missing'}, expected ${expected}`);
  }
  if (!html.includes('<meta name="description" content="')) {
    throw new Error(`${route} is missing a meta description`);
  }
  if (!html.includes('property="og:title"') || !html.includes('name="twitter:card"')) {
    throw new Error(`${route} is missing Open Graph or Twitter tags`);
  }
  if (!html.includes('application/ld+json') || !html.includes('"@type":"Organization"') || !html.includes('"@type":"WebSite"')) {
    throw new Error(`${route} is missing Organization or WebSite JSON-LD`);
  }
  if (route !== '/' && !html.includes('"@type":"BreadcrumbList"')) {
    throw new Error(`${route} is missing BreadcrumbList JSON-LD`);
  }
  if (route.startsWith('/blog/') && !html.includes('"@type":"BlogPosting"')) {
    throw new Error(`${route} is missing BlogPosting JSON-LD`);
  }
  if (html.includes('GTM-KZ9Q69GM') || html.includes('G-QLSJHEYCSC') || html.includes('googletagmanager.com/gtag')) {
    throw new Error(`${route} still contains an old analytics tag`);
  }
  if (!html.includes('GTM-NQF6G7LJ')) {
    throw new Error(`${route} is missing the GTM container`);
  }
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter(Boolean).length;
  if (words < 40) {
    throw new Error(`${route} prerendered text is only ${words} words`);
  }
}

if (!Array.isArray(prerenderPaths) || prerenderPaths.length < 40) {
  throw new Error(`Expected at least 40 routes, found ${prerenderPaths?.length || 0}`);
}

for (const route of prerenderPaths) {
  const rendered = await render(route);
  const { head, body } = extractHoisted(rendered);
  if (!head.includes('<title>')) {
    throw new Error(`No hoisted title for ${route}`);
  }
  if (!body.includes('<h1')) {
    throw new Error(`No h1 in prerendered body for ${route}`);
  }
  const page = applyTemplate(head, body, route);
  assertPage(route, page);
  const directory = route === '/' ? dist : path.join(dist, route.slice(1));
  fs.mkdirSync(directory, { recursive: true });
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(directory, 'index.html');
  fs.writeFileSync(file, page);
  console.log('prerendered', route);
}

const notFoundHead = [
  '<title>404 — Page Not Found | JF Knowledge Centre</title>',
  '<meta name="description" content="The page you&#39;re looking for doesn&#39;t exist. Return to JF Knowledge Centre." />',
  '<meta name="robots" content="noindex, nofollow" />',
].join('\n');
const notFoundBody = '<main><h1>Page not found</h1><p>The page you&#39;re looking for doesn&#39;t exist.</p><p><a href="/">Back to home</a></p></main>';
const notFound = applyTemplate(notFoundHead, notFoundBody, null).replace(
  ' data-prerender-path=""',
  '',
);
if (!notFound.includes('noindex')) throw new Error('404.html is missing noindex');
if (notFound.includes('rel="canonical"')) throw new Error('404.html should not advertise a canonical');
fs.writeFileSync(path.join(dist, '404.html'), notFound);

const urls = sitemapEntries
  .map((entry) => {
    const loc = canonicalFor(entry.path);
    if (loc.endsWith('/') && loc !== `${ORIGIN}/`) {
      throw new Error(`Sitemap URL has a trailing slash: ${loc}`);
    }
    if (loc.includes('://www.')) throw new Error(`Sitemap URL uses www: ${loc}`);
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
  })
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap);

const titles = new Set();
for (const route of prerenderPaths) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (titles.has(title)) throw new Error(`Duplicate title "${title}" on ${route}`);
  titles.add(title);
}

console.log(`prerendered ${prerenderPaths.length} routes with ${titles.size} unique titles`);
