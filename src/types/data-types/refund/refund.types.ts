import type {
  PaymentEntry,
  PaymentMethod,
  TenderPayment,
} from "@/types/data-types/payment.types";

export type RefundMethod =
  | "CASH"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "CARD"
  | "BANK_TRANSFER"
  | "BANK"
  | "OTHER"
  | "MIX";

export interface RefundItemPayload {
  saleItemId: string;
  quantity: number;
  amount?: number;
}

export interface CreateRefundPayload {
  saleId: string;
  items: RefundItemPayload[];
  method?: RefundMethod;
  payments?: TenderPayment[];
  reason?: string;
}

export interface RefundItem {
  id: string;
  refundId: string;
  saleItemId: string;
  quantity: number;
  amount: number;
  createdAt: string;
  saleItem?: {
    id: string;
    saleId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productVariant?: {
      id: string;
      sku: string;
      product?: {
        name: string;
      };
    };
  };
}

export interface Refund {
  id: string;
  refundNumber: string;
  saleId: string;
  totalAmount: number;
  refundMethod: PaymentMethod | string;
  payments?: PaymentEntry[];
  reason: string | null;
  processedById: string | null;
  createdAt: string;
  updatedAt: string;
  items?: RefundItem[];
  sale?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    customer?: {
      id: string;
      name: string;
      phone: string | null;
    } | null;
  };
  processedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreatedRefund {
  id: string;
  amount: number | string;
  method: PaymentMethod;
  payments?: PaymentEntry[];
  createdAt: string;
}

export interface CreateRefundResponse {
  refund: CreatedRefund;
  sale: { id: string };
}

export interface RefundFilters {
  saleId?: string;
  processedById?: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedRefundResponse {
  data: Refund[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RefundResponse {
  success: boolean;
  message: string;
  data: Refund;
}

export interface RefundsResponse {
  success: boolean;
  message: string;
  data: Refund[];
}
