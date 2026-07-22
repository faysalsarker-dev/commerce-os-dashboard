import type { Page, Resource } from "@/types/permissions/permissions.types"

export const RESOURCE_PAGE_MAP: Record<Resource, Page> = {
  product: "products",
  order: "orders",
  inventory: "inventory",
  user: "users",
  report: "reports",
  settings: "settings",
}