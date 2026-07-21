

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

];


