// useFilter.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      val === undefined || val === null || val === "" ||
      (Array.isArray(val) && val.length === 0) || val === defaultValues[key]
    if (isEmpty) params.delete(key)
    else params.set(key, Array.isArray(val) ? val.join(",") : String(val))
  }
  for (const [key, val] of Object.entries(extra)) {
    if (val === undefined || val === null || val === "") params.delete(key)
    else params.set(key, String(val))
  }
  const query = params.toString()
  window.history.replaceState({}, "", query ? `${window.location.pathname}?${query}` : window.location.pathname)
}

function isEmptyValue(v: any) {
  return v === undefined || v === null || v === ""
}

// The one place that knows how a filter *value* becomes API-shaped query
// param(s). Skips anything still at its default (nothing selected), and
// flattens ranges/arrays into the flat key=value pairs a real query string needs.
function serializeValues<T extends FilterValues>(values: T, defaultValues: T): Record<string, any> {
  const out: Record<string, any> = {}

  for (const key of Object.keys(values)) {
    const current = values[key]
    const fallback = defaultValues[key]

    if (Array.isArray(current)) {
      if (current.length === 0) continue
      out[key] = current.join(",")
      continue
    }

    if (current && typeof current === "object") {
      // numberRange { min, max } or dateRange { from, to } -> flat keys.
      const entries = Object.entries(current).filter(([, v]) => !isEmptyValue(v))
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
  const { defaultValues, debounceMs = {}, syncToUrl = false, defaultSort } = options

  const [values, setValuesState] = useState<T>(() =>
    syncToUrl ? readUrlValues(defaultValues) : defaultValues
  )
  const [debouncedValues, setDebouncedValues] = useState<T>(values)
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
    (nextValues: FilterValues, nextSort?: string) => {
      if (!syncToUrl) return
      writeUrlValues(nextValues, defaultValues, { sort: nextSort })
    },
    [syncToUrl, defaultValues]
  )

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValuesState((prev) => {
        const next = { ...prev, [name]: value }
        persistUrl(next, sort)
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
        persistUrl(next, sort)
        return next
      })
      Object.entries(partial).forEach(([name, value]) => applyDebounced(name as keyof T, value))
    },
    [applyDebounced, persistUrl, sort]
  )

  const reset = useCallback(() => {
    Object.values(timers.current).forEach((t) => t && clearTimeout(t))
    setValuesState(defaultValues)
    setDebouncedValues(defaultValues)
    persistUrl(defaultValues, sort)
  }, [defaultValues, persistUrl, sort])

  const remove = useCallback(
    (name: keyof T) => setValue(name, defaultValues[name]),
    [setValue, defaultValues]
  )

  const setSort = useCallback(
    (value: string) => {
      setSortState(value)
      persistUrl(values, value)
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
      if (current && typeof current === "object") {
        const fb = (fallback && typeof fallback === "object" ? fallback : {}) as Record<string, any>
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
  const filterParams = useMemo(
    () => ({ ...serializeValues(debouncedValues, defaultValues), ...(sort ? { sort } : {}) }),
    [debouncedValues, defaultValues, sort]
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
    sort,
    setSort,
    filterParams,
  }
}