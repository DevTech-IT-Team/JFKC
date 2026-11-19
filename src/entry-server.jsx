import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export { prerenderPaths, sitemapEntries } from './data/routes.js';

async function streamToString(stream) {
  if (stream && typeof stream.getReader === 'function') {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let html = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();
    return html;
  }

  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

export async function render(url) {
  const { prelude } = await prerender(
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );
  return streamToString(prelude);
}
