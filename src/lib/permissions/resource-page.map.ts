import type { Page, Resource } from "@/types/permissions/permissions.types"

export const RESOURCE_PAGE_MAP: Record<Resource, Page> = {
  product: "product",
  inventory: "inventory",
  orders: "orders",
  users: "users",
  customers: "customers",
  reports: "reports",
  category: "category",
  size: "size",
  expense: "expense",
  expense_category: "expense",
  settings: "settings",
  sell: "sell",
  refund: "refund",
  add_product: "product",
  profile: "profile",
  dashboard: "dashboard",
  "social-inbox": "social-inbox",
  all: "all",
};
