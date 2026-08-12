import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, Plus, QrCode, Trash2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader , Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow ,Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

import type { ProductColor, ProductVariant } from "@/types/data-types/product/product.types";
import { VariantSheet, type VariantFormValues } from "./VariantSheet";
import { QrPreviewDialog, type QrLabel } from "./QrPreviewDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { StockBadge } from "@/components/modules/Products/StatusBadge";

interface ColorCardProps {
  productName: string;
  color: ProductColor;
  index: number;
  onEditColor: (color: ProductColor) => void;
  onDeleteColor: (colorId: string) => Promise<void>;
  onCreateVariant: (colorId: string, values: VariantFormValues) => Promise<void>;
  onUpdateVariant: (variantId: string, values: VariantFormValues) => Promise<void>;
  onDeleteVariant: (variantId: string) => Promise<void>;
}

export function ColorCard({
  productName,
  color,
  index,
  onEditColor,
  onDeleteColor,
  onCreateVariant,
  onUpdateVariant,
  onDeleteVariant,
}: ColorCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [qrLabel, setQrLabel] = useState<QrLabel | null>(null);
  const [deleteColorOpen, setDeleteColorOpen] = useState(false);
  const [deletingVariant, setDeletingVariant] = useState<ProductVariant | null>(null);

  const stock = color.variants.reduce((sum, v) => sum + v.stockQty, 0);
  const skuPrefix = color.colorName.slice(0, 3).toUpperCase();

  const openVariantSheet = (variant: ProductVariant | null) => {
    setEditingVariant(variant);
    setSheetOpen(true);
  };

  const submitVariant = (values: VariantFormValues) =>
    editingVariant
      ? onUpdateVariant(editingVariant.id, values)
      : onCreateVariant(color.id, values);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden border-border shadow-card">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface/60 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="size-8 shrink-0 rounded-md border border-border bg-muted"
              style={{ backgroundColor: color.colorHex ?? undefined }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{color.colorName}</p>
              <p className="numeric truncate text-xs text-muted-foreground">
                {color.variants.length} size{color.variants.length === 1 ? "" : "s"} · {stock} units
                {color.colorHex ? ` · ${color.colorHex.toUpperCase()}` : ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => openVariantSheet(null)}>
              <Plus /> <span className="hidden sm:inline">Add size</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Actions for ${color.colorName}`}/>}>
                
                  <MoreHorizontal />
              
              </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-44">
  <DropdownMenuItem
  onClick={() => {
    onEditColor(color);
  }}
>
  <Pencil className="mr-2 size-4" /> Edit colour
</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem
  className="text-destructive focus:text-destructive"
  onClick={() => {
    setDeleteColorOpen(true);
  }}
>
  <Trash2 className="mr-2 size-4" /> Delete colour
</DropdownMenuItem>
  <DropdownMenuSeparator />

</DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0">
   {color.images.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 border-b border-border px-4 py-3 sm:grid-cols-6 sm:px-5">
              {color.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${color.colorName} image ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full rounded-md border border-border object-cover"
                />
              ))}
            </div>
          ) : null}


          {color.variants.length === 0 ? (
            <div className="p-4 sm:p-5">
              <EmptyState
                compact
                icon={Layers}
                title="No sizes yet"
                description="Add a size to start tracking stock and printing QR labels."
                action={
                  <Button size="sm" variant="outline" onClick={() => openVariantSheet(null)}>
                    <Plus /> Add size
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24 pl-4 sm:pl-5">Size</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="w-32">Stock</TableHead>
                    <TableHead className="w-32 pr-4 text-right sm:pr-5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {color.variants.map((variant) => (
                    <TableRow key={variant.id} className="group">
                      <TableCell className="pl-4 font-medium sm:pl-5">{variant.size}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {variant.sku}
                      </TableCell>
                      <TableCell>
                        <StockBadge qty={variant.stockQty} />
                      </TableCell>
                      <TableCell className="pr-4 sm:pr-5">
                        <div className="flex items-center justify-end gap-0.5 opacity-70 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                          <Tooltip>
                            <TooltipTrigger render={

    <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`QR label for ${variant.sku}`}
                                onClick={() =>
                                  setQrLabel({
                                    qrCode: variant.qrCode,
                                    sku: variant.sku,
                                    size: variant.size,
                                    colorName: color.colorName,
                                    productName,
                                  })
                                }
                             />
                            }>
                          
                                <QrCode />
                             
                            </TooltipTrigger>
                            <TooltipContent>QR label</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger 
                            
                            render={
 <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${variant.sku}`}
                                onClick={() => openVariantSheet(variant)}
                              />
                            }
                            >
                             
                                <Pencil />
                            
                            </TooltipTrigger>
                            <TooltipContent>Edit size</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger render={
 <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                aria-label={`Delete ${variant.sku}`}
                                onClick={() => setDeletingVariant(variant)}
                             / >

                            }>
                             
                                <Trash2 />
                             
                            </TooltipTrigger>
                            <TooltipContent>Delete size</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <VariantSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        variant={editingVariant}
        colorName={color.colorName}
        skuPrefix={skuPrefix}
        onSubmit={submitVariant}
      />

      <QrPreviewDialog
        open={Boolean(qrLabel)}
        onOpenChange={(open) => !open && setQrLabel(null)}
        label={qrLabel}
      />

      <ConfirmDialog
        open={deleteColorOpen}
        onOpenChange={setDeleteColorOpen}
        destructive
        title={`Delete “${color.colorName}”?`}
        description={`This removes the colour and all ${color.variants.length} of its sizes, including stock history. This can't be undone.`}
        confirmLabel="Delete colour"
        onConfirm={() => onDeleteColor(color.id)}
      />

      <ConfirmDialog
        open={Boolean(deletingVariant)}
        onOpenChange={(open) => !open && setDeletingVariant(null)}
        destructive
        title="Delete this size?"
        description={
          deletingVariant
            ? `${deletingVariant.sku} and its stock history will be removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete size"
        onConfirm={async () => {
          if (deletingVariant) await onDeleteVariant(deletingVariant.id);
        }}
      />
    </motion.div>
  );
}
