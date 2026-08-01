import { CategoryDialog } from "@/components/modules/category/CategoryDialog"
import { getDefaultValues } from "@/components/modules/filter"
import { DataTable } from "@/components/modules/table"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/features/category/category.api"
import type { Category } from "@/types/data-types/category/category.types"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  CATEGORY_FILTER_CONFIG,
  CATEGORY_PAGE_CONFIG,
  createCategoryTableColumns,
} from "./category.config"
import { useFilter } from "@/hooks/useFilter"



export default function AllCategory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const filter = useFilter({
    defaultValues: getDefaultValues(CATEGORY_FILTER_CONFIG),
    debounceMs: { search: 300 },
    syncToUrl: true,
  })
  const queryParams = filter.queryParams

  const { data: response, isLoading } = useGetCategoriesQuery(queryParams)
  const [deleteCategory] = useDeleteCategoryMutation()

  const openCreateDialog = () => {
    setSelectedCategory(undefined)
    setIsDialogOpen(true)
  }

  const columns = useMemo(
    () =>
      createCategoryTableColumns({
        onView: (category) => console.log("View", category.id),
        onEdit: (category) => {
          setSelectedCategory(category)
          setIsDialogOpen(true)
        },
        onDelete: async (category) => {
          try {
            await deleteCategory(category.id).unwrap()
            toast.success("Category deleted")
          } catch (error) {
            toast.error("Unable to delete category")
            console.error("Unable to delete category", error)
          }
        },
      }),
    [deleteCategory],
  )

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setSelectedCategory(undefined)
  }

  return (
    <PageContainer>
      <PageHeader
        title={CATEGORY_PAGE_CONFIG.title}
        description={CATEGORY_PAGE_CONFIG.description}
        onClick={openCreateDialog}
      />
      <FilterBar filter={filter} filters={CATEGORY_FILTER_CONFIG} />
      <CategoryDialog
        category={selectedCategory}
        trigger={null}
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
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
