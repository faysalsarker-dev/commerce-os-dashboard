import type { Action, Page, Resource } from "@/types/permissions/permissions.types"
import { ROLE_PERMISSIONS } from "./rbac.config"
import type { Role } from "@/types/data-types/enums"

export function can(role: Role | undefined, action: Action, resource: Resource): boolean {
  if (!role) return false
  const config = ROLE_PERMISSIONS[role]
  if (!config) return false

  if (config.actions === "*") return true // full control, every resource

  const resourceActions = config.actions[resource]
  if (!resourceActions) return false

  if (resourceActions === "*") return true // full control, THIS resource only
  return resourceActions.includes(action)
}

export function canAccessPage(role: Role | undefined, page: Page): boolean {
  if (!role) return false
  const config = ROLE_PERMISSIONS[role]
  if (!config) return false
  if (config.pages === "*") return true
  return config.pages.includes(page)
}