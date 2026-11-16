import { useMemo, useState } from "react"
import { CircleDollarSign, Plus, UsersRound, Wallet } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/modules/table"
import { CustomerFormDialog } from "@/components/modules/customer/CustomerFormDialog"
import { getDefaultValues, useFilter } from "@/components/modules/filter"
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common"
import { useCreateCustomerMutation, useGetCustomersQuery } from "@/redux/features/customer/customer.api"
import type { CustomerFormValues } from "@/types/data-types/customer/customer.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { getErrorMessage, handleAsyncMutation } from "@/utils/asyncHandler"
import {
  createCustomerTableColumns,
  CUSTOMER_FILTER_CONFIG,
  CUSTOMER_PAGE_CONFIG,
  CUSTOMER_PAGE_SIZE,
  CUSTOMER_SORT_OPTIONS,
} from "./customer.config"

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: typeof UsersRound
}) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

export default function CustomerManagementPage() {
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createCustomer, createState] = useCreateCustomerMutation()
  const filter = useFilter({
    defaultValues: getDefaultValues(CUSTOMER_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
    pageSize: CUSTOMER_PAGE_SIZE,
  })
  const queryParams = useMemo(() => {
    const selectedSort = filter.values.sort ?? CUSTOMER_SORT_OPTIONS[0].value
    const isDescending = selectedSort.startsWith("-")

    return {
      ...filter.queryParams,
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? ("desc" as const) : ("asc" as const),
    }
  }, [filter.queryParams, filter.values.sort])
  const { data: response, isLoading, isFetching, error } = useGetCustomersQuery(
    queryParams,
  )
  const customers = response?.data ?? []
  const totalCustomers = response?.meta?.total ?? customers.length
  const currentPageSpend = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const currentPageDue = customers.reduce((sum, customer) => sum + customer.totalDue, 0)

  const columns = useMemo(
    () =>
      createCustomerTableColumns({
        onOpen: (customer) => navigate(`/app/customers/${customer.id}`),
      }),
    [navigate],
  )

  const handleCreate = async (values: CustomerFormValues) => {
    await handleAsyncMutation(
      () => createCustomer({ name: values.name, phone: values.phone }).unwrap(),
      {
        successMessage: "Customer created",
        errorMessage: "Unable to create customer",
        errorDescription: "Please check the customer details and try again.",
        onSuccess: (result) => {
          setIsCreateOpen(false)
          navigate(`/app/customers/${result.data.id}`)
        },
      },
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title={CUSTOMER_PAGE_CONFIG.title}
        description={CUSTOMER_PAGE_CONFIG.description}
        noAction
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="h-10 gap-2 rounded-xl">
            <Plus className="size-4" />
            Add customer
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total customers"
          value={totalCustomers.toLocaleString()}
          detail="Matching your current search"
          icon={UsersRound}
        />
        <SummaryCard
          label="Lifetime spend"
          value={formatCurrency(currentPageSpend)}
          detail="Customers on this page"
          icon={CircleDollarSign}
        />
        <SummaryCard
          label="Outstanding balance"
          value={formatCurrency(currentPageDue)}
          detail="Customers on this page"
          icon={Wallet}
        />
      </section>

      <FilterBar filter={filter} filters={CUSTOMER_FILTER_CONFIG} />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
        >
          Customers could not be loaded: {getErrorMessage(error, "Please refresh the page and try again.")}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading || isFetching}
          getRowId={(customer) => customer.id}
          pagination={filter.tableState}
          onPaginationChange={filter.onTableStateChange}
          meta={response?.meta}
        />
      )}

      <CustomerFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add customer"
        description="Add a customer profile to keep their orders and refunds together."
        submitLabel="Create customer"
        isSaving={createState.isLoading}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
