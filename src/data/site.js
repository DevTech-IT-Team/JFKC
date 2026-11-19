export const SITE_ORIGIN = 'https://jfknowledge.com';

export const CRUMB_LABELS = {
  '/about': 'About',
  '/contact': 'Contact',
  '/career': 'Careers',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms and Conditions',
  '/services': 'Services',
  '/products': 'Products',
  '/portfolio': 'Portfolio',
  '/blog': 'Blog',
  '/training-modules': 'Training Modules',
  '/training-delivery': 'Training Delivery',
  '/immersive-learning': 'Immersive Learning',
  '/learning-technology': 'Learning Technology',
};

const MONTHS = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

export function canonicalPath(path = '/') {
  const withoutQuery = String(path || '/').split('?')[0].split('#')[0];
  let normalized = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || '/';
}

export function canonicalUrl(path = '/') {
  const normalized = canonicalPath(path);
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}`;
}

export function absoluteUrl(value) {
  if (!value) return `${SITE_ORIGIN}/og-image.png`;
  if (value.startsWith('https://') || value.startsWith('http://')) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
}

export function publishedIso(dateLabel) {
  if (!dateLabel) return undefined;
  const match = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/.exec(String(dateLabel).trim());
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return undefined;
  return `${match[3]}-${month}-${match[2].padStart(2, '0')}`;
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'JF Knowledge Centre',
    alternateName: 'JFKC',
    url: `${SITE_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}/logobg.png`,
      width: 435,
      height: 293,
    },
    email: 'info@jfknowledge.com',
    telephone: '+1-425-400-9246',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12315 NE 97th Street',
      addressLocality: 'Kirkland',
      addressRegion: 'WA',
      addressCountry: 'US',
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: 'JF Knowledge Centre',
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en',
  };
}

export function breadcrumbNode(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

export function blogPostingNode(post) {
  const pageUrl = canonicalUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.image);
  const published = publishedIso(post.date);
  const node = {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.imageWidth
      ? {
          '@type': 'ImageObject',
          url: imageUrl,
          width: post.imageWidth,
          height: post.imageHeight,
        }
      : imageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'JF Knowledge Centre',
      url: `${SITE_ORIGIN}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JF Knowledge Centre',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/logobg.png`,
        width: 435,
        height: 293,
      },
    },
    inLanguage: 'en',
  };
  if (published) node.datePublished = published;
  return node;
}

export function buildCrumbs(path, crumbTitle) {
  const current = canonicalPath(path);
  if (current === '/') return null;
  const parts = current.split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', path: '/' }];
  if (parts.length === 1) {
    crumbs.push({
      name: crumbTitle || CRUMB_LABELS[current] || parts[0],
      path: current,
    });
    return crumbs;
  }
  const parent = `/${parts[0]}`;
  crumbs.push({
    name: CRUMB_LABELS[parent] || parts[0],
    path: parent,
  });
  crumbs.push({
    name: crumbTitle || parts.slice(1).join(' '),
    path: current,
  });
  return crumbs;
}
