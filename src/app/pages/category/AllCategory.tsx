import { CategoryDialog } from "@/components/modules/category/CategoryDialog";
import { getDefaultValues, search, select } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import { action, column, createColumns  } from "@/components/modules/table/column-builder";
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common";
import { useFilter } from "@/hooks/useFilter";
import { usePagination } from "@/hooks/usePagination";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "@/redux/features/category/category.api";
import type { Category } from "@/types/data-types/category/category.types";
import { useMemo, useState } from "react";
import { toast } from "sonner";









const statusOptions = [
  { label: "Active", value: true, }, 
  { label: "inActive", value: false },
]
 
const sortOptions = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
    { label: "Display Order (Low → High)", value: "displayOrder" },
  { label: "Display Order (High → Low)", value: "-displayOrder" },

]
 



const productFilters = [
  search({ name: "searchTerm", label: "Search", placeholder: "Search by name" }),
  select({ name: "isActive", label: "Status", placeholder: "Status", options: statusOptions }),
  select({ name: "sort", label: "Sort", placeholder: "Sort", options: sortOptions }),

]


export default function AllCategory() {
const [open,setOpen] = useState<boolean>(false)
  const filter = useFilter({
    defaultValues: getDefaultValues(productFilters),
    debounceMs: { search: 300 },
    syncToUrl: true,
   
  })
  const pagination = usePagination({ pageSize: 10, syncToUrl: true })

  const queryParams = useMemo(
    () => ({ ...filter.queryParams , ...pagination.paginationParams }),
    [filter.queryParams, pagination.paginationParams]
  )

  const { data: response, isLoading } = useGetCategoriesQuery(queryParams)
const [deleteCategory]=useDeleteCategoryMutation()





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
  formatter: (value) => {
  const name = value as string;
  return name.toUpperCase();
}
    }),

    column.status("isActive", {
      label: "Status",
      formatter: (value) => {
  const isActive = value as boolean;

  return isActive ? "Active" : "Inactive";
}
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
          deleteCategory(category.id).unwrap()
          toast.success("Category deleted")
        },
      }),
    ]),
  ],
});


    const onEdit=()=>{
        setOpen(!open)
    }


 


  
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
