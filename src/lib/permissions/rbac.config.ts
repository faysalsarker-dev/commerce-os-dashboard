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
    category: ["view", "create", "edit"],
    sell: ["view", "create"],
    refund: ["view", "refund"],
    reports: ["view"],
    users: ["view"],
  }),
  [Role.MARKETER]: createRole({
    product: ["view"],
    category: ["view"],
    reports: ["view"],
  }),
  [Role.SALESMAN]: createRole({
    product: ["view"],
    category: ["view"],
    sell: ["view", "create"],
    refund: ["view", "refund"],
    inventory: ["view"],
  }),
}