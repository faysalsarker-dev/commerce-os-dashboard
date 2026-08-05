import { ChevronDown } from "lucide-react"
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
          className={`h-10 min-w-[160px] justify-between font-normal ${config.className ?? ""}`}
        >
          <span className={selected.length === 0 ? "text-muted-foreground" : ""}>{label}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      }/>
      
    
      <PopoverContent align="start" className="w-56 p-1">
        <div className="max-h-60 overflow-y-auto">
          {config.options.map((opt) => (
            <Label
              key={opt.label}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal hover:bg-accent"
            >
          <Checkbox
  checked={selected.includes(opt.value as string)}
  onCheckedChange={() => toggle(opt.value as string)}
/>
              {opt.label}
            </Label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
