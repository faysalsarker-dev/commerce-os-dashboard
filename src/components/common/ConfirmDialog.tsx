// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { buttonVariants } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface ConfirmDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   title: string;
//   description: string;
//   confirmLabel?: string;
//   destructive?: boolean;
//   onConfirm: () => Promise<void> | void;
// }

// export function ConfirmDialog({
//   open,
//   onOpenChange,
//   title,
//   description,
//   confirmLabel = "Confirm",
//   destructive,
//   onConfirm,
// }: ConfirmDialogProps) {
//   const [pending, setPending] = useState(false);

//   const handleConfirm = async (event: React.MouseEvent) => {
//     event.preventDefault();
//     setPending(true);
//     try {
//       await onConfirm();
//       console.log('yes confirm ')
//       onOpenChange(false);
//     } finally {
//       setPending(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="sm:max-w-105">
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>{description}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleConfirm}
//             disabled={pending}
//             className={cn(
//               buttonVariants({ variant: destructive ? "destructive" : "default" }),
//               "min-w-24",
//             )}
//           >
//             {pending ? <Loader2 className="animate-spin" /> : null}
//             {confirmLabel}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

import { useState } from "react";
import { Loader2, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  const Icon = destructive ? Trash2 : AlertCircle;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-105 gap-0 rounded-2xl border border-border/60 bg-card p-0 shadow-2xl">
        <AlertDialogHeader className="items-center gap-5 px-6 pb-4 pt-8 text-center">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm",
              destructive
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </motion.div>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 px-6 pb-6 pt-2 sm:justify-center">
          <AlertDialogCancel
            disabled={pending}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 min-w-28 rounded-xl border-border/60 bg-transparent font-medium hover:bg-accent hover:text-accent-foreground",
            )}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            className={cn(
              buttonVariants({
                variant: destructive ? "destructive" : "default",
                size: "lg",
              }),
              "h-11 min-w-28 rounded-xl font-medium shadow-sm",
              destructive && "hover:bg-destructive/90",
            )}
          >
            <AnimatePresence mode="wait">
              {pending && (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.span>
              )}
            </AnimatePresence>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
