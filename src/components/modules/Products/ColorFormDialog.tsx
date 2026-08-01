import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { ImageUploader, urlToItem, type UploaderItem } from "@/components/ui/ImageUploader";
import type { ProductColor } from "@/types/data-types/product/product.types";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { colorSchema, type ColorFormValues } from "@/types/validations/product/product";



interface ColorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: ProductColor | null;
  /** Receives multipart/form-data ready for a multer endpoint. */
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ColorFormDialog({ open, onOpenChange, color, onSubmit }: ColorFormDialogProps) {
  const isEditing = Boolean(color);
  const [images, setImages] = useState<UploaderItem[]>([]);
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: { colorName: "", colorHex: "" },
  });

 useEffect(() => {
  if (!open) return;

  form.reset({
    colorName: color?.colorName ?? "",
    colorHex: color?.colorHex ?? "",
  });

  const id = requestAnimationFrame(() => {
    setImages((color?.images ?? []).map(urlToItem));
  });

  return () => cancelAnimationFrame(id);
}, [open, color, form]);

  const submit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("colorName", values.colorName.trim());
    formData.append("colorHex", values.colorHex);
    // URLs that already exist on the server, so the backend knows what to keep.
    formData.append(
      "existingImages",
      JSON.stringify(images.filter((item) => !item.file).map((item) => item.url)),
    );
    // New binaries — matches multer `.array("images")`.
    images.forEach((item) => {
      if (item.file) formData.append("images", item.file, item.file.name);
    });

    await onSubmit(formData);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit colour" : "Add colour"}</DialogTitle>
          <DialogDescription>
            Colours group the images, sizes, stock counts and QR labels of this product.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={submit}
            className="max-h-[65vh] space-y-5 overflow-y-auto px-1 pb-1"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="colorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colour name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sky Blue" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colorHex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swatch</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Pick a preset, open the colour wheel, or type a hex value.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImageUploader
              value={images}
              onChange={setImages}
              disabled={form.formState.isSubmitting}
              label="Colour images"
            />

            <DialogFooter>
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
                {isEditing ? "Save changes" : "Add colour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
