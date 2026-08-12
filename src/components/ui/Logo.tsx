// import { motion } from "framer-motion";

// interface LogoProps {
//   className?: string;
//   width?: number;
//   height?: number;
//   alt?: string;
//   withText?: boolean;
// }

// export function Logo({
//   className = "",
//   width = 32,
//   height = 32,
//   alt = "Commerce OS",
//   withText = false,
// }: LogoProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.96 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{
//         duration: 0.25,
//         ease: "easeOut",
//       }}
//       whileHover={{ scale: 1.02 }}
//       className={`flex items-center gap-2.5 ${className}`}
//     >
//       <img
//         src="/commerce-os.png"
//         alt={alt}
//         width={width}
//         height={height}
//         draggable={false}
//         className="shrink-0 object-contain"
//       />

//       {withText && (
//         <motion.span
//           initial={{ opacity: 0, x: -5 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{
//             duration: 0.2,
//             delay: 0.05,
//             ease: "easeOut",
//           }}
//           className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground"
//         >
//           Commerce OS
//         </motion.span>
//       )}
//     </motion.div>
//   );
// }

// export default Logo;


import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, { mark: number; text: string; gap: string }> = {
  xs: { mark: 20, text: "text-sm", gap: "gap-1.5" },
  sm: { mark: 26, text: "text-[0.9375rem]", gap: "gap-2" },
  md: { mark: 32, text: "text-lg", gap: "gap-2.5" },
  lg: { mark: 40, text: "text-xl", gap: "gap-3" },
  xl: { mark: 56, text: "text-2xl", gap: "gap-3.5" },
};

export interface LogoProps {
  /** Preset size. Defaults to "md" (32px mark) — ideal for sidebars & headers. */
  size?: LogoSize;
  /** Explicit pixel size for the mark; overrides `size`. */
  mark?: number;
  /** Show the wordmark next to the mark. Defaults to true. */
  withText?: boolean;
  /** Wordmark label + image alt text. */
  label?: string;
  /** Disable mount/hover motion (useful inside animated containers). */
  animate?: boolean;
  className?: string;
  textClassName?: string;
}

export function Logo({
  size = "md",
  mark,
  withText = true,
  label = "Commerce OS",
  animate = true,
  className,
  textClassName,
}: LogoProps) {
  const preset = SIZES[size];
  const markSize = mark ?? preset.mark;

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.96 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={animate ? { scale: 1.02 } : undefined}
      className={cn("flex min-w-0 select-none items-center", preset.gap, className)}
    >
      <img
        src="/commerce-os.png"
        alt={label}
        width={markSize}
        height={markSize}
        draggable={false}
        style={{ width: markSize, height: markSize }}
        className="shrink-0 rounded-md object-contain"
      />

      {withText && (
        <motion.span
          initial={animate ? { opacity: 0, x: -5 } : false}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
          className={cn(
            "truncate whitespace-nowrap font-semibold tracking-tight text-foreground",
            preset.text,
            textClassName,
          )}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}

export default Logo;
