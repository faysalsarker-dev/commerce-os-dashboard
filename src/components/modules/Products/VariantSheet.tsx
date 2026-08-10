import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductVariant } from "@/types/data-types/product/product.types";
import { SIZE_OPTIONS, variantSchema, type SizeOption } from "@/types/validations/product/product";


type VariantFormInput = z.input<typeof variantSchema>;
export type VariantFormValues = z.output<typeof variantSchema>;

interface VariantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ProductVariant | null;
  colorName: string;
  skuPrefix: string;
  onSubmit: (values: VariantFormValues) => Promise<void>;
}

export function VariantSheet({
  open,
  onOpenChange,
  variant,
  colorName,
  skuPrefix,
  onSubmit,
}: VariantSheetProps) {
  const isEditing = Boolean(variant);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<VariantFormInput, any, VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: { size: undefined, sku: "", stockQty: 0 },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      variant
        ? { size: variant.size as SizeOption, sku: variant.sku, stockQty: variant.stockQty }
        : { size: undefined, sku: `${skuPrefix}-`, stockQty: 0 },
    );
  }, [open, variant, skuPrefix, form]);

  const handleSizeChange = (newSize: SizeOption) => {
    const currentSku = form.getValues("sku") || "";
    const prefixWithDash = `${skuPrefix}-`;

    let suffix = "";
    if (currentSku.startsWith(prefixWithDash)) {
      const remainder = currentSku.slice(prefixWithDash.length);
      const matchingSize = SIZE_OPTIONS.find(
        (s) => remainder.startsWith(`${s}-`) || remainder === s
      );
      if (matchingSize) {
        suffix = remainder.startsWith(`${matchingSize}-`)
          ? remainder.slice(matchingSize.length + 1)
          : "";
      } else {
        suffix = remainder;
      }
    }

    const newSku = suffix ? `${skuPrefix}-${newSize}-${suffix}` : `${skuPrefix}-${newSize}-`;
    form.setValue("sku", newSku, { shouldValidate: true });
  };

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>{isEditing ? "Edit size" : "Add size"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? `Update stock and identifiers for ${colorName}.`
              : `Create a new size under ${colorName}. A QR label is generated automatically.`}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 w-full">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleSizeChange(val as SizeOption);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Shown on the shelf label and receipt.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input className="font-mono" placeholder={`${skuPrefix}-M`} {...field} />
                    </FormControl>
                    <FormDescription>Must be unique across the catalogue.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

        <FormField
          control={form.control}
          name="stockQty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock on hand</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className="numeric"
                  value={field.value ?? 0}
                  onChange={(e) => {
                    const val = e.target.valueAsNumber;
                    field.onChange(Number.isNaN(val) ? 0 : val);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>

            <SheetFooter className="flex-row justify-end gap-2 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-28">
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
                {isEditing ? "Save changes" : "Add size"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}