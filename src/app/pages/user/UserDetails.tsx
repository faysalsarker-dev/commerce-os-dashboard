import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  BadgeDollarSign,
  TrendingUp,
  ReceiptText,
  Target,
  Trophy,
} from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { PageContainer } from "@/components/shared/common";
import PageEmptyState from "@/components/shared/common/PageEmptyState";
import {
  StatCard,
  TabNav,
  type TabItem,
  SalaryTable,
  EmptyState,
  UserDetailsSkeleton,
  ProfileHero,
  OverviewTab,
  EmploymentTab,
  EditUserDialog,
} from "@/components/modules/user";

import { formatCurrency } from "@/lib/format";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/hooks";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Role, EmployeeStatus } from "@/types/data-types/enums";

/* ─── Animation Variants ─── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Page Component ─── */
export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetUserQuery(id as string, { skip: !id });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = response?.data;

  /* ─── Local State ─── */
  const [tab, setTab] = useState("overview");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<Role>(Role.SALESMAN);
  const [editStatus, setEditStatus] = useState<EmployeeStatus>(
    EmployeeStatus.ACTIVE
  );

  /* ─── Handlers ─── */
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone ?? "");
    setEditRole(user.role as Role);
    setEditStatus(user.status as EmployeeStatus);
    setEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!editEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      await updateUser({
        id: user.id,
        data: {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim() || undefined,
          role: editRole,
          status: editStatus,
        },
      }).unwrap();

      toast.success("User updated successfully");
      setEditOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user profile");
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const nextStatus =
      user.status === EmployeeStatus.ACTIVE
        ? EmployeeStatus.INACTIVE
        : EmployeeStatus.ACTIVE;

    try {
      await updateUser({
        id: user.id,
        data: { status: nextStatus },
      }).unwrap();

      toast.success(
        nextStatus === EmployeeStatus.ACTIVE
          ? `${user.name} has been activated`
          : `${user.name} has been deactivated`
      );
      setConfirmOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <PageContainer className="mx-auto max-w-6xl">
        <UserDetailsSkeleton />
      </PageContainer>
    );
  }

  /* ─── Error / Not Found ─── */
  if (isError || !user) {
    return (
      <PageContainer className="mx-auto max-w-6xl">
        <PageEmptyState
          title="User not found"
          description={
            isError
              ? "We couldn't retrieve the user details at this time. Please check your connection or retry."
              : `We couldn't find a user with the ID "${id}". They may have been removed.`
          }
          buttonText="Back to Users"
          navigateTo="/app/users"
        />
      </PageContainer>
    );
  }

  /* ─── Derived Data ─── */
  const records = [...(user.salaryRecords ?? [])].sort(
    (a, b) => b.year - a.year || b.month - a.month
  );
  const currentYear = new Date().getFullYear();
  const paidYtd = records
    .filter((r) => r.status === "PAID" && r.year === currentYear)
    .reduce((sum, r) => sum + r.netPay, 0);
  const pendingTotal = records
    .filter((r) => r.status === "PENDING")
    .reduce((sum, r) => sum + r.netPay, 0);
  const totalBonus = records.reduce((sum, r) => sum + r.bonus, 0);

  const tabs: TabItem[] = [
    { value: "overview", label: "Overview" },
    { value: "employment", label: "Employment" },
    { value: "salary", label: "Salary History" },
    ...(user.salesSummary
      ? [{ value: "sales", label: "Sales Performance" }]
      : []),
  ];

  /* ─── Render ─── */
  return (
    <PageContainer className="mx-auto max-w-6xl space-y-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Profile Hero Card */}
        <ProfileHero
          user={user}
          copiedKey={copiedKey}
          onCopy={copyToClipboard}
          onEdit={handleOpenEdit}
        />

        {/* KPI Stats Grid */}
        <motion.div
          variants={item}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon={Wallet}
            label="Base Salary"
            value={user.employeeDetail?.baseSalary ?? 0}
            format={formatCurrency}
            hint="Monthly gross pay"
          />
          <StatCard
            icon={BadgeDollarSign}
            label={`Paid in ${currentYear}`}
            value={paidYtd}
            format={formatCurrency}
            hint={`${records.filter((r) => r.status === "PAID" && r.year === currentYear).length} paid cycles this year`}
          />
          <StatCard
            icon={ReceiptText}
            label="Pending Payout"
            value={pendingTotal}
            format={formatCurrency}
            hint={`${records.filter((r) => r.status === "PENDING").length} pending disbursement(s)`}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Bonus"
            value={totalBonus}
            format={formatCurrency}
            hint="Across all recorded periods"
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={item}>
          <TabNav tabs={tabs} active={tab} onChange={setTab} />
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "overview" && (
              <OverviewTab
                user={user}
                onCopy={copyToClipboard}
                copiedKey={copiedKey}
                onEdit={handleOpenEdit}
              />
            )}

            {tab === "employment" && (
              <EmploymentTab user={user} onEdit={handleOpenEdit} />
            )}

            {tab === "salary" && (
              <div className="space-y-4">
                {records.length === 0 ? (
                  <EmptyState
                    icon={ReceiptText}
                    title="No salary records"
                    description="Salary records will appear here once monthly payroll is processed."
                    actionLabel="Refresh data"
                    onAction={() => refetch()}
                  />
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <StatCard
                        icon={BadgeDollarSign}
                        label={`Total Paid in ${currentYear}`}
                        value={paidYtd}
                        format={formatCurrency}
                      />
                      <StatCard
                        icon={ReceiptText}
                        label="Pending Disbursements"
                        value={pendingTotal}
                        format={formatCurrency}
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Total Payroll Records"
                        value={records.length}
                      />
                    </div>
                    <SalaryTable records={records} />
                  </>
                )}
              </div>
            )}

            {tab === "sales" && user.salesSummary && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={ReceiptText}
                    label="Total Sales Revenue"
                    value={user.salesSummary.totalSales}
                    format={formatCurrency}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Total Collected"
                    value={user.salesSummary.totalPaid}
                    format={formatCurrency}
                  />
                  <StatCard
                    icon={Target}
                    label="Total Items Sold"
                    value={user.salesSummary.totalItemsSold}
                  />
                  <StatCard
                    icon={Trophy}
                    label="Refunded Items"
                    value={user.salesSummary.totalRefundItems}
                  />
                </div>
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground">
                    Performance metrics reflect completed point-of-sale
                    transactions attributed to this employee.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Edit Dialog */}
      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        userName={user.name}
        isUpdating={isUpdating}
        onSubmit={handleSaveEdit}
        editName={editName}
        setEditName={setEditName}
        editEmail={editEmail}
        setEditEmail={setEditEmail}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        editRole={editRole}
        setEditRole={setEditRole}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
      />

      {/* Confirm Status Toggle */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          user.status === EmployeeStatus.ACTIVE
            ? `Deactivate ${user.name}?`
            : `Activate ${user.name}?`
        }
        description={
          user.status === EmployeeStatus.ACTIVE
            ? "They will lose access immediately. You can reactivate their account whenever needed."
            : "Their platform access will be restored immediately."
        }
        confirmLabel={
          user.status === EmployeeStatus.ACTIVE ? "Deactivate" : "Activate"
        }
        destructive={user.status === EmployeeStatus.ACTIVE}
        onConfirm={handleToggleStatus}
      />
    </PageContainer>
  );
}

export default UserDetailsPage;
