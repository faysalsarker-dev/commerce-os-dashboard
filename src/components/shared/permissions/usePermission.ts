// src/components/shared/permissions/usePermission.ts

import { useMemo } from "react";
import {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
} from "@/lib/permissions/checkPermission";

// ⚠ Adjust this import to match your actual auth hook/context.
// Expected shape: { user, role, isAuthenticated }
import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/types/permissions/permissions.types";

export function usePermission() {
  const { role } = useAuth();

  return useMemo(
    () => ({
      role,
      can: (permission: Permission) => checkPermission(role, permission),
      canAny: (permissions: Permission[]) =>
        checkAnyPermission(role, permissions),
      canAll: (permissions: Permission[]) =>
        checkAllPermissions(role, permissions),
    }),
    [role]
  );
}
