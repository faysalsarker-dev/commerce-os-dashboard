import { CategoryDialog } from "@/components/modules/category/CategoryDialog";
import { getDefaultValues, search, select } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import { action, column, createColumns  } from "@/components/modules/table/column-builder";
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common";
import { useFilter } from "@/hooks/useFilter";
import { usePagination } from "@/hooks/usePagination";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import type { Category } from "@/types/data-types/product/product.types";
import { useMemo, useState } from "react";



const categoryColumns = createColumns<Category>({
  resource: "category",

  columns: [
    column.image("image", {
      label: "Image",
      size: 44,
      rounded: "md",
    }),

    column("name", {
      sortable: true,
    }),


    column("description", {
      formatter: (value:string) => {
        if (!value) return "-";

        const words = String(value).split(" ");

        return words.length > 5
          ? `${words.slice(0, 5).join(" ")}...`
          : value;
      },
    }),

    column.status("isActive", {
      label: "Status",
      formatter: (value:boolean) => (value ? "active" : "inactive"),
    }),

    column.number("displayOrder", {
      label: "Order",
      sortable: true,
    }),

    column.date("createdAt", {
      label: "Created",
      sortable: true,
    }),

    column.actions([
      action.view<Category>({
        onClick: (category) => {
          console.log("View", category.id);
        },
      }),

      action.edit<Category>({
        onClick: (category) => {
          console.log("Edit", category.id);
        },
      }),

      action.delete<Category>({
        confirmTitle: "Delete Category",
        confirmDescription:
          "This category will be permanently deleted.",
        onClick: (category) => {
          console.log("Delete", category.id);
        },
      }),
    ]),
  ],
});





const statusOptions = [
  { label: "Active", value: "active", }, 
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
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
  select({ name: "sort", label: "Sort", placeholder: "Sort", options: sortOptions }),

]


export default function AllCategory() {
const [open,setOpen] = useState<boolean>(false)
  const filter = useFilter({
    defaultValues: getDefaultValues(productFilters),
    debounceMs: { search: 300 },
    syncToUrl: false,
   
  })
  const pagination = usePagination({ pageSize: 10, syncToUrl: false })

  const queryParams = useMemo(
    () => ({ ...filter.queryParams, ...pagination.paginationParams }),
    [filter.queryParams, pagination.paginationParams]
  )

  const { data: response, isLoading } = useGetCategoriesQuery(queryParams)




    const onEdit=()=>{
        setOpen(!open)
    }


 


  console.log(pagination,'params')
  return (
    <PageContainer>
         <PageHeader
        title="Category"
        description="Manage your products and inventory."
       onClick={onEdit}
    />
<FilterBar
          filter={filter}
          filters={productFilters}
        />
    <CategoryDialog  trigger={null} open={open} onOpenChange={setOpen} /> 
        <DataTable   columns={categoryColumns}
      data={response?.data ?? []}
      isLoading={isLoading}
       pagination={pagination.tableState}
      onPaginationChange={pagination.onTableStateChange}
      meta={response?.meta}
      
      />
        
        </PageContainer>
  )
}
