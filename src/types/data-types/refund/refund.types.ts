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
  variantId: string;
  quantity: number;
  amount: number;
  createdAt: string;
  saleItem?: {
    id: string;
    saleId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  };
}

export interface Refund {
  id: string;
  saleId: string;
  amount: number | string;
  method: PaymentMethod | string;
  payments?: PaymentEntry[];
  reason: string | null;
  processedById: string;
  refundedAt: string;
  createdAt: string;
  items?: RefundItem[];
  sale?: {
    id: string;
    invoiceNo: string;
    total: number | string;
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
  items?: RefundItem[];
  refundedAt?: string;
  createdAt: string;
}

export interface CreateRefundResponse {
  refund: CreatedRefund;
  sale: { id: string; invoiceNo?: string };
}

export interface CreateExchangePayload {
  saleId: string;
  items: Array<{
    saleItemId: string;
    replacementVariantId: string;
    quantity: number;
  }>;
  reason?: string;
}

export interface ExchangeItem {
  id: string;
  exchangeId: string;
  originalSaleItemId: string;
  originalVariantId: string;
  replacementVariantId: string;
  quantity: number;
  unitPriceDifference: number | string;
  originalSaleItem?: { id: string; productName: string; sku: string };
  originalVariant?: { id: string; sku: string };
  replacementVariant?: { id: string; sku: string };
}

export interface Exchange {
  id: string;
  saleId: string;
  status: "COMPLETED" | "CANCELLED";
  reason: string | null;
  processedById: string | null;
  createdAt: string;
  items: ExchangeItem[];
  processedBy?: { id: string; name: string } | null;
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
