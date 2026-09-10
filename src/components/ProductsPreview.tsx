import {
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "./shared";
import { useStore } from "../context/StoreContext";
import { cn } from "../utils/cn";

export default function ProductsPreview() {
  const { products } = useStore();
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-28">
      {/* backdrop */}
      <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_20%,black,transparent)]" />
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/25 blur-[140px]" />
      <div className="absolute -bottom-40 right-1/5 h-96 w-96 rounded-full bg-cyan-accent/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Products & Tools"
          title="Plug-and-play assets for"
          highlight="instant growth."
          subtitle="Beyond custom work — grab battle-tested servers, templates and tools that launch your presence in days, not months."
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                to={`/products/${product.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-400",
                  product.popular
                    ? "border-brand-400/60 bg-gradient-to-b from-brand-600/20 to-navy-900 shadow-2xl shadow-brand-600/25 hover:-translate-y-2"
                    : "border-white/10 bg-white/[0.04] backdrop-blur hover:-translate-y-2 hover:border-brand-400/50 hover:bg-white/[0.07]"
                )}
              >
                {product.popular && (
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-brand-500/40">
                    <Zap className="h-3 w-3" fill="currentColor" /> Popular
                  </span>
                )}

                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                    product.gradient
                  )}
                >
                  <product.icon className="h-7 w-7" />
                </span>

                <h3 className="font-display mt-5 text-xl font-bold text-white">{product.name}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{product.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-white">{product.price}</span>
                  <span className="text-sm font-medium text-slate-400">{product.unit}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {product.features.slice(0, 4).map((feature) => (
                    <li key={feature.title} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span
                        className={cn(
                          "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
                          product.popular ? "bg-brand-500/30 text-sky-300" : "bg-white/10 text-brand-400"
                        )}
                        style={{ height: 18, width: 18 }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                      {feature.title}
                    </li>
                  ))}
                </ul>

                <span
                  className={cn(
                    "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
                    product.popular
                      ? "btn-shine bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/40 hover:shadow-xl"
                      : "border border-white/15 text-white hover:border-brand-400 hover:bg-brand-600/20"
                  )}
                >
                  Learn more <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center text-sm text-slate-500">
            All products include <span className="font-semibold text-sky-300">free setup</span> and a{" "}
            <span className="font-semibold text-sky-300">7-day money-back guarantee</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
