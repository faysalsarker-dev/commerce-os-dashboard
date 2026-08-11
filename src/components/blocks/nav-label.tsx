
// import { motion, AnimatePresence } from "framer-motion"
// import { useSidebar } from "@/components/ui/sidebar"
// import { cn } from "@/lib/utils"

// export function NavLabel({
//   children,
//   active,
// }: {
//   children: React.ReactNode
//   active?: boolean
// }) {
//   const { state, isMobile } = useSidebar()
//   const expanded = isMobile || state === "expanded"

//   return (
//     <AnimatePresence initial={false} mode="wait">
//       {expanded && (
//         <motion.span
//           key="label"
//           initial={{ opacity: 0, x: -8 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -8 }}
//           transition={{ duration: 0.15, ease: "easeOut" }}
//           className={cn(
//             "overflow-hidden whitespace-nowrap text-sm text-black",
//             active ? "font-semibold text-primary-foreground" : "font-medium"
//           )}
//         >
//           {children}
//         </motion.span>
//       )}
//     </AnimatePresence>
//   )
// }
import { motion, AnimatePresence } from "framer-motion"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavLabel({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  const { state, isMobile } = useSidebar()
  const expanded = isMobile || state === "expanded"

  return (
    <AnimatePresence initial={false} mode="wait">
      {expanded && (
        <motion.span
          key="label"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "overflow-hidden whitespace-nowrap text-sm",
            active ? "font-semibold" : "font-medium"
          )}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
