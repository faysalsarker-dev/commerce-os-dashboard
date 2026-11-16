import { Badge } from "@/components/ui";
import { select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { CourierAccount } from "@/types/data-types/courier-integration/courier-integration.types";
import {
  KeyRound,
  Pause,
  Play,
  Star,
} from "lucide-react";

export const COURIER_PAGE_CONFIG = {
  title: "Courier Integrations",
  description:
    "Connect delivery providers and manage your courier account settings.",
} as const;

export const COURIER_FILTER_CONFIG = [
  select({
    name: "provider",
    label: "Provider",
    placeholder: "All providers",
    options: [
      { label: "Pathao", value: "PATHAO" },
      { label: "Steadfast", value: "STEADFAST" },
    ],
  }),
  select({
    name: "isActive",
    label: "Status",
    placeholder: "All statuses",
    options: [
      { label: "Active", value: "true" },
      { label: "Paused", value: "false" },
    ],
  }),
];

export interface CourierTableHandlers {
  onView: (account: CourierAccount) => void;
  onEdit: (account: CourierAccount) => void;
  onDelete: (account: CourierAccount) => void;
  onSetDefault: (account: CourierAccount) => void;
  onPause: (account: CourierAccount) => void;
  onActivate: (account: CourierAccount) => void;
  onRegenerateSecret: (account: CourierAccount) => void;
}

export function createCourierTableColumns({
  onView,
  onEdit,
  onDelete,
  onSetDefault,
  onPause,
  onActivate,
  onRegenerateSecret,
}: CourierTableHandlers) {
  return createColumns<CourierAccount>({
    columns: [
      column("label", {
        label: "Account",
        render: (account) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{account.label}</span>
            <span className="text-xs text-muted-foreground">
              {account.maskedHint}
            </span>
          </div>
        ),
      }),
      column("provider", {
        label: "Provider",
        render: (account) => (
          <Badge variant="outline">
            {account.provider === "PATHAO" ? "Pathao" : "Steadfast"}
          </Badge>
        ),
      }),
      column("isDefault", {
        label: "Default",
        render: (account) => (
          <span className="text-sm text-muted-foreground">
            {account.isDefault ? "Default" : "-"}
          </span>
        ),
      }),
      column("isActive", {
        label: "Status",
        render: (account) => (
          <Badge
            variant={account.isActive ? "secondary" : "outline"}
            className={
              account.isActive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "text-muted-foreground"
            }
          >
            {account.isActive ? "Active" : "Paused"}
          </Badge>
        ),
      }),
      column("hasWebhookSecret", {
        label: "Webhook",
        render: (account) => (
          <span className="text-sm text-muted-foreground">
            {account.hasWebhookSecret ? "Configured" : "Not configured"}
          </span>
        ),
      }),
      column.date("createdAt", { label: "Connected" }),
      column.actions([
        action.view<CourierAccount>({ onClick: onView }),
        action.edit<CourierAccount>({ onClick: onEdit }),
        action.custom<CourierAccount>({
          label: "Set as default",
          icon: Star,
          hidden: (account) => account.isDefault,
          onClick: onSetDefault,
        }),
        action.custom<CourierAccount>({
          label: "Pause",
          icon: Pause,
          hidden: (account) => !account.isActive,
          onClick: onPause,
        }),
        action.custom<CourierAccount>({
          label: "Activate",
          icon: Play,
          hidden: (account) => account.isActive,
          onClick: onActivate,
        }),
        action.custom<CourierAccount>({
          label: "Regenerate webhook secret",
          icon: KeyRound,
          hidden: (account) => account.provider !== "PATHAO",
          confirm: true,
          confirmTitle: "Regenerate webhook secret?",
          confirmDescription:
            "The current secret will stop working. Save the replacement shown after regeneration.",
          confirmLabel: "Regenerate secret",
          onClick: onRegenerateSecret,
        }),
        action.delete<CourierAccount>({
          confirmTitle: "Disconnect courier account?",
          confirmDescription:
            "This courier account will be removed and can no longer be used for new shipments.",
          onClick: onDelete,
        }),
      ]),
    ],
  });
}
