import { Helmet } from 'react-helmet-async';
import {
  absoluteUrl,
  breadcrumbNode,
  buildCrumbs,
  canonicalUrl,
  organizationNode,
  websiteNode,
} from '../data/site';

const imageMime = (url) => {
  if (url.endsWith('.webp')) return 'image/webp';
  if (url.endsWith('.png')) return 'image/png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  return undefined;
};

const SEO = ({
  title,
  description,
  keywords,
  path = '/',
  image = 'https://jfknowledge.com/og-image.png',
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = 'JF Knowledge Centre',
  type = 'website',
  noindex = false,
  crumbTitle,
  crumbs,
  extraGraph = null,
}) => {
  const url = canonicalUrl(path);
  const imageUrl = absoluteUrl(image);
  const mime = imageMime(imageUrl);
  const trail = noindex ? null : crumbs || buildCrumbs(path, crumbTitle);
  const graph = [organizationNode(), websiteNode()];
  if (trail && trail.length > 1) graph.push(breadcrumbNode(trail));
  if (extraGraph) graph.push(extraGraph);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {noindex ? null : <link rel="canonical" href={url} />}
      <meta property="og:site_name" content="JF Knowledge Centre" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {noindex ? null : <meta property="og:url" content={url} />}
      <meta property="og:image" content={imageUrl} />
      {imageWidth ? <meta property="og:image:width" content={String(imageWidth)} /> : null}
      {imageHeight ? <meta property="og:image:height" content={String(imageHeight)} /> : null}
      {mime ? <meta property="og:image:type" content={mime} /> : null}
      {imageAlt ? <meta property="og:image:alt" content={imageAlt} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {imageAlt ? <meta name="twitter:image:alt" content={imageAlt} /> : null}
      <script type="application/ld+json">{jsonLd}</script>
    </Helmet>
  );
};

export default SEO;
