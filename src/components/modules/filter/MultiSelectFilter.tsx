import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import type { MultiSelectFilterConfig } from "@/types/filter/filter.types"

interface Props {
  config: MultiSelectFilterConfig
  value: string[]
  onChange: (value: string[]) => void
}

export function MultiSelectFilter({ config, value, onChange }: Props) {
  const selected = value ?? []

  function toggle(optValue: string) {
    onChange(
      selected.includes(optValue)
        ? selected.filter((v) => v !== optValue)
        : [...selected, optValue]
    )
  }

  const label =
    selected.length === 0
      ? config.placeholder ?? config.label ?? "Select"
      : selected.length === 1
      ? config.options.find((o) => o.value === selected[0])?.label ?? selected[0]
      : `${selected.length} selected`

  return (
     <Popover>
      <PopoverTrigger render={
        <Button
          type="button"
          variant="outline"
          className={`h-10 min-w-40 justify-between gap-2 rounded-xl border-border/60 bg-muted/40 font-normal shadow-none transition-colors hover:bg-muted/70 data-[state=open]:bg-background ${config.className ?? ""}`}
        >
          <span className="flex items-center gap-2 truncate">
            <span className={selected.length === 0 ? "text-muted-foreground" : "font-medium"}>
              {label}
            </span>
            {selected.length > 1 && (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {selected.length}
              </span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      }/>

      <PopoverContent align="start" className="w-60 rounded-xl p-1.5">
        <div className="max-h-60 space-y-0.5 overflow-y-auto">
          {config.options.map((opt) => {
            const isChecked = selected.includes(opt.value as string)
            return (
              <Label
                key={opt.label}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-normal transition-colors hover:bg-accent ${
                  isChecked ? "bg-accent/60 font-medium" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggle(opt.value as string)}
                />
                <span className="flex-1 truncate">{opt.label}</span>
                {isChecked && <Check className="size-3.5 shrink-0 text-primary" />}
              </Label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
