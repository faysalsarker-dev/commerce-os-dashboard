import { useMemo, useState } from "react";
import { Plus, Tag, CheckCircle2, TicketPercent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/modules/table";
import { getDefaultValues, useFilter } from "@/components/modules/filter";
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common";
import { CouponDialog } from "@/components/modules/coupon";
import {
  useDeleteCouponMutation,
  useGetCouponsQuery,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import type { Coupon } from "@/types/data-types/coupon/coupon.types";
import {
  COUPON_FILTER_CONFIG,
  COUPON_PAGE_CONFIG,
  COUPON_SORT_OPTIONS,
  createCouponTableColumns,
} from "./coupon.config";

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Tag;
}) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-xs">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export default function CouponPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const filter = useFilter({
    defaultValues: getDefaultValues(COUPON_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  });

  const queryParams = useMemo(() => {
    const selectedSort = filter.values.sort ?? COUPON_SORT_OPTIONS[0].value;
    const isDescending = typeof selectedSort === "string" && selectedSort.startsWith("-");

    const params: Record<string, any> = {
      ...filter.queryParams,
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? "desc" : "asc",
    };

    if (filter.values.discountType) {
      params.discountType = filter.values.discountType;
    }
    if (filter.values.channel) {
      params.channel = filter.values.channel;
    }
    if (filter.values.isActive !== undefined && filter.values.isActive !== "") {
      params.isActive = filter.values.isActive === "true";
    }

    return params;
  }, [filter.queryParams, filter.values]);

  const { data: response, isLoading } = useGetCouponsQuery(queryParams);
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = response?.data ?? [];
  const totalCount = response?.meta?.total ?? coupons.length;
  const activeCount = coupons.filter(
    (c) =>
      c.isActive &&
      (!c.endDate || new Date(c.endDate) >= new Date())
  ).length;
  const totalRedemptions = coupons.reduce(
    (acc, c) => acc + (c.usageCount || 0),
    0
  );

  const openCreateDialog = () => {
    setEditingCoupon(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    handleAsyncMutation(() => deleteCoupon(coupon.id).unwrap(), {
      successMessage: `Coupon "${coupon.code}" deleted`,
      errorMessage: "Unable to delete coupon",
      errorDescription:
        "Coupons with previous sales redemptions cannot be deleted. Deactivate them instead.",
    });
  };

  const columns = useMemo(
    () =>
      createCouponTableColumns({
        onEdit: openEditDialog,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <PageContainer>
      <PageHeader
        title={COUPON_PAGE_CONFIG.title}
        description={COUPON_PAGE_CONFIG.description}
        noAction
        actions={
          <Button
            onClick={openCreateDialog}
            className="h-10 gap-2 rounded-xl"
            type="button"
          >
            <Plus className="size-4" />
            Add Coupon
          </Button>
        }
      />

      {/* Metric / Summary Cards */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total Coupons"
          value={totalCount.toLocaleString()}
          detail="Total campaigns configured"
          icon={Tag}
        />
        <SummaryCard
          label="Active Coupons"
          value={activeCount.toLocaleString()}
          detail="Currently valid and redeemable"
          icon={CheckCircle2}
        />
        <SummaryCard
          label="Total Redemptions"
          value={totalRedemptions.toLocaleString()}
          detail="Redemptions recorded"
          icon={TicketPercent}
        />
      </section>

      {/* Filters */}
      <FilterBar filter={filter} filters={COUPON_FILTER_CONFIG} />

      {/* Create / Edit Dialog */}
      <CouponDialog
        coupon={editingCoupon}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingCoupon(null);
        }}
        trigger={null}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
        pagination={filter.tableState}
        onPaginationChange={filter.onTableStateChange}
        meta={response?.meta}
      />
    </PageContainer>
  );
}

