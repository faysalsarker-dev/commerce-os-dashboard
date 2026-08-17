import { useState, type FormEvent } from "react"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaleSearchProps {
  onSearch: (query: string) => void
  isSearching: boolean
}

export function SaleSearch({ onSearch, isSearching }: SaleSearchProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className="space-y-1.5" onSubmit={handleSubmit}>
      <Label htmlFor="sale-search" className="text-xs">
        Invoice number
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="sale-search"
            autoFocus
            autoComplete="off"
            placeholder="INV-20260816-47048245"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="numeric pl-9"
          />
        </div>
        <Button type="submit" disabled={!value.trim() || isSearching}>
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Search
        </Button>
      </div>
    </form>
  )
}
