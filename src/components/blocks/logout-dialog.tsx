import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

import { useLogout } from "@/hooks/auth/useLogout";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({
  open,
  onOpenChange,
}: LogoutDialogProps) {
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-112.5 rounded-2xl p-6">
      <AlertDialogHeader className="flex flex-col items-center text-center">
<div className="flex w-full justify-center mb-4">
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
    }}
    className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
  >
    <LogOut className="size-6" strokeWidth={2} />
  </motion.div>
</div>

  <AlertDialogTitle className="w-full text-center text-lg font-semibold tracking-tight">
    Sign out?
  </AlertDialogTitle>

  <AlertDialogDescription className="mt-2 w-full max-w-75 text-center text-sm leading-5">
    Are you sure you want to sign out of your account?
  </AlertDialogDescription>
</AlertDialogHeader>

        <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-2 sm:space-x-0">
          <AlertDialogCancel
            disabled={isLoading}
            className="mt-0 h-10 rounded-lg border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="h-10 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing out
              </>
            ) : (
              <>
                <LogOut className="mr-2 size-4" />
                Sign out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}