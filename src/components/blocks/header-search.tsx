

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeaderSearch() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Input
              autoFocus
              placeholder="Search..."
              className="h-9 w-[220px]"
              onBlur={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <XIcon className="size-4" /> : <SearchIcon className="size-4" />}
      </Button>
    </div>
  )
}