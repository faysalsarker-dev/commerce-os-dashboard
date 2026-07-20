import type { Page } from "@/types/permissions/permissions.types"
import type { RouteObject } from "react-router"


export interface RouteConfig {
  path?: string
  index?: boolean
  name: string
  Component: React.ComponentType
  icon?: React.ComponentType<{ className?: string }>
  page?: Page 
  isVisible?: boolean
  children?: RouteConfig[]
}

function buildRoute(route: RouteConfig): RouteObject {
  const handle = { page: route.page }

  if (route.index) {
    return { index: true, Component: route.Component, handle }
  }

  return {
    path: route.path,
    Component: route.Component,
    handle,
    ...(route.children ? { children: route.children.map(buildRoute) } : {}),
  }
}

export function generateRoutes(routes: RouteConfig[]): RouteObject[] {
  return routes.map(buildRoute)
}