import React, { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { seo } from '../data/seo';

const contactDetails = [
  {
    label: 'Office',
    value: 'GF-41, Omaxe Square, Jasola District Centre, New Delhi-25',
    href: 'https://maps.google.com/?q=Omaxe+Square+Jasola+District+Centre+New+Delhi',
    Icon: MapPin,
  },
  {
    label: 'Telephone Number',
    value: '+91 9818238969',
    href: 'tel:+919818238969',
    Icon: Phone,
  },
  {
    label: 'Mail Address',
    value: 'info@jfknowledge.com',
    href: 'mailto:info@jfknowledge.com',
    Icon: Mail,
  },
];

const MAP_EMBED =
  'https://maps.google.com/maps?q=Omaxe+Square,+Jasola+District+Centre,+New+Delhi-25&z=16&output=embed';

const CONTACT_SCRIPT_URL = import.meta.env.VITE_CONTACT_SCRIPT_URL;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!CONTACT_SCRIPT_URL) {
      console.error('VITE_CONTACT_SCRIPT_URL is not configured.');
      setSubmitStatus({
        type: 'error',
        message: 'The contact form is temporarily unavailable. Please contact us by phone or email.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await fetch(CONTACT_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          name: String(formData.get('name') || ''),
          phone: String(formData.get('phone') || ''),
          email: String(formData.get('email') || ''),
          message: String(formData.get('message') || ''),
        }),
      });

      setSubmitStatus({
        type: 'sent',
        message:
          'Submitted.',
      });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus({
        type: 'error',
        message:
          'Not submitted. Please try again or contact us by phone or email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-orange-50 to-slate-50 font-[family-name:var(--font-display)]">
      <SEO {...seo.contact} />
      <section className="relative overflow-hidden bg-[#0c1220] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pb-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.2),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-bold tracking-[0.22em] text-orange-400 uppercase">
            Contact Us for Partnering
          </p>
          <h1 className="max-w-3xl text-4xl tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            Powerful Collaborations in{' '}
            <span className="text-orange-400">Learning</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Whether you represent a corporate entity or an educational institution,
            we&apos;re eager to collaborate with you.
          </p>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl tracking-tight text-slate-900 sm:text-3xl">
              Let&apos;s build something together
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-[1.05rem]">
              Explore how partnering with JF Knowledge Centre can enhance your training
              programs or educational offerings. For custom e-learning solutions for your
              organisation, let&apos;s work together to create tailored solutions that meet
              your unique needs. Contact us to discuss potential collaborations and take
              learning to new heights.
            </p>

            <ul className="mt-10 space-y-6">
              {contactDetails.map(({ label, value, href, Icon }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-orange-500 uppercase">
                      {label}
                    </p>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      className="mt-1 block text-base font-medium text-slate-800 transition-colors hover:text-orange-500"
                    >
                      {value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[2rem] bg-gradient-to-br from-white via-orange-50/70 to-slate-100 p-5 shadow-lg ring-1 ring-orange-100/80 sm:p-7 lg:p-8">
              <p className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase">
                Send a message
              </p>
              <h3 className="mt-2 text-2xl tracking-tight text-slate-900">
                Tell us about your project
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Share a few details and we&apos;ll get back to you.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-5 rounded-2xl bg-white/80 p-5 ring-1 ring-orange-100 sm:p-6"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your first name"
                    required
                    maxLength={200}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    maxLength={50}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email <span className="text-orange-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      required
                      maxLength={254}
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-3 pl-11 text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Enter Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Enter your text"
                    rows={4}
                    maxLength={5000}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-orange-500 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Submit'}
                </button>

                {submitStatus && (
                  <p
                    role={submitStatus.type === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                    className={`text-sm leading-relaxed ${
                      submitStatus.type === 'error'
                        ? 'text-red-700'
                        : 'text-green-700'
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase">
                Find us
              </p>
              <h2 className="mt-2 text-2xl tracking-tight text-slate-900 sm:text-3xl">
                Our office on the map
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Omaxe+Square+Jasola+District+Centre+New+Delhi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
            >
              Open in Google Maps
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-lg ring-1 ring-slate-200/80">
            <iframe
              title="JF Knowledge Centre — Omaxe Square, Jasola, New Delhi"
              src={MAP_EMBED}
              className="h-[320px] w-full border-0 sm:h-[420px] lg:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
