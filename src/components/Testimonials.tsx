import { Link } from "react-router-dom";
import { Quote, Star, BadgeCheck, MessageSquare, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./shared";
import { useStore } from "../context/StoreContext";
import { cn } from "../utils/cn";

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < n ? "text-amber-400" : "text-slate-200")} fill="currentColor" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { reviews } = useStore();
  const featured = reviews[0];
  const rest = reviews.slice(1, 4);
  const avg =
    reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <section id="testimonials" className="relative overflow-hidden bg-brand-50/50 py-20 sm:py-28">
      <div className="bg-grid-light absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-sky-100 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Client love"
          title="Results that speak"
          highlight="louder than us."
          subtitle="Real reviews from registered DEVZARD members. Worked with us? Add yours."
        />

        {reviews.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-300 bg-white/70 p-10 text-center sm:p-14">
              <MessageSquare className="h-12 w-12 text-brand-300" />
              <h3 className="font-display mt-5 text-2xl font-bold text-slate-900">Be the first to review us</h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                We just launched reviews. Once our clients start sharing their experience, it&apos;ll show up right here.
              </p>
              <Link
                to="/reviews"
                className="btn-shine mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
              >
                Leave a review <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* featured */}
            <Reveal className="lg:col-span-2">
              <div className="card-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white p-8 sm:p-10">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-gradient-to-tr from-brand-100 to-cyan-100 blur-2xl" />
                <Quote className="h-10 w-10 text-brand-200" fill="currentColor" />
                <p className="font-display relative mt-5 text-xl leading-relaxed font-medium text-slate-800 sm:text-2xl">
                  &ldquo;{featured.text}&rdquo;
                </p>
                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 font-display text-lg font-bold text-white shadow-lg">
                      {featured.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                        {featured.authorName}
                        <BadgeCheck className="h-4 w-4 text-brand-500" />
                      </p>
                      <p className="text-sm text-slate-500">{featured.service || "DEVZARD client"}</p>
                    </div>
                  </div>
                  <Stars n={featured.rating} />
                </div>
              </div>
            </Reveal>

            {/* rating card */}
            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 p-8 text-white shadow-2xl shadow-brand-600/30">
                <div className="bg-grid-dark absolute inset-0 opacity-40" />
                <div className="relative">
                  <p className="font-display text-6xl font-bold">{avg}<span className="text-sky-200">/5</span></p>
                  <Stars n={Math.round(Number(avg))} />
                  <p className="mt-3 text-sm text-brand-100">
                    From {reviews.length} verified member review{reviews.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  to="/reviews"
                  className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Read all reviews <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* more reviews */}
            {rest.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <div className="card-glow flex h-full flex-col rounded-3xl border border-brand-100 bg-white p-7">
                  <Stars n={r.rating} />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-brand-50 pt-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 font-display text-sm font-bold text-white shadow-md">
                      {r.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.authorName}</p>
                      <p className="text-xs text-slate-500">{r.service || "DEVZARD client"}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
