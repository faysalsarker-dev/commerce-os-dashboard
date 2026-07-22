// src/config/routes.config.t
import { BoxIcon, ListIcon, WarehouseIcon, UsersIcon, FileChartColumnIcon, Settings2Icon } from "lucide-react"

import type { RouteConfig } from "@/types/routes/route.types"
import Page from "@/app/pages/test/Page"



export interface RouteGroup {
  label: string
  items: RouteConfig[]
}

export const routeGroups: RouteGroup[] = [
  {
    label: "Data Library",
    items: [
      {
        path: "products",
        name: "Products",
        Component: Page,
        icon: BoxIcon,
        index: true,
        page: "products",
        children: [
          {
            path: "new",
            name: "New Product",
            Component: Page,
            page: "products",
            isVisible: false,
          },
          {
            path: ":id/edit",
            name: "Edit Product",
            Component: Page,
            page: "products",
            isVisible: false,
          },
        ],
      },
      {
        path: "orders",
        name: "Orders",
        Component: Page,
        icon: ListIcon,
        page: "orders",
      },
      {
        path: "inventory",
        name: "Inventory",
        Component: Page,
        icon: WarehouseIcon,
        page: "inventory",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        path: "users",
        name: "Users",
        Component: Page,
        icon: UsersIcon,
        page: "users",
      },
      {
        path: "reports",
        name: "Reports",
        Component: Page,
        icon: FileChartColumnIcon,
        page: "reports",
      },
      {
        path: "settings",
        name: "Settings",
        Component: Page,
        icon: Settings2Icon,
        page: "settings",
      },
    ],
  },
]

// Flat list — routing doesn't care about sidebar grouping, only items do
export const routes: RouteConfig[] = routeGroups.flatMap((group) => group.items)