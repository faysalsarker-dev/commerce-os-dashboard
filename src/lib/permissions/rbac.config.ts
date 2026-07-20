import type { RolePermissions } from "@/types/permissions/permissions.types";



export const ROLE_PERMISSIONS: RolePermissions = {
  admin: {
    pages: ["products", "orders", "inventory", "users", "reports", "settings"],
    actions: {
      product: ["view", "create", "edit", "delete"],
      order: ["view", "create", "refund", "cancel"],
      inventory: ["view", "adjust"],
      user: ["view", "manage"],
      report: ["view", "export"],
      settings: ["manage"],
    },
  },

  seller: {
    pages: ["products", "orders", "inventory", "reports"],
    actions: {
      product: ["view", "edit"],
      order: ["view", "create"],
      inventory: ["view"],
      report: ["view"],
    },
  },

  moderator: {
    pages: ["products", "orders", "users", "reports"],
    actions: {
      product: ["view"],
      order: ["view", "refund"],
      user: ["view"],
      report: ["view"],
    },
  },
}