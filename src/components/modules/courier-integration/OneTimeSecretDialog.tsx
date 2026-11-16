import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/ui";

interface OneTimeSecretDialogProps {
  secret: string | null;
  onOpenChange: (open: boolean) => void;
}

export function OneTimeSecretDialog({
  secret,
  onOpenChange,
}: OneTimeSecretDialogProps) {
  const copySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      toast.success("Webhook secret copied");
    } catch {
      toast.error("Unable to copy the secret. Select and copy it manually.");
    }
  };

  return (
    <Dialog open={Boolean(secret)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            Save your webhook secret
          </DialogTitle>
          <DialogDescription>
            This secret is shown only once. Copy it into your courier provider’s
            webhook settings before closing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            readOnly
            value={secret ?? ""}
            className="font-mono text-xs"
            aria-label="One-time webhook secret"
          />
          <Button type="button" variant="outline" onClick={copySecret}>
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            I have saved it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
