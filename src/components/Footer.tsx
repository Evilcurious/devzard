import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useStore } from "../context/StoreContext";
import { EditableText } from "./Editable";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Forgot password", href: "/forgot-password" },
      { label: "My dashboard", href: "/account" },
    ],
  },
  {
    title: "Admin",
    links: [
      { label: "Admin panel", href: "/admin" },
      { label: "Manage orders", href: "/admin" },
      { label: "Theme & brand", href: "/admin" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Website Development", href: "/services/website-development" },
      { label: "App Development", href: "/services/app-development" },
      { label: "Meta & Google Ads", href: "/services/meta-ads" },
      { label: "TikTok Ads", href: "/services/tiktok-ads" },
      { label: "Video Editing", href: "/services/video-editing" },
      { label: "YouTube Branding", href: "/services/youtube-branding" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Blazing Servers", href: "/products/servers" },
      { label: "Website Templates", href: "/products/templates" },
      { label: "Brand Kits", href: "/products/brand-kits" },
      { label: "AI Marketing Suite", href: "/products/ai-suite" },
    ],
  },
];

export default function Footer() {
  const { theme } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden bg-navy-950 pt-20">
      <div className="bg-grid-dark absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* top area */}
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.2fr_2fr]">
          {/* brand + newsletter */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              {theme.logoImageUrl ? (
                <img src={theme.logoImageUrl} alt="logo" className="h-11 w-11 rounded-xl object-cover shadow-lg shadow-brand-500/30" />
              ) : (
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-lg shadow-brand-500/30 ${theme.logoGradient}`}>
                  {theme.logoIcon}
                </span>
              )}
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                {theme.siteName}
                <span className="text-gradient-blue">{theme.siteNameAccent}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              <EditableText id="footer-tagline" multiline>
                {theme.tagline}
              </EditableText>
            </p>

            <form onSubmit={handleSubscribe} className="mt-7">
              <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                <EditableText id="footer-newsletter">Growth tips in your inbox</EditableText>
              </p>
              {subscribed ? (
                <p className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300">
                  🎉 You're in! Watch your inbox for growth plays.
                </p>
              ) : (
                <div className="mt-3 flex overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur focus-within:border-brand-400/60">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105"
                  >
                    Subscribe <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="group flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-sky-300"
                      >
                        <span className="h-1 w-1 rounded-full bg-brand-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DEVZARD Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/" className="transition-colors hover:text-sky-300">Privacy Policy</Link>
            <Link to="/" className="transition-colors hover:text-sky-300">Terms of Service</Link>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="h-3.5 w-3.5 text-rose-500" fill="currentColor" /> by DEVZARD
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
