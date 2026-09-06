import { motion } from "framer-motion"
import { CheckCircle, Check, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChecklistItem {
  label: string
  completed: boolean
}

export interface ChecklistData {
  items: ChecklistItem[]
  completedCount: number
  total: number
  percent: number
}

interface ReadinessChecklistProps {
  checklist: ChecklistData
}

export function ReadinessChecklist({ checklist }: ReadinessChecklistProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border bg-card p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <CheckCircle className="size-4 text-primary" />
          Readiness Checklist
        </h4>
        <span className="text-xs font-semibold text-primary">
          {checklist.completedCount}/{checklist.total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${checklist.percent}%` }}
        />
      </div>

      <div className="space-y-2 pt-1">
        {checklist.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs">
            <div
              className={cn(
                "size-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                item.completed
                  ? "bg-emerald-500 text-white"
                  : "border border-border text-muted-foreground/40 bg-muted/30"
              )}
            >
              {item.completed && <Check className="size-2.5 stroke-[3]" />}
            </div>
            <span
              className={cn(
                "transition-colors",
                item.completed
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick tip box */}
      <div className="p-3 rounded-lg bg-muted/40 border text-[11px] text-muted-foreground leading-relaxed space-y-1">
        <p className="font-semibold text-foreground flex items-center gap-1">
          <HelpCircle className="size-3 text-primary" />
          Immediate Access
        </p>
        <p>
          Once created, this team member will immediately be capable of signing in with their assigned email and password based on their granted role privileges.
        </p>
      </div>
    </motion.div>
  )
}
