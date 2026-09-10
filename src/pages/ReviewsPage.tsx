import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Quote, Star, BadgeCheck, Sparkles, ArrowRight, Send, CheckCircle2, ShieldCheck, MessageSquare,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/shared";
import { EditableText } from "../components/Editable";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
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

/* ---------------- user review submission ---------------- */
function WriteReview() {
  const { user } = useAuth();
  const { services, addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [service, setService] = useState("");
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (text.trim().length < 10) return;
    addReview({
      authorName: user.name,
      authorEmail: user.email,
      rating,
      service: service || undefined,
      text: text.trim(),
    });
    setDone(true);
    setText("");
  };

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-7 shadow-sm sm:p-9">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
        <Sparkles className="h-3 w-3" /> Your turn
      </span>
      <h3 className="font-display mt-4 text-2xl font-bold text-slate-900">
        Worked with us? Leave a review.
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Every registered client can share their experience. It goes live on this page instantly.
      </p>

      {!user ? (
        <div className="mt-6 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-6 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-brand-400" />
          <p className="mt-3 text-sm text-slate-600">
            Only registered members can leave reviews — it takes 30 seconds.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/register" className="btn-shine inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-600">
              Sign in
            </Link>
          </div>
        </div>
      ) : done ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="mt-3 font-semibold text-emerald-800">Review published — thank you!</p>
          <p className="mt-1 text-xs text-emerald-600">Your review is now live in the community section.</p>
          <button onClick={() => setDone(false)} className="mt-4 text-xs font-semibold text-emerald-700 underline">
            Write another review
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Your rating</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn("h-8 w-8", (hover || rating) >= n ? "text-amber-400" : "text-slate-200")}
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              What did we help with? (optional)
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full appearance-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="">General / multiple services</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Your review *
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell others about your experience with DEVZARD…"
              className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          <button
            type="submit"
            className="btn-shine inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            <Send className="h-4 w-4" /> Publish review
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */
export default function ReviewsPage() {
  const { reviews } = useStore();
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";
  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const featured = reviews[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-400/20 blur-[130px]" />
        <div className="absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <EditableText id="rev-eyebrow">Client love</EditableText>
              </span>
              <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.06] font-bold tracking-tight text-slate-900 sm:text-6xl">
                <EditableText id="rev-h1a">Results that speak</EditableText>{" "}
                <span className="text-gradient-blue"><EditableText id="rev-h1b">louder than us.</EditableText></span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                <EditableText id="rev-desc" multiline>
                  We measure our success by your growth. Registered clients can leave their own
                  review below — real words from real people we&apos;ve worked with.
                </EditableText>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured (first real review) + ratings */}
      <section className="relative overflow-hidden bg-brand-50/50 py-16 sm:py-24">
        <div className="bg-grid-light absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-sky-100 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              {featured ? (
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
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-brand-300 bg-white/60 p-10 text-center sm:p-16">
                  <MessageSquare className="h-12 w-12 text-brand-300" />
                  <h3 className="font-display mt-5 text-2xl font-bold text-slate-900">No reviews yet</h3>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Be the first to share your experience with DEVZARD. Sign in and leave a review —
                    it&apos;ll appear right here.
                  </p>
                  <Link
                    to="/login"
                    className="btn-shine mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
                  >
                    Write the first review <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 p-8 text-white shadow-2xl shadow-brand-600/30">
                <div className="bg-grid-dark absolute inset-0 opacity-40" />
                <div className="relative">
                  <p className="font-display text-6xl font-bold">
                    {avg}<span className="text-sky-200">/5</span>
                  </p>
                  <Stars n={Math.round(Number(avg))} />
                  <p className="mt-3 text-sm text-brand-100">
                    {reviews.length > 0
                      ? `Based on ${reviews.length} verified member review${reviews.length === 1 ? "" : "s"}`
                      : "Awaiting your first review"}
                  </p>
                </div>
                <div className="relative mt-8 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur">
                    <span className="font-display text-2xl font-bold">{reviews.length}</span>
                    <span className="text-xs font-medium text-brand-100">total reviews</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur">
                    <span className="font-display text-2xl font-bold">{fiveStar}</span>
                    <span className="text-xs font-medium text-brand-100">5-star reviews</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Submission + community reviews */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <WriteReview />
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Community reviews"
                title="Real words from"
                highlight="real clients."
                subtitle="Every review here was submitted by a registered DEVZARD member."
              />

              {reviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-brand-300 bg-brand-50/40 p-10 text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-brand-300" />
                  <p className="font-display mt-4 text-lg font-bold text-slate-900">No reviews to show yet</p>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Once members start leaving reviews, they&apos;ll appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {reviews.map((r, i) => (
                    <Reveal key={r.id} delay={i * 0.05}>
                      <div className="card-glow flex h-full flex-col rounded-3xl border border-brand-100 bg-white p-7">
                        <Stars n={r.rating} />
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{r.text}&rdquo;</p>
                        <div className="mt-6 flex items-center gap-3 border-t border-brand-50 pt-5">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 font-display text-sm font-bold text-white shadow-md">
                            {r.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{r.authorName}</p>
                            <p className="text-xs text-slate-500">
                              {r.service || "DEVZARD client"} ·{" "}
                              {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-brand-500" />
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-800 via-brand-600 to-sky-500 p-8 text-center shadow-2xl shadow-brand-600/30 sm:p-16">
              <div className="bg-grid-dark absolute inset-0 opacity-40" />
              <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
              <h2 className="font-display relative mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                <EditableText id="rev-cta">Ready to join them?</EditableText>
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                <EditableText id="rev-cta-desc">
                  Let DEVZARD engineer your digital growth — then come back and tell the world.
                </EditableText>
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/contact" className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
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
