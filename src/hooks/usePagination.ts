// usePagination.ts
import { useCallback, useMemo, useState } from "react"
import type { OnChangeFn, PaginationState } from "@tanstack/react-table"

export interface UsePaginationOptions {
  pageSize?: number
  syncToUrl?: boolean
}

export interface UsePaginationReturn {
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
  /** Flat params shaped for the API — `{ page, limit }`. */
  paginationParams: { page: number; limit: number }
  /** Same state, shaped for TanStack Table's `pagination` prop. */
  tableState: PaginationState
  /** Drop straight into TanStack Table's `onPaginationChange` prop. */
  onTableStateChange: OnChangeFn<PaginationState>
}

function readUrlPagination(defaultPageSize: number) {
  if (typeof window === "undefined") return { page: 1, pageSize: defaultPageSize }
  const params = new URLSearchParams(window.location.search)
  return {
    page: Number(params.get("page")) || 1,
    pageSize: Number(params.get("limit")) || defaultPageSize,
  }
}

function writeUrlPagination(page: number, pageSize: number, defaultPageSize: number) {
  if (typeof window === "undefined") return
  const params = new URLSearchParams(window.location.search)
  page === 1 ? params.delete("page") : params.set("page", String(page))
  pageSize === defaultPageSize ? params.delete("limit") : params.set("limit", String(pageSize))
  const query = params.toString()
  window.history.replaceState({}, "", query ? `${window.location.pathname}?${query}` : window.location.pathname)
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { pageSize: defaultPageSize = 10, syncToUrl = false } = options

  const initial = syncToUrl ? readUrlPagination(defaultPageSize) : { page: 1, pageSize: defaultPageSize }
  const [page, setPageState] = useState(initial.page)
  const [pageSize, setPageSizeState] = useState(initial.pageSize)

  const persist = useCallback(
    (p: number, s: number) => syncToUrl && writeUrlPagination(p, s, defaultPageSize),
    [syncToUrl, defaultPageSize]
  )

  const setPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setPageState(clamped)
      persist(clamped, pageSize)
    },
    [persist, pageSize]
  )

  const setPageSize = useCallback(
    (next: number) => {
      setPageSizeState(next)
      setPageState(1) // page size change resets to page 1
      persist(1, next)
    },
    [persist]
  )

  const nextPage = useCallback(() => setPage(page + 1), [setPage, page])
  const prevPage = useCallback(() => setPage(page - 1), [setPage, page])

  const reset = useCallback(() => {
    setPageState(1)
    setPageSizeState(defaultPageSize)
    persist(1, defaultPageSize)
  }, [defaultPageSize, persist])

  // TanStack is 0-indexed (pageIndex), ours is 1-indexed (page) — this is the
  // only place that translation happens, so it can't drift out of sync.
  const tableState: PaginationState = useMemo(
    () => ({ pageIndex: page - 1, pageSize }),
    [page, pageSize]
  )

  const onTableStateChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const next = typeof updater === "function" ? updater(tableState) : updater
      if (next.pageSize !== tableState.pageSize) {
        setPageSize(next.pageSize)
      } else if (next.pageIndex !== tableState.pageIndex) {
        setPage(next.pageIndex + 1)
      }
    },
    [tableState, setPageSize, setPage]
  )

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    reset,
    paginationParams: { page, limit: pageSize },
    tableState,
    onTableStateChange,
  }
}