import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type PageContainerProps = ComponentProps<typeof motion.main>

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-4 bg-background min-w-full",
        "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.main>
  )
}