import { useParams, Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";
import ServicePage from "../components/ServicePage";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { services } = useStore();
  const service = slug ? services.find((s) => s.slug === slug) : undefined;

  if (!service) {
    return (
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-xl">
            <AlertCircle className="h-8 w-8" />
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold text-slate-900 sm:text-5xl">
            Service not found
          </h1>
          <p className="mt-4 text-slate-500">
            We couldn&apos;t find that service. Try one of these popular services instead.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {services.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {s.title}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/services"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl"
            >
              Browse all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <ServicePage service={service} />;
}
