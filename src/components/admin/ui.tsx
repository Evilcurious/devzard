import type { ReactNode, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

/* ---------------- AdminShell pieces ---------------- */

export function AdminCard({
  title,
  desc,
  children,
  action,
  className,
}: {
  title?: string;
  desc?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur", className)}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-lg font-bold text-white">{title}</h3>}
            {desc && <p className="mt-1 text-sm text-slate-400">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" ? "px-3.5 py-2 text-xs" : "px-5 py-2.5 text-sm",
        variant === "primary" &&
          "bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/25 hover:-translate-y-0.5",
        variant === "ghost" && "border border-white/15 text-slate-300 hover:border-brand-400/60 hover:text-white",
        variant === "danger" && "border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
        variant === "success" && "border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
        className
      )}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {label} {required && <span className="text-brand-400">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-brand-400/60 focus:bg-white/[0.08] focus:ring-4 focus:ring-brand-500/10"
      />
      {hint && <span className="mt-1.5 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-brand-400/60 focus:bg-white/[0.08] focus:ring-4 focus:ring-brand-500/10"
      />
      {hint && <span className="mt-1.5 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-400/60 focus:ring-4 focus:ring-brand-500/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-navy-900 text-white">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminToggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300",
          checked ? "bg-gradient-to-r from-brand-600 to-sky-400" : "bg-slate-600"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#2563eb"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/60"
        />
      </div>
      {hint && <span className="mt-1.5 block text-[11px] text-slate-500">{hint}</span>}
    </div>
  );
}

export function AdminBadge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "green" | "amber" | "rose" | "slate" | "violet";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-500/15 text-brand-300 border-brand-400/30",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    slate: "bg-white/10 text-slate-300 border-white/15",
    violet: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase", tones[tone])}>
      {children}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: typeof X;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-all hover:border-brand-400/40">
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg", gradient)}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
      <p className="font-display mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

export function AdminFeedback({ message, ok }: { message: string | null; ok: boolean }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        ok ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-rose-400/30 bg-rose-500/10 text-rose-300"
      )}
    >
      {message}
    </motion.div>
  );
}

/* ---------------- Modal ---------------- */

export function AdminModal({
  open,
  onClose,
  title,
  desc,
  children,
  onSubmit,
  submitLabel,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  desc?: string;
  children: ReactNode;
  onSubmit?: (e: FormEvent) => void;
  submitLabel?: string;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy-950/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "my-auto w-full rounded-3xl border border-white/10 bg-navy-900 p-7 shadow-2xl",
              wide ? "max-w-3xl" : "max-w-lg"
            )}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                {desc && <p className="mt-1 text-sm text-slate-400">{desc}</p>}
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.(e);
              }}
            >
              <div className="space-y-4">{children}</div>
              {submitLabel && (
                <div className="mt-7 flex gap-3">
                  <AdminButton type="submit" className="flex-1">
                    {submitLabel}
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={onClose}>
                    Cancel
                  </AdminButton>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <AdminModal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-relaxed text-slate-300">{message}</p>
      <div className="mt-7 flex gap-3">
        <AdminButton
          variant="danger"
          className="flex-1"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Yes, delete
        </AdminButton>
        <AdminButton variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </AdminButton>
      </div>
    </AdminModal>
  );
}
