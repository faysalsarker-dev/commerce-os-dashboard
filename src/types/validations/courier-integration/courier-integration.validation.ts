import { z } from "zod";

const courierAccountFormFields = z.object({
  provider: z.enum(["PATHAO", "STEADFAST"]),
  label: z.string().trim().min(1, "Enter an account name").max(100),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  storeId: z.coerce.number().optional(),
  sandbox: z.boolean(),
  webhookSecret: z.string().optional(),
  clearWebhookSecret: z.boolean(),
  hasWebhookSecret: z.boolean(),
  isDefault: z.boolean(),
});

export const courierAccountFormSchema = (isEditing: boolean) =>
  courierAccountFormFields.superRefine((values, context) => {
    const pathaoCredentials = [
      values.clientId,
      values.clientSecret,
      values.username,
      values.password,
    ];
    const pathaoTouched = pathaoCredentials.some((value) => Boolean(value));
    const steadfastCredentials = [values.apiKey, values.secretKey];
    const steadfastTouched = steadfastCredentials.some((value) =>
      Boolean(value),
    );
    const credentialsRequired =
      !isEditing ||
      (values.provider === "PATHAO" && pathaoTouched) ||
      (values.provider === "STEADFAST" && steadfastTouched);

    if (values.provider === "PATHAO") {
      if (
        !Number.isInteger(values.storeId) ||
        !values.storeId ||
        values.storeId < 1
      ) {
        context.addIssue({
          code: "custom",
          path: ["storeId"],
          message: "Enter a valid Pathao store ID",
        });
      }

      if (credentialsRequired) {
        const fields = [
          ["clientId", values.clientId],
          ["clientSecret", values.clientSecret],
          ["username", values.username],
          ["password", values.password],
        ] as const;
        fields.forEach(([field, value]) => {
          if (!value?.trim()) {
            context.addIssue({
              code: "custom",
              path: [field],
              message: "This field is required",
            });
          }
        });
        if (
          values.username &&
          !z.string().email().safeParse(values.username).success
        ) {
          context.addIssue({
            code: "custom",
            path: ["username"],
            message: "Enter a valid email address",
          });
        }
      }
    } else if (credentialsRequired) {
      const fields = [
        ["apiKey", values.apiKey],
        ["secretKey", values.secretKey],
      ] as const;
      fields.forEach(([field, value]) => {
        if (!value?.trim()) {
          context.addIssue({
            code: "custom",
            path: [field],
            message: "This field is required",
          });
        }
      });
    }
  });

export type CourierAccountFormValues = z.infer<
  ReturnType<typeof courierAccountFormSchema>
>;
