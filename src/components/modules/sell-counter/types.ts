export interface PosProduct {
  id: string;
  sku: string;
  name: string;
  variant: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
}

export interface CartLine extends PosProduct {
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

export const MOCK_PRODUCTS: PosProduct[] = [
  {
    id: "p1",
    sku: "PJB-MRN-M",
    name: "Premium Jersey",
    variant: "Maroon / M",
    sellingPrice: 850,
    costPrice: 620,
    stock: 12,
  },
  {
    id: "p2",
    sku: "CTP-BLK-32",
    name: "Cotton Pant",
    variant: "Black / 32",
    sellingPrice: 1200,
    costPrice: 850,
    stock: 20,
  },
  {
    id: "p3",
    sku: "OXS-WHT-M",
    name: "Oxford Shirt",
    variant: "White / M",
    sellingPrice: 1450,
    costPrice: 1050,
    stock: 9,
  },
];

export const MOCK_CUSTOMERS: PosCustomer[] = [
  { id: "c1", name: "Rahim Uddin", phone: "01711223344" },
  { id: "c2", name: "Karim Sarker", phone: "01812223344" },
];

/** `image` is an icon/image URL slot — swap for real logo URLs later. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cash", name: "Cash", image: "" },
  { id: "bkash", name: "bKash", image: "" },
  { id: "nagad", name: "Nagad", image: "" },
  { id: "card", name: "Card", image: "" },
  { id: "bank", name: "Bank Transfer", image: "" },
];

/** Swap this for a real async API call later — signature already async. */
export async function lookupProductByCode(code: string): Promise<PosProduct | undefined> {
  const needle = code.trim().toLowerCase();
  return MOCK_PRODUCTS.find(
    (p) => p.sku.toLowerCase() === needle || p.name.toLowerCase().includes(needle),
  );
}

export async function lookupCustomerByPhone(phone: string): Promise<PosCustomer | undefined> {
  return MOCK_CUSTOMERS.find((c) => c.phone === phone.trim());
}