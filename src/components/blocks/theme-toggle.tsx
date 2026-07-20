import { motion, AnimatePresence } from "framer-motion"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-8"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex"
        >
          {isDark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}