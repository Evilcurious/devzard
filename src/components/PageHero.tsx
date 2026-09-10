import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { EditableText } from "./Editable";
import { cn } from "../utils/cn";

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  icon: Icon,
  gradient,
  ctaLabel = "Start your project",
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  ctaLabel?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-[130px]" />
      <div className="absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm"
        >
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.href ? (
                <Link to={crumb.href} className="transition-colors hover:text-brand-600">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700">{crumb.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="text-slate-300">/</span>}
            </span>
          ))}
        </motion.nav>

        <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl",
                  gradient
                )}
              >
                <Icon className="h-8 w-8" />
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                <EditableText id={`ph-eyebrow`}>{eyebrow}</EditableText>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display mt-6 text-4xl leading-[1.06] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              <EditableText id={`ph-title`}>{title}</EditableText>{" "}
              <span className="text-gradient-blue">
                <EditableText id={`ph-highlight`}>{highlight}</EditableText>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500"
            >
              <EditableText id={`ph-desc`} multiline>
                {description}
              </EditableText>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Link
                to="/contact"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:border-brand-400 hover:text-brand-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to services
              </Link>
            </motion.div>
          </div>

          {/* Decorative right block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className={cn("absolute -inset-4 rounded-[2rem] bg-gradient-to-br opacity-20 blur-2xl", gradient)} />
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-8 shadow-2xl shadow-brand-900/10">
              <div className={cn("absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl", gradient)} />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Live preview</span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <div className="relative mt-6 space-y-4">
                <div className="rounded-2xl border border-brand-50 bg-brand-50/40 p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Avg. performance</p>
                  <p className={cn("font-display mt-1 text-3xl font-bold text-gradient-blue")}>+312%</p>
                  <p className="mt-1 text-xs text-slate-500">vs. previous quarter</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-brand-50 bg-white p-3">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Speed</p>
                    <p className="font-display mt-1 text-xl font-bold text-slate-900">0.8s</p>
                  </div>
                  <div className="rounded-xl border border-brand-50 bg-white p-3">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Uptime</p>
                    <p className="font-display mt-1 text-xl font-bold text-slate-900">99.9%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
