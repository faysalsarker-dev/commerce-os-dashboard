import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (v: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState(() => format(0));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => spring.on("change", (v) => setDisplay(format(v))), [spring, format]);

  return <span ref={ref}>{display}</span>;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  format = (v: number) => Math.round(v).toLocaleString(),
  hint,
  progress,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  format?: (v: number) => string;
  hint?: string;
  progress?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        <AnimatedNumber value={value} format={format} />
      </p>
      {typeof progress === "number" && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      )}
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export default StatCard;
