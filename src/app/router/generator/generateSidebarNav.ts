// src/app/router/generateSidebarNav.ts

import {
  checkAnyPermission,
  checkAllPermissions,
} from "@/lib/permissions/checkPermission";
import type { Role } from "@/types/permissions/permissions.types";
import type { IRoute } from "@/types/routes/route.types";

export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: IRoute["icon"];
  items?: SidebarNavItem[];
}

/**
 * Converts the SAME `routes` config used by generateRoutes() into the
 * shape your sidebar `data.navMain` already expects.
 *
 * WHY THIS EXISTS:
 * Without this, you'd maintain a second hand-written list of nav items
 * that silently drifts out of sync with the actual routes (add a page,
 * forget the sidebar; remove a page, forget to remove the link). This
 * function guarantees the sidebar can never show a link that isn't a
 * real route, and never hides a route from access control that it
 * still shows in the sidebar.
 *
 * Two filters are applied, in order:
 *  1. isVisible !== false   -> hides dynamic/detail routes (":id/edit")
 *  2. permission check      -> hides routes the current user can't access
 *
 * `basePath` accumulates as it recurses so nested items get correct,
 * absolute URLs (e.g. "/products/new") without you writing them by hand.
 */
export function generateSidebarNav(
  routes: IRoute[],
  role: Role | undefined | null,
  basePath = ""
): SidebarNavItem[] {
  return routes
    .filter((route) => route.isVisible !== false)
    .filter((route) => {
      if (!route.permission) return true;
      const perms = Array.isArray(route.permission)
        ? route.permission
        : [route.permission];
      return route.requireAll
        ? checkAllPermissions(role, perms)
        : checkAnyPermission(role, perms);
    })
    .map((route) => {
      const fullPath = route.index
        ? basePath || "/"
        : `${basePath}/${route.path}`.replace(/\/+/g, "/");

      const items = route.children
        ? generateSidebarNav(route.children, role, fullPath)
        : undefined;

      return {
        title: route.name,
        url: fullPath,
        icon: route.icon,
        ...(items?.length ? { items } : {}),
      };
    });
}
