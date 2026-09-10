import {
  SearchCheck,
  PenTool,
  Hammer,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Reveal, SectionHeading } from "./shared";

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

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute top-20 -right-32 h-80 w-80 rounded-full bg-brand-100/80 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How we work"
          title="A process built for"
          highlight="speed & clarity."
          subtitle="No black boxes. You'll always know what's happening, what's next, and how it's performing."
        />

        <div className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
          {/* connecting line */}
          <div className="absolute top-9 right-[12%] left-[12%] hidden border-t-2 border-dashed border-brand-200 lg:block" />

          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} className="relative">
              <div className="group flex h-full flex-col items-center text-center lg:items-start lg:text-left">
                {/* node */}
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

        {/* tech stack marquee */}
        <Reveal delay={0.1}>
          <div className="marquee-mask mt-20 overflow-hidden">
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
  );
}
