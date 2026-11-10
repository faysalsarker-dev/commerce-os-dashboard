import { useMemo, useState } from "react";
import { SalaryRecordDialog } from "@/components/modules/salary/SalaryRecordDialog";
import { getDefaultValues } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common";
import {
  useDeleteSalaryRecordMutation,
  useGetSalaryRecordsQuery,
} from "@/redux/hooks";
import type { SalaryRecord } from "@/types/data-types/user/salary-record.type";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  SALARY_FILTER_CONFIG,
  SALARY_PAGE_CONFIG,
  createSalaryTableColumns,
} from "./salary.config";
import { useFilter } from "@/hooks/useFilter";

export default function SalaryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord>();

  const filter = useFilter({
    defaultValues: getDefaultValues(SALARY_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  });

  const queryParams = filter.queryParams;
  const { data: response, isLoading } = useGetSalaryRecordsQuery(queryParams);
  const [deleteRecord] = useDeleteSalaryRecordMutation();

  const openCreateDialog = () => {
    setSelectedRecord(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setSelectedRecord(undefined);
  };

  const columns = useMemo(
    () =>
      createSalaryTableColumns({
        onEdit: (record) => {
          setSelectedRecord(record);
          setIsDialogOpen(true);
        },
        onDelete: (record) =>
          handleAsyncMutation(
            () => deleteRecord(record.id).unwrap(),
            {
              successMessage: "Record deleted",
              successDescription: "The salary record has been deleted.",
              errorMessage: "Unable to delete record",
              errorDescription:
                "An error occurred while deleting the salary record.",
            }
          ),
      }),
    [deleteRecord]
  );

  return (
    <PageContainer>
      <PageHeader
        title={SALARY_PAGE_CONFIG.title}
        description={SALARY_PAGE_CONFIG.description}
        onClick={openCreateDialog}
      />
      <FilterBar filter={filter} filters={SALARY_FILTER_CONFIG} />
      <SalaryRecordDialog
        record={selectedRecord}
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
