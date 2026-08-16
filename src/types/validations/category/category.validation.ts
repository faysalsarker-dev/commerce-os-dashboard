import z from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  isActive: z.boolean(),
  displayOrder: z.number().int("Must be a whole number").min(0, "Must be 0 or more"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  description: "",
  isActive: true,
  displayOrder: 0,
};