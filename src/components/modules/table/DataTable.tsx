/* eslint-disable react-hooks/incompatible-library */

import { useState } from "react"
import {
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
import type { DataTableProps } from "@/types/table/table.types"

const MotionRow = motion(TableRow)


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
  manualPagination = true,
  meta,
  pageSizeOptions = [10, 20, 50],
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange: onColumnVisibilityChangeProp,
  defaultColumnVisibility,
  emptyState,
  onRowClick,
  className,
  toolbar
}: DataTableProps<TData, TValue>) {
  // Uncontrolled fallbacks: the table works with zero wiring out of the box,
  // and upgrades to controlled the instant a page passes its own state + setter
  // (e.g. to sync pagination to the URL or hand it off to RTK Query).
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] ?? 10,
  })
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility ?? {})

  const sorting = sortingProp ?? internalSorting
  const onSortingChange = onSortingChangeProp ?? setInternalSorting
  const paginationState = paginationProp ?? internalPagination
  const onPaginationChange = onPaginationChangeProp ?? setInternalPagination
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility
  const onColumnVisibilityChange =
    onColumnVisibilityChangeProp ?? setInternalColumnVisibility

  // meta.totalPages is authoritative when the server provides it — no need to
  // recompute from total/limit, and it stays correct even if the server rounds
  // or applies rules our own Math.ceil wouldn't know about.
  const derivedPageCount = manualPagination
    ? (meta?.totalPages ??
        Math.max(1, Math.ceil((meta?.total ?? data.length) / paginationState.pageSize)))
    : undefined

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
    pageCount: derivedPageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const currentPage = paginationState.pageIndex + 1
  const totalRows = manualPagination ? (meta?.total ?? data.length) : data.length
  const columnCount = table.getVisibleLeafColumns().length


  return (
    <div className={cn("space-y-4", className)}>
      {toolbar && (
        <div className="flex items-center justify-between gap-4">{toolbar}</div>
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
                      "h-11 px-4 text-xs font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase",
                      header.column.columnDef.meta?.className
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                <TableCell
                  colSpan={columnCount}
                  className="h-48 text-center text-muted-foreground"
                >
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
