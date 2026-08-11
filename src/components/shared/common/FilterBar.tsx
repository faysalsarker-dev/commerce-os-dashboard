/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react"
import type { ComponentType } from "react"
import { Button , Badge } from "@/components/ui"
import type { FilterConfig, FilterValues, UseFilterReturn } from "@/types/filter/filter.types"
import { DateRangeFilter, MultiSelectFilter, NumberRangeFilter, SearchFilter, SelectFilter } from "@/components/modules/filter"
import { AnimatePresence , motion} from "framer-motion"



// The registry is the only place that needs to change when a new filter type is added.
// FilterBar's own logic never changes.
const filterRegistry: Record<string, ComponentType<any>> = {
  search: SearchFilter,
  select: SelectFilter,
  multiSelect: MultiSelectFilter,
  dateRange: DateRangeFilter,
  numberRange: NumberRangeFilter,
}

// Chips need type-aware formatting — numberRange/dateRange values are objects
// ({ min, max } / { from, to }), and String(obj) is where "[object Object]" came from.
function formatChipValue(config: FilterConfig | undefined, rawValue: any): string {
  if (Array.isArray(rawValue)) {
    if (config?.type === "multiSelect") {
      return rawValue
        .map((value) => config.options.find((option) => option.value === value)?.label ?? value)
        .join(", ")
    }
    return rawValue.join(", ")
  }

  if (config?.type === "select") {
    return config.options.find((option) => option.value === rawValue)?.label ?? String(rawValue)
  }

  if (rawValue && typeof rawValue === "object") {
    if (config?.type === "numberRange") {
      const { min, max } = rawValue
      if (min && max) return `${min} – ${max}`
      if (min) return `≥ ${min}`
      if (max) return `≤ ${max}`
      return ""
    }
    if (config?.type === "dateRange") {
      const { from, to } = rawValue
      if (from && to) return `${from} → ${to}`
      if (from) return `From ${from}`
      if (to) return `Until ${to}`
      return ""
    }
    return ""
  }

  return String(rawValue)
}

interface FilterBarProps<T extends FilterValues> {
  filter: UseFilterReturn<T>
  filters: FilterConfig[]
  className?: string
  /** Show "Status: Active ✕" chips + a Clear all button. Default true. */
  showActiveChips?: boolean
}

export function FilterBar<T extends FilterValues>({
  filter,
  filters,
  className,
  showActiveChips = true,
}: FilterBarProps<T>) {
  const { values, setValue, remove, reset, hasFilters, activeFilterKeys } = filter

  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card p-3 shadow-sm ring-1 ring-black/2 sm:p-4 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
       

        {filters.map((config) => {
          const Component = filterRegistry[config.type]
          if (!Component) {
            console.warn(`FilterBar: no component registered for filter type "${config.type}"`)
            return null
          }
          return (
            <Component
              key={config.name}
              config={config}
              value={values[config.name]}
              onChange={(value: any) => setValue(config.name as keyof T, value)}
            />
          )
        })}

        <AnimatePresence initial={false}>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="ml-auto"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                className="h-10 gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3.5" />
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showActiveChips && hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active
          </span>
          <AnimatePresence initial={false}>
            {activeFilterKeys.map((key) => {
              const config = filters.find((f) => f.name === key)
              const displayValue = formatChipValue(config, values[key])
              if (!displayValue) return null
              return (
                <motion.div
                  key={String(key)}
                  layout
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-full border border-border/60 bg-muted/70 py-1 pl-2.5 pr-1 text-xs font-medium text-foreground"
                  >
                    <span className="text-muted-foreground">
                      {config?.label ?? config?.name ?? String(key)}:
                    </span>
                    <span className="max-w-45 truncate">{displayValue}</span>
                    <Button
                      type="button"
                      onClick={() => remove(key)}
                      className="ml-0.5 grid size-4 place-items-center rounded-full p-0 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                      aria-label={`Remove ${String(key)} filter`}
                    >
                      <X className="size-3" />
                    </Button>
                  </Badge>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

