import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";


interface IRoute {
  path: string;
  Component: ComponentType;
  icon: LucideIcon;
  name: string;
}

export const routes: IRoute[] = [
//   {
//     path: "/",
//     Component: AppLayout,
//     icon: Home,
//     name: "Dashboard",
//   },
];