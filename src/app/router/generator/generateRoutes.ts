import type { RouteConfig } from "@/types/routes/route.types"
import type { RouteObject } from "react-router"

function buildRoute(route: RouteConfig): RouteObject {
  const handle = { page: route.page }

  if (route.index) {
    return {
      index: true,
      Component: route.Component,
      handle,
    }
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