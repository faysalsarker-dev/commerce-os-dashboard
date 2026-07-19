import type { SalaryStatus } from "../enums";

export interface SalaryRecord {
  id: string;

  userId: string;

  month: number;
  year: number;

  baseSalary: number;
  bonus: number;
  deduction: number;
  netPay: number;

  status: SalaryStatus;

  paidAt: string | null;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
}