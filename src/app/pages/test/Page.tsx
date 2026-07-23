import { dateRange, getDefaultValues, multiSelect, numberRange, search, select } from "@/components/modules/filter";
import {  DataTable } from "@/components/modules/table";

import { action, column, createColumns } from "@/components/modules/table/column-builder";
import { FilterBar } from "@/components/shared/common";
import { PageContainer } from "@/components/shared/common/PageContainer";
import { PageHeader } from "@/components/shared/common/PageHeader";
import { Button } from "@/components/ui";

import { useFilter } from "@/hooks/useFilter";
import { Plus } from "lucide-react";























const statuses: Product["status"][] = ["active", "draft", "archived","cancelled", "pending", "completed", "shipped", "returned", "refunded", "processing", "waiting", "failed", "confirmed", "approved", "rejected", "inactive"];
const categories = ["Electronics", "Groceries", "Apparel", "Home"]

const fakeProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
  id: `prod_${i + 1}`,
  name: `Product ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  status: statuses[i % statuses.length],
  category: categories[i % categories.length],
  price: Math.round((10 + i * 3.5) * 100) / 100,
  stock: (i * 7) % 120,
}))




export type ProductStatus =
  | "active"
  | "draft"
  | "archived"
  | "cancelled"
  | "pending"
  | "completed"
  | "shipped"
  | "returned"
  | "refunded"
  | "processing"
  | "waiting"
  | "failed"
  | "confirmed"
  | "approved"
  | "rejected"
  | "inactive"

export interface Product {
  id: string
  name: string
  sku: string
  status: ProductStatus
  category: string
  price: number
  stock: number
}

// -------------------------------------------------------------------------
// Page-level handlers — the builder never knows what these do.
// -------------------------------------------------------------------------

const viewProduct = (product: Product) => {
  console.log("view", product.id)
}

const editProduct = (product: Product) => {
  console.log("edit", product.id)
}

const deleteProduct = (product: Product) => {
  console.log("delete", product.id)
}

// -------------------------------------------------------------------------
// Columns
// -------------------------------------------------------------------------

const productColumns = createColumns<Product>({
  resource: "product",

  columns: [
    column("name"),

    column("sku", {
      label: "SKU",
    }),

    column("category"),

    column.status("status"),

    column.currency("price"),

    column.number("stock"),

    column.actions([
      action.view({
        onClick: viewProduct,
      }),

      action.edit({
        permission: "update",
        onClick: editProduct,
      }),

      action.delete({
        permission: "delete",
        onClick: deleteProduct,
      }),
    ]),
  ],
})









export default function Page() {
 

  return (
  <PageContainer>

    <PageHeader
        title="Products"
        description="Manage your products and inventory."
        actions={
            <Button>
                <Plus className="size-4" />
                Add Product
            </Button>
        }
    />

  <FilterBar
          filter={filter}
          filters={productFilters}
        />

   <DataTable columns={productColumns} data={fakeProducts} defaultColumnVisibility={{ sku: false }} />

</PageContainer>
  )
}



