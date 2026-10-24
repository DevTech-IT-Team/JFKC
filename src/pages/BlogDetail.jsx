import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getBlogBySlug } from '../data/blogs';

const setMeta = (name, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const BlogDetail = () => {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  useEffect(() => {
    if (!post) return undefined;
    const previousTitle = document.title;
    document.title = post.metaTitle || post.title;
    setMeta('description', post.metaDescription || post.excerpt);
    setMeta('keywords', post.metaKeywords);
    setMeta('og:title', post.metaTitle || post.title);
    setMeta('og:description', post.metaDescription || post.excerpt);
    return () => {
      document.title = previousTitle;
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="min-h-screen bg-white font-[family-name:var(--font-display)]">
      <section className="relative overflow-hidden bg-[#0c1220] pt-28 pb-14 sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.2),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to all blogs
          </Link>
          <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-4 text-base leading-relaxed text-white/75">{post.subtitle}</p>
          )}
          <p className="mt-4 text-sm text-white/60">
            {post.date} · {post.readTime}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <img
          src={post.image}
          alt={post.imageAlt || post.title}
          className="mb-10 w-full rounded-2xl"
        />
        <div className="space-y-5 text-base leading-relaxed text-slate-600">
          {post.body.map((block, index) => {
            if (typeof block === 'string') {
              return <p key={block.slice(0, 48)}>{block}</p>;
            }
            if (block.type === 'h2') {
              return (
                <h2
                  key={block.text}
                  className="pt-4 text-2xl tracking-tight text-slate-900"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'h3') {
              return (
                <h3 key={block.text} className="pt-2 text-lg font-semibold text-slate-900">
                  {block.text}
                </h3>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={block.items[0]} className="list-disc space-y-2 pl-5">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === 'table') {
              return (
                <div key={block.headers.join('-')} className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-2xl text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-left text-white">
                        {block.headers.map((header) => (
                          <th key={header} className="px-4 py-3 font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row[0]} className="odd:bg-slate-50 even:bg-white">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${row[0]}-${cellIndex}`}
                              className="border-t border-slate-200 px-4 py-3 align-top text-slate-600"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (block.type === 'faq') {
              return (
                <dl key="faq" className="space-y-5">
                  {block.items.map((item) => (
                    <div key={item.q}>
                      <dt className="font-semibold text-slate-900">{item.q}</dt>
                      <dd className="mt-1.5">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              );
            }
            if (block.type === 'links') {
              return (
                <ul key="links" className="flex flex-wrap gap-2">
                  {block.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-600 ring-1 ring-orange-100 hover:bg-orange-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === 'cta') {
              return (
                <Link
                  key={`cta-${index}`}
                  to="/contact"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-400"
                >
                  {post.cta || 'Schedule a consultation'}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              );
            }
            if (block.type === 'note') {
              return (
                <p
                  key={block.text.slice(0, 40)}
                  className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-500 ring-1 ring-slate-200"
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === 'references') {
              return (
                <div key="references" className="pt-4">
                  <h2 className="text-2xl tracking-tight text-slate-900">References</h2>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                    {block.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 underline-offset-2 hover:underline"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            }
            return <p key={block.text.slice(0, 48)}>{block.text}</p>;
          })}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to all blogs
          </Link>
        </div>
      </article>
    </main>
  );
};

export default BlogDetail;
