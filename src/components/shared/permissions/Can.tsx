// src/components/shared/permissions/Can.tsx

import type { Permission } from "@/types/permissions/permissions.types";
import type { ReactNode } from "react";
import { usePermission } from "./usePermission";

interface CanProps {
  /** A single permission, or an array of permissions to check */
  permission: Permission | Permission[];
  /** When permission is an array, require ALL of them (default: ANY) */
  requireAll?: boolean;
  /** Optional content shown when the check fails (default: nothing) */
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, canAll } = usePermission();

  const allowed = Array.isArray(permission)
    ? requireAll
      ? canAll(permission)
      : canAny(permission)
    : can(permission);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
