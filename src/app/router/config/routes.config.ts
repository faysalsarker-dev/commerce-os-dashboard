import { PackageIcon, LayoutGridIcon, Undo, UsersRound, Ruler, ReceiptText, Tag, MessageSquareMore, Wallet, TicketPercent, Truck, ClipboardList } from "lucide-react"

import type { RouteConfig } from "@/types/routes/route.types"
import AllProduct from "@/app/pages/products/AllProduct"
import AllCategory from "@/app/pages/category/AllCategory"
import SizePage from "@/app/pages/size/SizePage"
import CouponPage from "@/app/pages/coupon/CouponPage"
import ProductDetailPage from "@/app/pages/products/ProductDetailPage"
import SellCounter from "@/app/pages/sells/SellCounter"
import SalesManagementPage from "@/app/pages/sells/SalesManagementPage"
import RefundCounter from "@/app/pages/refund/RefundCounter"
import RefundManagementPage from "@/app/pages/refund/RefundManagementPage"
import ProfilePage from "@/app/pages/profile/ProfilePage"
import AllUser from "@/app/pages/user/AllUser"
import CreateUser from "@/app/pages/user/CreateUser"
import UserDetailsPage from "@/app/pages/user/UserDetails"
import UserIdCard from "@/app/pages/user/UserIdCard"
import ExpenseCategoryPage from "@/app/pages/expense/ExpenseCategoryPage"
import ExpensePage from "@/app/pages/expense/ExpensePage"
import SalaryPage from "@/app/pages/salary/SalaryPage"
import SocialInboxPage from "@/modules/social-inbox/pages/SocialInboxPage"
import CustomerManagementPage from "@/app/pages/customer/CustomerManagementPage"
import CustomerProfilePage from "@/app/pages/customer/CustomerProfilePage"
import CourierIntegrationPage from "@/app/pages/courier-integration/CourierIntegrationPage"
import OrderManagementPage from "@/app/pages/order/OrderManagementPage"
import OrderCreatePage from "@/app/pages/order/OrderCreatePage"

export interface RouteGroup {
  label: string
  items: RouteConfig[]
}

export const routeGroups: RouteGroup[] = [
  {
    label: "Engage",
    items: [
      {
        path: "social-inbox",
        name: "Social Inbox",
        Component: SocialInboxPage,
        icon: MessageSquareMore,
        page: "social-inbox",
      },
    ],
  },
  {
    label: "Sells",
    items: [
      {
        path: "orders",
        name: "Orders",
        Component: OrderManagementPage,
        icon: ClipboardList,
        page: "orders",
      },
      {
        path: "orders/create",
        name: "Create Order",
        Component: OrderCreatePage,
        page: "orders",
        isVisible: false,
      },
      {
        path: "customers",
        name: "Customers",
        Component: CustomerManagementPage,
        icon: UsersRound,
        page: "customers",
      },
      {
        path: "customers/:id",
        name: "Customer Profile",
        Component: CustomerProfilePage,
        page: "customers",
        isVisible: false,
      },
      {
        path: "sell",
        name: "Sales Management",
        Component: SalesManagementPage,
        icon: ClipboardList,
        page: "sell",
      },
      {
        path: "sell/counter",
        name: "Sell Counter",
        Component: SellCounter,
        page: "sell",
        isVisible: false,
      },
    ]
  },
  {
    label: "Refund",
    items: [
      {
        path: "refund",
        name: "Refund Management",
        Component: RefundManagementPage,
        icon: Undo,
        page: "refund",
      },
      {
        path: "refund/process",
        name: "Refund Counter",
        Component: RefundCounter,
        page: "refund",
        isVisible: false,
      },
    ]
  },
  {
    label: "Integrations",
    items: [
      {
        path: "courier-integrations",
        name: "Courier Integrations",
        Component: CourierIntegrationPage,
        icon: Truck,
        page: "courier-integration",
      },
    ],
  },
  {
    label: "Data Library",
    items: [
      {
        path: "products",
        name: "Products",
        Component: AllProduct,
        icon: PackageIcon,
        page: "product",
      },
      {
        path: "category",
        name: "Category",
        Component: AllCategory,
        icon: LayoutGridIcon,
        page: "category",
      },
      {
        path: "size",
        name: "Size",
        Component: SizePage,
        icon: Ruler,
        page: "size",
      },
      {
        path: "coupons",
        name: "Coupons",
        Component: CouponPage,
        icon: TicketPercent,
        page: "coupon",
      },
      {
        path: "expense-categories",
        name: "Expense Categories",
        Component: ExpenseCategoryPage,
        icon: Tag,
        page: "expense",
      },
      {
        path: "expenses",
        name: "Expenses",
        Component: ExpensePage,
        icon: ReceiptText,
        page: "expense",
      },
      {
        path: "salary",
        name: "Payroll",
        Component: SalaryPage,
        icon: Wallet,
        page: "salary",
      },
      {
        path: "users",
        name: "Users",
        Component: AllUser,
        icon: UsersRound,
        page: "users",
        children: []
      },
      {
        path: "users/create",
        name: "Create User",
        Component: CreateUser,
        page: "users",
        isVisible: false,
      },
      {
        path: "users/:id",
        name: "User Details",
        Component: UserDetailsPage,
        page: "users",
        isVisible: false,
      },
      {
        path: "users/:id/id-card",
        name: "User ID Card",
        Component: UserIdCard,
        page: "users",
        isVisible: false,
      },
      {
        path: "products/:id",
        name: "Product Details",
        Component: ProductDetailPage,
        page: "product",
        isVisible: false,
      },
      {
        path: "profile",
        name: "Profile",
        Component: ProfilePage,
        page: "profile",
        isVisible: false,
      }
    ]
  },
]

export const routes: RouteConfig[] = routeGroups.flatMap((group) => group.items)
