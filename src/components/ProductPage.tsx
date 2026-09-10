import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Sparkles,
  Server,
  Cpu,
} from "lucide-react";
import PageHero from "./PageHero";
import { Reveal, SectionHeading } from "./shared";
import { type Product, products as allProducts } from "../data/products";
import { cn } from "../utils/cn";

export default function ProductPage({ product }: { product: Product }) {
  const otherProducts = allProducts.filter((p) => p.slug !== product.slug);

  return (
    <div>
      <PageHero
        eyebrow={`Product · ${product.popular ? "Most popular" : "Premium"}`}
        title={product.name}
        highlight={product.tagline}
        description={product.longDesc}
        icon={product.icon}
        gradient={product.gradient}
        ctaLabel="Get started"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      {/* Stats strip */}
      <section className="border-y border-brand-100 bg-brand-50/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand-100 bg-brand-100 lg:grid-cols-4">
            {product.stats.map((s) => (
              <div key={s.label} className="bg-white/90 px-6 py-6 text-center backdrop-blur">
                <p className="font-display text-3xl font-bold text-gradient-blue sm:text-4xl">{s.value}</p>
                <p className="mt-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 sm:py-28">
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-brand-100/60 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Features"
            title="Built for serious"
            highlight="performance."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="card-glow h-full rounded-3xl border border-brand-100 bg-white p-7">
                  <span className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl", product.accent)}>
                    <Server className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing plans */}
      <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-28">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black,transparent)]" />
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-brand-600/25 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="Pricing"
            title="Plans that"
            highlight="scale with you."
            subtitle="Start small, scale fast. Switch or cancel anytime."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.06}>
                <div
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-400",
                    plan.highlight
                      ? "border-brand-400/60 bg-gradient-to-b from-brand-600/20 to-navy-900 shadow-2xl shadow-brand-600/25 hover:-translate-y-2"
                      : "border-white/10 bg-white/[0.04] backdrop-blur hover:-translate-y-2 hover:border-brand-400/50"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-brand-500/40">
                      ★ Best value
                    </span>
                  )}

                  <p className="font-display text-sm font-semibold text-white">{plan.name}</p>
                  <p className="font-display mt-4 text-3xl font-bold text-white">{plan.price}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span
                          className={cn(
                            "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
                            plan.highlight ? "bg-brand-500/30 text-sky-300" : "bg-white/10 text-brand-400"
                          )}
                          style={{ height: 18, width: 18 }}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/order?product=${encodeURIComponent(product.slug)}&plan=${encodeURIComponent(plan.name)}`}
                    className={cn(
                      "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
                      plan.highlight
                        ? "btn-shine bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/40"
                        : "border border-white/15 text-white hover:border-brand-400 hover:bg-brand-600/20"
                    )}
                  >
                    Get {plan.name} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + integrations */}
      <section className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-8 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
                  <Sparkles className="h-3 w-3" /> Why this product
                </span>
                <h3 className="font-display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Benefits that compound.
                </h3>
                <ul className="mt-7 space-y-3.5">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-sm">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-md">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium text-slate-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-white p-8 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
                  <Cpu className="h-3 w-3" /> Stack
                </span>
                <h3 className="font-display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Plays well with everything.
                </h3>
                <p className="mt-3 text-slate-500">
                  Connect with the tools you already use — or plug straight into our stack.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "React", "Next.js", "WordPress", "Shopify", "Webflow", "Framer",
                    "HubSpot", "Klaviyo", "Slack", "Notion", "Zapier", "Figma",
                  ].map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-brand-100 bg-brand-50/50 px-3.5 py-2 text-xs font-semibold text-brand-700 transition-colors hover:border-brand-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions,"
            highlight="answered."
            subtitle="Still curious? Our team is one click away."
          />
          <div className="space-y-4">
            {product.faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-2xl border border-brand-100 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 open:border-brand-300 open:shadow-lg open:shadow-brand-500/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-open:bg-brand-600 group-open:text-white">
                        <HelpCircle className="h-4 w-4" />
                      </span>
                      {f.q}
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-100 text-brand-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pl-11 text-sm leading-relaxed text-slate-500">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other products */}
      <section className="relative border-t border-brand-100 bg-brand-50/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-brand-500 uppercase">More products</p>
              <h3 className="font-display mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Pair it with these
              </h3>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {otherProducts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link
                  to={`/products/${p.slug}`}
                  className="card-glow group flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6"
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                      p.gradient
                    )}
                  >
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h4 className="font-display mt-4 text-lg font-bold text-slate-900">{p.name}</h4>
                  <p className="mt-2 flex-1 text-sm text-slate-500">{p.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 via-brand-600 to-sky-500 p-10 text-center shadow-2xl shadow-brand-600/30 sm:p-16">
              <div className="bg-grid-dark absolute inset-0 opacity-40" />
              <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
              <h2 className="font-display relative mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Get started with {product.name} today.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                Free setup, 7-day money-back guarantee. No contracts, cancel anytime.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to={`/order?product=${encodeURIComponent(product.slug)}`}
                  className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
                >
                  Order now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Compare products
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
