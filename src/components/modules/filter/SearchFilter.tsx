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
   <div className={`group relative min-w-55 flex-1 ${config.className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder ?? config.label ?? "Search..."}
        className="h-10 rounded-xl border-border/60 bg-muted/40 pl-10 pr-9 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:bg-background"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </Button>
      ) : null}
    </div>
  )
}
