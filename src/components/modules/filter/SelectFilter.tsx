import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SelectFilterConfig } from "@/types/filter/filter.types"


// Radix Select doesn't allow an item with value="" (used to represent "no filter"),
// so we map that state to this sentinel internally and translate back on change.
const CLEAR_VALUE = "__all__"

interface Props {
  config: SelectFilterConfig
  value: string
  onChange: (value: string) => void
}

export function SelectFilter({ config, value, onChange }: Props) {
  // Base UI Select displays the raw value unless it receives an item label map.
  // Keeping the value as the API-friendly identifier while passing `items` makes
  // the trigger display the human-readable option label.
  const items = [
    { value: CLEAR_VALUE, label: config.placeholder ?? config.label ?? "All" },
    ...config.options.map(({ value, label }) => ({ value, label })),
  ]

  return (
    <Select
      value={value || CLEAR_VALUE}
      items={items}
      onValueChange={(next) =>
  onChange(next == null || next === CLEAR_VALUE ? "" : next)
}
    >
      <SelectTrigger className={`h-10 min-w-40 ${config.className ?? ""}`}>
        <SelectValue placeholder={config.placeholder ?? config.label ?? "All"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CLEAR_VALUE}>{config.placeholder ?? config.label ?? "All"}</SelectItem>
        {config.options.map((opt) => (
          <SelectItem key={opt.label} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
