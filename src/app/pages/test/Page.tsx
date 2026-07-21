import { dateRange, getDefaultValues, multiSelect, numberRange, search, select } from "@/components/modules/filter";
import { FilterBar } from "@/components/shared/common";
import { PageContainer } from "@/components/shared/common/PageContainer";
import { PageHeader } from "@/components/shared/common/PageHeader";
import { Button } from "@/components/ui";
import { useFilter } from "@/hooks/useFilter";
import { Plus } from "lucide-react";
import { useState } from "react";





const statusOptions = [
  { label: "Active", value: "active", default: true }, // pre-selected + used by reset()
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
]
 
const categoryOptions = [
  { label: "Electronics", value: "electronics" },
  { label: "Groceries", value: "groceries" },
  { label: "Apparel", value: "apparel" },
]
 
const brandOptions = [
  { label: "Acme", value: "acme" },
  { label: "Globex", value: "globex" },
  { label: "Initech", value: "initech" },
]
 
const sortOptions = [
  { label: "Newest first", value: "-createdAt" },
  { label: "Oldest first", value: "createdAt" },
  { label: "Price: low to high", value: "price" },
  { label: "Price: high to low", value: "-price" },
  { label: "Stock: low to high", value: "stock" },
]
 



const productFilters = [
  search({ name: "search", label: "Search", placeholder: "Search by name or SKU..." }),
  select({ name: "status", label: "Status", placeholder: "Status", options: statusOptions }),
  select({ name: "category", label: "Category", placeholder: "Category", options: categoryOptions }),
  multiSelect({ name: "brand", label: "Brand", placeholder: "Brand", options: brandOptions }),
  numberRange({ name: "price", label: "Price", min: 0, step: 1, prefix: "$" }),
  dateRange({ name: "createdAt", label: "Created" }),
]

const PAGE_SIZE = 10

export default function Page() {
  const filter = useFilter({
    // status starts on "active" because that option carries `default: true` above.
    defaultValues: getDefaultValues(productFilters),
    // Only free-text search is debounced. Dropdowns, date range, and price range
    // apply instantly since they're deliberate clicks, not keystrokes.
    debounceMs: { search: 300 },
    // Filters, sort, and page all survive refresh and back-navigation.
    syncToUrl: true,
    pageSize: 10,
    defaultSort: sortOptions[0].value,
  })

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

  

</PageContainer>
  )
}
