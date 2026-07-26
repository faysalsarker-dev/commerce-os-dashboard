import { createForm } from "@/components/modules/form/createForm"
import { EntityFormPage } from "@/components/modules/form/EntityFormPage"
import { useGetCategoriesQuery } from "@/redux/features/category/category.api"
import { useCreateProductMutation } from "@/redux/features/product/product.api"
import z from "zod"

// Single source of truth for both TS types AND validation
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  costPrice: z.coerce.number().positive("Cost price must be positive"),
  sellingPrice: z.coerce.number().positive("Selling price must be positive"),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const productFormConfig = createForm<ProductFormValues>()
  .field("name", {
    kind: "text",
    label: "Product Name",
    placeholder: "e.g. Premium Polo Shirt",
    colSpan: 2,
  })
  .field("description", { kind: "textarea", label: "Description", colSpan: 2 })
  .field("categoryId", {
    kind: "relation",
    label: "Category",
    useQueryHook: useGetCategoriesQuery, // dynamic, fetched — isLoading/isError handled by the engine
    labelKey: "name",
    valueKey: "id",
  })
  .field("costPrice", {
    kind: "number",
    label: "Cost Price",
    prefix: "৳",
    min: 0,
    step: 0.01,
  })
  .field("sellingPrice", {
    kind: "number",
    label: "Selling Price",
    prefix: "৳",
    min: 0,
    step: 0.01,
  })
  .build()

export default function AddProduct() {
  const [createProduct] = useCreateProductMutation()

  return (
    <EntityFormPage
      title="Add Product"
      description="Create the product container. You'll add colors, sizes, and stock on the next page."
      schema={productSchema}
      config={productFormConfig}
      submitLabel="Create & Continue"
      backTo="/products"
      onSubmit={(data) => createProduct(data).unwrap()}
      onSuccessNavigate={(result) => `/products/${result.data.id}`}
    />
  )
}
