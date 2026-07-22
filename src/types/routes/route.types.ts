


import type { Page } from "../permissions/permissions.types";
export interface RouteConfig {
  path?: string
  index?: boolean
  name: string
  Component: React.ComponentType
  icon?: React.ComponentType<{ className?: string }>
  page?: Page // maps this route to a permission "page" — omit for auth-only routes
  isVisible?: boolean // false = registered route, hidden from sidebar
  children?: RouteConfig[]
}