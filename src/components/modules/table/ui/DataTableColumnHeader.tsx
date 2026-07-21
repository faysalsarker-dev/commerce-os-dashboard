// DataTableColumnHeader.tsx
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface Props<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

// Drop this into any column's `header` — it stays a plain label if the
// column isn't sortable, and becomes a toggle button if it is.
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: Props<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`-ml-3 h-8 gap-1.5 ${className ?? ""}`}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </Button>
  )
}
