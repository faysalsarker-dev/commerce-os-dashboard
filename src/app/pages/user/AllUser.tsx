import { getDefaultValues } from "@/components/modules/filter"
import { DataTable } from "@/components/modules/table"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { useFilter } from "@/hooks/useFilter"
import { useGetUsersQuery } from "@/redux/features/user/user.api"
import { useMemo } from "react"
import { useNavigate } from "react-router"
import {
  USER_FILTER_CONFIG,
  USER_PAGE_CONFIG,
  createUserTableColumns,
} from "./user.config"

export default function AllUser() {
  const navigate = useNavigate()
  const columns = useMemo(
    () =>
      createUserTableColumns({
        onOpen: (user) => navigate(`/app/users/${user.id}`),
      }),
    [navigate],
  )
  const filter = useFilter({
    defaultValues: getDefaultValues(USER_FILTER_CONFIG),
    debounceMs: { search: 300 },
    syncToUrl: true,
  })
  const { data: response, isLoading } = useGetUsersQuery(filter.queryParams)

  return (
    <PageContainer>
      <PageHeader
        title={USER_PAGE_CONFIG.title}
        description={USER_PAGE_CONFIG.description}
        onClick={() => navigate("/app/users/create")}
      />
      <FilterBar filter={filter} filters={USER_FILTER_CONFIG} />
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

