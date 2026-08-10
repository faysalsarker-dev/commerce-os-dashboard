import { useState } from "react"
import { Boxes, Plus } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/EmptyState"
import { ColorCard } from "@/components/modules/Products/ColorCard"
import { ColorFormDialog } from "@/components/modules/Products/ColorFormDialog"
import {
  useCreateProductColorMutation,
  useCreateProductVariantMutation,
  useDeleteProductColorMutation,
  useDeleteProductVariantMutation,
  useUpdateProductColorMutation,
  useUpdateProductVariantMutation,
} from "@/redux/features/product/product.api"
import type { ProductColor } from "@/types/data-types/product/product.types"
import type { VariantFormValues } from "@/components/modules/Products/VariantSheet"
import { handleAsyncMutation } from "@/utils/asyncHandler"

interface ProductColorsSectionProps {
  productId: string
  productName: string
  colors: ProductColor[]
}

export function ProductColorsSection({ productId, productName, colors }: ProductColorsSectionProps) {
  const [createColor] = useCreateProductColorMutation()
  const [updateColor] = useUpdateProductColorMutation()
  const [deleteColor] = useDeleteProductColorMutation()
  const [createVariantMutation] = useCreateProductVariantMutation()
  const [updateVariantMutation] = useUpdateProductVariantMutation()
  const [deleteVariantMutation] = useDeleteProductVariantMutation()

  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<ProductColor | null>(null)

  const openColorDialog = (color: ProductColor | null) => {
    setEditingColor(color)
    setColorDialogOpen(true)
  }

  const submitColor = async (formData: FormData): Promise<void> => {
    await handleAsyncMutation(
      async () => {
        if (editingColor) {
          formData.append("id", editingColor.id);
          return await updateColor({
            id: editingColor.id,
            productId,
            data: formData,
          }).unwrap();
        }

        formData.append("productId", productId);
        return await createColor({
          productId,
          data: formData,
        }).unwrap();
      },
      {
        successMessage: editingColor ? "Colour updated" : "Colour created",
      }
    );
  };

  const handleDeleteColor = async (colorId: string): Promise<void> => {
    await handleAsyncMutation(
      () =>
        deleteColor({
          id: colorId,
          productId,
        }).unwrap(),
      {
        successMessage: "Colour deleted",
      }
    );
  };

  const handleCreateVariant = async (
    colorId: string,
    data: VariantFormValues
  ): Promise<void> => {
    await handleAsyncMutation(
      () =>
        createVariantMutation({
          ...data,
          productColorId: colorId,
          productId,
        }).unwrap(),
      {
        successMessage: "Size added",
      }
    );
  };

  const handleUpdateVariant = async (
    variantId: string,
    data: VariantFormValues
  ): Promise<void> => {
    await handleAsyncMutation(
      () =>
        updateVariantMutation({
          id: variantId,
          productId,
          data,
        }).unwrap(),
      {
        successMessage: "Size updated",
      }
    );
  };

  const handleDeleteVariant = async (variantId: string): Promise<void> => {
    await handleAsyncMutation(
      () =>
        deleteVariantMutation({
          id: variantId,
          productId,
        }).unwrap(),
      {
        successMessage: "Size deleted",
      }
    );
  };
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Colours and sizes</h2>
          <p className="text-sm text-muted-foreground">Manage variants, stock quantities and QR labels.</p>
        </div>
        <Button onClick={() => openColorDialog(null)}>
          <Plus /> Add colour
        </Button>
      </div>

      {colors.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No colours yet"
          description="Add a colour to create sizes, track stock and print QR labels."
          action={
            <Button onClick={() => openColorDialog(null)}>
              <Plus /> Add colour
            </Button>
          }
        />
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-4">
            {colors.map((color, index) => (
              <ColorCard
                key={color.id}
                productName={productName}
                color={color}
                index={index}
                onEditColor={openColorDialog}
                onDeleteColor={handleDeleteColor}
                onCreateVariant={handleCreateVariant}
                onUpdateVariant={handleUpdateVariant}
                onDeleteVariant={handleDeleteVariant}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <ColorFormDialog open={colorDialogOpen} onOpenChange={setColorDialogOpen} color={editingColor} onSubmit={submitColor} />
    </section>
  )
}