// src/lib/permissions/rbac.config.ts

import type { Role, Permission } from "@/types/permissions";

/**
 * Single source of truth: which permissions each role has.
 * Add/remove permissions here only — never hardcode role checks elsewhere.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "product:create",
    "product:edit",
    "product:delete",
    "product:view",
    "order:view",
    "order:create",
    "order:refund",
    "order:cancel",
    "inventory:view",
    "inventory:adjust",
    "user:manage",
    "user:view",
    "report:view",
    "report:export",
    "settings:manage",
  ],
  seller: [
    "product:view",
    "product:edit",
    "order:view",
    "order:create",
    "inventory:view",
    "report:view",
  ],
  moderator: [
    "product:view",
    "order:view",
    "order:refund",
    "user:view",
    "report:view",
  ],
};
