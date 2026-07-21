// ProductsPage.tsx
//
// Ties the two packages together:
//  - FilterBar / useFilter (from ../../filter-bar) own filter state, sort, and pagination
//  - DataTable (this package) owns rendering, column visibility, and the pagination widget
// DataTable never imports Redux; useFilter never imports TanStack Table. Only this
// page file knows both exist.

import { useMemo } from "react"
import type { SortingState } from "@tanstack/react-table"
import {
  FilterBar,
  useFilter,
  search,
  select,
  multiSelect,
  dateRange,
  numberRange,
  getDefaultValues,
} from "../../filter-bar"
import { DataTable } from ".."
import { useGetProductsQuery } from "../../filter-bar/example/api/productsApi"
import { getProductColumns } from "./columns"

const statusOptions = [
  { label: "Active", value: "active", default: true },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
]

const categoryOptions = [
  { label: "Electronics", value: "electronics" },
  { label: "Groceries", value: "groceries" },
  { label: "Apparel", value: "apparel" },
]

const brandOptions = [
  { label: "Acme", value: "acme" },
  { label: "Globex", value: "globex" },
  { label: "Initech", value: "initech" },
]

const productFilters = [
  search({ name: "search", label: "Search", placeholder: "Search by name or SKU..." }),
  select({ name: "status", label: "Status", placeholder: "Status", options: statusOptions }),
  select({ name: "category", label: "Category", placeholder: "Category", options: categoryOptions }),
  multiSelect({ name: "brand", label: "Brand", placeholder: "Brand", options: brandOptions }),
  numberRange({ name: "price", label: "Price", min: 0, step: 1, prefix: "$" }),
  dateRange({ name: "createdAt", label: "Created" }),
]

export default function ProductsPage() {
  const filter = useFilter({
    defaultValues: getDefaultValues(productFilters),
    debounceMs: { search: 300 },
    syncToUrl: true,
    pageSize: 10,
    defaultSort: "-createdAt",
  })

  const { data, isLoading, isFetching } = useGetProductsQuery(filter.queryParams)

  // Bridge useFilter's single "-field" sort string to TanStack's SortingState, so
  // clicking a column header and using a separate "Sort by" control (if you add
  // one) both stay in sync with the same underlying value.
  const sorting: SortingState = useMemo(() => {
    if (!filter.sort) return []
    const desc = filter.sort.startsWith("-")
    return [{ id: desc ? filter.sort.slice(1) : filter.sort, desc }]
  }, [filter.sort])

  function handleSortingChange(updater: SortingState | ((old: SortingState) => SortingState)) {
    const next = typeof updater === "function" ? updater(sorting) : updater
    const first = next[0]
    filter.setSort(first ? (first.desc ? `-${first.id}` : first.id) : "-createdAt")
  }

  const columns = useMemo(
    () =>
      getProductColumns(
        (product) => console.log("edit", product.id),
        (product) => console.log("delete", product.id)
      ),
    []
  )

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${data?.total ?? 0} product${data?.total === 1 ? "" : "s"}`}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        getRowId={(product) => product.id}
        toolbar={<FilterBar filter={filter} filters={productFilters} />}
        emptyState="No products match these filters."
        // --- server-side pagination: DataTable only ever sees "this page's rows" ---
        manualPagination
        rowCount={data?.total ?? 0}
        pagination={{ pageIndex: filter.page - 1, pageSize: filter.pageSize }}
        onPaginationChange={(updater) => {
          const current = { pageIndex: filter.page - 1, pageSize: filter.pageSize }
          const next = typeof updater === "function" ? updater(current) : updater
          if (next.pageSize !== filter.pageSize) filter.setPageSize(next.pageSize)
          else filter.setPage(next.pageIndex + 1)
        }}
        // --- server-side sorting: bridged to useFilter's single sort string ---
        manualSorting
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  )
}

// Everything below is intentionally untouched by this wiring:
//  - Adding a column: one entry in columns.tsx.
//  - Adding a filter: one entry in productFilters above.
//  - Both compose through props; DataTable and FilterBar never know about each other.
