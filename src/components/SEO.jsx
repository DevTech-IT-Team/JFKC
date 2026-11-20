import { useEffect } from 'react';

const setMeta = (attributeName, attributeValue, content) => {
  if (!content) return;

  const query = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.head.querySelector(query);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const SEO = ({
  title,
  description,
  keywords,
  path = '/',
  image = 'https://jfknowledge.com/og-image.png',
  jsonLd = null,
  noindex = false,
}) => {
  useEffect(() => {
    const canonical = `https://jfknowledge.com${path}`;
    const resolvedTitle = title || 'JF Knowledge Centre';

    document.title = resolvedTitle;

    if (noindex) {
      setMeta('name', 'robots', 'noindex');
    } else {
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots && robots.getAttribute('content') === 'noindex') {
        robots.remove();
      }
    }

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', resolvedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', resolvedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // JSON-LD structured data — injected per page, cleaned up on unmount
    let ldScript = null;
    if (jsonLd) {
      ldScript = document.createElement('script');
      ldScript.setAttribute('type', 'application/ld+json');
      ldScript.setAttribute('data-seo', 'true');
      ldScript.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(ldScript);
    }

    return () => {
      if (ldScript) ldScript.remove();
    };
  }, [description, image, jsonLd, keywords, noindex, path, title]);

  return null;
};

export default SEO;
