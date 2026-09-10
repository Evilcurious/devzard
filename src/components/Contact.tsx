import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Reveal } from "./shared";
import { EditableText } from "./Editable";
import { useAuth } from "../context/AuthContext";

/* Brand icons (lucide removed brand glyphs) */
const InstagramIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const XIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
  </svg>
);
const LinkedinIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const services = [
  "Website Development",
  "App Development",
  "Meta Ads",
  "Google Ads",
  "TikTok Ads",
  "Video Editing",
  "YouTube Branding",
  "Social Media Management",
  "AI Marketing",
  "Digital Marketing 360°",
  "Servers / Templates / Products",
];

export default function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-100/80 blur-[120px]" />
      <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-cyan-100/60 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* CTA banner */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 via-brand-600 to-sky-500 px-8 py-14 text-center shadow-2xl shadow-brand-600/30 sm:px-14 sm:py-16">
            <div className="bg-grid-dark absolute inset-0 opacity-40" />
            <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />

            <p className="relative text-xs font-bold tracking-[0.3em] text-sky-200 uppercase">
              <EditableText id="home-cta-eyebrow">Ready when you are</EditableText>
            </p>
            <h2 className="font-display relative mx-auto mt-4 max-w-3xl text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              <EditableText id="home-cta-h1">Have a project in mind?</EditableText>
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)]">
                <EditableText id="home-cta-h2">Let&apos;s make it legendary.</EditableText>
              </span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base text-brand-100">
              <EditableText id="home-cta-desc" multiline>
                Tell us where you want to go — we&apos;ll show you exactly how to get there. Free
                strategy call, zero pressure.
              </EditableText>
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:devzardpk@gmail.com"
                className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
              >
                <Mail className="h-5 w-5" /> devzardpk@gmail.com
              </a>
              <a
                href="tel:+15550123456"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                <Phone className="h-5 w-5" /> 03174541414
              </a>
            </div>
          </div>
        </Reveal>

        {/* form + info */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* info column */}
          <Reveal>
            <div className="flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
                Contact us
              </span>
              <h3 className="font-display mt-4 text-3xl font-bold text-slate-900">
                Let's talk growth.
              </h3>
              <p className="mt-3 text-slate-500">
                Reach out through the form or any channel below — we reply within 12 hours,
                usually much faster.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Mail, label: "Email us", value: "devzardpk@gmail.com", href: "mailto:devzardpk@gmail.com" },
                  { icon: Phone, label: "Call us", value: "03174541414", href: "tel:03174541414" },
                  { icon: MapPin, label: "Studio", value: "Remote-first · Serving 15+ countries", href: undefined },
                  { icon: Clock, label: "Support hours", value: "Mon–Sat · 24/7 emergency line", href: undefined },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-4 transition-all duration-300 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-md shadow-brand-500/25 transition-transform duration-300 group-hover:scale-110">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-slate-800 hover:text-brand-600">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Follow the journey</p>
                <div className="mt-3 flex gap-3">
                  {[
                    { icon: InstagramIcon, label: "Instagram" },
                    { icon: XIcon, label: "Twitter / X" },
                    { icon: LinkedinIcon, label: "LinkedIn" },
                    { icon: MessageCircle, label: "WhatsApp" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#contact"
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:bg-brand-600 hover:text-white hover:shadow-lg hover:shadow-brand-500/30"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* form column */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-8 shadow-xl shadow-brand-900/5 sm:p-10">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-50 blur-2xl" />

              {submitted ? (
                <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </span>
                  <h4 className="font-display mt-6 text-2xl font-bold text-slate-900">
                    Request received! 🎉
                  </h4>
                  <p className="mt-3 max-w-sm text-slate-500">
                    Thanks for reaching out to DEVZARD. A strategist will get back to you within
                    12 hours with next steps.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-full border border-brand-200 px-6 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Your name *
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Service needed *
                      </label>
                      <select
                        required
                        defaultValue=""
                        className="w-full appearance-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {services.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Budget range
                      </label>
                      <select
                        defaultValue=""
                        className="w-full appearance-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                      >
                        <option value="" disabled>
                          Select budget
                        </option>
                        <option>Under $500</option>
                        <option>$500 – $2,000</option>
                        <option>$2,000 – $10,000</option>
                        <option>$10,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      Project details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your goals, timeline and anything else we should know..."
                      className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-500/40"
                  >
                    Send request
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    🔒 Your info stays private. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
