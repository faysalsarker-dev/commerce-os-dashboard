import type { Role } from "../data-types/enums"

export type Page = "products" | "orders" | "inventory" | "users" | "reports" | "settings"
export type Resource = "product" | "order" | "inventory" | "user" | "report" | "settings"
export type Action = "view" | "create" | "edit" | "delete" | "refund" | "cancel" | "adjust" | "manage" | "export"

// A resource's actions can be an explicit list, OR "*" for full control of that resource
export type ResourceActions = Action[] | "*"

export interface RoleConfig {
  pages: Page[] | "*"
  actions: Partial<Record<Resource, ResourceActions>> | "*"
}

export type RolePermissions = Record<Role, RoleConfig>