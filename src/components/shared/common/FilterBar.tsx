/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react"
import type { ComponentType } from "react"
import { Button , Badge } from "@/components/ui"
import type { FilterConfig, FilterValues, UseFilterReturn } from "@/types/filter/filter.types"
import { DateRangeFilter, MultiSelectFilter, NumberRangeFilter, SearchFilter, SelectFilter } from "@/components/modules/filter"



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
  if (Array.isArray(rawValue)) return rawValue.join(", ")

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
    <div className={`flex flex-col gap-2 ${className ?? ""} bg-card border rounded p-4 shadow`}>
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

        {hasFilters && (
          <Button type="button" variant="ghost" onClick={reset} className="h-10 text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      {showActiveChips && hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilterKeys.map((key) => {
            const config = filters.find((f) => f.name === key)
            const displayValue = formatChipValue(config, values[key])
            if (!displayValue) return null
            return (
              <Badge
                key={String(key)}
                variant="secondary"
                className="gap-1 py-1 pl-2.5 pr-1.5 font-medium"
              >
                {config?.label ?? config?.name ?? String(key)}: {displayValue}
                <Button
                  type="button"
                  onClick={() => remove(key)}
                  className="rounded-full p-0.5 hover:bg-black/10"
                  aria-label={`Remove ${String(key)} filter`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}