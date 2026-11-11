import type { Role } from "../data-types/enums"

export type Page = "product" | "orders" | "inventory" | "users" | "customers" | "reports" | "settings" | "category" | "size" | "expense" | "sell" | "add_product" | "refund" | "profile" | "dashboard" | "social-inbox" | "all"
export type Resource = "product" | "orders" | "inventory" | "users" | "customers" | "reports" | "settings" | "category" | "size" | "expense" | "expense_category" | "sell" | "add_product" | "refund" | "profile" | "dashboard" | "social-inbox" | "all"
export type Action = "view" | "create" | "edit" | "delete" | "refund" | "cancel" | "adjust" | "manage" | "export"

// A resource's actions can be an explicit list, OR "*" for full control of that resource
export type ResourceActions = Action[] | "*"

export interface RoleConfig {
  pages: Page[] | "*"
  actions: Partial<Record<Resource, ResourceActions>> | "*"
}

export type RolePermissions = Record<Role, RoleConfig>
