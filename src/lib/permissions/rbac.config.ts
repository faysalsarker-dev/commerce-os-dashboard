import { Role } from "@/types/data-types/enums";
import type { RolePermissions } from "@/types/permissions/permissions.types";
import { createRole, createSuperRole } from "./createRole";

export const ROLE_PERMISSIONS: RolePermissions = {
  [Role.SUPER_ADMIN]: createSuperRole(),
  [Role.ADMIN]: createSuperRole(),
  [Role.MANAGER]: createRole({
    product: ["view", "create", "edit"],
    inventory: ["view", "edit"],
    orders: ["view", "manage"],
    customers: ["view", "create", "edit", "delete"],
    category: ["view", "create", "edit"],
    size: ["view", "create", "delete"],
    expense: ["view", "create", "edit", "delete"],
    expense_category: ["view", "create", "edit", "delete"],
    sell: ["view", "create"],
    refund: ["view", "refund"],
    reports: ["view"],
    users: ["view"],
    "social-inbox": ["view", "manage"],
  }),
  [Role.MARKETER]: createRole({
    product: ["view"],
    category: ["view"],
    size: ["view"],
    reports: ["view"],
    "social-inbox": ["view", "manage"],
  }),
  [Role.SALESMAN]: createRole({
    product: ["view"],
    category: ["view"],
    size: ["view"],
    sell: ["view", "create"],
    customers: ["view", "create"],
    refund: ["view", "refund"],
    inventory: ["view"],
    "social-inbox": ["view"],
  }),
};
