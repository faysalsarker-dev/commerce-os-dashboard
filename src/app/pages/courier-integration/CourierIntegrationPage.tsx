import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CirclePause,
  Plus,
  Star,
  Truck,
  Webhook,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { DataTable } from "@/components/modules/table";
import { getDefaultValues } from "@/components/modules/filter";
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common";
import { useFilter } from "@/hooks/useFilter";
import type {
  CourierAccount,
  CourierAccountListQuery,
  CourierProvider,
} from "@/types/data-types/courier-integration/courier-integration.types";
import {
  useDeleteCourierAccountMutation,
  useGetCourierAccountsQuery,
  useRegenerateCourierWebhookSecretMutation,
  useUpdateCourierAccountMutation,
} from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import { toast } from "sonner";
import {
  CourierAccountDetailsDialog,
  CourierAccountFormDialog,
  OneTimeSecretDialog,
} from "@/components/modules/courier-integration";
import {
  COURIER_FILTER_CONFIG,
  COURIER_PAGE_CONFIG,
  createCourierTableColumns,
} from "./courier-integration.config";

interface CourierFilters {
  provider: CourierProvider | "";
  isActive: "" | "true" | "false";
}

export default function CourierIntegrationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CourierAccount | null>(
    null,
  );
  const [initialProvider, setInitialProvider] =
    useState<CourierProvider>("PATHAO");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [oneTimeSecret, setOneTimeSecret] = useState<string | null>(null);

  const filter = useFilter<CourierFilters>({
    defaultValues: getDefaultValues(COURIER_FILTER_CONFIG) as CourierFilters,
    syncToUrl: true,
  });

  const queryParams = useMemo<CourierAccountListQuery>(
    () => ({
      page: filter.page,
      limit: filter.pageSize,
      ...(filter.values.provider && {
        provider: filter.values.provider,
      }),
      ...(filter.values.isActive !== "" && {
        isActive: filter.values.isActive === "true",
      }),
    }),
    [filter.page, filter.pageSize, filter.values],
  );

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetCourierAccountsQuery(queryParams);
  const {
    data: overviewResponse,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useGetCourierAccountsQuery({ page: 1, limit: 100 });
  const overviewAccounts = overviewResponse?.data ?? [];
  const totalConnections = overviewResponse?.meta.total ?? 0;
  const activeConnections = overviewAccounts.filter(
    (account) => account.isActive,
  ).length;
  const pausedConnections = Math.max(
    0,
    totalConnections - activeConnections,
  );
  const defaultConnections = overviewAccounts.filter(
    (account) => account.isDefault,
  ).length;
  const [deleteCourierAccount] = useDeleteCourierAccountMutation();
  const [updateCourierAccount] = useUpdateCourierAccountMutation();
  const [regenerateWebhookSecret] =
    useRegenerateCourierWebhookSecretMutation();

  const columns = useMemo(
    () =>
      createCourierTableColumns({
        onView: (account) => setDetailsId(account.id),
        onEdit: (account) => {
          setEditingAccount(account);
          setDialogOpen(true);
        },
        onDelete: (account) =>
          handleAsyncMutation(
            () => deleteCourierAccount(account.id).unwrap(),
            {
              successMessage: "Courier account disconnected",
              successDescription: `"${account.label}" has been removed.`,
              errorMessage: "Unable to disconnect courier account",
            },
          ),
        onSetDefault: (account) =>
          handleAsyncMutation(
            () =>
              updateCourierAccount({
                id: account.id,
                data: { isDefault: true },
              }).unwrap(),
            {
              successMessage: "Default courier updated",
              errorMessage: "Unable to update courier account",
            },
          ),
        onPause: (account) =>
          handleAsyncMutation(
            () =>
              updateCourierAccount({
                id: account.id,
                data: { isActive: false },
              }).unwrap(),
            {
              successMessage: "Courier account paused",
              errorMessage: "Unable to pause courier account",
            },
          ),
        onActivate: (account) =>
          handleAsyncMutation(
            () =>
              updateCourierAccount({
                id: account.id,
                data: { isActive: true },
              }).unwrap(),
            {
              successMessage: "Courier account activated",
              errorMessage: "Unable to activate courier account",
            },
          ),
        onRegenerateSecret: (account) =>
          handleAsyncMutation(
            () => regenerateWebhookSecret(account.id).unwrap(),
            {
              successMessage: "Webhook secret regenerated",
              successDescription: "Save the replacement; it will only be shown once.",
              errorMessage: "Unable to regenerate webhook secret",
              onSuccess: (result) => {
                if (!result.data.oneTimeWebhookSecret) {
                  toast.error("The server did not return a webhook secret.");
                  return;
                }
                setOneTimeSecret(result.data.oneTimeWebhookSecret);
              },
            },
          ),
      }),
    [
      deleteCourierAccount,
      regenerateWebhookSecret,
      updateCourierAccount,
    ],
  );

  const totalPages = response?.meta
    ? Math.max(1, Math.ceil(response.meta.total / response.meta.limit))
    : 1;
  const tableMeta = response?.meta
    ? {
        ...response.meta,
        totalPages,
        hasNextPage: response.meta.page < totalPages,
        hasPrevPage: response.meta.page > 1,
      }
    : undefined;
  const openCreateDialog = (provider: CourierProvider = "PATHAO") => {
    setEditingAccount(null);
    setInitialProvider(provider);
    setDialogOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title={COURIER_PAGE_CONFIG.title}
        description={COURIER_PAGE_CONFIG.description}
        onClick={() => openCreateDialog()}
      
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Connections"
          value={isOverviewLoading ? "..." : totalConnections}
          detail="Courier accounts configured"
          icon={Truck}
          tone="blue"
        />
        <SummaryCard
          label="Active"
          value={isOverviewLoading ? "..." : activeConnections}
          detail="Ready for new shipments"
          icon={CheckCircle2}
          tone="green"
        />
        <SummaryCard
          label="Paused"
          value={isOverviewLoading ? "..." : pausedConnections}
          detail="Not used for new shipments"
          icon={CirclePause}
          tone="amber"
        />
        <SummaryCard
          label="Default routes"
          value={isOverviewLoading ? "..." : defaultConnections}
          detail="Preferred account by courier"
          icon={Star}
          tone="violet"
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Supported couriers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect the delivery providers your team uses most.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <ProviderCard
            name="Pathao"
            description="Manage Pathao credentials, sandbox settings, and webhook secrets."
            icon={Truck}
            count={isOverviewLoading
              ? "..."
              : overviewAccounts.filter(
                  (account) => account.provider === "PATHAO",
                ).length}
            onConnect={() => openCreateDialog("PATHAO")}
          />
          <ProviderCard
            name="Steadfast"
            description="Connect your merchant API and webhook configuration."
            icon={Webhook}
            count={isOverviewLoading
              ? "..."
              : overviewAccounts.filter(
                  (account) => account.provider === "STEADFAST",
                ).length}
            onConnect={() => openCreateDialog("STEADFAST")}
          />
        </div>
      </section>

      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Connected accounts
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review connection health and manage account settings.
        </p>
      </div>

      <FilterBar filter={filter} filters={COURIER_FILTER_CONFIG} />

      {(isError || isOverviewError) && (
        <p role="alert" className="text-sm text-destructive">
          Unable to load courier account data. Please try again.
        </p>
      )}

      <DataTable
        columns={columns}
        data={response?.data ?? []}
        isLoading={isLoading || isFetching}
        pagination={filter.tableState}
        onPaginationChange={filter.onTableStateChange}
        meta={tableMeta}
      />

      <CourierAccountFormDialog
        account={editingAccount}
        initialProvider={initialProvider}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAccount(null);
        }}
        onSecretGenerated={setOneTimeSecret}
      />
      <CourierAccountDetailsDialog
        id={detailsId}
        onOpenChange={(open) => {
          if (!open) setDetailsId(null);
        }}
      />
      <OneTimeSecretDialog
        secret={oneTimeSecret}
        onOpenChange={(open) => {
          if (!open) setOneTimeSecret(null);
        }}
      />
    </PageContainer>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Truck;
  tone: "blue" | "green" | "amber" | "violet";
}) {
  const tones = {
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };

  return (
    <Card className="rounded-2xl border border-border/60 shadow-xs">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function ProviderCard({
  name,
  description,
  icon: Icon,
  count,
  onConnect,
}: {
  name: string;
  description: string;
  icon: typeof Truck;
  count: number | string;
  onConnect: () => void;
}) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-xs">
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{name}</p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {count} connected
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2"
          onClick={onConnect}
        >
          <Plus className="size-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
