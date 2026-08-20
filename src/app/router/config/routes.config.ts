import { PackageIcon, LayoutGridIcon, ScanBarcodeIcon, Undo, UsersRound } from "lucide-react"

import type { RouteConfig } from "@/types/routes/route.types"
import AllProduct from "@/app/pages/products/AllProduct"
import AllCategory from "@/app/pages/category/AllCategory"
import ProductDetailPage from "@/app/pages/products/ProductDetailPage"
import SellCounter from "@/app/pages/sells/SellCounter"
import RefundCounter from "@/app/pages/refund/RefundCounter"
import ProfilePage from "@/app/pages/profile/ProfilePage"
import AllUser from "@/app/pages/user/AllUser"



export interface RouteGroup {
  label: string
  items: RouteConfig[]
}

export const routeGroups: RouteGroup[] = [

  {
    label: "Sells",
    items: [
      {
        path: "sell",
        name: "Sell Counter",
        Component: SellCounter,
        icon: ScanBarcodeIcon,
        page: "sell",
      },
     


    ]
  },
  {
    label: "Refund",
    items: [
      {
        path: "refund",
        name: "Refund Counter",
        Component: RefundCounter,
        icon: Undo,
        page: "refund",
      }


    ]
  }
  ,
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
        path: "users",
        name: "Users",
        Component: AllUser,
        icon: UsersRound,
        page: "users",
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




//  {
//     label: "Data Library",
//     items: [
//       {
//         path: "products",
//         name: "Products",
//         Component: Page,
//         icon: BoxIcon,
//         index: true,
//         page: "products",
//         children: [
//           {
//             path: "new",
//             name: "New Product",
//             Component: Page,
//             page: "products",
//             isVisible: false,
//           },
//           {
//             path: ":id/edit",
//             name: "Edit Product",
//             Component: Page,
//             page: "products",
//             isVisible: false,
//           },
//         ],
//       },
//       {
//         path: "orders",
//         name: "Orders",
//         Component: Page,
//         icon: ListIcon,
//         page: "orders",
//       },
//       {
//         path: "inventory",
//         name: "Inventory",
//         Component: Page,
//         icon: WarehouseIcon,
//         page: "inventory",
//       },
//     ],
//   },
