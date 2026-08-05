import { Role } from "@/types/data-types/enums";
import type { RolePermissions } from "@/types/permissions/permissions.types";
import { createRole, createSuperRole } from "./createRole";


export const ROLE_PERMISSIONS: RolePermissions = {
  [Role.SUPER_ADMIN]: createSuperRole(),

  [Role.ONLINE_SALESMAN]: createRole({
    product: ["view", "edit"],
    inventory: ["view"],
  }),

  [Role.OFFLINE_SALESMAN]: createRole({
    product: ["view"],
    inventory: ["view"],
  }),

  [Role.MARKETER]: createRole({
    product: ["view"],
  }),
}