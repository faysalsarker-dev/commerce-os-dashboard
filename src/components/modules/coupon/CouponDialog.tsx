import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Sparkles, Tag } from "lucide-react";

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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import type { Coupon } from "@/types/data-types/coupon/coupon.types";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  couponFormSchema,
  DEFAULT_COUPON_VALUES,
  type CouponFormValues,
} from "@/types/validations/coupon/coupon.validation";

export interface CouponDialogProps {
  coupon?: Coupon | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
}

export function CouponDialog({
  coupon,
  open,
  onOpenChange,
  trigger,
}: CouponDialogProps) {
  const isEditMode = Boolean(coupon);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: DEFAULT_COUPON_VALUES,
  });

  const discountType = form.watch("discountType");

  React.useEffect(() => {
    if (!dialogOpen) return;

    if (coupon) {
      form.reset({
        code: coupon.code,
        title: coupon.title ?? "",
        description: coupon.description ?? "",
        discountType: coupon.discountType,
        discountValue: String(coupon.discountValue),
        minOrderAmount:
          coupon.minOrderAmount !== null && coupon.minOrderAmount !== undefined
            ? String(coupon.minOrderAmount)
            : "",
        maxDiscountAmount:
          coupon.maxDiscountAmount !== null &&
          coupon.maxDiscountAmount !== undefined
            ? String(coupon.maxDiscountAmount)
            : "",
        startDate: coupon.startDate
          ? coupon.startDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: coupon.endDate ? coupon.endDate.split("T")[0] : "",
        usageLimit:
          coupon.usageLimit !== null && coupon.usageLimit !== undefined
            ? String(coupon.usageLimit)
            : "",
        perCustomerLimit:
          coupon.perCustomerLimit !== null &&
          coupon.perCustomerLimit !== undefined
            ? String(coupon.perCustomerLimit)
            : "1",
        isActive: coupon.isActive,
        channel: coupon.channel ?? "ALL",
      });
    } else {
      form.reset(DEFAULT_COUPON_VALUES);
    }
  }, [dialogOpen, coupon, form]);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SAVE";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", code, { shouldValidate: true });
  };

  const onSubmit = async (values: CouponFormValues) => {
    const formattedCode = values.code.trim().toUpperCase();

    const payload = {
      code: formattedCode,
      title: values.title?.trim() || null,
      description: values.description?.trim() || null,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      minOrderAmount:
        values.minOrderAmount && values.minOrderAmount.trim() !== ""
          ? Number(values.minOrderAmount)
          : null,
      maxDiscountAmount:
        values.maxDiscountAmount && values.maxDiscountAmount.trim() !== ""
          ? Number(values.maxDiscountAmount)
          : null,
      startDate: new Date(values.startDate).toISOString(),
      endDate:
        values.endDate && values.endDate.trim() !== ""
          ? new Date(values.endDate).toISOString()
          : null,
      usageLimit:
        values.usageLimit && values.usageLimit.trim() !== ""
          ? Number(values.usageLimit)
          : null,
      perCustomerLimit:
        values.perCustomerLimit && values.perCustomerLimit.trim() !== ""
          ? Number(values.perCustomerLimit)
          : null,
      isActive: Boolean(values.isActive),
      channel: values.channel === "ALL" ? null : values.channel,
    };

    if (isEditMode && coupon) {
      await handleAsyncMutation(
        () => updateCoupon({ id: coupon.id, data: payload }).unwrap(),
        {
          successMessage: `Coupon "${formattedCode}" updated successfully.`,
          errorMessage: "Unable to update coupon",
          onSuccess: () => {
            setDialogOpen(false);
          },
        }
      );
    } else {
      await handleAsyncMutation(() => createCoupon(payload).unwrap(), {
        successMessage: `Coupon "${formattedCode}" created successfully.`,
        errorMessage: "Unable to create coupon",
        onSuccess: () => {
          form.reset(DEFAULT_COUPON_VALUES);
          setDialogOpen(false);
        },
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger !== null && (
        <DialogTrigger>
          {trigger ?? (
            <Button>
              <Plus className="size-4" />
              Add Coupon
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Tag className="size-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditMode ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update the configuration, validity, or discount rule for this coupon."
                  : "Configure discount rules, order eligibility limits, and promotional dates."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: Code & Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Coupon Code *</FormLabel>
                      {!isEditMode && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={generateRandomCode}
                        >
                          <Sparkles className="size-3" />
                          Generate
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. FLASH20"
                        autoComplete="off"
                        className="font-mono uppercase tracking-wider"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign / Display Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Summer Flash Sale"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Discount Type & Discount Value */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">
                          Percentage Discount (%)
                        </SelectItem>
                        <SelectItem value="FIXED_AMOUNT">
                          Fixed Amount Discount (৳)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {discountType === "PERCENTAGE"
                        ? "Discount Percentage (%) *"
                        : "Discount Amount (৳) *"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max={discountType === "PERCENTAGE" ? "100" : undefined}
                        placeholder={
                          discountType === "PERCENTAGE" ? "e.g. 15" : "e.g. 150"
                        }
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Min Order Amount & Max Discount Cap (if percentage) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Order Amount (৳)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 1000 (0 for none)"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Subtotal required to qualify for this coupon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Discount Cap (৳)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 500 (leave empty for unlimited)"
                        disabled={discountType === "FIXED_AMOUNT"}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Cap on maximum deduction for percentage discounts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Start Date & End Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
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

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Expiration)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if this coupon has no expiration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 5: Limits */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Redemptions Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 100 (leave empty for unlimited)"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="perCustomerLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Customer Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 1 (default 1)"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 6: Channel & Active Toggle */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligible Sales Channel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="All Channels" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All Channels</SelectItem>
                        <SelectItem value="OFFLINE">In-Store / POS Only</SelectItem>
                        <SelectItem value="ONLINE">Online Store Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription className="text-xs">
                        Enable or pause this coupon anytime.
                      </FormDescription>
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
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add internal notes or customer-facing terms..."
                      rows={2}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditMode ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
