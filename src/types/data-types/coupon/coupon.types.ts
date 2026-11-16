import type { ApiResponse } from "@/types/shared";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
export type SaleChannel = "ONLINE" | "OFFLINE";

export interface CouponCreatedBy {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface CouponCount {
  usages: number;
  sales: number;
}

export interface Coupon {
  id: string;
  code: string;
  title: string | null;
  description: string | null;
  discountType: DiscountType;
  discountValue: number | string;
  minOrderAmount: number | string | null;
  maxDiscountAmount: number | string | null;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  isActive: boolean;
  channel: SaleChannel | null;
  createdById?: string | null;
  createdBy?: CouponCreatedBy | null;
  _count?: CouponCount;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  code: string;
  title?: string | null;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  usageLimit?: number | null;
  perCustomerLimit?: number | null;
  isActive?: boolean;
  channel?: SaleChannel | null;
}

export interface UpdateCouponPayload {
  code?: string;
  title?: string | null;
  description?: string | null;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  usageLimit?: number | null;
  perCustomerLimit?: number | null;
  isActive?: boolean;
  channel?: SaleChannel | null;
}

export interface ValidateCouponPayload {
  code: string;
  orderAmount: number;
  customerId?: string | null;
  channel?: SaleChannel | null;
}

export interface ValidateCouponResult {
  coupon: Coupon;
  discountAmount: number;
  finalAmount: number;
}

export interface CouponFilters {
  searchTerm?: string;
  search?: string;
  code?: string;
  isActive?: boolean | string;
  discountType?: DiscountType;
  channel?: SaleChannel;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type CouponResponse = ApiResponse<Coupon>;
export type CouponsResponse = ApiResponse<Coupon[]>;
export type ValidateCouponResponse = ApiResponse<ValidateCouponResult>;

