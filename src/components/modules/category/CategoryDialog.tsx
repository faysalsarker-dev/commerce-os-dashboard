import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Sparkles, Plus, ImageIcon, Tag, Hash, AlignLeft, Layers } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
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

import { ImageUploader, imagesToFormData, type ImageUploaderResult } from "@/components/blocks/ImageUploader";

import type { Category } from "@/types/data-types/category/category.types";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";

// ============================================================================
// Schema (unchanged)
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
  const slugValue = form.watch("slug");
  const descValue = form.watch("description") ?? "";
  const isActiveValue = form.watch("isActive");

  React.useEffect(() => {
    if (slugTouched) return;
    form.setValue("slug", makeSlug(nameValue), { shouldValidate: true });
  }, [nameValue, slugTouched, form]);

  const regenerateSlug = () => {
    form.setValue("slug", makeSlug(form.getValues("name")), { shouldValidate: true });
    setSlugTouched(false);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = imagesToFormData(
      imageResult ?? { files: [], existingUrls: [], removedUrls: [], isEmpty: true },
      {
        fileField: "image",
        existingField: "existingImage",
        removedField: "removedImage",
        extra: {
          name: values.name,
          slug: values.slug,
          description: values.description ?? "",
          isActive: String(values.isActive),
          displayOrder: String(values.displayOrder),
        },
      }
    );

    try {
      if (isEditMode && category) {
        await updateCategory({ id: category.id, body: payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      const message =
        err?.data?.message ?? "Something went wrong while saving this category.";
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

      <DialogContent
        className="p-0 gap-0 overflow-hidden border-border/60 shadow-2xl sm:rounded-2xl"
        style={{ width: "90vw", height: "90vh", maxWidth: "90vw" }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full w-full flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/60 bg-background/80 px-8 py-5 backdrop-blur">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold tracking-tight">
                    {isEditMode ? "Edit category" : "New category"}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {isEditMode
                      ? "Update details, imagery and visibility."
                      : "Organize your catalog with a new category."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActiveValue
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActiveValue ? "bg-emerald-500" : "bg-muted-foreground/50"
                    }`}
                  />
                  {isActiveValue ? "Active" : "Inactive"}
                </span>
              </div>
            </header>

            {/* Body — split layout */}
            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* Left: form fields */}
              <div className="min-h-0 overflow-y-auto px-8 py-6">
                <div className="mx-auto max-w-2xl space-y-8">
                  {/* Section: Basics */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold tracking-tight">Basics</h3>
                    </div>

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
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                              Slug
                            </FormLabel>
                            <AnimatePresence>
                              {!slugTouched && (
                                <motion.span
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  auto
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
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
                          <FormDescription>
                            Used in the URL — lowercase, hyphenated.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                              Description
                              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                            </FormLabel>
                            <span className="text-[11px] tabular-nums text-muted-foreground">
                              {descValue.length}/500
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="What belongs in this category?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Section: Media */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold tracking-tight">Image</h3>
                    </div>
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
                      <ImageUploader onChange={setImageResult} />
                    </div>
                  </section>

                  {/* Section: Settings */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold tracking-tight">Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display order</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormDescription>Lower numbers appear first.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <FormControl>
                              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2 transition-colors hover:bg-muted/40">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium">
                                    {field.value ? "Active" : "Inactive"}
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {field.value ? "Visible to customers" : "Hidden from storefront"}
                                  </div>
                                </div>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </div>
              </div>

              {/* Right: live preview */}
              <aside className="hidden min-h-0 flex-col border-l border-border/60 bg-muted/30 lg:flex">
                <div className="border-b border-border/60 px-6 py-4">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Preview
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-muted to-muted/40">
                      <div className="grid h-full place-items-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8 opacity-40" />
                      </div>
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-semibold">
                          {nameValue || "Category name"}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            isActiveValue
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isActiveValue ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="truncate font-mono text-xs text-muted-foreground">
                        /{slugValue || "your-slug"}
                      </div>
                      {descValue && (
                        <p className="line-clamp-3 text-xs text-muted-foreground">
                          {descValue}
                        </p>
                      )}
                    </div>
                  </div>

                  <dl className="mt-6 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Display order</dt>
                      <dd className="font-medium tabular-nums">
                        {form.watch("displayOrder") ?? 0}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Mode</dt>
                      <dd className="font-medium">{isEditMode ? "Editing" : "Creating"}</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/80 px-8 py-4 backdrop-blur">
              <p className="hidden text-xs text-muted-foreground sm:block">
                Changes are saved when you click{" "}
                <span className="font-medium text-foreground">
                  {isEditMode ? "Save changes" : "Create category"}
                </span>
                .
              </p>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? "Save changes" : "Create category"}
                </Button>
              </div>
            </footer>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
