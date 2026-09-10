import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EditableText } from "./Editable";
import { useStore } from "../context/StoreContext";
import {
  ArrowRight,
  Play,
  TrendingUp,
  CheckCircle2,
  MonitorPlay,
  Rocket,
  Sparkles,
  Globe,
  Smartphone,
} from "lucide-react";


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const bars = [34, 52, 40, 66, 48, 78, 60, 92, 70, 100, 82, 96];

export default function Hero() {
  const { assets, stats } = useStore();
  const hv = stats.heroVisual;
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* backdrop */}
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-400/20 blur-[130px]" />
      <div className="absolute top-10 -right-40 h-[460px] w-[460px] rounded-full bg-cyan-accent/20 blur-[130px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-50/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        {/* ------------ left ------------ */}
        <div className="text-center lg:text-left">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-500" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <EditableText id="hero-badge">Now onboarding new projects for 2026</EditableText>
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
            className="font-display mt-6 text-5xl leading-[1.04] font-bold tracking-tight text-slate-900 sm:text-6xl xl:text-7xl"
          >
            <EditableText id="hero-l1">We engineer</EditableText>
            <br />
            <span className="text-gradient-blue">
              <EditableText id="hero-l2">digital growth</EditableText>
            </span>
            <br />
            <EditableText id="hero-l3">for bold brands</EditableText>
            <span className="text-brand-500">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.24}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500 lg:mx-0"
          >
            <EditableText id="hero-desc" multiline>
              DEVZARD is a full-stack digital agency — websites, apps, paid ads, video
              editing, YouTube branding and AI-powered marketing. One team, every
              channel, measurable results.
            </EditableText>
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.36}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              to="/contact"
              className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-500/40 sm:w-auto"
            >
              <Rocket className="h-5 w-5" />
              Start Your Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-brand-200 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:border-brand-400 hover:text-brand-600 sm:w-auto"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
              </span>
              Explore Services
            </Link>
          </motion.div>

          {/* mini proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.48}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {["DZ", "HD", "TL", "FZ"].map((n, i) => (
                  <span
                    key={n}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${
                        ["#2563eb", "#38bdf8", "#1e4fd4", "#0ea5e9"][i]
                      }, ${["#38bdf8", "#22d3ee", "#59a7ff", "#22d3ee"][i]})`,
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{stats.trustCount}</span> trust us
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <span className="flex text-amber-400">{"★★★★★"}</span>
              {stats.ratingText}
            </div>
          </motion.div>
        </div>

        {/* ------------ right: dashboard mockup / custom hero image ------------ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl hidden md:block lg:max-w-none"
        >
          {/* glow behind */}
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/15 via-sky-400/10 to-cyan-300/15 blur-2xl" />

          {assets.heroImageUrl ? (
            <img
              src={assets.heroImageUrl}
              alt="DEVZARD showcase"
              className="relative w-full rounded-3xl border border-brand-100 object-cover shadow-2xl shadow-brand-900/15"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          ) : (
          <>
          {/* browser window */}
          <div className="relative rounded-3xl border border-brand-100 bg-white/90 p-2 shadow-2xl shadow-brand-900/15 backdrop-blur">
            <div className="flex items-center gap-2 rounded-t-2xl bg-slate-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-slate-400">
                devzardpk.com/dashboard
              </span>
            </div>

            <div className="rounded-b-2xl bg-gradient-to-b from-white to-brand-50/50 p-5">
              {/* header row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Campaign overview
                  </p>
                  <p className="font-display mt-0.5 text-lg font-bold text-slate-900">
                    {hv.revenueLabel} · <span className="text-gradient-blue">{hv.revenueValue}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> {hv.revenueChange}
                </span>
              </div>

              {/* bar chart */}
              <div className="mt-5 flex h-28 items-end gap-1.5 sm:gap-2">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.7, delay: 0.7 + i * 0.05, ease: "easeOut" }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-sky-400"
                    style={{ opacity: i % 3 === 0 ? 1 : i % 3 === 1 ? 0.7 : 0.45 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="flex-1 text-center">
                    {d}
                  </span>
                ))}
              </div>

              {/* service chips */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { icon: Globe, label: "Websites", stat: "56 launched" },
                  { icon: Smartphone, label: "Apps", stat: "23 shipped" },
                  { icon: MonitorPlay, label: "YouTube", stat: "4.2M views" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-brand-100 bg-white p-2.5 shadow-sm"
                  >
                    <s.icon className="h-4 w-4 text-brand-500" />
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-700">{s.label}</p>
                    <p className="text-[10px] text-slate-400">{s.stat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* floating card: ROAS */}
          <div className="glass-card absolute -top-7 -left-3 flex animate-float items-center gap-3 rounded-2xl p-3.5 shadow-xl shadow-brand-900/10 sm:-left-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{hv.roas.label}</p>
              <p className="font-display text-sm font-bold text-slate-900">
                {hv.roas.value} <span className="text-[10px] font-semibold text-emerald-500">{hv.roas.sub}</span>
              </p>
            </div>
          </div>

          {/* floating card: video */}
          <div className="glass-card absolute -bottom-8 -left-4 flex animate-float-slow items-center gap-3 rounded-2xl p-3.5 shadow-xl shadow-brand-900/10 sm:-left-12">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-md">
              <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{hv.videoEdit.label}</p>
              <p className="font-display text-sm font-bold text-slate-900">
                {hv.videoEdit.value} <span className="text-[10px] font-semibold text-brand-500">{hv.videoEdit.sub}</span>
              </p>
            </div>
          </div>

          {/* floating card: subscriber */}
          <div className="glass-card absolute -right-2 -top-10 hidden animate-float items-center gap-3 rounded-2xl p-3.5 shadow-xl shadow-brand-900/10 sm:flex lg:-right-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-400 text-white shadow-md">
              <MonitorPlay className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{hv.youtube.label}</p>
              <p className="font-display text-sm font-bold text-slate-900">
                {hv.youtube.value} <span className="text-[10px] font-semibold text-rose-500">{hv.youtube.sub}</span>
              </p>
            </div>
          </div>

          {/* rotating badge */}
          <div className="absolute -right-6 -bottom-6 hidden sm:block lg:-right-10">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                <defs>
                  <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-brand-600 text-[10.5px] font-bold tracking-[2.5px] uppercase">
                  <textPath href="#circlePath">devzard · digital agency ·</textPath>
                </text>
              </svg>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 shadow-lg shadow-brand-500/40">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </span>
            </div>
          </div>
          </>
          )}
        </motion.div>
      </div>

      {/* bottom stats strip */}
      <div className="relative mx-auto mt-14 max-w-7xl px-4 sm:mt-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-brand-100 bg-brand-100 shadow-lg shadow-brand-900/5 lg:grid-cols-4"
        >
          {stats.hero.map((s) => (
            <div key={s.label} className="bg-white/90 px-4 py-6 text-center backdrop-blur sm:px-6 sm:py-7">
              <p className="font-display text-2xl font-bold text-gradient-blue sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
