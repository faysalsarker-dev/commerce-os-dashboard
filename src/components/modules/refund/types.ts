export type SaleStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "PARTIALLY_RETURNED"
  | "RETURNED"
  | "CANCELLED"

export type PaymentStatus =
  "UNPAID" | "PAID" | "PARTIAL" | "DUE" | "REFUNDED" | "PARTIALLY_REFUNDED"

export type RefundMethod =
  "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "CARD" | "BANK_TRANSFER"

export const REFUND_METHODS: { value: RefundMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
]

export interface SaleItem {
  id: string
  saleId: string
  variantId: string
  productName: string
  sku: string
  unitPrice: number
  quantity: number
  discount: number
  subtotal: number
  alreadyRefundedQty: number
}

export interface Sale {
  id: string
  invoiceNo: string
  customerId: string | null
  customer: { name: string; phone: string }
  status: SaleStatus
  total: number
  paidAmount: number
  dueAmount: number
  paymentStatus: PaymentStatus
  createdAt: string
  items: SaleItem[]
}

export interface RefundResult {
  id: string
  amount: number
  method: RefundMethod
  createdAt: string
}

export const REFUNDABLE_STATUSES: SaleStatus[] = [
  "COMPLETED",
  "PARTIALLY_RETURNED",
  "CONFIRMED",
]

export function remainingQty(item: SaleItem): number {
  return Math.max(0, item.quantity - item.alreadyRefundedQty)
}

export function isFullyRefunded(sale: Sale): boolean {
  return sale.items.every((item) => remainingQty(item) === 0)
}

export function ineligibleReason(sale: Sale): string | null {
  if (!REFUNDABLE_STATUSES.includes(sale.status)) {
    if (sale.status === "DRAFT")
      return "This sale is still a draft and cannot be refunded until it is confirmed."
    if (sale.status === "CANCELLED")
      return "This sale was cancelled, so there is nothing to refund."
    if (sale.status === "RETURNED")
      return "This sale has already been fully returned."
    return "This sale is not in a refundable state."
  }
  return isFullyRefunded(sale)
    ? "Every item on this sale has already been refunded."
    : null
}
