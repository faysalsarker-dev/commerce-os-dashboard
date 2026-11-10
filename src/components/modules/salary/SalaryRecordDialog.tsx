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
  Textarea,
} from "@/components/ui";
import type { SalaryRecord } from "@/types/data-types/user/salary-record.type";
import {
  useCreateSalaryRecordMutation,
  useUpdateSalaryRecordMutation,
  useGetUsersQuery,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  salaryRecordFormSchema,
  DEFAULT_SALARY_RECORD_VALUES,
  type SalaryRecordFormValues,
} from "@/types/validations/user/salary.validation";
import { SalaryStatus } from "@/types/data-types/enums";

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export interface SalaryRecordDialogProps {
  record?: SalaryRecord;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
}

export function SalaryRecordDialog({
  record,
  open,
  onOpenChange,
  trigger,
}: SalaryRecordDialogProps) {
  const isEditMode = Boolean(record);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const { data: usersResponse } = useGetUsersQuery({ limit: 100 });
  const users = usersResponse?.data ?? [];

  const [createRecord, { isLoading: isCreating }] =
    useCreateSalaryRecordMutation();
  const [updateRecord, { isLoading: isUpdating }] =
    useUpdateSalaryRecordMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<SalaryRecordFormValues>({
    resolver: zodResolver(salaryRecordFormSchema),
    defaultValues: DEFAULT_SALARY_RECORD_VALUES,
  });

  React.useEffect(() => {
    if (!dialogOpen) return;
    if (record) {
      form.reset({
        userId: record.userId,
        month: record.month,
        year: record.year,
        baseSalary: String(record.baseSalary),
        bonus: record.bonus ? String(record.bonus) : "",
        deduction: record.deduction ? String(record.deduction) : "",
        status: record.status,
        notes: record.notes ?? "",
      });
    } else {
      form.reset(DEFAULT_SALARY_RECORD_VALUES);
    }
  }, [dialogOpen, record]);

  const onSubmit = async (values: SalaryRecordFormValues) => {
    const payload = {
      userId: values.userId,
      month: values.month,
      year: values.year,
      baseSalary: values.baseSalary ? Number(values.baseSalary) : undefined,
      bonus: values.bonus ? Number(values.bonus) : undefined,
      deduction: values.deduction ? Number(values.deduction) : undefined,
      status: values.status,
      notes: values.notes?.trim() || null,
    };

    if (isEditMode && record) {
      await handleAsyncMutation(
        () => updateRecord({ id: record.id, data: payload }).unwrap(),
        {
          successMessage: "Salary record updated",
          successDescription: "The salary record has been updated.",
          errorMessage: "Unable to update salary record",
          onSuccess: () => setDialogOpen(false),
        }
      );
    } else {
      await handleAsyncMutation(
        () => createRecord(payload).unwrap(),
        {
          successMessage: "Salary record created",
          successDescription: "The salary record has been added.",
          errorMessage: "Unable to create salary record",
          onSuccess: () => {
            form.reset(DEFAULT_SALARY_RECORD_VALUES);
            setDialogOpen(false);
          },
        }
      );
    }
  };

  const defaultTrigger =
    trigger === null ? null : trigger ?? (
      <Button size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add Record
      </Button>
    );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {defaultTrigger && <DialogTrigger>{defaultTrigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg gap-0 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="pb-4 border-b space-y-1 px-6 pt-6">
              <DialogTitle className="text-base">
                {isEditMode ? "Edit Salary Record" : "New Salary Record"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update this monthly salary entry."
                  : "Add a monthly salary record for an employee."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Employee */}
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}{" "}
                              <span className="text-muted-foreground">
                                ({u.role.replace(/_/g, " ")})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Month & Year */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MONTHS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>
                              {m.label}
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Base Salary, Bonus, Deduction */}
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="baseSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Base Salary{" "}
                        <span className="text-muted-foreground text-xs">(৳)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bonus{" "}
                        <span className="text-muted-foreground text-xs">(৳)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Deduction{" "}
                        <span className="text-muted-foreground text-xs">(৳)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SalaryStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={SalaryStatus.PAID}>Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Notes{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-28"
              >
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
