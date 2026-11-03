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
  image = 'https://jfknowledge.com/logobg.png',
}) => {
  useEffect(() => {
    const canonical = `https://jfknowledge.com${path}`;
    const resolvedTitle = title || 'JF Knowledge Centre';

    document.title = resolvedTitle;

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
  }, [description, image, keywords, path, title]);

  return null;
};

export default SEO;
