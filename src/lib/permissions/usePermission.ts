import { useAuth } from "@/hooks/auth/useAuth"
import { can, canAccessPage } from "@/lib/permissions/can"
import type { Action, Page, Resource, Role } from "@/types/permissions/permissions.types"


export function usePermission() {
  const { role } = useAuth()

  return {
    can: (action: Action, resource: Resource) => can(role as Role, action, resource),
    canAccessPage: (page: Page) => canAccessPage(role as Role, page),
  }
}