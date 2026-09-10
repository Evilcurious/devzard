import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditableText } from "./Editable";
import { cn } from "../utils/cn";

/* ---------------- Reveal: scroll-triggered animation wrapper ---------------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- SectionHeading ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "mb-14 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase",
          dark
            ? "border-white/15 bg-white/5 text-sky-300"
            : "border-brand-200 bg-brand-50 text-brand-600"
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-500" />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", dark ? "bg-sky-300" : "bg-brand-500")} />
        </span>
        <EditableText id={`heading-eyebrow`} multiline>
          {eyebrow}
        </EditableText>
      </span>
      <h2
        className={cn(
          "font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl",
          dark ? "text-white" : "text-slate-900"
        )}
      >
        <EditableText id={`heading-title`}>{title}</EditableText>{" "}
        {highlight && (
          <span className="text-gradient-blue">
            <EditableText id={`heading-highlight`}>{highlight}</EditableText>
          </span>
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-slate-400" : "text-slate-500"
          )}
        >
          <EditableText id={`heading-subtitle`} multiline>
            {subtitle}
          </EditableText>
        </p>
      )}
    </Reveal>
  );
}

/* ---------------- Counter: animated number ---------------- */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
