import { Input } from "@/components/ui"
import type { NumberRangeFilterConfig } from "@/types/filter/filter.types"

interface NumberRangeValue {
  min?: number | string
  max?: number | string
}

interface Props {
  config: NumberRangeFilterConfig
  value: NumberRangeValue
  onChange: (value: NumberRangeValue) => void
}

export function NumberRangeFilter({ config, value, onChange }: Props) {
  const current = value ?? {}
  const prefix = config.prefix

  return (
   <div
      className={`flex h-10 items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 px-3 transition-colors focus-within:bg-background ${config.className ?? ""}`}
    >
      {config.label && (
        <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {config.label}
        </span>
      )}

      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <Input
          type="number"
          min={config.min}
          max={config.max}
          step={config.step ?? 1}
          value={current.min ?? ""}
          onChange={(e) => onChange({ ...current, min: e.target.value })}
          placeholder="Min"
          className="h-8 w-16 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <span className="text-muted-foreground/60">–</span>

      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <Input
          type="number"
          min={config.min}
          max={config.max}
          step={config.step ?? 1}
          value={current.max ?? ""}
          onChange={(e) => onChange({ ...current, max: e.target.value })}
          placeholder="Max"
          className="h-8 w-16 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}

