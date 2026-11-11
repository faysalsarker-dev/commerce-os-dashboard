import { useMemo, useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpRight, CircleDollarSign, Plus, UsersRound, Wallet } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/modules/table"
import { CustomerFormDialog } from "@/components/modules/customer/CustomerFormDialog"
import { getDefaultValues, search, useFilter } from "@/components/modules/filter"
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common"
import { useCreateCustomerMutation, useGetCustomersQuery } from "@/redux/features/customer/customer.api"
import type { Customer, CustomerFormValues } from "@/types/data-types/customer/customer.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate, initialsFrom } from "@/lib/format"
import { getErrorMessage, handleAsyncMutation } from "@/utils/asyncHandler"

const CUSTOMER_FILTERS = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search customers by name or phone...",
  }),
]

const column = createColumnHelper<Customer>()

function CustomerAvatar({ name }: { name: string }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
      {initialsFrom(name) || "C"}
    </span>
  )
}

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
    defaultValues: getDefaultValues(CUSTOMER_FILTERS),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  })
  const { data: response, isLoading, isFetching, error } = useGetCustomersQuery(
    filter.queryParams,
  )
  const customers = response?.data ?? []
  const totalCustomers = response?.meta?.total ?? customers.length
  const currentPageSpend = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const currentPageDue = customers.reduce((sum, customer) => sum + customer.totalDue, 0)

  const columns = useMemo(
    () => [
      column.display({
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex min-w-52 items-center gap-3">
            <CustomerAvatar name={row.original.name} />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{row.original.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Added {formatDate(row.original.createdAt)}
              </p>
            </div>
          </div>
        ),
      }),
      column.accessor("phone", {
        header: "Phone",
        cell: ({ getValue }) => getValue() || <span className="text-muted-foreground">Not provided</span>,
      }),
      column.accessor("totalOrders", {
        header: "Orders",
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums">{getValue()}</span>
        ),
      }),
      column.accessor("totalSpent", {
        header: "Lifetime spend",
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums">{formatCurrency(getValue())}</span>
        ),
      }),
      column.accessor("totalDue", {
        header: "Outstanding",
        cell: ({ getValue }) => (
          <span className={getValue() > 0 ? "font-medium text-amber-700 dark:text-amber-400" : "text-muted-foreground"}>
            {formatCurrency(getValue())}
          </span>
        ),
      }),
      column.accessor("lastPurchaseAt", {
        header: "Last purchase",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      column.display({
        id: "view",
        header: "",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-primary"
            onClick={() => navigate(`/app/customers/${row.original.id}`)}
          >
            View profile <ArrowUpRight className="size-3.5" />
          </Button>
        ),
      }),
    ],
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
        title="Customers"
        description="A complete view of your customer relationships, orders, and account balances."
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

      <FilterBar filter={filter} filters={CUSTOMER_FILTERS} />

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
