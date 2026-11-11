import type { PaymentEntry, PaymentMethod } from "@/types/data-types/payment.types";
import type {
  PaymentStatus,
  SaleChannel,
  SaleStatus,
} from "@/types/data-types/sales/sales.types";

type DecimalValue = number | string;

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  totalDue: number;
  totalOrders: number;
  totalSpent: number;
  lastPurchaseAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerSaleItem {
  id: string;
  saleId: string;
  variantId: string;
  productName: string;
  sku: string;
  unitPrice: DecimalValue;
  quantity: number;
  discount: DecimalValue;
  subtotal: DecimalValue;
  createdAt: string;
}

export interface CustomerPayment extends PaymentEntry {
  id: string;
  saleId: string;
  amount: DecimalValue;
  receivedById: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
}

export interface CustomerRefundItem {
  id: string;
  refundId: string;
  saleItemId: string;
  variantId: string;
  quantity: number;
  amount: DecimalValue;
  saleItem: CustomerSaleItem;
}

export interface CustomerRefund {
  id: string;
  saleId: string;
  amount: DecimalValue;
  method: PaymentMethod;
  reason: string | null;
  processedById: string;
  refundedAt: string;
  createdAt: string;
  items: CustomerRefundItem[];
  payments: Array<{
    id: string;
    refundId: string;
    method: PaymentMethod;
    amount: DecimalValue;
    reference: string | null;
    createdAt: string;
  }>;
  processedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CustomerSale {
  id: string;
  invoiceNo: string;
  customerId: string | null;
  soldById: string;
  channel: SaleChannel;
  status: SaleStatus;
  subtotal: DecimalValue;
  discount: DecimalValue;
  shippingFee: DecimalValue;
  total: DecimalValue;
  paidAmount: DecimalValue;
  dueAmount: DecimalValue;
  paymentStatus: PaymentStatus;
  refundedAmount: DecimalValue;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: CustomerSaleItem[];
  payments: CustomerPayment[];
  soldBy: {
    id: string;
    name: string;
    email: string;
  };
  refunds: CustomerRefund[];
}

export interface CustomerProfile extends Customer {
  totalRefunded: number;
  netSpent: number;
  sales: CustomerSale[];
}

export interface CustomerPaymentPayload {
  saleId: string;
  amount: number;
  method: Exclude<PaymentMethod, "MIX">;
  reference?: string;
  notes?: string;
}

export interface CustomerPaymentResult {
  payment: CustomerPayment;
  sale: Omit<CustomerSale, "items" | "payments" | "soldBy" | "refunds">;
  customer: Pick<Customer, "id" | "totalDue">;
}

export interface CreateCustomerPayload {
  name: string;
  phone?: string | null;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string | null;
}

export interface CustomerFormValues {
  name: string;
  phone?: string;
}

export interface CustomerFilters {
  searchTerm?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerOption {
  value: string;
  label: string;
}

export interface PaginatedCustomerResponse {
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: Customer[];
}
