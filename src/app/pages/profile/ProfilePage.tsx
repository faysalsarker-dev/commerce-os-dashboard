import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  Camera,
  CreditCard,
  Mail,
  Phone,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Wallet,
} from "lucide-react"

import type { User } from "@/types/data-types/user/user.type"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUserProfileQuery } from "@/redux/hooks"
import { cn } from "@/lib/utils"
import userImage from "@/assets/system/commerce-os-user.png"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const toNumber = (value: number | string | null | undefined) =>
  Number(value ?? 0)

const formatMoney = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(toNumber(value))

const formatDate = (value?: string | Date | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—"

const formatDateTime = (value?: string | Date | null) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

const getInitials = (name?: string | null) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U"

function StatusBadge({ status }: { status?: string | null }) {
  const label = status ?? "Unknown"
  const normalized = label.toUpperCase()

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
        normalized === "ACTIVE" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        normalized === "PAID" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        normalized !== "ACTIVE" &&
          normalized !== "PAID" &&
          "border-muted-foreground/20 bg-muted text-muted-foreground"
      )}
    >
      {label.replace(/_/g, " ")}
    </Badge>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType
  label: string
  value: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>

      {children}
    </section>
  )
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <div className="overflow-hidden rounded-3xl border bg-card">
        <Skeleton className="h-28 rounded-none" />

        <div className="flex flex-col gap-5 px-5 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="-mt-14 flex items-end gap-4">
            <Skeleton className="size-28 rounded-2xl border-4 border-card" />

            <div className="space-y-2 pb-1">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>

              <Skeleton className="size-10 rounded-xl" />
            </div>

            <Skeleton className="mt-4 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-5 w-32" />

            <div className="mt-4 space-y-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-3 py-3.5">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-5 w-36" />

            <div className="mt-4 space-y-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 py-3.5">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-5 w-36" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-5 w-28" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  const { data, isLoading, isError } = useGetUserProfileQuery(undefined)
const user = data?.data as User | undefined
  const [imageOpen, setImageOpen] = useState(false)

  const salaryRecords = useMemo(
    () =>
      [...(user?.salaryRecords ?? [])].sort(
        (a, b) =>
          (b?.year ?? 0) - (a?.year ?? 0) || (b?.month ?? 0) - (a?.month ?? 0)
      ),
    [user?.salaryRecords]
  )

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError || !user) {
    return null
  }

  const employeeDetail = user?.employeeDetail
  const salesSummary = user?.salesSummary

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-3xl border bg-card shadow-sm"
      >
        <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />

        <div className="flex flex-col gap-5 px-5 pb-6 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <Avatar className="size-28 rounded-2xl border-4 border-card shadow-lg">
                <AvatarImage
                  src={user?.image ?? userImage}
                  alt={user?.name ?? "User"}
                />

                <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => setImageOpen(true)}
                aria-label="Change profile image"
                className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-xl border bg-background shadow-sm transition-all hover:bg-accent active:scale-95"
              >
                <Camera className="size-4" />
              </button>

              {user?.isOnline && (
                <span className="absolute top-1 right-1 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user?.name ?? "User"}
                </h1>

                <StatusBadge status={user?.status} />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {employeeDetail?.designation ?? "â€”"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-2 rounded-full",
                user?.isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
              )}
            />

            {user?.isOnline
              ? "Online"
              : `Last seen ${formatDate(user?.lastSeenAt)}`}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total sales"
          value={formatMoney(salesSummary?.totalSales)}
          description={`${salesSummary?.totalSalesCount ?? 0} sales`}
        />

        <StatCard
          icon={CreditCard}
          label="Total paid"
          value={formatMoney(salesSummary?.totalPaid)}
          description="Collected from sales"
        />

        <StatCard
          icon={Wallet}
          label="Total due"
          value={formatMoney(salesSummary?.totalDue)}
          description="Outstanding amount"
        />

        <StatCard
          icon={RotateCcw}
          label="Refunds"
          value={formatMoney(salesSummary?.totalRefundAmount)}
          description={`${salesSummary?.totalRefundItems ?? 0} items refunded`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-5">
          <Section title="Personal information">
            <div className="divide-y px-5">
              <InfoItem icon={Mail} label="Email" value={user?.email} />

              <InfoItem icon={Phone} label="Phone" value={user?.phone} />

              <InfoItem
                icon={ShieldCheck}
                label="Role"
                value={user?.role?.replace(/_/g, " ")}
              />

              <InfoItem
                icon={CalendarDays}
                label="Join date"
                value={formatDate(user?.createdAt)}
              />
            </div>
          </Section>

          <Section title="Employee information">
            <div className="divide-y px-5">
              <InfoItem
                icon={BadgeCheck}
                label="Designation"
                value={employeeDetail?.designation}
              />

              <InfoItem
                icon={Banknote}
                label="Base salary"
                value={formatMoney(employeeDetail?.baseSalary)}
              />
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Sales overview">
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Sales count</p>
                  <ReceiptText className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-2xl font-bold tabular-nums">
                  {salesSummary?.totalSalesCount ?? 0}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Items sold</p>
                  <ShoppingBag className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-2xl font-bold tabular-nums">
                  {salesSummary?.totalItemsSold ?? 0}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total paid</p>
                  <CreditCard className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-xl font-bold tabular-nums">
                  {formatMoney(salesSummary?.totalPaid)}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total due</p>
                  <Wallet className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-xl font-bold tabular-nums">
                  {formatMoney(salesSummary?.totalDue)}
                </p>
              </div>
            </div>
          </Section>

          <Section title="Salary history">
            {salaryRecords.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                No salary records
              </div>
            ) : (
              <div className="divide-y">
                {salaryRecords.map((salary) => (
                  <div
                    key={salary?.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {MONTHS[(salary?.month ?? 0) - 1] ?? "Unknown"}{" "}
                          {salary?.year ?? ""}
                        </p>

                        <StatusBadge status={salary?.status} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Paid {formatDateTime(salary?.paidAt)}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-5 text-right">
                      <div>
                        <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                          Base
                        </p>
                        <p className="mt-1 text-sm font-medium tabular-nums">
                          {formatMoney(salary?.baseSalary)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                          Bonus
                        </p>
                        <p className="mt-1 text-sm font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                          +{formatMoney(salary?.bonus)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                          Net pay
                        </p>
                        <p className="mt-1 text-sm font-bold tabular-nums">
                          {formatMoney(salary?.netPay)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update profile image</DialogTitle>
            <DialogDescription>
              Select a new image for your profile.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="flex justify-center py-4">
            <Avatar className="size-32 rounded-3xl">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback className="rounded-3xl bg-primary/10 text-2xl font-bold text-primary">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImageOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button onClick={() => setImageOpen(false)} className="rounded-xl">
              Save image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
