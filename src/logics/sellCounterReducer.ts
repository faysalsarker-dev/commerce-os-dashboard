import type { CartLine } from "@/components/modules/sell-counter/types";
import type { Customer } from "@/types/data-types/customer/customer.types";

interface SellCounterState {
  lines: CartLine[];
  customer: Customer | null;
  notFoundPhone: string | null;
  discount: number;
  paymentMethodId: string | null;
  amountReceived: number;
  dueDate: Date | undefined;
}

const initialState: SellCounterState = {
  lines: [],
  customer: null,
  notFoundPhone: null,
  discount: 0,
  paymentMethodId: null,
  amountReceived: 0,
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
  | { type: "SET_PAYMENT_METHOD"; id: string }
  | { type: "SET_AMOUNT_RECEIVED"; amount: number }
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

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethodId: action.id };

    case "SET_AMOUNT_RECEIVED":
      return { ...state, amountReceived: action.amount };

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