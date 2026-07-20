import { ROLE_PERMISSIONS } from "./rbac.config"
import type { Action, Page, Resource, Role } from "@/types/permissions/permissions.types"

// "Can this role do {action} on {resource}?"
export function can(
  roles: Role | Role[] | undefined,
  action: Action,
  resource: Resource
): boolean {
  if (!roles) return false
  const roleList = Array.isArray(roles) ? roles : [roles]
  return roleList.some((role) =>
    ROLE_PERMISSIONS[role]?.actions[resource]?.includes(action)
  )
}

// "Can this role access this page?"
export function canAccessPage(
  roles: Role | Role[] | undefined,
  page: Page
): boolean {
  if (!roles) return false
  const roleList = Array.isArray(roles) ? roles : [roles]
  return roleList.some((role) => ROLE_PERMISSIONS[role]?.pages.includes(page))
}