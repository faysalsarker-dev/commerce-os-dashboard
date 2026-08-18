import { useNavigate, useParams } from "react-router"
import { useState } from "react"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EntityFormDialog } from "@/components/modules/form/EntityFormDialog"
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/features/product/product.api"
import { PageContainer } from "@/components/shared/common"
import { Metric } from "@/components/modules/Products/PageHeader"
import { PageHeader } from "@/components/modules/Products/PageHeader"
import { ProductDetailSkeleton } from "@/components/modules/Products/ProductDetailSkeleton"
import { ProductColorsSection } from "@/components/modules/Products/ProductColorSection"
import { productFormConfig } from "@/components/modules/Products/Product.config"
import { productSchema, type ProductFormValues } from "@/types/validations/product/product"
import { formatCurrency } from "@/lib/formatCurrency"
import PageEmptyState from "@/components/shared/common/PageEmptyState"


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: response, isLoading, isError } = useGetProductQuery(id!, { skip: !id })
  const product = response?.data
  const [updateProduct] = useUpdateProductMutation()
  const [editProductOpen, setEditProductOpen] = useState(false)

  if (isLoading) {
    return (
      <PageContainer className="mx-auto max-w-6xl">
        <ProductDetailSkeleton />
      </PageContainer>
    )
  }

  if (isError || !product) {
    return (
      <PageContainer className="mx-auto max-w-6xl">
      <PageEmptyState
      title="Product not found"
      description="The product you're looking for doesn't exist or may have been removed."
      buttonText="Back to Products"
      navigateTo="/app/products"
    />
      </PageContainer>
    )
  }

  const totalVariants = product.colors.reduce((total, color) => total + color.variants.length, 0)
  const stockOnHand = product.colors.reduce(
    (total, color) => total + color.variants.reduce((sum, variant) => sum + variant.stockQty, 0),
    0,
  )
  const margin = product.sellingPrice - product.costPrice

  const updateProductDetails = (data: ProductFormValues) => updateProduct({ id: product.id, data }).unwrap()

  return (
    <PageContainer className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={
          <Button variant="ghost" size="sm" className="-ml-2 h-7 px-2 text-muted-foreground" onClick={() => navigate("/app/products")}>
            <ArrowLeft /> Products
          </Button>
        }
        title={product.name}
        description={product.description || "No description has been added yet."}
        actions={
          <Button onClick={() => setEditProductOpen(true)}>
            <Pencil /> Edit product
          </Button>
        }
        meta={
          <>
            <Metric label="Category" value={product.category?.name ?? "Uncategorised"} />
            <Metric label="Cost price" value={formatCurrency(product.costPrice)} />
            <Metric label="Selling price" value={formatCurrency(product.sellingPrice)} />
            <Metric
              label="Margin"
              value={formatCurrency(margin)}
              hint={product.sellingPrice ? `${((margin / product.sellingPrice) * 100).toFixed(1)}%` : undefined}
            />
            <Metric label="Stock on hand" value={stockOnHand} hint={`${totalVariants} SKU${totalVariants === 1 ? "" : "s"}`} />
          </>
        }
      />

      <ProductColorsSection productId={product.id} productName={product.name} colors={product.colors} />

      <EntityFormDialog
        open={editProductOpen}
        onOpenChange={setEditProductOpen}
        title="Edit product"
        description="Update the core information for this product."
        schema={productSchema}
        config={productFormConfig}
        defaultValues={{
          name: product.name,
          description: product.description ?? "",
          categoryId: product.categoryId ?? undefined,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
        }}
        submitLabel="Save changes"
        onSubmit={updateProductDetails}
      />
    </PageContainer>
  )
}