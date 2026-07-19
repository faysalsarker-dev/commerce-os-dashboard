// src/types/route.ts

import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "../permissions/permissions.types";

export interface IRoute {
  /** URL segment relative to parent. Omit when `index` is true. */
  path?: string;
  /** Display name — used as the sidebar label. */
  name: string;
  /** Page component to render for this route. */
  Component: ComponentType;
  /** Sidebar icon. Store the component reference, NOT a rendered <Icon /> element. */
  icon?: LucideIcon;
  /** Marks this as the index route of its parent (e.g. "/" or "/products"). */
  index?: boolean;
  /**
   * Controls SIDEBAR visibility only. Does NOT affect routing.
   * Default: true. Set false for dynamic/detail routes like ":id/edit".
   */
  isVisible?: boolean;
  /** Permission(s) required to access this route AND see it in the sidebar. */
  permission?: Permission | Permission[];
  /** When `permission` is an array, require ALL of them (default: ANY). */
  requireAll?: boolean;
  /** Nested routes (also nested sidebar items, if visible). */
  children?: IRoute[];
}
