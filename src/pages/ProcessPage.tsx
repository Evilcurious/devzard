import { Link } from "react-router-dom";
import { SearchCheck, PenTool, Hammer, Rocket, ArrowRight, Sparkles, Clock, ShieldCheck, ThumbsUp } from "lucide-react";
import { Reveal, SectionHeading } from "../components/shared";

const steps = [
  {
    icon: SearchCheck,
    number: "01",
    title: "Discover",
    desc: "We audit your market, competitors and goals to find the fastest path to growth.",
    points: ["Free strategy call", "Brand & market audit", "Growth roadmap"],
  },
  {
    icon: PenTool,
    number: "02",
    title: "Design",
    desc: "Strategy becomes wireframes, ad concepts and creatives — approved by you first.",
    points: ["UX wireframes", "Ad creative concepts", "Content calendar"],
  },
  {
    icon: Hammer,
    number: "03",
    title: "Develop",
    desc: "We build, launch campaigns and produce content with weekly progress drops.",
    points: ["Agile build sprints", "Campaign setup", "Weekly demos"],
  },
  {
    icon: Rocket,
    number: "04",
    title: "Deliver & Scale",
    desc: "We launch, measure and optimize relentlessly — then scale what works.",
    points: ["Launch + QA", "A/B optimization", "Monthly growth reports"],
  },
];

const stack = [
  "React", "Shopify", "Figma", "Meta Ads", "Google Ads", "TikTok Ads", "Premiere Pro",
  "After Effects", "DaVinci Resolve", "Photoshop", "Illustrator", "Canva", "Notion",
  "Zapier", "HubSpot", "ChatGPT", "Midjourney", "Google Analytics",
];

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-400/20 blur-[130px]" />
        <div className="absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" /> How we work
              </span>
              <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.04] font-bold tracking-tight text-slate-900 sm:text-6xl">
                A process built for
                <br />
                <span className="text-gradient-blue">speed & clarity.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
                No black boxes. You&apos;ll always know what&apos;s happening, what&apos;s next,
                and how it&apos;s performing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process steps */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute top-20 -right-32 h-80 w-80 rounded-full bg-brand-100/80 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The 4-step process"
            title="From kickoff to scale in"
            highlight="predictable steps."
          />

          <div className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            <div className="absolute top-9 right-[12%] left-[12%] hidden border-t-2 border-dashed border-brand-200 lg:block" />

            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.1} className="relative">
                <div className="group flex h-full flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="relative z-10">
                    <span className="absolute -inset-2 rounded-2xl bg-brand-100 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-brand-100 bg-white shadow-lg shadow-brand-900/5 transition-all duration-500 group-hover:-rotate-6 group-hover:border-brand-300 group-hover:shadow-brand-500/25">
                      <step.icon className="h-8 w-8 text-brand-600" />
                    </span>
                    <span className="font-display absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 text-[11px] font-bold text-white shadow-md">
                      {i + 1}
                    </span>
                  </div>

                  <p className="font-display mt-6 text-xs font-bold tracking-[0.3em] text-brand-500 uppercase">
                    Step {step.number}
                  </p>
                  <h3 className="font-display mt-1.5 text-2xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{step.desc}</p>

                  <ul className="mt-5 w-full space-y-2.5">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2.5 rounded-xl border border-brand-50 bg-brand-50/50 px-3.5 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors duration-300 group-hover:border-brand-200"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-600 to-sky-400" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {i < steps.length - 1 && (
                    <ArrowRight className="absolute top-9 -right-7 hidden h-5 w-5 text-brand-300 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="relative overflow-hidden bg-brand-50/50 py-20 sm:py-24">
        <div className="bg-grid-light absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our promises"
            title="What you can"
            highlight="always expect."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "12-hour response",
                desc: "We reply to every message within 12 hours — usually much faster.",
              },
              {
                icon: ShieldCheck,
                title: "Zero surprises",
                desc: "Transparent pricing, weekly demos, monthly reports. No black boxes.",
              },
              {
                icon: ThumbsUp,
                title: "Results-driven",
                desc: "We measure our success by the business outcomes we deliver for you.",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card-glow h-full rounded-3xl border border-brand-100 bg-white p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-lg">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Tech we use daily"
            title="The same tools"
            highlight="the big teams use."
            subtitle="We invest in best-in-class tools so your team and ours can move faster, together."
          />
          <Reveal delay={0.1}>
            <div className="marquee-mask overflow-hidden">
              <div className="flex w-max animate-marquee-slow items-center gap-3 [animation-direction:reverse]">
                {[...stack, ...stack].map((tech, i) => (
                  <span
                    key={`${tech}-${i}`}
                    className="rounded-full border border-brand-100 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-slate-500 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
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
                Like this process?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                See it in action — book a free strategy call and we&apos;ll walk you through how it works for your project.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
            >
                  Book free call <ArrowRight className="h-4 w-4" />
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
