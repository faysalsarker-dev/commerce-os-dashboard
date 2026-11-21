import { useMemo } from "react";
import { EntityFormDialog } from "@/components/modules/form/EntityFormDialog";
import { createCourierAccountFormConfig } from "./courier-account-form.config";
import type {
  CourierAccount,
  CourierProvider,
  CreateCourierAccountPayload,
  PathaoConfig,
  PathaoCredentials,
  SteadfastCredentials,
  TestCourierConnectionPayload,
  UpdateCourierAccountPayload,
} from "@/types/data-types/courier-integration/courier-integration.types";
import type { CourierAccountFormValues } from "@/types/validations/courier-integration/courier-integration.validation";
import { courierAccountFormSchema } from "@/types/validations/courier-integration/courier-integration.validation";
import {
  useCreateCourierAccountMutation,
  useTestCourierConnectionMutation,
  useUpdateCourierAccountMutation,
} from "@/redux/hooks";

interface CourierAccountFormDialogProps {
  account: CourierAccount | null;
  initialProvider?: CourierProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSecretGenerated: (secret: string) => void;
}

function isPathaoConfig(
  config: CourierAccount["config"],
): config is PathaoConfig {
  return Boolean(config && "storeId" in config);
}

function getPathaoCredentials(
  values: CourierAccountFormValues,
): PathaoCredentials {
  return {
    clientId: values.clientId?.trim() ?? "",
    clientSecret: values.clientSecret ?? "",
    username: values.username?.trim() ?? "",
    password: values.password ?? "",
  };
}

function getSteadfastCredentials(
  values: CourierAccountFormValues,
): SteadfastCredentials {
  return {
    apiKey: values.apiKey?.trim() ?? "",
    secretKey: values.secretKey ?? "",
  };
}

export function CourierAccountFormDialog({
  account,
  initialProvider = "PATHAO",
  open,
  onOpenChange,
  onSecretGenerated,
}: CourierAccountFormDialogProps) {
  const [createCourierAccount] = useCreateCourierAccountMutation();
  const [updateCourierAccount] = useUpdateCourierAccountMutation();
  const [testCourierConnection] = useTestCourierConnectionMutation();

  const defaultValues = useMemo<CourierAccountFormValues>(() => {
    const config =
      account && isPathaoConfig(account.config) ? account.config : undefined;

    return {
      provider: account?.provider ?? initialProvider,
      label: account?.label ?? "",
      clientId: "",
      clientSecret: "",
      username: "",
      password: "",
      apiKey: "",
      secretKey: "",
      storeId: config?.storeId ?? 1,
      sandbox: config?.sandbox ?? true,
      webhookSecret: "",
      clearWebhookSecret: false,
      hasWebhookSecret: account?.hasWebhookSecret ?? false,
      isDefault: account?.isDefault ?? false,
    };
  }, [account, initialProvider]);

  const formConfig = useMemo(
    () => createCourierAccountFormConfig(Boolean(account)),
    [account],
  );
  const schema = useMemo(
    () => courierAccountFormSchema(Boolean(account)),
    [account],
  );

  const onSubmit = async (values: CourierAccountFormValues) => {
    if (account) {
      const data: UpdateCourierAccountPayload = {
        label: values.label.trim(),
        isDefault: values.isDefault,
      };

      if (account.provider === "PATHAO") {
        const credentials = getPathaoCredentials(values);
        const credentialsChanged = Object.values(credentials).some(Boolean);
        const config: PathaoConfig = {
          storeId: values.storeId ?? 0,
          sandbox: values.sandbox,
        };

        if (credentialsChanged) {
          const testPayload: TestCourierConnectionPayload = {
            provider: "PATHAO",
            credentials,
            config,
          };
          await testCourierConnection(testPayload).unwrap();
          data.credentials = credentials;
        }

        const currentConfig = isPathaoConfig(account.config)
          ? account.config
          : null;
        if (
          !currentConfig ||
          currentConfig.storeId !== config.storeId ||
          currentConfig.sandbox !== config.sandbox
        ) {
          data.config = config;
        }
      } else {
        const credentials = getSteadfastCredentials(values);
        const credentialsChanged = Object.values(credentials).some(Boolean);
        if (credentialsChanged) {
          const testPayload: TestCourierConnectionPayload = {
            provider: "STEADFAST",
            credentials,
          };
          await testCourierConnection(testPayload).unwrap();
          data.credentials = credentials;
        }

        if (values.clearWebhookSecret) {
          data.webhookSecret = null;
        } else if (values.webhookSecret?.trim()) {
          data.webhookSecret = values.webhookSecret.trim();
        }
      }

      return updateCourierAccount({ id: account.id, data }).unwrap();
    }

    let payload: CreateCourierAccountPayload;

    if (values.provider === "PATHAO") {
      const credentials = getPathaoCredentials(values);
      const config: PathaoConfig = {
        storeId: values.storeId ?? 0,
        sandbox: values.sandbox,
      };
      payload = {
        provider: "PATHAO",
        label: values.label.trim(),
        credentials,
        config,
        isDefault: values.isDefault,
      };
    } else {
      const credentials = getSteadfastCredentials(values);
      payload = {
        provider: "STEADFAST",
        label: values.label.trim(),
        credentials,
        ...(values.webhookSecret?.trim() && {
          webhookSecret: values.webhookSecret.trim(),
        }),
        isDefault: values.isDefault,
      };
    }

    const response = await createCourierAccount(payload).unwrap();
    if (response.data.oneTimeWebhookSecret) {
      onSecretGenerated(response.data.oneTimeWebhookSecret);
    }
    return response;
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={account ? "Edit courier account" : "Connect courier account"}
      description="New credentials are tested before saving. Saved credentials are never displayed."
      schema={schema}
      config={formConfig}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitLabel={account ? "Save changes" : "Connect account"}
      contentClassName="sm:max-w-2xl"
    />
  );
}
