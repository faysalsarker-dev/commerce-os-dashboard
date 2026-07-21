/* eslint-disable @typescript-eslint/no-explicit-any */
// useFilter.ts
// Zero Redux/RTK Query imports. Fully generic — works for Products, Orders, Users, anything.
// Owns: filter values (+ per-field debounce), sort, and pagination — one hook, one source of truth.

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { FilterValues, UseFilterOptions, UseFilterReturn } from "@/types/filter/filter.types"

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

function writeUrlValues(values: FilterValues, defaultValues: FilterValues, extra: Record<string, any>) {
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
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState({}, "", url)
}

// Treats "" and undefined as equally "empty" so a numberRange/dateRange object
// like { min: "", max: "" } doesn't count as an active filter.
function isEmptyValue(v: any) {
  return v === undefined || v === null || v === ""
}

export function useFilter<T extends FilterValues>(
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
  const { defaultValues, debounceMs = {}, syncToUrl = false, pageSize = 10, defaultSort } = options

  const [values, setValuesState] = useState<T>(() =>
    syncToUrl ? readUrlValues(defaultValues) : defaultValues
  )
  const [debouncedValues, setDebouncedValues] = useState<T>(values)
  const [page, setPageState] = useState(1)
  const [sort, setSortState] = useState<string | undefined>(defaultSort)

  const timers = useRef<Partial<Record<keyof T, ReturnType<typeof setTimeout>>>>({})

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
    (nextValues: FilterValues, nextSort?: string, nextPage?: number) => {
      if (!syncToUrl) return
      writeUrlValues(nextValues, defaultValues, { sort: nextSort, page: nextPage === 1 ? undefined : nextPage })
    },
    [syncToUrl, defaultValues]
  )

  // Any real filter change snaps the user back to page 1 — a narrowed result set
  // shouldn't leave them stranded on a page that no longer exists.
  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValuesState((prev) => {
        const next = { ...prev, [name]: value }
        persistUrl(next, sort, 1)
        return next
      })
      applyDebounced(name, value)
      setPageState(1)
    },
    [applyDebounced, persistUrl, sort]
  )

  const setValues = useCallback(
    (partial: Partial<T>) => {
      setValuesState((prev) => {
        const next = { ...prev, ...partial }
        persistUrl(next, sort, 1)
        return next
      })
      Object.entries(partial).forEach(([name, value]) => applyDebounced(name as keyof T, value))
      setPageState(1)
    },
    [applyDebounced, persistUrl, sort]
  )

  const reset = useCallback(() => {
    Object.values(timers.current).forEach((t) => t && clearTimeout(t))
    setValuesState(defaultValues)
    setDebouncedValues(defaultValues)
    setPageState(1)
    persistUrl(defaultValues, sort, 1)
  }, [defaultValues, persistUrl, sort])

  const remove = useCallback(
    (name: keyof T) => {
      setValue(name, defaultValues[name])
    },
    [setValue, defaultValues]
  )

  const setPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setPageState(clamped)
      persistUrl(values, sort, clamped)
    },
    [persistUrl, values, sort]
  )

  const nextPage = useCallback(() => setPage(page + 1), [setPage, page])
  const prevPage = useCallback(() => setPage(page - 1), [setPage, page])

  const setSort = useCallback(
    (value: string) => {
      setSortState(value)
      setPageState(1)
      persistUrl(values, value, 1)
    },
    [persistUrl, values]
  )

  const activeFilterKeys = useMemo(() => {
    return (Object.keys(values) as (keyof T)[]).filter((key) => {
      const current = values[key]
      const fallback = defaultValues[key]

      if (Array.isArray(current)) {
        const fb = Array.isArray(fallback) ? fallback : []
        return current.length !== fb.length || current.some((v, i) => v !== fb[i])
      }

      // numberRange ({ min, max }) and dateRange ({ from, to }) — compare key by
      // key, treating "" and undefined as the same "not set" state.
      if (current && typeof current === "object") {
        const fb = (fallback && typeof fallback === "object" ? fallback : {}) as Record<string, any>
        const keys = new Set([...Object.keys(current), ...Object.keys(fb)])
        return Array.from(keys).some((k) => {
          const cv = current[k]
          const fv = fb[k]
          if (isEmptyValue(cv) && isEmptyValue(fv)) return false
          return cv !== fv
        })
      }

      return current !== fallback
    })
  }, [values, defaultValues])

  const hasFilters = activeFilterKeys.length > 0

  const queryParams = useMemo(
    () => ({ ...debouncedValues, sort, page, pageSize }),
    [debouncedValues, sort, page, pageSize]
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
    nextPage,
    prevPage,
    sort,
    setSort,
    queryParams,
  }
}