export const SITE_ORIGIN = 'https://jfknowledge.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JF Knowledge Centre',
  alternateName: 'JFKC',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/logobg.png`,
  email: 'info@jfknowledge.com',
  telephone: '+91-9818238969',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'GF-41, Omaxe Square, Jasola District Centre',
    addressLocality: 'New Delhi',
    postalCode: '110025',
    addressCountry: 'IN',
  },
};

const CRUMB_LABELS = {
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

const humanize = (segment) =>
  segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const absoluteUrl = (src) => {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith('/') ? src : `/${src}`}`;
};

export const breadcrumbSchema = (path = '/', leafLabel) => {
  const clean = String(path).split('?')[0].split('#')[0] || '/';
  const segments = clean.split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', item: `${SITE_ORIGIN}/` }];
  let acc = '';

  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    crumbs.push({
      name: (isLast && leafLabel) || CRUMB_LABELS[acc] || humanize(segment),
      item: `${SITE_ORIGIN}${acc}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
};

const publisher = {
  '@type': 'Organization',
  name: organizationSchema.name,
  url: organizationSchema.url,
  logo: {
    '@type': 'ImageObject',
    url: organizationSchema.logo,
  },
};

export const serviceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  serviceType: service.headline,
  description: service.intro?.[0] || service.text,
  url: `${SITE_ORIGIN}/services/${service.slug}`,
  provider: {
    '@type': 'Organization',
    name: organizationSchema.name,
    url: organizationSchema.url,
    email: organizationSchema.email,
    telephone: organizationSchema.telephone,
  },
});

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

export const isoDate = (display) => {
  const match = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/.exec(String(display || '').trim());
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return undefined;
  return `${match[3]}-${month}-${match[2].padStart(2, '0')}`;
};

export const plainText = (value) =>
  String(value || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

export const blogPostingSchema = (post, path) => {
  const canonical = `${SITE_ORIGIN}${path}`;
  const published = isoDate(post.date);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    ...(published ? { datePublished: published } : {}),
    image: absoluteUrl(post.image),
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: organizationSchema.name,
      url: organizationSchema.url,
    },
    publisher,
    mainEntityOfPage: canonical,
  };
};

export const faqPageSchema = (post) => {
  const items = (post.body || [])
    .filter((block) => block && block.type === 'faq')
    .flatMap((block) => block.items || [])
    .map((item) => ({
      question: plainText(item.q),
      answer: plainText(item.a),
    }))
    .filter((item) => item.question && item.answer);

  if (!items.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
};
