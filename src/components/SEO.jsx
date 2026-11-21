import { useEffect } from 'react';
import { absoluteUrl, breadcrumbSchema } from '../data/schema';

const upsertMeta = (attributeName, attributeValue, content) => {
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  const existing = [...document.head.querySelectorAll(selector)];

  if (!content) {
    existing.forEach((node) => node.remove());
    return;
  }

  const [element, ...duplicates] = existing;
  duplicates.forEach((node) => node.remove());

  const target = element || document.createElement('meta');
  if (!element) {
    target.setAttribute(attributeName, attributeValue);
    document.head.appendChild(target);
  }
  target.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  const existing = [...document.head.querySelectorAll('link[rel="canonical"]')];
  if (!href) {
    existing.forEach((node) => node.remove());
    return;
  }

  const [link, ...duplicates] = existing;
  duplicates.forEach((node) => node.remove());
  const target = link || document.createElement('link');
  if (!link) {
    target.setAttribute('rel', 'canonical');
    document.head.appendChild(target);
  }
  target.setAttribute('href', href);
};

const asList = (jsonLd) => {
  if (!jsonLd) return [];
  return Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd];
};

const SEO = ({
  title,
  description,
  path = '/',
  image = 'https://jfknowledge.com/og-image.png',
  jsonLd = null,
  breadcrumbLabel,
  noindex = false,
  ogType = 'website',
}) => {
  const serializedLd = JSON.stringify(jsonLd ?? null);

  useEffect(() => {
    const resolvedTitle = title || 'JF Knowledge Centre';
    const canonical = `https://jfknowledge.com${path.startsWith('/') ? path : `/${path}`}`;
    const resolvedImage = absoluteUrl(image);
    const extraLd = JSON.parse(serializedLd);

    document.title = resolvedTitle;
    document.head.querySelector('meta[name="keywords"]')?.remove();

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', resolvedTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:image', resolvedImage);
    if (resolvedImage === 'https://jfknowledge.com/og-image.png') {
      upsertMeta('property', 'og:image:width', '1200');
      upsertMeta('property', 'og:image:height', '630');
      upsertMeta('property', 'og:image:type', 'image/png');
    } else {
      upsertMeta('property', 'og:image:width', null);
      upsertMeta('property', 'og:image:height', null);
      upsertMeta('property', 'og:image:type', null);
    }
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', resolvedTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', resolvedImage);

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, follow');
      upsertCanonical(null);
      upsertMeta('property', 'og:url', null);
    } else {
      upsertMeta('name', 'robots', null);
      upsertCanonical(canonical);
      upsertMeta('property', 'og:url', canonical);
    }

    document.head.querySelectorAll('script[data-seo="true"]').forEach((node) => node.remove());

    const graphs = noindex
      ? asList(extraLd)
      : [breadcrumbSchema(path, breadcrumbLabel), ...asList(extraLd)];

    const scripts = graphs.map((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => script.remove());
    };
  }, [breadcrumbLabel, description, image, noindex, ogType, path, serializedLd, title]);

  return null;
};

export default SEO;
