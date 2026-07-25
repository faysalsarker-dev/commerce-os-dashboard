import { getDefaultValues, search, select, useFilter } from "@/components/modules/filter";
import { DataTable } from "@/components/modules/table";
import { action, column, createColumns } from "@/components/modules/table/column-builder";
import { FilterBar, PageContainer, PageHeader } from "@/components/shared/common";
import { usePagination } from "@/hooks/usePagination";
import { useGetProductsQuery } from "@/redux/features/product/product.api";
import type { Product } from "@/types/data-types/product/product.types";
import { useNavigate } from "react-router";
import { useMemo } from "react";


const statusOptions = [
  { label: "Active", value: "active", default: true }, 
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
]
 

const sortOptions = [
  { label: "Newest first", value: "-createdAt" ,default: true},
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










const categories = [
  "Electronics",
  "Fashion",
  "Shoes",
  "Home & Living",
  "Sports",
  "Beauty",
];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#22C55E" },
];

const sizes = ["S", "M", "L", "XL"];


const fakeProducts: Product[] = Array.from({ length: 100 }, (_, i) => {
  const productId = `prod_${i + 1}`;
  const categoryId = `cat_${(i % categories.length) + 1}`;

  const selectedColors = colors.slice(0, (i % 3) + 1);

  return {
    id: productId,

    name: `Product ${i + 1}`,

    description: `This is the description for Product ${i + 1}.`,

    categoryId,

    category: {
      id: categoryId,
      name: categories[i % categories.length],
    },

    costPrice: 500 + i * 20,

    sellingPrice: 750 + i * 30,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),

    colors: selectedColors.map((color, colorIndex) => ({
      id: `color_${productId}_${colorIndex}`,

      productId,

      colorName: color.name,

      colorHex: color.hex,

      images: [
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvKMuLZl1DPdkgAW_CvEMrWBVUxfKumfJ6mrrgtdjmWQ`,
      ],

      createdAt: new Date().toISOString(),

      variants: sizes.map((size, sizeIndex) => ({
        id: `variant_${productId}_${colorIndex}_${size}`,

        productColorId: `color_${productId}_${colorIndex}`,

        size,

        sku: `SKU-${i + 1}-${color.name.substring(0, 3).toUpperCase()}-${size}`,

        stockQty: ((i + 1) * (sizeIndex + 2) * 3) % 120,

        costPriceOverride:
          sizeIndex % 2 === 0 ? null : 520 + i * 20,

        sellingPriceOverride:
          sizeIndex % 2 === 0 ? null : 780 + i * 30,

        qrCode: `QR-${i + 1}-${colorIndex}-${size}`,

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      })),
    })),
  };
});






const productColumns = createColumns<Product>({
  resource: "product",

  columns: [
column.image("colors", {
  label: "Image",
  size: 46,
  sortable: false,
  rounded: "none",
  formatter: (_, row) => row.colors[0]?.images[0],
}),
    column("name",
      {sortable: false,}
    ),

    column("category.name", {
  label: "Category",
}),

    column.currency("costPrice", {
      label: "Cost Price",
      sortable:true,
      currency: "BDT",
    }),

    column.currency("sellingPrice", {
      label: "Selling Price",
      currency: "BDT",
    }),

    column("colors", {
      label: "Colors",
      align: "center",
      formatter: (_, row) => row.colors.length,
    }),

    column.date("createdAt"),

    column.actions([
      action.view<Product>({
        onClick: (product) => {
          console.log("View", product.id);
        },
      }),

      action.edit<Product>({
        onClick: (product) => {
          console.log("Edit", product.id);
        },
      }),

      action.delete<Product>({
        can: "delete",
        confirmTitle: "Delete Product",
        confirmDescription:
          "This product will be permanently deleted.",
        onClick: (product) => {
          console.log("Delete", product.id);
        },
      }),
    ]),
  ],
});




export default function AllProduct() {
const navigatge =useNavigate()
 const filter = useFilter({
    // status starts on "active" because that option carries `default: true` above.
    defaultValues: getDefaultValues(productFilters),
    // Only free-text search is debounced. Dropdowns, date range, and price range
    // apply instantly since they're deliberate clicks, not keystrokes.
    debounceMs: { search: 300 },
    // Filters, sort, and page all survive refresh and back-navigation.
    syncToUrl: true,
    pageSize: 10,
  })
  const pagination = usePagination({ pageSize: 10, syncToUrl: true })

  const queryParams = useMemo(() => {
    const { sort, ...filters } = filter.queryParams
    const selectedSort = sort ?? sortOptions[0].value
    const status = filter.debouncedValues.status
    const isDescending = selectedSort.startsWith("-")

    return {
      ...filters,
      ...(status ? { status } : {}),
      ...pagination.paginationParams,
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? "desc" as const : "asc" as const,
    }
  }, [filter.debouncedValues.status, filter.queryParams, pagination.paginationParams])

  const { data: response, isLoading } = useGetProductsQuery(queryParams)



  return (
    <PageContainer>
  <PageHeader
        title="Products"
        description="Manage your products and inventory."
        onClick={()=>navigatge("/")}
    />

  <FilterBar
          filter={filter}
          filters={productFilters}
        />
<DataTable
  columns={productColumns}
  data={response?.data ?? []}
  isLoading={isLoading}
  pagination={pagination.tableState}
  onPaginationChange={pagination.onTableStateChange}
  meta={response?.meta}
/>

    </PageContainer>
  )
}
