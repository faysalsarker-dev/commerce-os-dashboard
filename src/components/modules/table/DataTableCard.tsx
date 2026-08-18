/**
 * DataTableCard.tsx
 *
 * Mobile card renderer for the DataTable.
 * Auto-derives layout from existing TanStack column metadata:
 *   - `image`  column → thumbnail (card header, left)
 *   - first `text` column → title (card header, bold)
 *   - `actions` column → ⋯ menu (card header, right)
 *   - all other data columns → label / value detail rows
 *
 * Uses the same `flexRender` pipeline as the table, so every formatter,
 * custom renderer, StatusBadge, Avatar, currency formatter, etc. works
 * identically — zero duplication.
 */

import type { Row, Column } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------- */
/* Types                                                                  */
/* --------------------------------------------------------------------- */

interface DataTableCardProps<TData> {
  rows: Row<TData>[]
  columns: Column<TData, unknown>[]
  isLoading: boolean
  loadingCount: number
  onRowClick?: (row: TData) => void
}

/* --------------------------------------------------------------------- */
/* Column categorization                                                  */
/* --------------------------------------------------------------------- */

interface CategorizedColumns<TData> {
  imageCol: Column<TData, unknown> | null
  titleCol: Column<TData, unknown> | null
  actionsCol: Column<TData, unknown> | null
  detailCols: Column<TData, unknown>[]
}

function categorizeColumns<TData>(
  columns: Column<TData, unknown>[]
): CategorizedColumns<TData> {
  let imageCol: Column<TData, unknown> | null = null
  let titleCol: Column<TData, unknown> | null = null
  let actionsCol: Column<TData, unknown> | null = null
  const detailCols: Column<TData, unknown>[] = []

  for (const col of columns) {
    const colType = col.columnDef.meta?.columnType

    if (col.id === "actions") {
      actionsCol = col
    } else if (colType === "image" && !imageCol) {
      imageCol = col
    } else if (colType === "text" && !titleCol) {
      titleCol = col
    } else {
      detailCols.push(col)
    }
  }

  return { imageCol, titleCol, actionsCol, detailCols }
}

/* --------------------------------------------------------------------- */
/* Skeleton card (loading state)                                          */
/* --------------------------------------------------------------------- */

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm ring-1 ring-black/2",
        "animate-pulse"
      )}
    >
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        {/* Image placeholder */}
        {index % 2 === 0 && (
          <Skeleton className="size-11 shrink-0 rounded-lg" />
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/5 rounded-full" />
          <Skeleton className="h-3 w-2/5 rounded-full" />
        </div>
        <Skeleton className="size-8 shrink-0 rounded-lg" />
      </div>

      {/* Detail rows skeleton */}
      <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
        {Array.from({ length: 3 }).map((_, j) => (
          <div key={j} className="flex items-center justify-between gap-4">
            <Skeleton
              className={`h-3 rounded-full ${
                ["w-20", "w-24", "w-16"][j % 3]
              }`}
            />
            <Skeleton
              className={`h-3 rounded-full ${
                ["w-28", "w-20", "w-24"][j % 3]
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------- */
/* DataTableCard                                                          */
/* --------------------------------------------------------------------- */

export function DataTableCard<TData>({
  rows,
  columns,
  isLoading,
  loadingCount,
  onRowClick,
}: DataTableCardProps<TData>) {
  const { imageCol, titleCol, actionsCol, detailCols } =
    categorizeColumns(columns)

  /* ---- Loading ---- */
  if (isLoading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-card-${i}`} index={i} />
        ))}
      </div>
    )
  }

  /* ---- Empty ---- */
  if (rows.length === 0) return null // parent renders EmptyState

  /* ---- Cards ---- */
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <div className="grid gap-3">
        {rows.map((row) => {
          const cells = row.getVisibleCells()

          // Find matching cells for each category
          const imageCell = imageCol
            ? cells.find((c) => c.column.id === imageCol.id)
            : null
          const titleCell = titleCol
            ? cells.find((c) => c.column.id === titleCol.id)
            : null
          const actionsCell = actionsCol
            ? cells.find((c) => c.column.id === actionsCol.id)
            : null
          const detailCells = cells.filter((c) =>
            detailCols.some((dc) => dc.id === c.column.id)
          )

          return (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => onRowClick?.(row.original)}
              className={cn(
                "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ring-black/2",
                "transition-all hover:border-border hover:shadow-md",
                onRowClick && "cursor-pointer active:scale-[0.99]"
              )}
            >
              {/* ---- Card Header: Image + Title + Actions ---- */}
              <div className="flex items-center gap-3 p-4 pb-0">
                {/* Image thumbnail */}
                {imageCell && (
                  <div className="shrink-0">
                    {flexRender(
                      imageCell.column.columnDef.cell,
                      imageCell.getContext()
                    )}
                  </div>
                )}

                {/* Title */}
                <div className="min-w-0 flex-1">
                  {titleCell && (
                    <div className="truncate text-sm font-semibold text-foreground">
                      {flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext()
                      )}
                    </div>
                  )}
                </div>

                {/* Actions menu */}
                {actionsCell && (
                  <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {flexRender(
                      actionsCell.column.columnDef.cell,
                      actionsCell.getContext()
                    )}
                  </div>
                )}
              </div>

              {/* ---- Card Body: Detail rows ---- */}
              {detailCells.length > 0 && (
                <div className="mt-3 space-y-0 border-t border-border/40 px-4 pt-0">
                  {detailCells.map((cell) => {
                    const label =
                      cell.column.columnDef.meta?.label ?? cell.column.id

                    return (
                      <div
                        key={cell.id}
                        className="flex items-center justify-between gap-3 border-b border-border/30 py-2.5 last:border-b-0"
                      >
                        <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          {label}
                        </span>
                        <div className="min-w-0 text-right text-sm font-medium text-foreground/90">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </AnimatePresence>
  )
}
