import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { blogs } from '../data/blogs';

const Blog = () => {
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className="min-h-screen bg-slate-50 font-[family-name:var(--font-display)]">
      <section className="relative overflow-hidden bg-[#0c1220] pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.22),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-4xl text-4xl tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            The JFKC <span className="text-orange-400">Journal</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Notes on learning design, delivery, talent, and the industries we build for —
            written for teams who need training that people finish and use.
          </p>
          <p className="mt-8 text-xs font-semibold tracking-[0.22em] text-orange-400 uppercase">
            Learning <span className="mx-2 text-orange-400/50">•</span> Design{' '}
            <span className="mx-2 text-orange-400/50">•</span> Delivery
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-slate-200 lg:grid-cols-2"
          >
            <div className="relative min-h-[240px]">
              <img
                src={featured.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold tracking-[0.16em] text-orange-500 uppercase">
                {featured.category}
              </p>
              <h2 className="mt-3 text-2xl tracking-tight text-slate-900 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">{featured.date}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500">
                  Read journal
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-slate-200"
              >
                <Link to={`/blog/${item.slug}`} className="relative block aspect-[16/9]">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 uppercase">
                    {item.category}
                  </span>
                  <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white">
                    {item.readTime}
                  </span>
                </Link>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                    <Link to={`/blog/${item.slug}`} className="hover:text-orange-500">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {item.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs text-slate-400">{item.date}</p>
                    <Link
                      to={`/blog/${item.slug}`}
                      className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Blog;
