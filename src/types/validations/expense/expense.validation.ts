import { z } from "zod";

// ─── Expense Category ──────────────────────────────────────────────────────

const expenseFrequency = z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);

// All numeric fields kept as strings in the form — converted to numbers in onSubmit
// This avoids zodResolver type inference conflicts with Zod v4 transforms
const scheduleSchema = z.object({
  frequency: expenseFrequency,
  interval: z.string().optional().or(z.literal("")),
  dueDateEnabled: z.boolean().optional(),
  daysOfWeek: z.array(z.number()).optional(),
  daysOfMonth: z.string().optional().or(z.literal("")),
  monthOfYear: z.string().optional().or(z.literal("")),
  expectedAmount: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  reminderEnabled: z.boolean().optional(),
  reminderDaysBefore: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const expenseCategoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z
    .string()
    .max(500, "Keep it under 500 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  enableSchedule: z.boolean(),
  schedule: scheduleSchema.optional(),
});

export type ExpenseCategoryFormValues = z.infer<
  typeof expenseCategoryFormSchema
>;

export const DEFAULT_SCHEDULE_VALUES: ScheduleFormValues = {
  frequency: "MONTHLY",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  interval: "",
  dueDateEnabled: false,
  daysOfWeek: [],
  daysOfMonth: "",
  monthOfYear: "",
  expectedAmount: "",
  reminderEnabled: false,
  reminderDaysBefore: "",
  isActive: true,
};

export const DEFAULT_EXPENSE_CATEGORY_VALUES: ExpenseCategoryFormValues = {
  name: "",
  description: "",
  isActive: true,
  enableSchedule: false,
  schedule: DEFAULT_SCHEDULE_VALUES,
};

// ─── Expense ──────────────────────────────────────────────────────────────

export const expenseFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  // Keep as string to avoid zodResolver coercion type issues; convert to number on submit
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
  expenseDate: z.string().min(1, "Date is required"),
  description: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),
  note: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("")),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const DEFAULT_EXPENSE_VALUES: ExpenseFormValues = {
  categoryId: "",
  amount: "",
  expenseDate: new Date().toISOString().split("T")[0],
  description: "",
  note: "",
};
