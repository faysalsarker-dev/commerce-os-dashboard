import type { ScannedProduct } from "@/types/data-types/sales/sales.types";
import cash from "@/assets/cash_payment.png";
import bkash from "@/assets/bkash_payment.png";

export interface CartLine extends ScannedProduct {
  id: string; // = variantId, kept as `id` since list rendering/keys expect it
  quantity: number;
}

export interface PosCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  image: string;
}

/** `image` is an icon/image URL slot — swap for real logo URLs later. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cash", name: "Cash", image: cash },
  { id: "bkash", name: "bKash", image: bkash },
];