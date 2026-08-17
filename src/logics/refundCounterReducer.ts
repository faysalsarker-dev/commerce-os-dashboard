import type { RefundMethod, Sale } from "@/components/modules/refund/types"

export interface RefundCounterState {
  sale: Sale | null
  searched: boolean
  quantities: Record<string, number>
  method: RefundMethod | null
  reason: string
  error: string | null
}

export const initialRefundCounterState: RefundCounterState = {
  sale: null,
  searched: false,
  quantities: {},
  method: null,
  reason: "",
  error: null,
}

export type RefundCounterAction =
  | { type: "SEARCH_STARTED" }
  | { type: "SALE_FOUND"; sale: Sale }
  | { type: "SET_QUANTITY"; saleItemId: string; quantity: number }
  | { type: "SET_METHOD"; method: RefundMethod }
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
      return { ...state, sale: action.sale }
    case "SET_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.saleItemId]: action.quantity,
        },
      }
    case "SET_METHOD":
      return { ...state, method: action.method }
    case "SET_REASON":
      return { ...state, reason: action.reason }
    case "SET_ERROR":
      return { ...state, error: action.error }
    default:
      return state
  }
}
