export type SaleStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "COMPLETED"
  | "PARTIALLY_RETURNED"
  | "RETURNED"
  | "CANCELLED";

export type PaymentStatus = "PAID" | "PARTIAL" | "DUE" | "REFUNDED";

export type RefundMethod = "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "CARD" | "BANK_TRANSFER";

export const REFUND_METHODS: { value: RefundMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
];

export interface SaleItem {
  id: string;
  saleId: string;
  variantId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  subtotal: number;
  /** Derived on the backend: sum of prior RefundItem.quantity for this saleItem. */
  alreadyRefundedQty: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string;
  customer: { name: string; phone: string };
  status: SaleStatus;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: SaleItem[];
}

export interface RefundCreatePayload {
  saleId: string;
  items: { saleItemId: string; variantId: string; quantity: number; amount: number }[];
  amount: number;
  method: RefundMethod;
  reason?: string;
  processedById: string;
}

export interface RefundResult {
  id: string;
  amount: number;
  method: RefundMethod;
  createdAt: string;
}

export const REFUNDABLE_STATUSES: SaleStatus[] = ["COMPLETED", "PARTIALLY_RETURNED", "CONFIRMED"];

export function remainingQty(item: SaleItem): number {
  return Math.max(0, item.quantity - item.alreadyRefundedQty);
}

export function isFullyRefunded(sale: Sale): boolean {
  return sale.items.every((i) => remainingQty(i) === 0);
}

export function ineligibleReason(sale: Sale): string | null {
  if (!REFUNDABLE_STATUSES.includes(sale.status)) {
    if (sale.status === "DRAFT") return "This sale is still a draft — it can't be refunded until it is confirmed.";
    if (sale.status === "CANCELLED") return "This sale was cancelled, so there is nothing to refund.";
    if (sale.status === "RETURNED") return "This sale has already been fully returned.";
    return "This sale isn't in a refundable state.";
  }
  if (isFullyRefunded(sale)) return "Every item on this sale has already been refunded.";
  return null;
}

/** Mock dataset — swap `lookupSale` for the real API call later. */
const MOCK_SALES: Sale[] = [
  {
    id: "s1",
    invoiceNo: "INV-10241",
    customerId: "c1",
    customer: { name: "Rahim Uddin", phone: "01711223344" },
    status: "COMPLETED",
    total: 3500,
    paidAmount: 3500,
    dueAmount: 0,
    paymentStatus: "PAID",
    createdAt: "2026-08-06T11:24:00.000Z",
    items: [
      {
        id: "si1",
        saleId: "s1",
        variantId: "v1",
        productName: "Premium Jersey",
        sku: "PJB-MRN-M",
        unitPrice: 850,
        quantity: 2,
        discount: 0,
        subtotal: 1700,
        alreadyRefundedQty: 0,
      },
      {
        id: "si2",
        saleId: "s1",
        variantId: "v2",
        productName: "Cotton Pant",
        sku: "CTP-BLK-32",
        unitPrice: 1200,
        quantity: 1,
        discount: 100,
        subtotal: 1100,
        alreadyRefundedQty: 0,
      },
      {
        id: "si3",
        saleId: "s1",
        variantId: "v3",
        productName: "Oxford Shirt",
        sku: "OXS-WHT-M",
        unitPrice: 1450,
        quantity: 1,
        discount: 0,
        subtotal: 1450,
        alreadyRefundedQty: 1,
      },
    ],
  },
  {
    id: "s2",
    invoiceNo: "INV-10242",
    customerId: "c2",
    customer: { name: "Karim Sarker", phone: "01812223344" },
    status: "PARTIALLY_RETURNED",
    total: 2400,
    paidAmount: 1200,
    dueAmount: 1200,
    paymentStatus: "PARTIAL",
    createdAt: "2026-08-08T08:02:00.000Z",
    items: [
      {
        id: "si4",
        saleId: "s2",
        variantId: "v2",
        productName: "Cotton Pant",
        sku: "CTP-BLK-32",
        unitPrice: 1200,
        quantity: 2,
        discount: 0,
        subtotal: 2400,
        alreadyRefundedQty: 1,
      },
    ],
  },
  {
    id: "s3",
    invoiceNo: "INV-10243",
    customerId: "c1",
    customer: { name: "Rahim Uddin", phone: "01711223344" },
    status: "DRAFT",
    total: 850,
    paidAmount: 0,
    dueAmount: 850,
    paymentStatus: "DUE",
    createdAt: "2026-08-09T15:40:00.000Z",
    items: [
      {
        id: "si5",
        saleId: "s3",
        variantId: "v1",
        productName: "Premium Jersey",
        sku: "PJB-MRN-M",
        unitPrice: 850,
        quantity: 1,
        discount: 0,
        subtotal: 850,
        alreadyRefundedQty: 0,
      },
    ],
  },
];

/** Replace with the real GET /sales?query= call — signature is already async. */
export async function lookupSale(query: string): Promise<Sale | null> {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;
  await new Promise((r) => setTimeout(r, 350));
  return (
    MOCK_SALES.find(
      (s) => s.invoiceNo.toLowerCase() === needle || s.customer.phone === needle,
    ) ?? null
  );
}

/** Replace with the real POST /refunds call. */
export async function createRefund(payload: RefundCreatePayload): Promise<RefundResult> {
  console.log("createRefund", payload);
  await new Promise((r) => setTimeout(r, 700));
  return {
    id: `RF-${Math.floor(100000 + Math.random() * 899999)}`,
    amount: payload.amount,
    method: payload.method,
    createdAt: new Date().toISOString(),
  };
}