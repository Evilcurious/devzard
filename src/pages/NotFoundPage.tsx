import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Reveal } from "../components/shared";

export default function NotFoundPage() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-[130px]" />
      <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-xl">
            <AlertCircle className="h-8 w-8" />
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display mt-6 text-7xl font-bold text-gradient-blue sm:text-8xl">404</p>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="font-display mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Page not found
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-4 text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl"
            >
              Back to home <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-600"
            >
              Contact us
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Products", href: "/products" },
              { label: "Process", href: "/process" },
              { label: "Reviews", href: "/reviews" },
              { label: "About", href: "/about" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
