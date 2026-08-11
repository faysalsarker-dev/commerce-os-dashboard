import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  withText?: boolean;
}

export function Logo({
  className = "",
  width = 32,
  height = 32,
  alt = "Commerce OS",
  withText = false,
}: LogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-2.5 ${className}`}
    >
      <img
        src="/commerce-os.png"
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        className="shrink-0 object-contain"
      />

      {withText && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.05,
            ease: "easeOut",
          }}
          className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground"
        >
          Commerce OS
        </motion.span>
      )}
    </motion.div>
  );
}

export default Logo;