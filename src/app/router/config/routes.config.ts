import { BoxIcon} from "lucide-react"

import type { RouteConfig } from "@/types/routes/route.types"
import AllProduct from "@/app/pages/products/AllProduct"
import AllCategory from "@/app/pages/category/AllCategory"
import ProductDetailPage from "@/app/pages/products/ProductDetailPage"
import SellCounter from "@/app/pages/sells/SellCounter"



export interface RouteGroup {
  label: string
  items: RouteConfig[]
}

export const routeGroups: RouteGroup[] = [
 {label: "Data Library",
    items: [
      {
        path: "products",
        name: "Products",
        Component: AllProduct,
        icon: BoxIcon,
        page: "products",
      },
      {
        path: "category",
        name: "Products Category",
        Component: AllCategory,
        icon: BoxIcon,
        page: "category",
      },
      {
        path: "products/:id",
        name: "Product Details",
        Component: ProductDetailPage,
        page: "products",
        isVisible: false,
      },

    ]},
 {label: "Sells",
    items: [
      {
        path: "sell",
        name: "Sell Counter",
        Component: SellCounter,
        icon: BoxIcon,
        page: "sell",
      }
   

    ]}
  
]

// Flat list — routing doesn't care about sidebar grouping, only items do
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
