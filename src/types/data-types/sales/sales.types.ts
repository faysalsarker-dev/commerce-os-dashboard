import type {
  PaymentEntry,
  PaymentMethod,
  TenderPayment,
} from "@/types/data-types/payment.types";

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

export interface SalesHistoryParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SalesHistoryItem {
  saleId: string
  invoiceNo: string
  customerName: string
  customerPhone: string | null
  totalProducts: number
  date: string
  channel: SaleChannel
  status: SaleStatus
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  paidAmount: number
  dueAmount: number
  paymentStatus: PaymentStatus
}

export type SaleRecord = SalesHistoryItem

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
  subtotal: number | string
  discount: number | string
  shippingFee: number | string
  total: string | number
  paidAmount: string | number
  dueAmount: string | number
  paymentStatus: PaymentStatus
  createdAt: string
  items: SaleByInvoiceItem[]
  payments?: PaymentEntry[]
  customer?: { name: string; phone: string | null } | null
}

// ---- Payment method must match your Prisma enum exactly — no free-form string escape hatch ----
export type { PaymentMethod };

export const SALE_CHANNELS = [
  "ONLINE",
  "OFFLINE",
  "SOCIAL",
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "WHATSAPP",
  "GOOGLE",
  "YOUTUBE",
  "OTHER",
] as const

export type SaleChannel = (typeof SALE_CHANNELS)[number]

export const SALE_CHANNEL_LABELS: Record<SaleChannel, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  SOCIAL: "Social",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
  GOOGLE: "Google",
  YOUTUBE: "YouTube",
  OTHER: "Other",
}
export type SaleStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY_RETURNED"
  | "RETURNED"
export type PaymentStatus =
  "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED" | "PARTIALLY_REFUND"

export interface CheckoutItemPayload {
  variantId: string // required, not optional — backend has no productId fallback path
  quantity: number
  discount?: number // per-line discount in taka
  // productId removed — checkout only ever operates on variants, a product alone has no
  // price/sku/stock, so there's nothing the backend could do with a bare productId
}

export interface CheckoutPayload {
  customerId?: string // omit for guest sale
  campaignId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  items: CheckoutItemPayload[]
  discount?: number // order-level discount in taka
  shippingFee?: number
  paymentMethod?: PaymentMethod
  payments?: TenderPayment[]
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
  payments: PaymentEntry[]
  dueDate: string | null

  notes: string | null
}

export interface CheckoutResponse {
  invoice: InvoiceReceipt // it's nested, not a flat top-level object
}
