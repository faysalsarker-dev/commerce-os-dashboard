// useFilter.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { OnChangeFn, PaginationState } from "@tanstack/react-table"
import type {
  FilterValues,
  UseFilterOptions,
  UseFilterReturn,
} from "@/types/filter/filter.types"

function readUrlValues<T extends FilterValues>(defaultValues: T): T {
  if (typeof window === "undefined") return defaultValues
  const params = new URLSearchParams(window.location.search)
  const result = { ...defaultValues }
  for (const key of Object.keys(defaultValues)) {
    if (params.has(key)) {
      const raw = params.get(key) as string
      ;(result as any)[key] = Array.isArray((defaultValues as any)[key])
        ? raw.split(",").filter(Boolean)
        : raw
    }
  }
  return result
}

function writeUrlValues(
  values: FilterValues,
  defaultValues: FilterValues,
  extra: Record<string, any>
) {
  if (typeof window === "undefined") return
  const params = new URLSearchParams(window.location.search)
  for (const key of Object.keys(values)) {
    const val = values[key]
    const isEmpty =
      val === undefined ||
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0) ||
      val === defaultValues[key]
    if (isEmpty) params.delete(key)
    else params.set(key, Array.isArray(val) ? val.join(",") : String(val))
  }
  for (const [key, val] of Object.entries(extra)) {
    if (val === undefined || val === null || val === "") params.delete(key)
    else params.set(key, String(val))
  }
  const query = params.toString()
  window.history.replaceState(
    {},
    "",
    query ? `${window.location.pathname}?${query}` : window.location.pathname
  )
}

function isEmptyValue(v: any) {
  return v === undefined || v === null || v === ""
}

// The one place that knows how a filter *value* becomes API-shaped query
// param(s). Skips anything still at its default (nothing selected), and
// flattens ranges/arrays into the flat key=value pairs a real query string needs.
function serializeValues<T extends FilterValues>(
  values: T,
  defaultValues: T
): Record<string, any> {
  const out: Record<string, any> = {}

  for (const key of Object.keys(values)) {
    const current = values[key]
    const fallback = defaultValues[key]

    if (Array.isArray(current)) {
      if (current.length === 0) continue
      out[key] = current.join(",")
      continue
    }

    if (key === "sort") {
      if (isEmptyValue(current) || current === fallback) continue

      const value = current as string

      out.sortBy = value.startsWith("-") ? value.slice(1) : value

      out.sortOrder = value.startsWith("-") ? "desc" : "asc"

      continue
    }

    if (current && typeof current === "object") {
      // numberRange { min, max } or dateRange { from, to } -> flat keys.
      const entries = Object.entries(current).filter(
        ([, v]) => !isEmptyValue(v)
      )
      for (const [subKey, subVal] of entries) {
        out[`${key}${subKey[0].toUpperCase()}${subKey.slice(1)}`] = subVal // priceMin, priceMax
      }
      continue
    }

    if (isEmptyValue(current) || current === fallback) continue
    out[key] = current
  }

  return out
}

export function useFilter<T extends FilterValues>(
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
const {
  defaultValues,
  syncToUrl = false,
  defaultSort,
  pageSize: defaultPageSize = 10,
} = options;

const debounceMs =
  options.debounceMs ?? ({} as Partial<Record<keyof T, number>>);

  const [values, setValuesState] = useState<T>(() =>
    syncToUrl ? readUrlValues(defaultValues) : defaultValues
  )
  const [debouncedValues, setDebouncedValues] = useState<T>(values)
  const [sort, setSortState] = useState<string | undefined>(defaultSort)
  const [page, setPageState] = useState(() =>
    syncToUrl && typeof window !== "undefined"
      ? Math.max(
          1,
          Number(new URLSearchParams(window.location.search).get("page")) || 1
        )
      : 1
  )
  const [pageSize, setPageSizeState] = useState(() =>
    syncToUrl && typeof window !== "undefined"
      ? Math.max(
          1,
          Number(new URLSearchParams(window.location.search).get("limit")) ||
            defaultPageSize
        )
      : defaultPageSize
  )

  const timers = useRef<
    Partial<Record<keyof T, ReturnType<typeof setTimeout>>>
  >({})

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => t && clearTimeout(t))
    }
  }, [])

  const applyDebounced = useCallback(
    (name: keyof T, value: any) => {
      const delay = debounceMs[name] ?? 0
      if (delay <= 0) {
        setDebouncedValues((prev) => ({ ...prev, [name]: value }))
        return
      }
      const existing = timers.current[name]
      if (existing) clearTimeout(existing)
      timers.current[name] = setTimeout(() => {
        setDebouncedValues((prev) => ({ ...prev, [name]: value }))
      }, delay)
    },
    [debounceMs]
  )

  const persistUrl = useCallback(
    (
      nextValues: FilterValues,
      nextSort = sort,
      nextPage = page,
      nextPageSize = pageSize
    ) => {
      if (!syncToUrl) return
      writeUrlValues(nextValues, defaultValues, {
        sort: nextSort,
        page: nextPage === 1 ? undefined : nextPage,
        limit: nextPageSize === defaultPageSize ? undefined : nextPageSize,
      })
    },
    [syncToUrl, defaultValues, sort, page, pageSize, defaultPageSize]
  )

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValuesState((prev) => {
        const next = { ...prev, [name]: value }
        setPageState(1)
        persistUrl(next, sort, 1)
        return next
      })
      applyDebounced(name, value)
    },
    [applyDebounced, persistUrl, sort]
  )

  const setValues = useCallback(
    (partial: Partial<T>) => {
      setValuesState((prev) => {
        const next = { ...prev, ...partial }
        setPageState(1)
        persistUrl(next, sort, 1)
        return next
      })
      Object.entries(partial).forEach(([name, value]) =>
        applyDebounced(name as keyof T, value)
      )
    },
    [applyDebounced, persistUrl, sort]
  )

  const reset = useCallback(() => {
    Object.values(timers.current).forEach((t) => t && clearTimeout(t))
    setValuesState(defaultValues)
    setDebouncedValues(defaultValues)
    setPageState(1)
    setPageSizeState(defaultPageSize)
    persistUrl(defaultValues, sort, 1, defaultPageSize)
  }, [defaultValues, defaultPageSize, persistUrl, sort])

  const remove = useCallback(
    (name: keyof T) => setValue(name, defaultValues[name]),
    [setValue, defaultValues]
  )

  const setSort = useCallback(
    (value: string) => {
      setSortState(value)
      setPageState(1)
      persistUrl(values, value, 1)
    },
    [persistUrl, values]
  )

  const setPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setPageState(clamped)
      persistUrl(values, sort, clamped)
    },
    [persistUrl, sort, values]
  )

  const setPageSize = useCallback(
    (next: number) => {
      const size = Math.max(1, next)
      setPageSizeState(size)
      setPageState(1)
      persistUrl(values, sort, 1, size)
    },
    [persistUrl, sort, values]
  )

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage])
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage])
  const tableState: PaginationState = useMemo(
    () => ({ pageIndex: page - 1, pageSize }),
    [page, pageSize]
  )
  const onTableStateChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const next = typeof updater === "function" ? updater(tableState) : updater
      if (next.pageSize !== tableState.pageSize) setPageSize(next.pageSize)
      else if (next.pageIndex !== tableState.pageIndex)
        setPage(next.pageIndex + 1)
    },
    [setPage, setPageSize, tableState]
  )

  const activeFilterKeys = useMemo(() => {
    return (Object.keys(values) as (keyof T)[]).filter((key) => {
      const current = values[key]
      const fallback = defaultValues[key]
   if (Array.isArray(current)) {
  const currentArray = current as unknown[];
  const fallbackArray = Array.isArray(fallback)
    ? (fallback as unknown[])
    : [];

  return (
    currentArray.length !== fallbackArray.length ||
    currentArray.some((v, i) => v !== fallbackArray[i])
  );
}
      if (current && typeof current === "object") {
        const fb = (
          fallback && typeof fallback === "object" ? fallback : {}
        ) as Record<string, any>
        const keys = new Set([...Object.keys(current), ...Object.keys(fb)])
        return Array.from(keys).some((k) => {
          const cv = (current as any)[k]
          const fv = fb[k]
          if (isEmptyValue(cv) && isEmptyValue(fv)) return false
          return cv !== fv
        })
      }
      return current !== fallback
    })
  }, [values, defaultValues])

  const hasFilters = activeFilterKeys.length > 0

  // Only non-empty, non-default, API-shaped params — nothing "unset" leaks in.
  const queryParams = useMemo(
    () => ({
      ...serializeValues(debouncedValues, defaultValues),
      ...(sort ? { sort } : {}),
      page,
      limit: pageSize,
    }),
    [debouncedValues, defaultValues, sort, page, pageSize]
  )

  return {
    values,
    debouncedValues,
    setValue,
    setValues,
    reset,
    remove,
    hasFilters,
    activeFilterKeys,
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    paginationParams: { page, limit: pageSize },
    tableState,
    onTableStateChange,
    sort,
    setSort,
    queryParams,
  }
}
