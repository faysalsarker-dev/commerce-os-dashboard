import type {
  PaymentMethod,
  PaymentStatus,
  SaleChannel,
  SaleStatus,
} from "@/types/data-types/sales/sales.types";

type DecimalValue = number | string;

export type OrderStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURNED";

export type ShipmentStatus =
  | "PENDING_DISPATCH"
  | "DISPATCH_FAILED"
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "PARTIAL_DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export type CourierProvider = "PATHAO" | "STEADFAST";

export interface CreateOrderPayload {
  customerId: string;
  saleId: string;
  estimatedDeliveryDate?: string;
  courierAccountId?: string;
}

export interface UpdateOrderPayload {
  status: OrderStatus;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  channel?: SaleChannel;
  customerId?: string;
  saleId?: string;
  searchTerm?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface OrderCustomer {
  id: string;
  name: string;
  phone: string | null;
}

export interface OrderSaleSummary {
  id: string;
  invoiceNo: string;
  channel: SaleChannel;
  status: SaleStatus;
  total: DecimalValue;
  paymentStatus: PaymentStatus;
}

export interface OrderListItem {
  id: string;
  customerId: string;
  saleId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  sale: OrderSaleSummary;
  _count: { shipments: number };
}

export interface OrderSaleItem {
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
  variant: {
    id: string;
    sku: string;
    stockQty: number;
    size: { id: string; size: string };
    productColor: {
      id: string;
      colorName: string;
      colorHex: string | null;
      images: string[];
      product: { id: string; name: string };
    };
  };
}

export interface OrderPayment {
  id: string;
  saleId: string;
  method: PaymentMethod;
  amount: DecimalValue;
  reference: string | null;
  receivedById: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
}

export interface OrderRefund {
  id: string;
  saleId: string;
  amount: DecimalValue;
  method: PaymentMethod;
  reason: string | null;
  processedById: string;
  refundedAt: string;
  createdAt: string;
  items: Array<{
    id: string;
    refundId: string;
    saleItemId: string;
    variantId: string;
    quantity: number;
    amount: DecimalValue;
  }>;
  payments: Array<{
    id: string;
    refundId: string;
    method: PaymentMethod;
    amount: DecimalValue;
    reference: string | null;
    createdAt: string;
  }>;
}

export interface OrderShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  rawStatus: string | null;
  payload: unknown;
  occurredAt: string;
  createdAt: string;
}

export interface OrderShipment {
  id: string;
  orderId: string;
  courierAccountId: string;
  provider: CourierProvider;
  consignmentId: string | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  courierStatus: string | null;
  codAmount: DecimalValue;
  deliveryCharge: DecimalValue | null;
  attempts: number;
  lastError: string | null;
  requestPayload: unknown;
  responsePayload: unknown;
  createdAt: string;
  updatedAt: string;
  courierAccount: {
    id: string;
    label: string;
    provider: CourierProvider;
  };
  events: OrderShipmentEvent[];
}

export interface OrderDetail extends Omit<OrderListItem, "_count" | "sale"> {
  sale: OrderSaleSummary & {
    customerId: string | null;
    soldById: string | null;
    subtotal: DecimalValue;
    discount: DecimalValue;
    shippingFee: DecimalValue;
    paidAmount: DecimalValue;
    dueAmount: DecimalValue;
    refundedAmount: DecimalValue;
    shippingAddress: string | null;
    notes: string | null;
    items: OrderSaleItem[];
    payments: OrderPayment[];
    refunds: OrderRefund[];
  };
  shipments: OrderShipment[];
}

export interface OrderListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
