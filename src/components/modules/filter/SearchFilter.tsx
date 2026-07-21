import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SearchFilterConfig } from "@/types/filter/filter.types"

interface Props {
  config: SearchFilterConfig
  value: string
  onChange: (value: string) => void
}

export function SearchFilter({ config, value, onChange }: Props) {
  return (
    <div className={`relative min-w-[220px] flex-1 ${config.className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder ?? config.label ?? "Search..."}
        className="h-10 pl-9 pr-8"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  )
}
