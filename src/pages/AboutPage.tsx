import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Zap,
  Globe,
  Award,
  Users,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/shared";
import { useStore } from "../context/StoreContext";
import { getIcon } from "../lib/icons";
import { EditableText } from "../components/Editable";

/* legacy photo keys (uploaded before team became admin-managed) */
const LEGACY_PHOTO_KEY: Record<string, "founder" | "cofounder" | "ceo"> = {
  "tm-hadi": "founder",
  "tm-talha": "cofounder",
  "tm-faizan": "ceo",
};

const values = [
  {
    icon: Target,
    title: "Outcome-obsessed",
    desc: "We measure our work in business results, not deliverables. If it doesn't move the needle, we don't do it.",
    gradient: "from-brand-600 to-sky-400",
  },
  {
    icon: Heart,
    title: "Genuinely kind",
    desc: "We treat every client like a partner. That means honest pushback, transparent pricing, and zero BS.",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: Zap,
    title: "Relentlessly fast",
    desc: "Speed is a feature. We ship in days, not months, and we iterate weekly.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Globe,
    title: "Globally minded",
    desc: "Remote-first, serving brands across 15+ countries. Different timezones, same standard of work.",
    gradient: "from-violet-600 to-indigo-400",
  },
];

export default function AboutPage() {
  const { assets, stats, team, skills } = useStore();
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
                <EditableText id="about-eyebrow">About DEVZARD</EditableText>
              </span>
              <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.08] font-bold tracking-tight text-slate-900 sm:text-6xl">
                <EditableText id="about-h1">
                  We&apos;re a senior team of digital growth engineers.
                </EditableText>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                <EditableText id="about-hero-desc" multiline>
                  DEVZARD was founded to give ambitious brands a single, accountable team for
                  every digital touchpoint — from code to content to paid media.
                </EditableText>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-brand-100/60 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
                  <Award className="h-3 w-3" /> Our story
                </span>
                <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Built in 2022. <br />
                  <span className="text-gradient-blue">Built to stay.</span>
                </h2>
                <p className="mt-5 text-slate-500">
                  DEVZARD started when three frustrated operators noticed the same problem:
                  brands were getting nickel-and-dimed by specialists, freelancers, and
                  agencies that wouldn&apos;t talk to each other. Every channel ran in a silo.
                </p>
                <p className="mt-4 text-slate-500">
                  We built DEVZARD to fix that. One team. One strategy. Every channel.
                  Today, we serve 120+ brands across 15+ countries — from funded startups
                  to 8-figure DTC brands.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {["Remote-first", "Senior team only", "AI-native", "Outcome-driven"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-200/40 to-cyan-100/40 blur-2xl" />
                {assets.aboutStoryUrl ? (
                  <img
                    src={assets.aboutStoryUrl}
                    alt="DEVZARD story"
                    className="relative w-full rounded-3xl border border-brand-100 object-cover shadow-2xl"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                ) : (
                  <div className="relative grid grid-cols-2 gap-4">
                    {stats.about.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5"
                      >
                        <p className="font-display text-4xl font-bold text-gradient-blue sm:text-5xl">
                          {s.value}
                        </p>
                        <p className="mt-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-100/60 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we're great at"
            title="Our skills."
            highlight="Battle-tested."
            subtitle="The capabilities we bring to every engagement — honed over hundreds of projects."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s, i) => {
              const Icon = getIcon(s.iconName);
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div className="card-glow group h-full rounded-3xl border border-brand-100 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ${s.gradient}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-lg font-bold text-brand-600">{s.level}%</span>
                    </div>
                    <h3 className="font-display mt-4 text-base font-bold text-slate-900">{s.name}</h3>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                      />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-brand-50/50 py-20 sm:py-24">
        <div className="bg-grid-light absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we live by"
            title="Four values."
            highlight="One mission."
            subtitle="These aren’t poster quotes — they’re the criteria we hire, fire, and decide by every day."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card-glow h-full rounded-3xl border border-brand-100 bg-white p-7">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${v.gradient}`}
                  >
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The team"
            title="Senior people."
            highlight="No juniors."
            subtitle="Every person on your project has 5+ years of experience. We don't learn on your dime."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => {
              const legacyKey = LEGACY_PHOTO_KEY[m.id];
              const photo = m.photoUrl || (legacyKey ? assets.teamImages?.[legacyKey] : "");
              return (
                <Reveal key={m.id} delay={i * 0.05}>
                  <div className="card-glow group overflow-hidden rounded-3xl border border-brand-100 bg-white">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-600/15 via-sky-400/10 to-cyan-300/15">
                      {photo ? (
                        <img
                          src={photo}
                          alt={`${m.name} — ${m.role}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br font-display text-4xl font-bold text-white shadow-xl ${m.gradient}`}>
                            {m.initials}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-brand-700 uppercase backdrop-blur">
                        {m.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-6">
                      <div>
                        <p className="font-display text-lg font-bold text-slate-900">
                          <EditableText id={`team-name-${m.id}`}>{m.name}</EditableText>
                        </p>
                        <p className="text-sm text-slate-500">
                          <EditableText id={`team-role-${m.id}`}>{m.role}</EditableText>
                        </p>
                      </div>
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ${m.gradient}`}>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            {/* coming soon card */}
            <Reveal delay={0.2}>
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-brand-300 bg-brand-50/40 p-8 text-center">
                <Users className="h-8 w-8 text-brand-400" />
                <p className="font-display mt-4 text-lg font-bold text-slate-900">More teammates soon</p>
                <p className="mt-1.5 text-sm text-slate-500">
                  We&apos;re growing — new faces will be announced here.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black,transparent)]" />
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-brand-600/25 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="The journey"
            title="From 3 people to"
            highlight="a global team."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { year: "2022", title: "Founded", desc: "Three co-founders, one garage, one shared mission." },
              { year: "2023", title: "10 clients", desc: "Quickly outgrew referrals. Hired our first 5 strategists." },
              { year: "2024", title: "120 clients", desc: "Crossed 120 active clients, expanded to video & AI." },
              { year: "2026", title: "Global team", desc: "Remote-first across 9 timezones, 15+ countries served." },
            ].map((item, i) => (
              <Reveal key={item.year} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <p className="font-display text-4xl font-bold text-gradient-blue">{item.year}</p>
                  <h3 className="font-display mt-3 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
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
              <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-sky-200 uppercase backdrop-blur">
                <Users className="h-3 w-3" /> Want to join?
              </span>
              <h2 className="font-display relative mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Let&apos;s build something legendary.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base text-brand-100">
                Whether you want to work with us, or join the team — we&apos;d love to hear from you.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="btn-shine keep-light inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-xl transition-transform hover:-translate-y-0.5"
            >
                  Start a project <ArrowRight className="h-4 w-4" />
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
