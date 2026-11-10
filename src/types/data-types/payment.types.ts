export type TenderMethod = "CASH" | "BKASH" | "BANK_TRANSFER";

export type PaymentMethod =
  | TenderMethod
  | "NAGAD"
  | "ROCKET"
  | "CARD"
  | "MIX";

export interface PaymentEntry {
  method: PaymentMethod;
  amount: number | string;
  reference?: string | null;
}

export interface TenderPayment {
  method: TenderMethod;
  amount: number;
  reference?: string;
}

export interface TenderAmount {
  amount: string;
  reference: string;
}

export type TenderAmounts = Record<TenderMethod, TenderAmount>;

export const TENDER_METHODS: {
  value: TenderMethod;
  label: string;
  needsReference: boolean;
}[] = [
  { value: "CASH", label: "Cash", needsReference: false },
  { value: "BKASH", label: "bKash", needsReference: true },
  { value: "BANK_TRANSFER", label: "Bank transfer", needsReference: true },
];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  CARD: "Card",
  BANK_TRANSFER: "Bank transfer",
  MIX: "Mixed payment",
};

export function createEmptyTenderAmounts(): TenderAmounts {
  return {
    CASH: { amount: "", reference: "" },
    BKASH: { amount: "", reference: "" },
    BANK_TRANSFER: { amount: "", reference: "" },
  };
}

export function getTenderPayments(tenders: TenderAmounts): TenderPayment[] {
  return TENDER_METHODS.flatMap(({ value }) => {
    const tender = tenders[value];
    const amount = Number(tender.amount);
    if (!Number.isFinite(amount) || amount <= 0) return [];

    return [{
      method: value,
      amount: Math.round(amount * 100) / 100,
      ...(tender.reference.trim() ? { reference: tender.reference.trim() } : {}),
    }];
  });
}

export function sumTenderAmounts(tenders: TenderAmounts): number {
  const totalCents = TENDER_METHODS.reduce((sum, { value }) => {
    const amount = Number(tenders[value].amount);
    return sum + (Number.isFinite(amount) ? Math.round(amount * 100) : 0);
  }, 0);
  return totalCents / 100;
}
