import { useMemo, useState } from "react";
import { ExpenseCategoryDialog } from "@/components/modules/expense/ExpenseCategoryDialog";
import { getDefaultValues } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common";
import {
  useDeleteExpenseCategoryMutation,
  useGetExpenseCategoriesQuery,
} from "@/redux/hooks";
import type { ExpenseCategory } from "@/types/data-types/expense/expense.types";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  EXPENSE_CATEGORY_FILTER_CONFIG,
  EXPENSE_CATEGORY_PAGE_CONFIG,
  createExpenseCategoryTableColumns,
} from "./expense-category.config";
import { useFilter } from "@/hooks/useFilter";

export default function ExpenseCategoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>();

  const filter = useFilter({
    defaultValues: getDefaultValues(EXPENSE_CATEGORY_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  });

  const queryParams = filter.queryParams;
  const { data: response, isLoading } = useGetExpenseCategoriesQuery(queryParams);
  const [deleteCategory] = useDeleteExpenseCategoryMutation();

  const openCreateDialog = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setSelectedCategory(undefined);
  };

  const columns = useMemo(
    () =>
      createExpenseCategoryTableColumns({
        onEdit: (category) => {
          setSelectedCategory(category);
          setIsDialogOpen(true);
        },
        onDelete: (category) =>
          handleAsyncMutation(
            () => deleteCategory(category.id).unwrap(),
            {
              successMessage: "Category deleted",
              successDescription: `"${category.name}" has been deleted.`,
              errorMessage: "Unable to delete category",
              errorDescription: "An error occurred while deleting the category.",
            }
          ),
      }),
    [deleteCategory]
  );

  return (
    <PageContainer>
      <PageHeader
        title={EXPENSE_CATEGORY_PAGE_CONFIG.title}
        description={EXPENSE_CATEGORY_PAGE_CONFIG.description}
        onClick={openCreateDialog}
      />
      <FilterBar filter={filter} filters={EXPENSE_CATEGORY_FILTER_CONFIG} />
      <ExpenseCategoryDialog
        category={selectedCategory}
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        trigger={null}
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
  );
}

