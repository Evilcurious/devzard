import { ArrowUpRight, Cpu, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "./shared";
import { useStore } from "../context/StoreContext";
import { cn } from "../utils/cn";

function ServiceCard({
  slug,
  index,
  span,
  big = false,
}: {
  slug: string;
  index: number;
  span: string;
  big?: boolean;
}) {
  const { services } = useStore();
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  const isBig = big;

  return (
    <Reveal delay={(index % 3) * 0.08} className={cn("group relative", span)}>
      <Link
        to={`/services/${service.slug}`}
        className="card-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white p-7"
      >
        {service.popular && (
          <span className="absolute top-5 right-5 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-sky-500 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase shadow-lg shadow-brand-500/30">
            ★ Popular
          </span>
        )}
        <span className="font-display absolute -top-3 right-4 text-7xl font-bold text-brand-50 transition-colors duration-500 select-none group-hover:text-brand-100">
          {service.number}
        </span>

        {isBig && (
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-tr from-brand-100 to-cyan-50 blur-2xl transition-transform duration-700 group-hover:scale-125" />
        )}

        <span
          className={cn(
            "relative flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
            service.gradient
          )}
          style={{ height: 52, width: 52 }}
        >
          <service.icon className="h-6 w-6" />
        </span>

        <div className="relative mt-5 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-slate-900">{service.title}</h3>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-100 text-slate-400 transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="relative mt-2.5 text-sm leading-relaxed text-slate-500">{service.desc}</p>

        {isBig && (
          <div className="relative mt-5 hidden overflow-hidden rounded-2xl border border-brand-100 bg-slate-950 p-4 sm:block">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed">
              <p className="text-sky-300">
                <span className="text-slate-500">1</span> const devzard ={" "}
                <span className="text-slate-300">{"{"}</span>
              </p>
              <p className="pl-5 text-slate-300">
                design: <span className="text-emerald-400">"clean"</span>,
              </p>
              <p className="pl-5 text-slate-300">
                speed: <span className="text-emerald-400">"lightning"</span>,
              </p>
              <p className="pl-5 text-slate-300">
                conversion: <span className="text-emerald-400">"+300%"</span>
              </p>
              <p className="text-slate-300">{"}"};</p>
            </div>
          </div>
        )}

        <div className="relative mt-auto flex flex-wrap gap-2 pt-5">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-[11px] font-semibold text-brand-700 transition-colors duration-300 group-hover:border-brand-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </Reveal>
  );
}

const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export default function ServicesPreview() {
  const { services } = useStore();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="bg-dots absolute top-0 right-0 h-72 w-72 opacity-40 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-sky-100/70 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What we do"
          title="Every service your brand needs."
          highlight="One team."
          subtitle="From a single landing page to a full growth engine — strategy, creative, development and ads working together, not in silos."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {services.slice(0, 10).map((service, i) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              index={i}
              span={spans[i] ?? "lg:col-span-2"}
              big={i === 0}
            />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-dashed border-brand-300 bg-brand-50/50 p-6 sm:flex-row sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-lg shadow-brand-500/30">
                <Cpu className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-slate-900">
                  Not sure which service fits?
                </p>
                <p className="text-sm text-slate-500">
                  Book a free 20-minute strategy call — we&apos;ll map your growth plan, no strings attached.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Check className="h-4 w-4 text-emerald-500" /> Free audit included
              </span>
              <Link
                to="/contact"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600"
              >
                Book a call <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
