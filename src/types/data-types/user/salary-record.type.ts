import type { EmployeeStatus, Role, SalaryStatus } from "../enums";

export interface SalaryUserSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: EmployeeStatus;
}

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

  user?: SalaryUserSummary;

  createdAt: string;
  updatedAt: string;
}