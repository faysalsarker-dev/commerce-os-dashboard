import type { CartLine } from "@/components/modules/sell-counter/types";
import {
  createEmptyTenderAmounts,
  type PaymentMethod,
  type TenderAmounts,
  type TenderMethod,
} from "@/types/data-types/payment.types";
import type { Customer } from "@/types/data-types/customer/customer.types";

interface SellCounterState {
  lines: CartLine[];
  customer: Customer | null;
  notFoundPhone: string | null;
  discount: number;
  paymentMethod: PaymentMethod;
  payments: TenderAmounts;
  dueDate: Date | undefined;
}

const initialState: SellCounterState = {
  lines: [],
  customer: null,
  notFoundPhone: null,
  discount: 0,
  paymentMethod: "CASH",
  payments: createEmptyTenderAmounts(),
  dueDate: undefined,
};

type Action =
  | { type: "ADD_LINE"; line: CartLine }
  | { type: "INCREMENT_LINE"; id: string }
  | { type: "SET_QUANTITY"; id: string; quantity: number }
  | { type: "REMOVE_LINE"; id: string }
  | { type: "SET_CUSTOMER"; customer: Customer | null; notFoundPhone: string | null }
  | { type: "CLEAR_CUSTOMER" }
  | { type: "SET_DISCOUNT"; discount: number }
  | { type: "SET_PAYMENT_METHOD"; method: PaymentMethod }
  | { type: "SET_PAYMENT_AMOUNT"; method: TenderMethod; amount: string }
  | { type: "SET_PAYMENT_REFERENCE"; method: TenderMethod; reference: string }
  | { type: "SET_DUE_DATE"; date: Date | undefined }
  | { type: "RESET_SALE" };

function sellCounterReducer(state: SellCounterState, action: Action): SellCounterState {
  switch (action.type) {
    case "ADD_LINE":
      return { ...state, lines: [...state.lines, action.line] };

    case "INCREMENT_LINE":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.id ? { ...l, quantity: l.quantity + 1 } : l,
        ),
      };

    case "SET_QUANTITY":
      if (action.quantity < 1) return state;
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.id ? { ...l, quantity: action.quantity } : l,
        ),
      };

    case "REMOVE_LINE":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };

    case "SET_CUSTOMER":
      return { ...state, customer: action.customer, notFoundPhone: action.notFoundPhone };

    case "CLEAR_CUSTOMER":
      return { ...state, customer: null, notFoundPhone: null };

    case "SET_DISCOUNT":
      return { ...state, discount: action.discount };

    case "SET_PAYMENT_METHOD": {
      const nextMethod = action.method;
      let nextPayments = { ...state.payments };

      if (nextMethod === "CASH") {
        const fallbackAmount =
          state.payments.BKASH.amount || state.payments.BANK_TRANSFER.amount;
        nextPayments = {
          CASH: {
            amount: state.payments.CASH.amount || fallbackAmount || "",
            reference: "",
          },
          BKASH: { amount: "", reference: "" },
          BANK_TRANSFER: { amount: "", reference: "" },
        };
      } else if (nextMethod === "BKASH") {
        const fallbackAmount =
          state.payments.CASH.amount || state.payments.BANK_TRANSFER.amount;
        nextPayments = {
          CASH: { amount: "", reference: "" },
          BKASH: {
            amount: state.payments.BKASH.amount || fallbackAmount || "",
            reference: state.payments.BKASH.reference,
          },
          BANK_TRANSFER: { amount: "", reference: "" },
        };
      } else if (nextMethod === "BANK_TRANSFER") {
        const fallbackAmount =
          state.payments.CASH.amount || state.payments.BKASH.amount;
        nextPayments = {
          CASH: { amount: "", reference: "" },
          BKASH: { amount: "", reference: "" },
          BANK_TRANSFER: {
            amount: state.payments.BANK_TRANSFER.amount || fallbackAmount || "",
            reference: state.payments.BANK_TRANSFER.reference,
          },
        };
      } else if (nextMethod === "MIX") {
        nextPayments = {
          ...nextPayments,
          BANK_TRANSFER: { amount: "", reference: "" },
        };
      }

      return {
        ...state,
        paymentMethod: nextMethod,
        payments: nextPayments,
      };
    }

    case "SET_PAYMENT_AMOUNT":
      return {
        ...state,
        payments: {
          ...state.payments,
          [action.method]: {
            ...state.payments[action.method],
            amount: action.amount,
          },
        },
      };

    case "SET_PAYMENT_REFERENCE":
      return {
        ...state,
        payments: {
          ...state.payments,
          [action.method]: {
            ...state.payments[action.method],
            reference: action.reference,
          },
        },
      };

    case "SET_DUE_DATE":
      return { ...state, dueDate: action.date };

    case "RESET_SALE":
      return initialState;

    default:
      return state;
  }
}

export { sellCounterReducer, initialState };
export type { SellCounterState, Action as SellCounterAction };