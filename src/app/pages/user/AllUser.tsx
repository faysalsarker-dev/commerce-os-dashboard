import { getDefaultValues } from "@/components/modules/filter"
import { EntityFormDialog } from "@/components/modules/form/EntityFormDialog"
import { DataTable } from "@/components/modules/table"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { useFilter } from "@/hooks/useFilter"
import {
  useCreateUserMutation,
  useGetUsersQuery,
} from "@/redux/features/user/user.api"
import {
  USER_FORM_DEFAULT_VALUES,
  userFormSchema,
} from "@/types/validations/user/user.validation"
import { useState } from "react"
import { buildFormData } from "@/utils/buildFormData"
import {
  USER_FILTER_CONFIG,
  USER_PAGE_CONFIG,
  USER_TABLE_COLUMNS,
  userFormConfig,
} from "./user.config"

export default function AllUser() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createUser] = useCreateUserMutation()
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
        onClick={() => setIsCreateDialogOpen(true)}
      />
      <EntityFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title={USER_PAGE_CONFIG.createDialog.title}
        description={USER_PAGE_CONFIG.createDialog.description}
        schema={userFormSchema}
        config={userFormConfig}
        defaultValues={USER_FORM_DEFAULT_VALUES}
        submitLabel={USER_PAGE_CONFIG.createDialog.submitLabel}
        contentClassName="h-[90vh] w-[90vw] max-w-[90vw] sm:max-w-[90vw]"
        onSubmit={(data) => {
          const image = data.image[0]

          return createUser(
            buildFormData({
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role,
              status: data.status,
              phone: data.phone?.trim() || undefined,
              image,
              employeeDetail: {
                designation: data.designation?.trim() || undefined,
                joinDate: data.joinDate,
                baseSalary: data.baseSalary,
                nidNumber: data.nidNumber?.trim() || undefined,
                birthCertificateNumber:
                  data.birthCertificateNumber?.trim() || undefined,
                address: data.address?.trim() || undefined,
                emergencyContact: data.emergencyContact?.trim() || undefined,
              },
            })
          ).unwrap()
        }}
      />
      <FilterBar filter={filter} filters={USER_FILTER_CONFIG} />
      <DataTable
        columns={USER_TABLE_COLUMNS}
        data={response?.data ?? []}
        isLoading={isLoading}
        pagination={filter.tableState}
        onPaginationChange={filter.onTableStateChange}
        meta={response?.meta}
      />
    </PageContainer>
  )
}
