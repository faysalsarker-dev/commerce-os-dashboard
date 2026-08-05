export interface ScanProductPayload {
  code: string;
}

export interface ScannedProduct {
  variantId: string;
  sku: string;
  productName: string;
  colorName: string;
  colorHex?: string;
  size: string;
  thumbnailUrl: string | null;
  sellingPrice: number;
  isOverridden: boolean;
  stockQty: number;
  inStock: boolean;
}

export interface CheckoutItemPayload {
  productId?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutPayload {
  items: CheckoutItemPayload[];
  paymentMethod: "CASH" | "CARD" | "MOBILE_PAYMENT" | string;
  discount?: number;
  tax?: number;
  totalAmount: number;
  customerId?: string;
  note?: string;
}

export interface CheckoutResponse {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface ReturnItemPayload {
  variantId?: string;
  productId?: string;
  quantity: number;
  reason?: string;
}

export interface ReturnSalePayload {
  saleId: string;
  items: ReturnItemPayload[];
  note?: string;
}

export interface ReturnSaleResponse {
  id: string;
  saleId: string;
  refundAmount: number;
  createdAt: string;
}

export interface SalesHistoryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface SaleRecord {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paymentMethod: string;
  itemsCount: number;
  createdAt: string;
}
