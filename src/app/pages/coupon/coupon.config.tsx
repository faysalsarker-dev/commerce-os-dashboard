import { TicketPercent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { search, select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { Coupon } from "@/types/data-types/coupon/coupon.types";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/format";

export const COUPON_PAGE_CONFIG = {
  title: "Coupons",
  description:
    "Create, configure, and monitor discount promo codes and campaign rules.",
} as const;

export const COUPON_SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt", default: true },
  { label: "Oldest first", value: "createdAt" },
  { label: "Code (A-Z)", value: "code" },
  { label: "Code (Z-A)", value: "-code" },
  { label: "Discount (High to Low)", value: "-discountValue" },
  { label: "Discount (Low to High)", value: "discountValue" },
  { label: "Expiring Soon", value: "endDate" },
];

export const COUPON_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search code, title, description...",
  }),
  select({
    name: "discountType",
    label: "Discount Type",
    placeholder: "All Types",
    options: [
      { label: "All Types", value: "" },
      { label: "Percentage (%)", value: "PERCENTAGE" },
      { label: "Fixed Amount (৳)", value: "FIXED_AMOUNT" },
    ],
  }),
  select({
    name: "channel",
    label: "Channel",
    placeholder: "All Channels",
    options: [
      { label: "All Channels", value: "" },
      { label: "In-Store / POS Only", value: "OFFLINE" },
      { label: "Online Store Only", value: "ONLINE" },
    ],
  }),
  select({
    name: "isActive",
    label: "Status",
    placeholder: "All Status",
    options: [
      { label: "All Status", value: "" },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: COUPON_SORT_OPTIONS,
  }),
];

type CouponTableHandlers = {
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
};

export const createCouponTableColumns = ({
  onEdit,
  onDelete,
}: CouponTableHandlers) =>
  createColumns<Coupon>({
    resource: "coupon" as any,
    columns: [
      column("code", {
        label: "Coupon Code",
        sortable: true,
        render: (coupon) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-wider text-primary">
              <TicketPercent className="size-3.5 shrink-0" />
              <span>{coupon.code}</span>
            </div>
            {coupon.title && (
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {coupon.title}
              </span>
            )}
          </div>
        ),
      }),
      column("discountValue", {
        label: "Discount",
        sortable: true,
        render: (coupon) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {coupon.discountType === "PERCENTAGE"
                ? `${coupon.discountValue}% OFF`
                : formatCurrency(Number(coupon.discountValue))}
            </span>
            {coupon.discountType === "PERCENTAGE" &&
              coupon.maxDiscountAmount && (
                <span className="text-xs text-muted-foreground">
                  Cap: {formatCurrency(Number(coupon.maxDiscountAmount))}
                </span>
              )}
          </div>
        ),
      }),
      column("minOrderAmount", {
        label: "Min Order",
        sortable: true,
        render: (coupon) =>
          coupon.minOrderAmount ? (
            <span className="text-sm font-medium">
              {formatCurrency(Number(coupon.minOrderAmount))}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No minimum</span>
          ),
      }),
      column("usageCount", {
        label: "Redemptions",
        render: (coupon) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {coupon.usageCount}{" "}
              <span className="text-xs text-muted-foreground">
                / {coupon.usageLimit !== null ? coupon.usageLimit : "∞"}
              </span>
            </span>
            {coupon.perCustomerLimit && (
              <span className="text-xs text-muted-foreground">
                Max {coupon.perCustomerLimit}/customer
              </span>
            )}
          </div>
        ),
      }),
      column("channel", {
        label: "Channel",
        render: (coupon) => {
          if (coupon.channel === "ONLINE") {
            return (
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-xs font-normal text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                Online
              </Badge>
            );
          }
          if (coupon.channel === "OFFLINE") {
            return (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-xs font-normal text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              >
                In-Store (POS)
              </Badge>
            );
          }
          return (
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 text-xs font-normal text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
            >
              All Channels
            </Badge>
          );
        },
      }),
      column("startDate", {
        label: "Validity",
        sortable: true,
        render: (coupon) => {
          const isExpired = coupon.endDate
            ? new Date() > new Date(coupon.endDate)
            : false;
          return (
            <div className="flex flex-col">
              <span className="text-xs font-medium">
                {formatDate(coupon.startDate)} –{" "}
                {coupon.endDate ? formatDate(coupon.endDate) : "No expiry"}
              </span>
              {isExpired ? (
                <span className="text-[11px] font-semibold text-destructive">
                  Expired
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  Valid campaign
                </span>
              )}
            </div>
          );
        },
      }),
      column("isActive", {
        label: "Status",
        sortable: true,
        render: (coupon) => {
          const isExpired = coupon.endDate
            ? new Date() > new Date(coupon.endDate)
            : false;
          if (isExpired) {
            return (
              <StatusBadge value="inactive" text="Expired" variant="danger" />
            );
          }
          return (
            <StatusBadge
              value={coupon.isActive}
              text={coupon.isActive ? "Active" : "Inactive"}
            />
          );
        },
      }),
      column.actions([
        action.edit<Coupon>({
          onClick: onEdit,
        }),
        action.delete<Coupon>({
          confirmTitle: "Delete Coupon",
          confirmDescription:
            "Are you sure you want to delete this coupon? If it has existing redemptions, consider deactivating it instead.",
          onClick: onDelete,
        }),
      ]),
    ],
  });

