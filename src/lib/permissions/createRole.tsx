import type { Page, Resource, ResourceActions, RoleConfig } from "@/types/permissions/permissions.types"
import { RESOURCE_PAGE_MAP } from "./resource-page.map"

export function createRole(
  actions: Partial<Record<Resource, ResourceActions>>
): RoleConfig {
  const pages = Array.from(
    new Set(Object.keys(actions).map((resource) => RESOURCE_PAGE_MAP[resource as Resource]))
  ) as Page[]

  return { pages, actions }
}



export function createSuperRole(): RoleConfig {
  return {
    pages: "*",
    actions: "*",
  }
}