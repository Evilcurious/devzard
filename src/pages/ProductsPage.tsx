import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Zap, Server } from "lucide-react";
import { Reveal, SectionHeading } from "../components/shared";
import { useStore } from "../context/StoreContext";
import { cn } from "../utils/cn";

export default function ProductsPage() {
  const { products, stats } = useStore();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_20%,black,transparent)]" />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/25 blur-[140px]" />
        <div className="absolute -top-40 right-1/5 h-80 w-80 rounded-full bg-cyan-accent/15 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-300 uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Products & tools
              </span>
              <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.04] font-bold tracking-tight text-white sm:text-6xl">
                Launch faster with
                <br />
                <span className="text-gradient-blue">battle-tested products.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
                Servers, templates, brand kits and an AI marketing suite — engineered by
                the same team that ships custom work for the world&apos;s boldest brands.
              </p>

              <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
                {stats.products.map((s) => (
                  <div key={s.label} className="bg-navy-900/80 px-6 py-7 text-center backdrop-blur">
                    <p className="font-display text-3xl font-bold text-gradient-blue sm:text-4xl">{s.value}</p>
                    <p className="mt-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products grid */}
      <section className="relative overflow-hidden bg-navy-950 pb-20 sm:pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.05}>
                <Link
                  to={`/products/${product.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-400",
                    product.popular
                      ? "border-brand-400/60 bg-gradient-to-b from-brand-600/20 to-navy-900 shadow-2xl shadow-brand-600/25 hover:-translate-y-2"
                      : "border-white/10 bg-white/[0.04] backdrop-blur hover:-translate-y-2 hover:border-brand-400/50 hover:bg-white/[0.07]"
                  )}
                >
                  {product.popular && (
                    <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-brand-500/40">
                      <Zap className="h-3 w-3" fill="currentColor" /> Most popular
                    </span>
                  )}

                  <span
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                      product.gradient
                    )}
                  >
                    <product.icon className="h-8 w-8" />
                  </span>

                  <h3 className="font-display mt-6 text-2xl font-bold text-white">{product.name}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{product.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-bold text-white">{product.price}</span>
                    <span className="text-sm font-medium text-slate-400">{product.unit}</span>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {product.features.slice(0, 5).map((feature) => (
                      <li key={feature.title} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span
                          className={cn(
                            "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
                            product.popular ? "bg-brand-500/30 text-sky-300" : "bg-white/10 text-brand-400"
                          )}
                          style={{ height: 18, width: 18 }}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span>
                          <span className="font-semibold text-white">{feature.title}.</span> {feature.desc}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <span
                    className={cn(
                      "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
                      product.popular
                        ? "btn-shine bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/40"
                        : "border border-white/15 text-white hover:border-brand-400 hover:bg-brand-600/20"
                    )}
                  >
                    View product <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why DEVZARD */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="Why these products"
            title="Built by the same team,"
            highlight="shipped to you."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Zap, title: "Instant deploy", desc: "Most products are live in under 5 minutes." },
              { icon: Server, title: "Battle-tested", desc: "Same infrastructure we use for our biggest clients." },
              { icon: Sparkles, title: "Always updated", desc: "Free updates and new features, forever." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-lg">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 via-brand-600 to-sky-500 p-10 text-center shadow-2xl shadow-brand-600/30 sm:p-16">
              <div className="bg-grid-dark absolute inset-0 opacity-40" />
              <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
              <h2 className="font-display relative mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Need something custom?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                If our products don&apos;t fit, our services team will build exactly what you need.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
              >
                  Talk to us <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Browse services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
