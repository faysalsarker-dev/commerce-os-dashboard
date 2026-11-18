import { z } from "zod"

export const orderCreateSchema = z.object({
  advanceAmount: z.number().min(0, "Advance cannot be negative").optional(),
  courierCharge: z.number().min(0, "Courier charge cannot be negative").optional(),
  estimatedDeliveryDate: z.string().optional(),
})

export type OrderCreateFormValues = z.infer<typeof orderCreateSchema>
