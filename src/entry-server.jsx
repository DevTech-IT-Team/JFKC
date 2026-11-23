import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { AppShell } from './App.jsx';

const readStream = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value).toString('utf8'));
  }
  return chunks.join('');
};

export async function render(url) {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
    {
      onError(error) {
        throw error;
      },
    },
  );
  return readStream(prelude);
}
