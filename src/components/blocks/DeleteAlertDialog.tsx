"use client";

import { ReactNode, useState } from "react";
import { Trash2, TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteAlertDialogProps {
  trigger: ReactNode;

  onDelete: () => Promise<void> | void;

  title?: string;

  description?: string;

  itemName?: string;

  confirmText?: string;

  cancelText?: string;
}

export function DeleteAlertDialog({
  trigger,
  onDelete,
  title = "Delete Item?",
  description,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteAlertDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await onDelete();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500">
            <TriangleAlert className="h-6 w-6" />
          </div>

          <AlertDialogTitle className="text-center">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            {description ??
              `This action will permanently delete ${
                itemName ? `"${itemName}"` : "this item"
              }. This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />

            {loading ? "Deleting..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}