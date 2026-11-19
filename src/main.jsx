import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { canonicalPath } from './data/site.js'
import { preloadRoute } from './route-loaders.js'
import './index.css'

const rootEl = document.getElementById('root')
const currentPath = canonicalPath(window.location.pathname)
const renderedPath = rootEl?.dataset.prerenderPath

function stripStaticHead() {
  document.head
    .querySelectorAll(
      [
        'title',
        'meta[name="description"]',
        'meta[name="keywords"]',
        'meta[name="robots"]',
        'link[rel="canonical"]',
        'meta[property^="og:"]',
        'meta[name^="twitter:"]',
        'link[rel="preload"][as="image"]',
        'script[type="application/ld+json"]',
      ].join(','),
    )
    .forEach((node) => node.remove())
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

async function boot() {
  try {
    await preloadRoute(currentPath)
  } catch (error) {
    console.error('Route preload failed', error)
  }

  if (renderedPath && canonicalPath(renderedPath) === currentPath) {
    hydrateRoot(rootEl, app)
  } else {
    stripStaticHead()
    createRoot(rootEl).render(app)
  }
}

boot()
