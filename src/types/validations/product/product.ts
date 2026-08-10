import { z } from "zod";

export const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"] as const;

export const variantSchema = z.object({
  size: z.enum(SIZE_OPTIONS, {
    message: "Select a size",
  }),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers and dashes only"),
  stockQty: z
    .number()
    .int("Whole units only")
    .min(0, "Stock cannot be negative"),
});

export type SizeOption = (typeof SIZE_OPTIONS)[number];



export const productSchema = z.object({ name: z.string().min(1, "Name is required"), description: z.string().optional(), categoryId: z.string().optional(), costPrice: z.coerce.number().positive("Cost price must be positive"), sellingPrice: z.coerce.number().positive("Selling price must be positive") })
export type ProductFormValues = z.infer<typeof productSchema>


export const colorSchema = z.object({
  colorName: z.string().min(1, "Colour name is required").max(40),
  colorHex: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use a 6-digit hex value, e.g. #1F2937")
    .or(z.literal("")),
});

export type ColorFormValues = z.infer<typeof colorSchema>;