import { z } from "zod";

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Coupon code is required")
      .max(30, "Code must be at most 30 characters"),
    title: z
      .string()
      .trim()
      .max(100, "Title is too long")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .trim()
      .max(500, "Description is too long")
      .optional()
      .or(z.literal("")),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    discountValue: z
      .string()
      .min(1, "Discount value is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Discount value must be greater than 0"
      ),
    minOrderAmount: z.string().optional().or(z.literal("")),
    maxDiscountAmount: z.string().optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    usageLimit: z.string().optional().or(z.literal("")),
    perCustomerLimit: z.string().optional().or(z.literal("")),
    isActive: z.boolean(),
    channel: z.enum(["ALL", "ONLINE", "OFFLINE"]),
  })
  .refine(
    (data) => {
      if (data.discountType === "PERCENTAGE") {
        return Number(data.discountValue) <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate && data.endDate.trim() !== "") {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type CouponFormValues = z.infer<typeof couponFormSchema>;

export const DEFAULT_COUPON_VALUES: CouponFormValues = {
  code: "",
  title: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "10",
  minOrderAmount: "",
  maxDiscountAmount: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  usageLimit: "",
  perCustomerLimit: "1",
  isActive: true,
  channel: "ALL",
};
