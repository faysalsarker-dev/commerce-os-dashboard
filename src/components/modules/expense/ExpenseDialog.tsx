import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

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
} from "@/components/ui";

import type { Expense } from "@/types/data-types/expense/expense.types";
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useGetExpenseCategoriesForSelectQuery,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  expenseFormSchema,
  DEFAULT_EXPENSE_VALUES,
  type ExpenseFormValues,
} from "@/types/validations/expense/expense.validation";

export interface ExpenseDialogProps {
  expense?: Expense;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
}

export function ExpenseDialog({
  expense,
  open,
  onOpenChange,
  trigger,
}: ExpenseDialogProps) {
  const isEditMode = Boolean(expense);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const { data: categoriesResponse } = useGetExpenseCategoriesForSelectQuery();
  const categories = categoriesResponse?.data ?? [];

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: DEFAULT_EXPENSE_VALUES,
  });

  React.useEffect(() => {
    if (!dialogOpen) return;
    if (expense) {
      form.reset({
        categoryId: expense.categoryId,
        amount: String(expense.amount),
        expenseDate: expense.expenseDate
          ? expense.expenseDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: expense.description ?? "",
        note: expense.note ?? "",
      });
    } else {
      form.reset(DEFAULT_EXPENSE_VALUES);
    }
  }, [dialogOpen, expense]);

  const onSubmit = async (values: ExpenseFormValues) => {
    const payload = {
      categoryId: values.categoryId,
      // Preserve existing scheduleId when editing (don't strip it)
      ...(isEditMode && expense?.scheduleId !== undefined
        ? { scheduleId: expense.scheduleId }
        : {}),
      amount: Number(values.amount),
      expenseDate: values.expenseDate,
      description: values.description?.trim() || null,
      note: values.note?.trim() || null,
    };

    if (isEditMode && expense) {
      await handleAsyncMutation(
        () => updateExpense({ id: expense.id, data: payload }).unwrap(),
        {
          successMessage: "Expense updated",
          successDescription: "The expense has been updated.",
          errorMessage: "Unable to update expense",
          errorDescription: "An error occurred while updating the expense.",
          onSuccess: () => setDialogOpen(false),
        }
      );
    } else {
      await handleAsyncMutation(
        () => createExpense(payload).unwrap(),
        {
          successMessage: "Expense created",
          successDescription: "The expense has been recorded.",
          errorMessage: "Unable to create expense",
          errorDescription: "An error occurred while creating the expense.",
          onSuccess: () => {
            form.reset(DEFAULT_EXPENSE_VALUES);
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
            Add Expense
          </Button>
        );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {defaultTrigger && <DialogTrigger>{defaultTrigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md gap-0 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="pb-4 border-b space-y-1">
              <DialogTitle className="text-base">
                {isEditMode ? "Edit Expense" : "New Expense"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update this expense record."
                  : "Record a new expense entry."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-2 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <Input
                        {...field}
                        placeholder="Short description…"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Note{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Any additional notes…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
