import {
  getDefaultValues,
  useFilter,
} from "@/components/modules/filter"
import { DataTable } from "@/components/modules/table"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { EntityFormDialog } from "@/components/modules/form/EntityFormDialog"

import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "@/redux/features/product/product.api"
import {
  PRODUCT_FILTER_CONFIG,
  PRODUCT_PAGE_CONFIG,
  PRODUCT_SORT_OPTIONS,
  createProductTableColumns,
} from "./product.config"
import { productFormConfig } from "@/components/modules/Products/Product.config"
import { productSchema } from "@/types/validations/product/product"

export default function AllProduct() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [createProduct] = useCreateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const navigate = useNavigate()
  const columns = useMemo(
    () =>
      createProductTableColumns({
        onOpen: (product) => navigate(`/products/${product.id}`),
        onDelete: (product) => {
          void deleteProduct({ id: product.id })
        },
      }),
    [deleteProduct, navigate],
  )

  const filter = useFilter({
    defaultValues: getDefaultValues(PRODUCT_FILTER_CONFIG),
    debounceMs: { search: 300 },
    syncToUrl: true,
    pageSize: 10,
  })
  const queryParams = useMemo(() => {
    const { sort, ...filters } = filter.queryParams
    const selectedSort = sort ?? PRODUCT_SORT_OPTIONS[0].value
    const status = filter.debouncedValues.status
    const isDescending = selectedSort.startsWith("-")

    return {
      ...filters,
      ...(status ? { status } : {}),
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? ("desc" as const) : ("asc" as const),
    }
  }, [filter.debouncedValues.status, filter.queryParams])

  const { data: response, isLoading } = useGetProductsQuery(queryParams)

  return (
    <PageContainer>
      <PageHeader
        title={PRODUCT_PAGE_CONFIG.title}
        description={PRODUCT_PAGE_CONFIG.description}
        onClick={() => setIsCreateDialogOpen(true)}
      />

      <EntityFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title={PRODUCT_PAGE_CONFIG.createDialog.title}
        description={PRODUCT_PAGE_CONFIG.createDialog.description}
        schema={productSchema}
        config={productFormConfig}
        submitLabel={PRODUCT_PAGE_CONFIG.createDialog.submitLabel}
        onSubmit={(data) => createProduct(data).unwrap()}
      />

      <FilterBar filter={filter} filters={PRODUCT_FILTER_CONFIG} />
      <DataTable
        columns={columns}
        data={response?.data ?? []}
        isLoading={isLoading}
        pagination={filter.tableState}
        onPaginationChange={filter.onTableStateChange}
        meta={response?.meta}
      />
    </PageContainer>
  )
}
