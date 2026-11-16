import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useGetCourierAccountQuery } from "@/redux/hooks";

interface CourierAccountDetailsDialogProps {
  id: string | null;
  onOpenChange: (open: boolean) => void;
}

export function CourierAccountDetailsDialog({
  id,
  onOpenChange,
}: CourierAccountDetailsDialogProps) {
  const { data: response, isLoading, isError } = useGetCourierAccountQuery(
    id ?? "",
    { skip: !id },
  );
  const account = response?.data;

  const copyWebhookUrl = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account.webhookUrl);
      toast.success("Webhook URL copied");
    } catch {
      toast.error("Unable to copy the webhook URL.");
    }
  };

  return (
    <Dialog open={Boolean(id)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Courier account details</DialogTitle>
          <DialogDescription>
            Connection settings and webhook information. Secret credentials are
            never displayed.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading account details…
          </div>
        ) : isError || !account ? (
          <p role="alert" className="py-6 text-sm text-destructive">
            Unable to load this courier account.
          </p>
        ) : (
          <div className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail label="Account" value={account.label} />
              <Detail
                label="Provider"
                value={account.provider === "PATHAO" ? "Pathao" : "Steadfast"}
              />
              <Detail label="Credential hint" value={account.maskedHint} />
              <Detail
                label="Status"
                value={account.isActive ? "Active" : "Paused"}
              />
              <Detail
                label="Default account"
                value={account.isDefault ? "Yes" : "No"}
              />
              <Detail
                label="Webhook secret"
                value={account.hasWebhookSecret ? "Configured" : "Not configured"}
              />
              {account.provider === "PATHAO" &&
                account.config &&
                "storeId" in account.config && (
                  <>
                    <Detail
                      label="Pathao store ID"
                      value={String(account.config.storeId)}
                    />
                    <Detail
                      label="Environment"
                      value={account.config.sandbox ? "Sandbox" : "Production"}
                    />
                  </>
                )}
            </dl>

            <div className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Webhook URL</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={copyWebhookUrl}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
              <code className="block break-all text-xs text-muted-foreground">
                {account.webhookUrl}
              </code>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
    </div>
  );
}
