import { canAccessPage } from "@/lib/permissions/can";
import type { Role } from "@/types/data-types/enums";
import type { RouteConfig } from "@/types/routes/route.types";
import type { RouteGroup } from "../config/routes.config";



export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: RouteConfig["icon"];
  items?: SidebarNavItem[];
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

function buildRoutePath(basePath: string, routePath: string | undefined, isIndex?: boolean) {
  if (isIndex) return basePath || "/"
  if (!routePath) return basePath || "/"

  const normalizedBase = basePath === "/" ? "" : basePath
  const normalizedPath = routePath.startsWith("/")
    ? routePath
    : `${normalizedBase}/${routePath}`.replace(/\/+/, "/")

  return normalizedPath || "/"
}

function buildNavItems(
  routes: RouteConfig[],
  role: Role | undefined | null,
  basePath = ""
): SidebarNavItem[] {
  return routes
    .filter((route) => route.isVisible !== false)
    .filter((route) => {
      if (!route.page) return true;
      return canAccessPage(role ?? undefined, route.page);
    })
    .map((route) => {
      const fullPath = buildRoutePath(basePath, route.path, route.index);

      const items = route.children
        ? buildNavItems(route.children, role, fullPath)
        : undefined;

      return {
        title: route.name,
        url: fullPath,
        icon: route.icon,
        ...(items?.length ? { items } : {}),
      };
    });
}

/**
 * Walks routeGroups (not the flat routes list) so each group's `label`
 * survives into the sidebar output. Groups that end up with zero visible
 * items (everything filtered out by permission/isVisible) are dropped
 * entirely, so you never render an empty "WIDGETS" heading with nothing under it.
 */
export function generateSidebarNav(
  groups: RouteGroup[],
  role: Role | undefined | null
): SidebarNavGroup[] {
  return groups
    .map((group) => ({
      label: group.label,
      items: buildNavItems(group.items, role, "/app"),
    }))
    .filter((group) => group.items.length > 0);
}