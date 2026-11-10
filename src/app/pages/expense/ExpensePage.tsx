import { useMemo, useState } from "react";
import { ExpenseDialog } from "@/components/modules/expense/ExpenseDialog";
import { getDefaultValues } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common";
import {
  useDeleteExpenseMutation,
  useGetExpensesQuery,
} from "@/redux/hooks";
import type { Expense } from "@/types/data-types/expense/expense.types";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  EXPENSE_FILTER_CONFIG,
  EXPENSE_PAGE_CONFIG,
  createExpenseTableColumns,
} from "./expense.config";
import { useFilter } from "@/hooks/useFilter";

export default function ExpensePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  const filter = useFilter({
    defaultValues: getDefaultValues(EXPENSE_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  });

  const queryParams = filter.queryParams;
  const { data: response, isLoading } = useGetExpensesQuery(queryParams);
  const [deleteExpense] = useDeleteExpenseMutation();

  const openCreateDialog = () => {
    setSelectedExpense(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setSelectedExpense(undefined);
  };

  const columns = useMemo(
    () =>
      createExpenseTableColumns({
        onEdit: (expense) => {
          setSelectedExpense(expense);
          setIsDialogOpen(true);
        },
        onDelete: (expense) =>
          handleAsyncMutation(
            () => deleteExpense(expense.id).unwrap(),
            {
              successMessage: "Expense deleted",
              successDescription: "The expense has been deleted.",
              errorMessage: "Unable to delete expense",
              errorDescription: "An error occurred while deleting the expense.",
            }
          ),
      }),
    [deleteExpense]
  );

  return (
    <PageContainer>
      <PageHeader
        title={EXPENSE_PAGE_CONFIG.title}
        description={EXPENSE_PAGE_CONFIG.description}
        onClick={openCreateDialog}
      />
      <FilterBar filter={filter} filters={EXPENSE_FILTER_CONFIG} />
      <ExpenseDialog
        expense={selectedExpense}
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

