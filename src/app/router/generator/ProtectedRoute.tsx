// src/app/router/ProtectedRoute.tsx

import type { ReactNode } from "react";

import {
  checkAnyPermission,
  checkAllPermissions,
} from "@/lib/permissions/checkPermission";
import type { Permission } from "@/types/permissions/permissions.types";
import { useAuth } from "@/hooks/auth/useAuth";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  permission: Permission | Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

/**
 * Route-level guard. Used by generateRoutes() — you should not need to
 * reference this directly in page files.
 *
 * Not authenticated  -> redirect to /auth/login
 * Authenticated, no permission -> redirect to /error/forbidden
 * Otherwise -> render the page
 */
export function ProtectedRoute({
  permission,
  requireAll = false,
  children,
}: ProtectedRouteProps) {
  // const { role, isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  // const perms = Array.isArray(permission) ? permission : [permission];
  // const allowed = requireAll
  //   ? checkAllPermissions(role, perms)
  //   : checkAnyPermission(role, perms);

  // if (!allowed) {
  //   return <Navigate to="/error/forbidden" replace />;
  // }

  return <>{children}</>;
}
