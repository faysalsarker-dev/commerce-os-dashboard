import "@tanstack/react-table"
import type { ColumnDef, OnChangeFn, PaginationState, SortingState, VisibilityState } from "@tanstack/react-table"
import type { ReactNode } from "react"


declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string
    className?: string
  }
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  getRowId?: (row: TData, index: number) => string

  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  manualSorting?: boolean

  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  manualPagination?: boolean
  /** Server pagination meta — replaces manual rowCount/pageCount math when provided. */
  meta?: PaginationMeta
  pageSizeOptions?: number[]

  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  defaultColumnVisibility?: VisibilityState
  enableColumnVisibility?: boolean

  toolbar?: ReactNode
  emptyState?: ReactNode
  onRowClick?: (row: TData) => void
  className?: string
}