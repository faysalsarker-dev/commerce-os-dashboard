import {
  getDefaultValues,
  search,
  select,
  useFilter,
} from "@/components/modules/filter"
import { DataTable } from "@/components/modules/table"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { usePagination } from "@/hooks/usePagination"
import { EntityFormDialog } from "@/components/modules/form/EntityFormDialog"
import {
  useCreateProductMutation,
  useGetProductsQuery,
} from "@/redux/features/product/product.api"
import type { Product } from "@/types/data-types/product/product.types"
import { useMemo, useState } from "react"
import { productFormConfig, productSchema } from "./AddProduts"

const statusOptions = [
  { label: "Active", value: "active", default: true },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
]

const sortOptions = [
  { label: "Newest first", value: "-createdAt", default: true },
  { label: "Oldest first", value: "createdAt" },
  { label: "Price: low to high", value: "price" },
  { label: "Price: high to low", value: "-price" },
  { label: "Stock: low to high", value: "stock" },
]

const productFilters = [
  search({
    name: "search",
    label: "Search",
    placeholder: "Search by name or SKU...",
  }),
  select({
    name: "status",
    label: "Status",
    placeholder: "Status",
    options: statusOptions,
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: sortOptions,
  }),
]



const productColumns = createColumns<Product>({
  resource: "product",

  columns: [
    column.image("colors", {
      label: "Image",
      size: 46,
      sortable: false,
      rounded: "none",
      formatter: (_, row) => row.colors[0]?.images[0],
    }),
    column("name", { sortable: false }),

    column("category.name", {
      label: "Category",
    }),

    column.currency("costPrice", {
      label: "Cost Price",
      sortable: true,
      currency: "BDT",
    }),

    column.currency("sellingPrice", {
      label: "Selling Price",
      currency: "BDT",
    }),

    column("colors", {
      label: "Colors",
      align: "center",
      formatter: (_, row) => row.colors.length,
    }),

    column.date("createdAt"),

    column.actions([
      action.view<Product>({
        onClick: (product) => {
          console.log("View", product.id)
        },
      }),

      action.edit<Product>({
        onClick: (product) => {
          console.log("Edit", product.id)
        },
      }),

      action.delete<Product>({
        can: "delete",
        confirmTitle: "Delete Product",
        confirmDescription: "This product will be permanently deleted.",
        onClick: (product) => {
          console.log("Delete", product.id)
        },
      }),
    ]),
  ],
})

export default function AllProduct() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createProduct] = useCreateProductMutation()

  const filter = useFilter({
    // status starts on "active" because that option carries `default: true` above.
    defaultValues: getDefaultValues(productFilters),
    // Only free-text search is debounced. Dropdowns, date range, and price range
    // apply instantly since they're deliberate clicks, not keystrokes.
    debounceMs: { search: 300 },
    // Filters, sort, and page all survive refresh and back-navigation.
    syncToUrl: true,
    pageSize: 10,
  })
  const pagination = usePagination({ pageSize: 10, syncToUrl: true })

  const queryParams = useMemo(() => {
    const { sort, ...filters } = filter.queryParams
    const selectedSort = sort ?? sortOptions[0].value
    const status = filter.debouncedValues.status
    const isDescending = selectedSort.startsWith("-")

    return {
      ...filters,
      ...(status ? { status } : {}),
      ...pagination.paginationParams,
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? ("desc" as const) : ("asc" as const),
    }
  }, [
    filter.debouncedValues.status,
    filter.queryParams,
    pagination.paginationParams,
  ])

  const { data: response, isLoading } = useGetProductsQuery(queryParams)

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your products and inventory."
        onClick={() => setIsCreateDialogOpen(true)}
      />

      <EntityFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Add Product"
        description="Create the product container. You can add colors, sizes, and stock afterwards."
        schema={productSchema}
        config={productFormConfig}
        submitLabel="Create Product"
        onSubmit={(data) => createProduct(data).unwrap()}
      />

      <FilterBar filter={filter} filters={productFilters} />
      <DataTable
        columns={productColumns}
        data={response?.data ?? []}
        isLoading={isLoading}
        pagination={pagination.tableState}
        onPaginationChange={pagination.onTableStateChange}
        meta={response?.meta}
      />
    </PageContainer>
  )
}
