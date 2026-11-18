import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Home, Search, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const suggestions = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const NotFound = () => {
  const { pathname } = useLocation();

  // Signal a 404 to any server-side / prerender layer that reads window.__statusCode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__statusCode = 404;
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-orange-50 to-slate-50 font-[family-name:var(--font-display)]">
      <SEO
        title="404 — Page Not Found | JF Knowledge Centre"
        description="The page you're looking for doesn't exist. Return to JF Knowledge Centre to explore e-learning, LMS solutions, and business services."
        path={pathname}
      />

      {/* Dark hero banner — matches site pattern */}
      <section className="relative overflow-hidden bg-[#0c1220] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pb-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.18),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Large 404 watermark */}
          <p
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,22vw,18rem)] font-black leading-none tracking-tighter text-white/[0.04] sm:right-10"
            aria-hidden="true"
          >
            404
          </p>

          <p className="mb-4 text-xs font-bold tracking-[0.22em] text-orange-400 uppercase">
            Error 404
          </p>
          <h1 className="max-w-2xl text-4xl tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            Page{' '}
            <span className="text-orange-400">not found</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            The address{' '}
            <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-sm text-orange-300">
              {pathname}
            </code>{' '}
            doesn't match any page on this site. It may have moved, been
            renamed, or never existed.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
            >
              <Home className="h-4 w-4" />
              Back to home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Quick-links section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-3">
            <Search className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              You might be looking for
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {suggestions.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
              >
                {label}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
