import type { Page, Resource } from "@/types/permissions/permissions.types"

export const RESOURCE_PAGE_MAP: Record<Resource, Page> = {
  product: "product",
  inventory: "inventory",
  orders: "orders",
  users: "users",
  reports: "reports",
  category: "category",
  settings: "settings",
  sell: "sell",
add_product: "product",
};