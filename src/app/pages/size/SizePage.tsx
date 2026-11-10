import { useMemo, useState } from "react";
import { SizeDialog } from "@/components/modules/size/SizeDialog";
import { getDefaultValues } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common";
import {
  useDeleteSizeMutation,
  useGetSizesQuery,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  SIZE_FILTER_CONFIG,
  SIZE_PAGE_CONFIG,
  createSizeTableColumns,
} from "./size.config";
import { useFilter } from "@/hooks/useFilter";

export default function SizePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filter = useFilter({
    defaultValues: getDefaultValues(SIZE_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  });

  const queryParams = filter.queryParams;
  const { data: response, isLoading } = useGetSizesQuery(queryParams);
  const [deleteSize] = useDeleteSizeMutation();

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      createSizeTableColumns({
        onDelete: (size) =>
          handleAsyncMutation(() => deleteSize(size.id).unwrap(), {
            successMessage: "Size deleted",
            successDescription: `Size "${size.size}" has been successfully deleted.`,
            errorMessage: "Unable to delete size",
            errorDescription: "An error occurred while deleting the size.",
          }),
      }),
    [deleteSize]
  );

  return (
    <PageContainer>
      <PageHeader
        title={SIZE_PAGE_CONFIG.title}
        description={SIZE_PAGE_CONFIG.description}
        onClick={openCreateDialog}
      />
      <FilterBar filter={filter} filters={SIZE_FILTER_CONFIG} />
      <SizeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
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

