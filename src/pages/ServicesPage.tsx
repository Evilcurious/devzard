import { Link } from "react-router-dom";
import { ArrowRight, Check, Cpu, Sparkles, Zap } from "lucide-react";
import { Reveal, SectionHeading } from "../components/shared";
import { useStore } from "../context/StoreContext";
import { cn } from "../utils/cn";

export default function ServicesPage() {
  const { services, stats } = useStore();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-400/20 blur-[130px]" />
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" /> Our services
              </span>
              <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.04] font-bold tracking-tight text-slate-900 sm:text-6xl">
                Ten services. <span className="text-gradient-blue">One team.</span>
                <br />
                Every channel covered.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
                Strategy, creative, development and paid media — working together instead
                of in silos. Pick a service to dive deeper.
              </p>

              <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-brand-100 bg-brand-100 lg:grid-cols-4">
                {stats.services.map((s) => (
                  <div key={s.label} className="bg-white/90 px-6 py-7 text-center backdrop-blur">
                    <p className="font-display text-3xl font-bold text-gradient-blue sm:text-4xl">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="bg-dots absolute top-0 right-0 h-72 w-72 opacity-40 [mask-image:radial-gradient(closest-side,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we offer"
            title="Pick a service,"
            highlight="see the play."
            subtitle="Each service has its own dedicated page with process, deliverables, FAQs and case studies."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link
                  to={`/services/${s.slug}`}
                  className="card-glow group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white p-7"
                >
                  {s.popular && (
                    <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-sky-500 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-brand-500/30">
                      ★ Popular
                    </span>
                  )}
                  <span className="font-display absolute -top-3 right-4 text-7xl font-bold text-brand-50 transition-colors duration-500 select-none group-hover:text-brand-100">
                    {s.number}
                  </span>

                  <span
                    className={cn(
                      "relative flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
                      s.gradient
                    )}
                    style={{ height: 56, width: 56 }}
                  >
                    <s.icon className="h-7 w-7" />
                  </span>

                  <h3 className="font-display mt-5 text-2xl font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm font-medium text-brand-600">{s.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-[11px] font-semibold text-brand-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
                    Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why DEVZARD */}
      <section className="relative overflow-hidden bg-brand-50/50 py-20 sm:py-24">
        <div className="bg-grid-light absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why DEVZARD"
            title="One team."
            highlight="Every channel."
            subtitle="Stop juggling freelancers and specialists. Get a single team that owns the full growth loop."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Speed to launch",
                desc: "Most campaigns and sites ship in days, not months.",
                gradient: "from-brand-600 to-sky-400",
              },
              {
                icon: Cpu,
                title: "Senior team only",
                desc: "No juniors learning on your dime — every person is battle-tested.",
                gradient: "from-indigo-600 to-brand-400",
              },
              {
                icon: Sparkles,
                title: "AI-native",
                desc: "We use AI to ship 10× faster without sacrificing craft.",
                gradient: "from-violet-600 to-indigo-400",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="card-glow h-full rounded-3xl border border-brand-100 bg-white p-7">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                      item.gradient
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{item.desc}</p>
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
                Not sure which service you need?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                Book a free 20-minute strategy call — we&apos;ll map your growth plan.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
            >
                  Book free call <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  See our products
                </Link>
              </div>
              <div className="relative mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-brand-100">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-300" /> Free audit included
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-300" /> 12-hour response
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-300" /> No contracts
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
