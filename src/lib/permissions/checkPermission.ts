// src/lib/permissions/checkPermission.ts

import type { Permission, Role } from "@/types/permissions/permissions.types";
import { ROLE_PERMISSIONS } from "./rbac.config";

/**
 * Pure function — no side effects, no React, no external state.
 * Safe to unit test in isolation and reuse in Commerzos or any other project.
 */
export function checkPermission(
  role: Role | undefined | null,
  permission: Permission
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Returns true if the role has ANY of the given permissions.
 */
export function checkAnyPermission(
  role: Role | undefined | null,
  permissions: Permission[]
): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.some((p) => checkPermission(role, p));
}

/**
 * Returns true if the role has ALL of the given permissions.
 */
export function checkAllPermissions(
  role: Role | undefined | null,
  permissions: Permission[]
): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.every((p) => checkPermission(role, p));
}
