import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const bullets = [
  { icon: Sparkles, text: "Free 20-minute strategy call included" },
  { icon: ShieldCheck, text: "Enterprise-grade privacy & security" },
  { icon: Zap, text: "Launch in days, not months" },
];

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* backdrop */}
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-400/20 blur-[130px]" />
      <div className="absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/20 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Left brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 shadow-lg shadow-brand-500/30">
              <Zap className="h-5 w-5 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              DEV<span className="text-gradient-blue">ZARD</span>
            </span>
          </Link>

          <h2 className="font-display mt-10 text-4xl leading-tight font-bold tracking-tight text-slate-900">
            Your growth,
            <br />
            <span className="text-gradient-blue">all in one place.</span>
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-500">
            Sign in to manage projects, track campaigns, download deliverables, and
            chat with your growth team.
          </p>

          <ul className="mt-10 space-y-4">
            {bullets.map((b, i) => (
              <motion.li
                key={b.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-white/80 p-4 backdrop-blur"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-md">
                  <b.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-700">{b.text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {["AK", "MR", "JS", "RT"].map((n, i) => (
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
              <span className="font-semibold text-slate-800">2,400+ members</span> already onboard
            </p>
          </div>
        </motion.div>

        {/* Right form panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white/90 p-8 shadow-2xl shadow-brand-900/10 backdrop-blur sm:p-10">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-50 blur-2xl" />
            <div className="relative">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>
              <div className="mt-8">{children}</div>
              {footer && <div className="mt-8 border-t border-brand-50 pt-6">{footer}</div>}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function AuthFormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
      />
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
        !
      </span>
      {message}
    </motion.div>
  );
}

export function AuthSubmit({ label, loading }: { label: string; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-500/40 disabled:opacity-60 disabled:pointer-events-none"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
