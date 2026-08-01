import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { createForm } from "../form/createForm";
import type { ProductFormValues } from "@/types/validations/product/product";

export const productFormConfig = createForm<ProductFormValues>()
  .field("name", { kind: "text", label: "Product Name", placeholder: "e.g. Premium Polo Shirt", colSpan: 2 })
  .field("description", { kind: "textarea", label: "Description", colSpan: 2 })
  .field("categoryId", { kind: "relation", label: "Category", useQueryHook: useGetCategoriesQuery, labelKey: "name", valueKey: "id" })
  .field("costPrice", { kind: "number", label: "Cost Price", prefix: "৳", min: 0, step: 0.01 })
  .field("sellingPrice", { kind: "number", label: "Selling Price", prefix: "৳", min: 0, step: 0.01 })
  .build()
