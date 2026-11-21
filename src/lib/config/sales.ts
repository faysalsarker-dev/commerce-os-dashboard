import {
  SALE_CHANNELS,
  type SaleChannel,
} from "@/types/data-types/sales/sales.types"

// Enable only after the backend database migration is confirmed.
export const SELECTABLE_SALE_CHANNELS: readonly SaleChannel[] =
  import.meta.env.VITE_ENABLE_EXPANDED_SALE_CHANNELS === "true"
    ? SALE_CHANNELS
    : ["ONLINE", "OFFLINE"]
