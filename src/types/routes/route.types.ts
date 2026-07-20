

import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "../data-types/enums";

export interface IRoute {
  
  path?: string;
  name: string;
  Component: ComponentType;
  icon?: LucideIcon;
  index?: boolean;
  isVisible?: boolean;
  permission?: Role | Role[];
  requireAll?: boolean;
  children?: IRoute[];
}
