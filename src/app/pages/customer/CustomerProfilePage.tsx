import { useMemo, useState } from "react"
import { ArrowLeft, CalendarDays, CircleDollarSign, ClipboardList, CreditCard, Pencil, Phone, RotateCcw, ShoppingBag, UserRound } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { CustomerFormDialog } from "@/components/modules/customer/CustomerFormDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageContainer } from "@/components/shared/common"
import { useGetCustomerQuery, useUpdateCustomerMutation } from "@/redux/features/customer/customer.api"
import type { CustomerFormValues, CustomerRefund, CustomerSale } from "@/types/data-types/customer/customer.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate, initialsFrom } from "@/lib/format"
import { getErrorMessage, handleAsyncMutation } from "@/utils/asyncHandler"

function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusVariant(value: string): "default" | "secondary" | "destructive" | "outline" {
  if (["COMPLETED", "PAID"].includes(value)) return "default"
  if (["RETURNED", "CANCELLED", "UNPAID"].includes(value)) return "destructive"
  if (["PARTIAL", "PENDING", "PARTIALLY_RETURNED", "PARTIALLY_REFUNDED"].includes(value)) return "secondary"
  return "outline"
}

function ProfileStat({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string
  value: string
  icon: typeof ShoppingBag
  tone?: "primary" | "amber" | "emerald" | "violet"
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  }

  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-xl font-semibold tabular-nums">{value}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

function HistoryEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-border/70 px-5 py-8 text-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function OrdersTable({ sales }: { sales: CustomerSale[] }) {
  if (!sales.length) {
    return <HistoryEmpty title="No orders yet" description="Orders attached to this customer will appear here." />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
              <TableCell>{formatDate(sale.createdAt)}</TableCell>
              <TableCell>{sale.items.reduce((quantity, item) => quantity + item.quantity, 0)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(sale.status)}>{formatStatus(sale.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(sale.paymentStatus)}>{formatStatus(sale.paymentStatus)}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatCurrency(Number(sale.total))}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(Number(sale.dueAmount))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RefundsTable({ refunds }: { refunds: Array<CustomerRefund & { invoiceNo: string }> }) {
  if (!refunds.length) {
    return <HistoryEmpty title="No refunds" description="Refunds processed for this customer will appear here." />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Order</TableHead>
            <TableHead>Refund date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Refund amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id}>
              <TableCell className="font-medium">{refund.invoiceNo}</TableCell>
              <TableCell>{formatDate(refund.refundedAt)}</TableCell>
              <TableCell>
                {refund.items.reduce((quantity, item) => quantity + item.quantity, 0)}
              </TableCell>
              <TableCell>{formatStatus(refund.method)}</TableCell>
              <TableCell className="max-w-48 truncate">{refund.reason || "—"}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatCurrency(Number(refund.amount))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function CustomerProfilePage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { data: response, isLoading, error } = useGetCustomerQuery(id, { skip: !id })
  const [updateCustomer, updateState] = useUpdateCustomerMutation()
  const customer = response?.data

  const refunds = useMemo(
    () =>
      (customer?.sales ?? [])
        .flatMap((sale) => sale.refunds.map((refund) => ({ ...refund, invoiceNo: sale.invoiceNo })))
        .sort((left, right) => new Date(right.refundedAt).getTime() - new Date(left.refundedAt).getTime()),
    [customer?.sales],
  )
  const sales = useMemo(
    () => [...(customer?.sales ?? [])].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [customer?.sales],
  )

  const handleUpdate = async (values: CustomerFormValues) => {
    await handleAsyncMutation(
      () => updateCustomer({ id, data: { name: values.name, phone: values.phone ?? null } }).unwrap(),
      {
        successMessage: "Customer profile updated",
        errorMessage: "Unable to update customer",
        errorDescription: "Please check the details and try again.",
        onSuccess: () => setIsEditOpen(false),
      },
    )
  }

  if (isLoading) {
    return (
      <PageContainer className="mx-auto max-w-7xl">
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </PageContainer>
    )
  }

  if (error || !customer) {
    return (
      <PageContainer className="mx-auto max-w-7xl">
        <Button variant="ghost" className="w-fit gap-2" onClick={() => navigate("/app/customers")}>
          <ArrowLeft className="size-4" /> Back to customers
        </Button>
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error
            ? `Customer profile could not be loaded: ${getErrorMessage(error, "Please try again.")}`
            : "This customer could not be found."}
        </div>
      </PageContainer>
    )
  }

  const memberSince = customer.createdAt ? formatDate(customer.createdAt) : "—"

  return (
    <PageContainer className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="-ml-2 gap-2 text-muted-foreground"
          onClick={() => navigate("/app/customers")}
        >
          <ArrowLeft className="size-4" />
          All customers
        </Button>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsEditOpen(true)}>
          <Pencil className="size-4" />
          Edit profile
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary/15 via-primary/5 to-violet-500/10" />
        <CardContent className="-mt-9 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-end gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl border-4 border-card bg-primary/10 text-xl font-semibold text-primary shadow-sm">
              {initialsFrom(customer.name) || "C"}
            </span>
            <div className="min-w-0 pb-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{customer.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5" /> Customer since {memberSince}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            {customer.phone ? (
              <a href={`tel:${customer.phone}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 px-3 text-sm hover:bg-muted">
                <Phone className="size-4 text-primary" /> {customer.phone}
              </a>
            ) : (
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 text-sm text-muted-foreground">
                <Phone className="size-4" /> No phone number
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <ProfileStat label="Total orders" value={customer.totalOrders.toLocaleString()} icon={ShoppingBag} />
        <ProfileStat label="Lifetime spend" value={formatCurrency(customer.totalSpent)} icon={CircleDollarSign} />
        <ProfileStat label="Refunded" value={formatCurrency(customer.totalRefunded)} icon={RotateCcw} tone="violet" />
        <ProfileStat label="Net spent" value={formatCurrency(customer.netSpent)} icon={CreditCard} tone="emerald" />
        <ProfileStat label="Outstanding" value={formatCurrency(customer.totalDue)} icon={ClipboardList} tone="amber" />
      </section>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className="h-11 w-full justify-start gap-1 rounded-xl border border-border/60 bg-card p-1 sm:w-fit">
          <TabsTrigger value="overview" className="gap-2 rounded-lg px-4">
            <UserRound className="size-4" /> Overview
          </TabsTrigger>
          <TabsTrigger id="customer-orders-tab" value="orders" className="gap-2 rounded-lg px-4">
            <ShoppingBag className="size-4" /> Orders <span className="text-xs text-muted-foreground">{sales.length}</span>
          </TabsTrigger>
          <TabsTrigger value="refunds" className="gap-2 rounded-lg px-4">
            <RotateCcw className="size-4" /> Refunds <span className="text-xs text-muted-foreground">{refunds.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="size-4 text-primary" /> Recent orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sales.length ? (
                <div className="space-y-1">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-muted/40">
                      <div className="min-w-0">
                        <p className="font-medium">{sale.invoiceNo}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(sale.createdAt)} · {sale.items.length} line item{sale.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium tabular-nums">{formatCurrency(Number(sale.total))}</p>
                        <Badge className="mt-1" variant={statusVariant(sale.status)}>{formatStatus(sale.status)}</Badge>
                      </div>
                    </div>
                  ))}
                  {sales.length > 5 && (
                    <Button variant="ghost" className="mt-2 w-full" onClick={() => document.getElementById("customer-orders-tab")?.click()}>
                      View all orders
                    </Button>
                  )}
                </div>
              ) : (
                <HistoryEmpty title="No orders yet" description="This customer's order history will appear here." />
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Customer details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><UserRound className="size-4" /></span>
                <div><p className="text-xs text-muted-foreground">Full name</p><p className="mt-1 font-medium">{customer.name}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><Phone className="size-4" /></span>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="mt-1 font-medium">{customer.phone || "Not provided"}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><CalendarDays className="size-4" /></span>
                <div><p className="text-xs text-muted-foreground">Last purchase</p><p className="mt-1 font-medium">{formatDate(customer.lastPurchaseAt)}</p></div>
              </div>
              <div className="border-t border-border/60 pt-3">
                <p className="text-xs text-muted-foreground">Customer ID</p>
                <p className="mt-1 break-all font-mono text-xs">{customer.id}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Order history</CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersTable sales={sales} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Refund history</CardTitle>
            </CardHeader>
            <CardContent>
              <RefundsTable refunds={refunds} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CustomerFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit customer profile"
        description="Update contact details for this customer."
        submitLabel="Save changes"
        initialValues={{ name: customer.name, phone: customer.phone ?? undefined }}
        isSaving={updateState.isLoading}
        onSubmit={handleUpdate}
      />
    </PageContainer>
  )
}
