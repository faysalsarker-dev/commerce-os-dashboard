import type { Sale } from "@/components/modules/refund/types"
import {
  createEmptyTenderAmounts,
  type PaymentMethod,
  type TenderAmounts,
  type TenderMethod,
} from "@/types/data-types/payment.types"

export interface RefundCounterState {
  sale: Sale | null
  searched: boolean
  quantities: Record<string, number>
  paymentMethod: PaymentMethod
  payments: TenderAmounts
  reason: string
  error: string | null
}

export const initialRefundCounterState: RefundCounterState = {
  sale: null,
  searched: false,
  quantities: {},
  paymentMethod: "CASH",
  payments: createEmptyTenderAmounts(),
  reason: "",
  error: null,
}

export type RefundCounterAction =
  | { type: "SEARCH_STARTED" }
  | { type: "SALE_FOUND"; sale: Sale }
  | { type: "SET_QUANTITY"; saleItemId: string; quantity: number }
  | { type: "SET_PAYMENT_METHOD"; method: PaymentMethod }
  | { type: "SET_PAYMENT_AMOUNT"; method: TenderMethod; amount: string }
  | { type: "SET_PAYMENT_REFERENCE"; method: TenderMethod; reference: string }
  | { type: "SET_REASON"; reason: string }
  | { type: "SET_ERROR"; error: string | null }

export function refundCounterReducer(
  state: RefundCounterState,
  action: RefundCounterAction
): RefundCounterState {
  switch (action.type) {
    case "SEARCH_STARTED":
      return {
        ...initialRefundCounterState,
        searched: true,
      }
    case "SALE_FOUND":
      return {
        ...state,
        sale: action.sale,
        quantities: {},
        paymentMethod: "CASH",
        payments: createEmptyTenderAmounts(),
        error: null,
      }
    case "SET_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.saleItemId]: action.quantity,
        },
      }
    case "SET_PAYMENT_METHOD": {
      const nextMethod = action.method
      let nextPayments = { ...state.payments }

      if (nextMethod === "CASH") {
        const fallbackAmount =
          state.payments.BKASH.amount || state.payments.BANK_TRANSFER.amount
        nextPayments = {
          CASH: {
            amount: state.payments.CASH.amount || fallbackAmount || "",
            reference: "",
          },
          BKASH: { amount: "", reference: "" },
          BANK_TRANSFER: { amount: "", reference: "" },
        }
      } else if (nextMethod === "BKASH") {
        const fallbackAmount =
          state.payments.CASH.amount || state.payments.BANK_TRANSFER.amount
        nextPayments = {
          CASH: { amount: "", reference: "" },
          BKASH: {
            amount: state.payments.BKASH.amount || fallbackAmount || "",
            reference: state.payments.BKASH.reference,
          },
          BANK_TRANSFER: { amount: "", reference: "" },
        }
      } else if (nextMethod === "BANK_TRANSFER") {
        const fallbackAmount =
          state.payments.CASH.amount || state.payments.BKASH.amount
        nextPayments = {
          CASH: { amount: "", reference: "" },
          BKASH: { amount: "", reference: "" },
          BANK_TRANSFER: {
            amount: state.payments.BANK_TRANSFER.amount || fallbackAmount || "",
            reference: state.payments.BANK_TRANSFER.reference,
          },
        }
      } else if (nextMethod === "MIX") {
        nextPayments = {
          ...nextPayments,
          BANK_TRANSFER: { amount: "", reference: "" },
        }
      }

      return {
        ...state,
        paymentMethod: nextMethod,
        payments: nextPayments,
      }
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
      }
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
      }
    case "SET_REASON":
      return { ...state, reason: action.reason }
    case "SET_ERROR":
      return { ...state, error: action.error }
    default:
      return state
  }
}
