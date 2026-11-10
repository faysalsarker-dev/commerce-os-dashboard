import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, CalendarClock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";

import type { ExpenseCategory } from "@/types/data-types/expense/expense.types";
import {
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  expenseCategoryFormSchema,
  DEFAULT_EXPENSE_CATEGORY_VALUES,
  DEFAULT_SCHEDULE_VALUES,
  type ExpenseCategoryFormValues,
} from "@/types/validations/expense/expense.validation";

// ─── Constants ────────────────────────────────────────────────────────────────

const FREQUENCY_OPTIONS = [
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
] as const;

const DAYS_OF_WEEK = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

const MONTHS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toNum(val: string | undefined | null): number | undefined {
  if (!val || val === "") return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function toNumOrNull(val: string | undefined | null): number | null {
  if (!val || val === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface ExpenseCategoryDialogProps {
  category?: ExpenseCategory;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
}

export function ExpenseCategoryDialog({
  category,
  open,
  onOpenChange,
  trigger,
}: ExpenseCategoryDialogProps) {
  const isEditMode = Boolean(category);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [createCategory, { isLoading: isCreating }] =
    useCreateExpenseCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateExpenseCategoryMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<ExpenseCategoryFormValues>({
    resolver: zodResolver(expenseCategoryFormSchema),
    defaultValues: DEFAULT_EXPENSE_CATEGORY_VALUES,
  });

  const enableSchedule = useWatch({ control: form.control, name: "enableSchedule" });
  const frequency = useWatch({ control: form.control, name: "schedule.frequency" });
  const dueDateEnabled = useWatch({ control: form.control, name: "schedule.dueDateEnabled" });
  const reminderEnabled = useWatch({ control: form.control, name: "schedule.reminderEnabled" });

  // ── Populate form on open ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (!dialogOpen) return;

    if (category) {
      const s = category.schedule;
      form.reset({
        name: category.name,
        description: category.description ?? "",
        isActive: category.isActive,
        enableSchedule: Boolean(s),
        schedule: s
          ? {
              frequency: s.frequency,
              startDate: s.startDate ? s.startDate.split("T")[0] : "",
              endDate: s.endDate ? s.endDate.split("T")[0] : "",
              interval: s.interval !== null ? String(s.interval) : "",
              dueDateEnabled: s.dueDateEnabled,
              daysOfWeek: s.daysOfWeek ?? [],
              daysOfMonth: s.daysOfMonth?.length ? String(s.daysOfMonth[0]) : "",
              monthOfYear: s.monthOfYear !== null ? String(s.monthOfYear) : "",
              expectedAmount: s.expectedAmount !== null ? String(s.expectedAmount) : "",
              reminderEnabled: s.reminderEnabled,
              reminderDaysBefore: s.reminderDaysBefore !== null ? String(s.reminderDaysBefore) : "",
              isActive: s.isActive,
            }
          : DEFAULT_SCHEDULE_VALUES,
      });
    } else {
      form.reset(DEFAULT_EXPENSE_CATEGORY_VALUES);
    }
  }, [dialogOpen, category]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (values: ExpenseCategoryFormValues) => {
    // Build schedule payload — convert string fields → numbers
    type SchedulePayload = {
      frequency: string;
      startDate: string;
      endDate?: string | null;
      interval?: number;
      dueDateEnabled?: boolean;
      daysOfWeek?: number[];
      daysOfMonth?: number[];
      monthOfYear?: number | null;
      expectedAmount?: number | null;
      reminderEnabled?: boolean;
      reminderDaysBefore?: number;
      isActive?: boolean;
    };

    let schedulePayload: SchedulePayload | null | undefined = undefined;

    if (values.enableSchedule && values.schedule) {
      const s = values.schedule;
      const daysOfMonth = toNum(s.daysOfMonth);
      schedulePayload = {
        frequency: s.frequency,
        startDate: s.startDate,
        endDate: s.endDate || null,
        interval: toNum(s.interval),
        dueDateEnabled: s.dueDateEnabled,
        daysOfWeek: s.daysOfWeek ?? [],
        daysOfMonth: daysOfMonth !== undefined ? [daysOfMonth] : [],
        monthOfYear: toNumOrNull(s.monthOfYear),
        expectedAmount: toNumOrNull(s.expectedAmount),
        reminderEnabled: s.reminderEnabled,
        reminderDaysBefore: toNum(s.reminderDaysBefore),
        isActive: s.isActive ?? true,
      };
    } else if (isEditMode && !values.enableSchedule && category?.schedule) {
      // User toggled off an existing schedule → send null to remove it
      schedulePayload = null;
    }

    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      isActive: values.isActive,
      ...(schedulePayload !== undefined
        ? { schedule: schedulePayload as never }
        : {}),
    };

    if (isEditMode && category) {
      await handleAsyncMutation(
        () => updateCategory({ id: category.id, data: payload }).unwrap(),
        {
          successMessage: "Category updated",
          successDescription: `"${payload.name}" has been updated.`,
          errorMessage: "Unable to update category",
          errorDescription: "An error occurred while updating the category.",
          onSuccess: () => setDialogOpen(false),
        }
      );
    } else {
      await handleAsyncMutation(
        () => createCategory(payload).unwrap(),
        {
          successMessage: "Category created",
          successDescription: `"${payload.name}" has been created.`,
          errorMessage: "Unable to create category",
          errorDescription: "An error occurred while creating the category.",
          onSuccess: () => {
            form.reset(DEFAULT_EXPENSE_CATEGORY_VALUES);
            setDialogOpen(false);
          },
        }
      );
    }
  };

  const defaultTrigger =
    trigger === null
      ? null
      : trigger ?? (
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {defaultTrigger && <DialogTrigger>{defaultTrigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg gap-0 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="pb-4 border-b space-y-1">
              <DialogTitle className="text-base">
                {isEditMode ? "Edit Expense Category" : "New Expense Category"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update this expense category's details."
                  : "Add a new category to organise your expenses."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 py-5 space-y-5 max-h-[72vh] overflow-y-auto">
              {/* ── Name ── */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Office Supplies"
                        autoFocus
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Description ── */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Brief description of this category…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Active ── */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Active</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Inactive categories won't appear in expense forms.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              {/* ── Enable Schedule toggle ── */}
              <FormField
                control={form.control}
                name="enableSchedule"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Recurring Schedule</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Attach a repeating schedule to this category.
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ── Schedule fields ── */}
              {enableSchedule && (
                <div className="space-y-4 rounded-lg border bg-muted/30 px-4 py-4">
                  {/* Frequency + Interval */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schedule.frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select…" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FREQUENCY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schedule.interval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Interval{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              placeholder="e.g. 2"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Start / End Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schedule.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schedule.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End Date{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Expected Amount */}
                  <FormField
                    control={form.control}
                    name="schedule.expectedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Expected Amount{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Due Date toggle */}
                  <FormField
                    control={form.control}
                    name="schedule.dueDateEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Enable Due Dates
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Due date detail fields */}
                  {dueDateEnabled && (
                    <div className="space-y-3 pl-3 border-l-2 border-muted-foreground/20">
                      {/* Days of Week — only for WEEKLY */}
                      {frequency === "WEEKLY" && (
                        <FormField
                          control={form.control}
                          name="schedule.daysOfWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Days of Week</FormLabel>
                              <div className="flex flex-wrap gap-3 pt-1">
                                {DAYS_OF_WEEK.map((day) => {
                                  const checked = (field.value ?? []).includes(day.value);
                                  return (
                                    <label
                                      key={day.value}
                                      className="flex items-center gap-1.5 cursor-pointer select-none"
                                    >
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) => {
                                          const current = field.value ?? [];
                                          field.onChange(
                                            v
                                              ? [...current, day.value]
                                              : current.filter((d) => d !== day.value)
                                          );
                                        }}
                                      />
                                      <span className="text-sm">{day.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Day of Month — for MONTHLY / YEARLY */}
                      {(frequency === "MONTHLY" || frequency === "YEARLY") && (
                        <FormField
                          control={form.control}
                          name="schedule.daysOfMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Day of Month</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={1}
                                  max={31}
                                  placeholder="e.g. 15"
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Month of Year — only for YEARLY */}
                      {frequency === "YEARLY" && (
                        <FormField
                          control={form.control}
                          name="schedule.monthOfYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Month</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select month…" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MONTHS.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                      {m.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Reminder */}
                  <FormField
                    control={form.control}
                    name="schedule.reminderEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Enable Reminders
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {reminderEnabled && (
                    <FormField
                      control={form.control}
                      name="schedule.reminderDaysBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            Remind (days before)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              placeholder="e.g. 3"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Schedule Active */}
                  <FormField
                    control={form.control}
                    name="schedule.isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Schedule Active
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
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
              <Button type="submit" disabled={isSubmitting} className="min-w-28">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
