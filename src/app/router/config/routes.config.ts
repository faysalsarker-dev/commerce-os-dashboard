

import {
  LayoutDashboardIcon,
  BoxIcon,
  ShoppingCartIcon,
  UsersIcon,
  FileChartColumnIcon,
  Settings2Icon,
} from "lucide-react";


// import DashboardPage from "@/app/pages/dashboard/DashboardPage";
// import ProductListPage from "@/app/pages/products/ProductListPage";
// import ProductFormPage from "@/app/pages/products/ProductFormPage";
// import OrderListPage from "@/app/pages/orders/OrderListPage";
// import OrderDetailPage from "@/app/pages/orders/OrderDetailPage";
// import UserListPage from "@/app/pages/users/UserListPage";
// import ReportsPage from "@/app/pages/reports/ReportsPage";
// import SettingsPage from "@/app/pages/settings/SettingsPage";
import type { IRoute } from "@/types/routes/route.types";

/**
 * SINGLE SOURCE OF TRUTH.
 * Every page in the app is registered here exactly once.
 * generateRoutes() reads this to build the browser router.
 * generateSidebarNav() reads this to build the sidebar.
 */
export const routes: IRoute[] = [
  {
    path: "/",
    name: "Dashboard",
    Component: DashboardPage,
    icon: LayoutDashboardIcon,
    index: true,
  },
  {
    path: "products",
    name: "Products",
    Component: ProductListPage,
    icon: BoxIcon,
    permission: "product:view",
    children: [
      {
        path: "new",
        name: "New Product",
        Component: ProductFormPage,
        permission: "product:create",
        isVisible: false, // in the router, hidden from sidebar
      },
      {
        path: ":id/edit",
        name: "Edit Product",
        Component: ProductFormPage,
        permission: "product:edit",
        isVisible: false, // dynamic route, no sidebar entry
      },
    ],
  },
  {
    path: "orders",
    name: "Orders",
    Component: OrderListPage,
    icon: ShoppingCartIcon,
    permission: "order:view",
    children: [
      {
        path: ":id",
        name: "Order Detail",
        Component: OrderDetailPage,
        permission: "order:view",
        isVisible: false,
      },
    ],
  },
  {
    path: "users",
    name: "Team",
    Component: UserListPage,
    icon: UsersIcon,
    permission: "user:view",
  },
  {
    path: "reports",
    name: "Reports",
    Component: ReportsPage,
    icon: FileChartColumnIcon,
    permission: "report:view",
  },
  {
    path: "settings",
    name: "Settings",
    Component: SettingsPage,
    icon: Settings2Icon,
    permission: "settings:manage",
  },
];


