import { z } from "zod";
import { SalaryStatus } from "@/types/data-types/enums";

const moneyStr = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), {
    message: "Must be a non-negative number",
  });

export const salaryRecordFormSchema = z.object({
  userId: z.string().min(1, "Employee is required"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(9999),
  baseSalary: moneyStr,
  bonus: moneyStr,
  deduction: moneyStr,
  status: z.nativeEnum(SalaryStatus),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type SalaryRecordFormValues = z.infer<typeof salaryRecordFormSchema>;

const now = new Date();
export const DEFAULT_SALARY_RECORD_VALUES: SalaryRecordFormValues = {
  userId: "",
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  baseSalary: "",
  bonus: "",
  deduction: "",
  status: SalaryStatus.PENDING,
  notes: "",
};

export const increaseSalaryFormSchema = z.object({
  userId: z.string().min(1, "Employee is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
});

export type IncreaseSalaryFormValues = z.infer<typeof increaseSalaryFormSchema>;
