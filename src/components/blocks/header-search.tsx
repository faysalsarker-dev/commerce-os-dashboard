

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { SearchIcon, XIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export function HeaderSearch() {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className="flex items-center">
//       <AnimatePresence initial={false}>
//         {open && (
//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: 220, opacity: 1 }}
//             exit={{ width: 0, opacity: 0 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="overflow-hidden"
//           >
//             <Input
//               autoFocus
//               placeholder="Search..."
//               className="h-9 w-[220px]"
//               onBlur={() => setOpen(false)}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <Button
//         size="icon"
//         variant="ghost"
//         className="size-8"
//         onClick={() => setOpen((v) => !v)}
//       >
//         {open ? <XIcon className="size-4" /> : <SearchIcon className="size-4" />}
//       </Button>
//     </div>
//   )
// }

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HeaderSearch({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}) {
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      {/* mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl text-muted-foreground md:hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon className="size-4" />
      </Button>

      {/* desktop */}
      <motion.div
        animate={{ width: focused ? 320 : 232 }}
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
        className={cn(
          "relative hidden items-center md:flex",
          "rounded-full border border-border/70 bg-muted/40",
          focused && "border-primary/40 bg-background ring-4 ring-primary/10"
        )}
      >
        <SearchIcon className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="h-9 border-0 bg-transparent pl-10 pr-14 text-sm shadow-none focus-visible:ring-0"
        />
        <kbd className="pointer-events-none absolute right-2.5 hidden select-none rounded-md border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:block">
          ⌘K
        </kbd>
      </motion.div>
    </>
  )
}
