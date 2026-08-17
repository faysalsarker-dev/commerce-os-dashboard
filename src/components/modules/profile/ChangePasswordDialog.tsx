import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 Button , Input,  Label } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: ChangePasswordValues) => Promise<void> | void;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl bg-muted/40 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const values = { currentPassword, newPassword };
    
      console.log("Change password payload:", values);
      await onSubmit?.(values);
      reset();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md gap-0 overflow-hidden rounded-3xl border-border/60 p-0 sm:w-full">
        <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-primary to-primary/70" />
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center gap-3 px-5 pb-2 pt-6 text-center sm:px-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
              <KeyRound className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                Change password
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
                Enter your current password and choose a new one.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-5 py-5 sm:px-7">
            <PasswordField
              id="current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="••••••••"
            />
            <PasswordField
              id="new-password"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="At least 6 characters"
            />
            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat new password"
            />
            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="flex-col-reverse gap-2.5 border-t border-border/50 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              className="h-11 w-full rounded-xl sm:w-auto sm:min-w-[110px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className={cn(
                "h-11 w-full gap-2 rounded-xl sm:w-auto sm:min-w-[150px]",
                "transition-transform active:scale-[0.98]",
              )}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
