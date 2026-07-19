// src/app/router/generateRoutes.ts

import { createElement } from "react";
import type { RouteObject } from "react-router";
import type { IRoute } from "@/types/routes/route.types";
import { ProtectedRoute } from "./ProtectedRoute";

/**
 * Converts the central `routes` config into react-router's RouteObject[].
 *
 * WHY THIS EXISTS:
 * routes.config.ts describes pages in terms of your domain (name, icon,
 * permission, visibility) — react-router doesn't need or want any of that.
 * This function is the ONLY place that translates "your" route shape into
 * "react-router's" route shape, so routes.config.ts never has to know
 * anything about createBrowserRouter internals.
 *
 * Runs recursively so nested `children` (e.g. products -> :id/edit) are
 * preserved at the correct depth automatically.
 */
export function generateRoutes(routes: IRoute[]): RouteObject[] {
  return routes.map((route) => {
    const page = createElement(route.Component);

    // If a route requires a permission, wrap it in ProtectedRoute.
    // Routes with no `permission` are just auth-gated by the parent
    // AuthWrapper already in your router tree — no extra wrapping needed.
    const element = route.permission
      ? createElement(
          ProtectedRoute,
          { permission: route.permission, requireAll: route.requireAll },
          page
        )
      : page;

    const routeObject: RouteObject = route.index
      ? { index: true, element }
      : { path: route.path, element };

    if (route.children?.length) {
      routeObject.children = generateRoutes(route.children);
    }

    return routeObject;
  });
}
