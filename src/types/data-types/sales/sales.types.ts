export interface ScanProductPayload {
  code: string
}

export interface ScannedProduct {
  variantId: string
  sku: string
  productName: string
  colorName: string
  colorHex?: string
  size: string
  thumbnailUrl: string | null
  sellingPrice: number
  isOverridden: boolean
  stockQty: number
  inStock: boolean
}

export interface ReturnItemPayload {
  variantId?: string
  productId?: string
  quantity: number
  reason?: string
}

export interface ReturnSalePayload {
  saleId: string
  items: ReturnItemPayload[]
  note?: string
}

export interface ReturnSaleResponse {
  id: string
  saleId: string
  refundAmount: number
  createdAt: string
}

export interface SalesHistoryParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  search?: string
}

export interface SaleRecord {
  id: string
  invoiceNumber: string
  totalAmount: number
  paymentMethod: string
  itemsCount: number
  createdAt: string
}

export interface SaleByInvoiceItem {
  id: string
  saleId: string
  variantId: string
  productName: string
  sku: string
  unitPrice: string | number
  quantity: number
  discount: string | number
  subtotal: string | number
  alreadyRefundedQty?: number
}

export interface SaleByInvoice {
  id: string
  invoiceNo: string
  customerId: string | null
  status: SaleStatus
  total: string | number
  paidAmount: string | number
  dueAmount: string | number
  paymentStatus: PaymentStatus
  createdAt: string
  items: SaleByInvoiceItem[]
  customer?: { name: string; phone: string | null } | null
}

// ---- Payment method must match your Prisma enum exactly — no free-form string escape hatch ----
export type PaymentMethod =
  "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "CARD" | "BANK_TRANSFER"
// "MOBILE_PAYMENT" doesn't exist in your schema's PaymentMethod enum — BKASH/NAGAD/ROCKET are
// your actual mobile payment methods. And the `| string` fallback defeats the whole point of a
// union type — it lets TypeScript pass through any typo silently. Drop it.

export type SaleChannel = "OFFLINE" | "ONLINE"
export type SaleStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY_RETURNED"
  | "RETURNED"
export type PaymentStatus =
  "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED" | "PARTIALLY_REFUNDED"

export interface CheckoutItemPayload {
  variantId: string // required, not optional — backend has no productId fallback path
  quantity: number
  discount?: number // per-line discount in taka
  // productId removed — checkout only ever operates on variants, a product alone has no
  // price/sku/stock, so there's nothing the backend could do with a bare productId
}

export interface CheckoutPayload {
  customerId?: string // omit for guest sale
  items: CheckoutItemPayload[]
  discount?: number // order-level discount in taka
  shippingFee?: number
  paymentMethod: PaymentMethod | string
  isFullPayment: boolean // required now — this is what was silently defaulting to true before
  paidAmount?: number // send only when isFullPayment is false
  dueDate?: string // ISO string, send only when there's a due
  channel?: SaleChannel
  notes?: string // was `note` — backend field is `notes`
  // totalAmount removed — server derives it from DB prices, never trust client math
  // tax removed — there's no tax field on Sale in the current schema; add this back
  //   only once/if VAT support is actually added to the Prisma model
}

// ---- Response ----

export interface InvoiceReceiptItem {
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

export interface InvoiceReceiptCustomer {
  id: string
  name: string
  phone: string | null
}

export interface InvoiceReceipt {
  invoiceNo: string // was `invoiceNumber`
  saleId: string
  date: string
  channel: SaleChannel
  status: SaleStatus

  soldBy: { id: string; name: string }
  customer: InvoiceReceiptCustomer | null

  items: InvoiceReceiptItem[]

  subtotal: number
  discount: number
  shippingFee: number
  total: number // was `totalAmount`

  paidAmount: number
  dueAmount: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod | null
  dueDate: string | null

  notes: string | null
}

export interface CheckoutResponse {
  invoice: InvoiceReceipt // it's nested, not a flat top-level object
}
