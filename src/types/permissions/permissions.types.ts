// src/types/permissions.ts
export type Role = "admin" | "seller" | "moderator"

export type Page = "products" | "orders" | "inventory" | "users" | "reports" | "settings"

export type Resource = "product" | "order" | "inventory" | "user" | "report" | "settings"
export type Action = "view" | "create" | "edit" | "delete" | "refund" | "cancel" | "adjust" | "manage" | "export"

export interface RoleConfig {
  pages: Page[]
  actions: Partial<Record<Resource, Action[]>>
}

export type RolePermissions = Record<Role, RoleConfig>