import { blogs } from './blogs';
import { industries } from './industries';
import { services } from './services';
import { canonicalPath, publishedIso } from './site';

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/career', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/services', changefreq: 'monthly', priority: '0.8' },
  ...services.map((service) => ({
    path: `/services/${service.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  { path: '/products', changefreq: 'monthly', priority: '0.8' },
  { path: '/portfolio', changefreq: 'monthly', priority: '0.7' },
  ...industries.map((industry) => ({
    path: `/portfolio/${industry.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  ...blogs.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: publishedIso(post.date),
  })),
  { path: '/training-modules', changefreq: 'monthly', priority: '0.8' },
  { path: '/training-delivery', changefreq: 'monthly', priority: '0.8' },
  { path: '/immersive-learning', changefreq: 'monthly', priority: '0.8' },
  { path: '/learning-technology', changefreq: 'monthly', priority: '0.8' },
];

export const sitemapEntries = pages.map((page) => ({
  ...page,
  path: canonicalPath(page.path),
}));

export const prerenderPaths = sitemapEntries.map((page) => page.path);
