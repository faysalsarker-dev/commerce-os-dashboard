/* eslint-disable react-hooks/incompatible-library */
import type { ReactNode } from "react"
import { useState } from "react"
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import "@/types/table/table.types" 
import { DataTablePagination } from "./DataTablePagination"
import { cn } from "@/lib/utils"


const MotionRow = motion(TableRow)

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean

  /** Row identity for TanStack (defaults to row index). Use for stable row-selection/animation keys. */
  getRowId?: (row: TData, index: number) => string

  // Sorting — omit both to let the table sort client-side on its own.
  // Pass both + manualSorting to hand sorting off to your API.
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  manualSorting?: boolean

  // Pagination — omit pagination/onPaginationChange for internal client-side paging
  // over `data`. Pass both + manualPagination + rowCount to page server-side
  // (e.g. RTK Query) instead — `data` is then just "this page's rows".
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  manualPagination?: boolean
  /** Total row count across all pages. Required when manualPagination is true. */
  rowCount?: number
  pageSizeOptions?: number[]

  // Column visibility — omit both to manage it internally.
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  /** Seeds which columns start hidden, e.g. { sku: false }. Ignored once columnVisibility is controlled. */
  defaultColumnVisibility?: VisibilityState
  enableColumnVisibility?: boolean

  /** Rendered left of the view-options button — drop your FilterBar, a search box, bulk actions, etc. here. */
  toolbar?: ReactNode
  emptyState?: ReactNode
  onRowClick?: (row: TData) => void
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  getRowId,
  sorting: sortingProp,
  onSortingChange: onSortingChangeProp,
  manualSorting = false,
  pagination: paginationProp,
  onPaginationChange: onPaginationChangeProp,
  manualPagination = false,
  rowCount,
  pageSizeOptions = [10, 20, 50],
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange: onColumnVisibilityChangeProp,
  defaultColumnVisibility,
  emptyState,
  onRowClick,
  className,
  toolbar,
}: DataTableProps<TData, TValue>) {
  // Uncontrolled fallbacks: the table works with zero wiring out of the box,
  // and upgrades to controlled the instant a page passes its own state + setter
  // (e.g. to sync pagination to the URL or hand it off to RTK Query).
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] ?? 10,
  })
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility ?? {}
  )

  const sorting = sortingProp ?? internalSorting
  const onSortingChange = onSortingChangeProp ?? setInternalSorting
  const paginationState = paginationProp ?? internalPagination
  const onPaginationChange = onPaginationChangeProp ?? setInternalPagination
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility
  const onColumnVisibilityChange = onColumnVisibilityChangeProp ?? setInternalColumnVisibility

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, pagination: paginationState, columnVisibility },
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange,
    manualSorting,
    manualPagination,
    pageCount: manualPagination
      ? Math.max(1, Math.ceil((rowCount ?? data.length) / paginationState.pageSize))
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const currentPage = paginationState.pageIndex + 1
  const totalRows = manualPagination ? rowCount ?? data.length : data.length
  const columnCount = table.getVisibleLeafColumns().length

  return (
   <div className={cn("space-y-4", className)}>
   
{toolbar && (
  <div className="flex items-center justify-between gap-4">
    {toolbar}
  </div>
)}
      <div className="overflow-hidden rounded border bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (

<TableHead
  key={header.id}
  className={cn(
    "h-11 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
    header.column.columnDef.meta?.className
  )}
>




                  
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
             Array.from({
  length: Math.min(paginationState.pageSize, 10),
}).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton
  className={`h-4 ${
    ["w-2/3", "w-full", "w-3/4", "w-1/2"][j % 4]
  }`}
/>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-48 text-center text-muted-foreground">
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((row) => (
                  <MotionRow
                    key={row.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
  "transition-colors hover:bg-muted/40",
  onRowClick && "cursor-pointer"
)}
                  >
                    {row.getVisibleCells().map((cell) => (

                      <TableCell
  key={cell.id}
  className={cn(
    "px-4 py-3 font-medium",
    cell.column.columnDef.meta?.className
  )}
>
                      
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </MotionRow>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={currentPage}
        pageCount={pageCount}
        pageSize={paginationState.pageSize}
        totalRows={totalRows}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  )
}
