export type SaleChannel = "OFFLINE" | "ONLINE";

export type SaleStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY_RETURNED"
  | "RETURNED";

export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED" | "PARTIALLY_REFUNDED";

export type PaymentMethod = "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "CARD" | "BANK_TRANSFER";

export interface InvoiceItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface InvoiceParty {
  id: string;
  name: string;
}

export interface InvoiceCustomer {
  id: string;
  name: string;
  phone: string | null;
}

export interface Invoice {
  invoiceNo: string;
  saleId: string;
  date: string;
  channel: SaleChannel;
  status: SaleStatus;
  soldBy: InvoiceParty;
  customer: InvoiceCustomer | null;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  dueDate: string | null;
  notes: string | null;
}

/** Static shop config — not part of the checkout API response. */
export const SHOP = {
  wordmark: "COMMERZOS",
  tagline: "Dhanmondi · Store 02",
  thankYou: "Thank you for shopping with us",
} as const;

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  CARD: "Card",
  BANK_TRANSFER: "Bank Transfer",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PARTIAL: "Partial — Due",
  PAID: "Paid",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially refunded",
};

/** Deterministic formatting (fixed locale + time zone) so SSR and client agree. */
export function formatInvoiceDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
}

export function formatDueDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
}

/** Mock of the checkout API response — swap for a fetch-by-saleId later. */
export const MOCK_INVOICE: Invoice = {
  invoiceNo: "INV-2026-004182",
  saleId: "sale_9f2c71",
  date: "2026-08-11T04:42:00.000Z",
  channel: "OFFLINE",
  status: "COMPLETED",
  soldBy: { id: "u_21", name: "Nusrat Jahan" },
  customer: { id: "c1", name: "Rahim Uddin", phone: "01711223344" },
  items: [
    {
      productName: "Premium Jersey",
      sku: "PJB-MRN-M",
      quantity: 2,
      unitPrice: 850,
      discount: 100,
      subtotal: 1600,
    },
    {
      productName: "Cotton Pant",
      sku: "CTP-BLK-32",
      quantity: 1,
      unitPrice: 1200,
      discount: 0,
      subtotal: 1200,
    },
    {
      productName: "Oxford Shirt",
      sku: "OXS-WHT-M",
      quantity: 1,
      unitPrice: 1450,
      discount: 50,
      subtotal: 1400,
    },
  ],
  subtotal: 4200,
  discount: 150,
  shippingFee: 0,
  total: 4200,
  paidAmount: 3000,
  dueAmount: 1200,
  paymentStatus: "PARTIAL",
  paymentMethod: "BKASH",
  dueDate: "2026-08-20T00:00:00.000Z",
  notes: "Customer will collect the remaining item on Friday.",
};