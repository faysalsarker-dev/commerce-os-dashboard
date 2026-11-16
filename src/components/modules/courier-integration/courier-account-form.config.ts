import { createForm } from "@/components/modules/form/createForm";
import type { CourierAccountFormValues } from "@/types/validations/courier-integration/courier-integration.validation";

const PROVIDER_OPTIONS = [
  { label: "Pathao", value: "PATHAO" },
  { label: "Steadfast", value: "STEADFAST" },
];

export function createCourierAccountFormConfig(isEditing: boolean) {
  const credentialsDescription = isEditing
    ? "Leave blank to keep the current credential."
    : undefined;

  return createForm<CourierAccountFormValues>()
    .field("provider", {
      kind: "select",
      label: "Courier provider",
      options: PROVIDER_OPTIONS,
      disabled: isEditing,
      colSpan: 2,
    })
    .field("label", {
      kind: "text",
      label: "Account name",
      placeholder: "e.g. Dhaka warehouse",
      colSpan: 2,
    })
    .field("clientId", {
      kind: "text",
      label: "Pathao client ID",
      description: credentialsDescription,
      condition: (values) => values.provider === "PATHAO",
    })
    .field("clientSecret", {
      kind: "password",
      label: "Pathao client secret",
      description: credentialsDescription,
      condition: (values) => values.provider === "PATHAO",
    })
    .field("username", {
      kind: "text",
      label: "Pathao account email",
      description: credentialsDescription,
      condition: (values) => values.provider === "PATHAO",
    })
    .field("password", {
      kind: "password",
      label: "Pathao account password",
      description: credentialsDescription,
      condition: (values) => values.provider === "PATHAO",
    })
    .field("storeId", {
      kind: "number",
      label: "Pathao store ID",
      min: 1,
      step: 1,
      condition: (values) => values.provider === "PATHAO",
    })
    .field("sandbox", {
      kind: "switch",
      label: "Use Pathao sandbox",
      description: "Use the test environment instead of production.",
      condition: (values) => values.provider === "PATHAO",
    })
    .field("apiKey", {
      kind: "text",
      label: "Steadfast API key",
      description: credentialsDescription,
      condition: (values) => values.provider === "STEADFAST",
    })
    .field("secretKey", {
      kind: "password",
      label: "Steadfast secret key",
      description: credentialsDescription,
      condition: (values) => values.provider === "STEADFAST",
    })
    .field("webhookSecret", {
      kind: "password",
      label: "Steadfast webhook secret",
      description: isEditing
        ? "Enter a replacement or leave blank to keep the current secret."
        : "Optional secret used to validate Steadfast webhooks.",
      condition: (values) => values.provider === "STEADFAST",
    })
    .field("clearWebhookSecret", {
      kind: "checkbox",
      label: "Remove saved webhook secret",
      condition: (values) =>
        isEditing &&
        values.provider === "STEADFAST" &&
        values.hasWebhookSecret,
    })
    .field("isDefault", {
      kind: "switch",
      label: "Set as default account for this courier",
      colSpan: 2,
    })
    .build();
}
