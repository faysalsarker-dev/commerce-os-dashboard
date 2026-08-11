import type { DateRangeFilterConfig } from "@/types/filter/filter.types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


interface DateRangeValue {
  from?: string
  to?: string
}

interface Props {
  config: DateRangeFilterConfig
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

// Stored as plain "yyyy-MM-dd" strings (URL/query-string friendly) and only
// converted to Date objects at the edge, for the Calendar widget.
function toDate(s?: string) {
  return s ? new Date(`${s}T00:00:00`) : undefined
}

export function DateRangeFilter({ config, value, onChange }: Props) {
  const current = value ?? {}
  const range = { from: toDate(current.from), to: toDate(current.to) }

  const label =
    range.from && range.to
      ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
      : range.from
      ? `${format(range.from, "MMM d, yyyy")} – ...`
      : config.placeholder ?? config.label ?? "Pick a date range"

  return (
      <Popover>
      <PopoverTrigger render={
        <Button
          type="button"
          variant="outline"
          className={`h-10 min-w-60 justify-start gap-2 rounded-xl border-border/60 bg-muted/40 font-normal shadow-none transition-colors hover:bg-muted/70 data-[state=open]:bg-background ${config.className ?? ""}`}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className={`truncate ${!range.from ? "text-muted-foreground" : "font-medium"}`}>
            {label}
          </span>
        </Button>
      } />

      <PopoverContent className="w-auto overflow-hidden rounded-xl p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={range.from}
          numberOfMonths={2}
          onSelect={(next) =>
            onChange({
              from: next?.from ? format(next.from, "yyyy-MM-dd") : undefined,
              to: next?.to ? format(next.to, "yyyy-MM-dd") : undefined,
            })
          }
        />
        {(current.from || current.to) && (
          <div className="border-t border-border/60 bg-muted/30 p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full rounded-lg text-muted-foreground hover:text-destructive"
              onClick={() => onChange({ from: undefined, to: undefined })}
            >
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
