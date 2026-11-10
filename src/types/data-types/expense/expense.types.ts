// ─── ExpenseFrequency ─────────────────────────────────────────────────────────

export type ExpenseFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

// ─── ExpenseSchedule ─────────────────────────────────────────────────────────

export interface ExpenseSchedule {
  id: string;
  categoryId: string;
  frequency: ExpenseFrequency;
  interval: number | null;
  dueDateEnabled: boolean;
  daysOfWeek: number[];
  daysOfMonth: number[];
  monthOfYear: number | null;
  expectedAmount: number | string | null;
  startDate: string;
  endDate: string | null;
  reminderEnabled: boolean;
  reminderDaysBefore: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseSchedulePayload {
  frequency: ExpenseFrequency;
  interval?: number;
  dueDateEnabled?: boolean;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  monthOfYear?: number | null;
  expectedAmount?: number | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  reminderEnabled?: boolean;
  reminderDaysBefore?: number;
  isActive?: boolean;
}

export interface UpdateExpenseSchedulePayload {
  frequency?: ExpenseFrequency;
  interval?: number;
  dueDateEnabled?: boolean;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  monthOfYear?: number | null;
  expectedAmount?: number | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  reminderEnabled?: boolean;
  reminderDaysBefore?: number;
  isActive?: boolean;
}

// ─── ExpenseCategory ──────────────────────────────────────────────────────────

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expenses?: Expense[];
  schedule?: ExpenseSchedule | null;
}

export interface CreateExpenseCategoryPayload {
  name: string;
  description?: string | null;
  isActive?: boolean;
  schedule?: CreateExpenseSchedulePayload;
}

export interface UpdateExpenseCategoryPayload {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  /** Pass null to remove the schedule, omit to leave unchanged */
  schedule?: UpdateExpenseSchedulePayload | null;
}

export interface ExpenseCategoryFilters {
  searchTerm?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt" | string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ExpenseCategoryOption {
  value: string;
  label: string;
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  categoryId: string;
  scheduleId: string | null;
  amount: number | string;
  expenseDate: string;
  description: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  category?: ExpenseCategory;
  schedule?: ExpenseSchedule | null;
}

export interface CreateExpensePayload {
  categoryId: string;
  scheduleId?: string | null;
  amount: number;
  expenseDate?: string | Date;
  description?: string | null;
  note?: string | null;
}

export interface UpdateExpensePayload {
  categoryId?: string;
  scheduleId?: string | null;
  amount?: number;
  expenseDate?: string | Date;
  description?: string | null;
  note?: string | null;
}

export interface ExpenseFilters {
  searchTerm?: string;
  search?: string;
  categoryId?: string;
  scheduleId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "amount" | "expenseDate" | "createdAt" | "updatedAt" | string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
