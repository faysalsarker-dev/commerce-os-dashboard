import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { ImageUploader, type ImageUploaderResult } from "@/components/blocks/ImageUploader";

import type { Category } from "@/types/data-types/category/category.types";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";

// ============================================================================
// Schema
// ============================================================================

const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int("Must be a whole number").min(0, "Must be 0 or more"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const defaultValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  displayOrder: 0,
};

const makeSlug = (value: string) => slugify(value, { lower: true, strict: true, trim: true });

// ============================================================================
// FormData builder — plain, multer-friendly (field name: "image")
// ============================================================================

function buildCategoryFormData(
  values: CategoryFormValues,
  image: ImageUploaderResult | null
) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description ?? "");
  formData.append("isActive", String(values.isActive));
  formData.append("displayOrder", String(values.displayOrder));

  // new file(s) picked by the user — multer field name "image"
  image?.files.forEach((file) => formData.append("image", file));

  // edit mode bookkeeping so the backend knows what stayed / got removed
  if (image?.existingUrls.length) {
    formData.append("existingImage", image.existingUrls[0]);
  }
  if (image?.removedUrls.length) {
    formData.append("removedImage", image.removedUrls[0]);
  }

  return formData;
}

// ============================================================================
// Component
// ============================================================================

export interface CategoryDialogProps {
  category?: Category;
  trigger?: React.ReactNode | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({ category, trigger, open, onOpenChange }: CategoryDialogProps) {
  const isEditMode = Boolean(category);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [slugTouched, setSlugTouched] = React.useState(false);
  const [imageResult, setImageResult] = React.useState<ImageUploaderResult | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (!dialogOpen) return;
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        isActive: category.isActive,
        displayOrder: category.displayOrder,
      });
      setSlugTouched(true);
    } else {
      form.reset(defaultValues);
      setSlugTouched(false);
    }
    setImageResult(null);
  }, [dialogOpen, category, form]);

  const nameValue = form.watch("name");

  React.useEffect(() => {
    if (slugTouched) return;
    form.setValue("slug", makeSlug(nameValue), { shouldValidate: true });
  }, [nameValue, slugTouched, form]);

  const regenerateSlug = () => {
    form.setValue("slug", makeSlug(form.getValues("name")), { shouldValidate: true });
    setSlugTouched(false);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const formData = buildCategoryFormData(values, imageResult);

    try {
      if (isEditMode && category) {
        await updateCategory({ id: category.id, body: formData }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      const message = err?.data?.message ?? "Something went wrong while saving this category.";
      if (String(message).toLowerCase().includes("slug")) {
        form.setError("slug", { message });
      } else {
        toast.error(message);
      }
    }
  };

  const defaultTrigger =
    trigger === null ? null : trigger ?? (
      <Button size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add category
      </Button>
    );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {defaultTrigger && <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="px-6 pt-6 pb-4 border-b space-y-1">
              <DialogTitle className="text-base">
                {isEditMode ? "Edit category" : "New category"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update this category's details."
                  : "Add a new category to your catalog."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Outerwear" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            setSlugTouched(true);
                            field.onChange(makeSlug(e.target.value));
                          }}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={regenerateSlug}
                        title="Regenerate from name"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>Used in the URL — lowercase, hyphenated.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="What belongs in this category?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem >
                <FormLabel>Image</FormLabel>
                <ImageUploader className="w-full" onChange={setImageResult} />
              </FormItem>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <div className="flex h-9 items-center">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-muted/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}