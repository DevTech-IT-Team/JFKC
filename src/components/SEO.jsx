import { absoluteUrl, breadcrumbSchema } from '../data/schema';

const asList = (jsonLd) => {
  if (!jsonLd) return [];
  return Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd];
};

const DEFAULT_IMAGE = 'https://jfknowledge.com/og-image.png';

const SEO = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  jsonLd = null,
  breadcrumbLabel,
  noindex = false,
  ogType = 'website',
}) => {
  const resolvedTitle = title || 'JF Knowledge Centre';
  const canonical = `https://jfknowledge.com${path.startsWith('/') ? path : `/${path}`}`;
  const resolvedImage = absoluteUrl(image);
  const graphs = noindex
    ? asList(jsonLd)
    : [breadcrumbSchema(path, breadcrumbLabel), ...asList(jsonLd)];

  return (
    <>
      <title>{resolvedTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={resolvedTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content={ogType} />
      {noindex ? null : <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={resolvedImage} />
      {resolvedImage === DEFAULT_IMAGE ? (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/png" />
        </>
      ) : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={resolvedImage} />
      {graphs.map((data) => (
        <script
          key={data['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
};

export default SEO;
