import { z } from "zod";

export const sizeFormSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(50, "Size must be at most 50 characters"),
});

export type SizeFormValues = z.infer<typeof sizeFormSchema>;

export const DEFAULT_SIZE_VALUES: SizeFormValues = {
  size: "",
};

