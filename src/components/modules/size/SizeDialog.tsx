import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";

import { useCreateSizeMutation } from "@/redux/hooks";
import { handleAsyncMutation } from "@/utils/asyncHandler";
import {
  sizeFormSchema,
  DEFAULT_SIZE_VALUES,
  type SizeFormValues,
} from "@/types/validations/size/size.validation";

export interface SizeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
}

export function SizeDialog({ open, onOpenChange, trigger }: SizeDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [createSize, { isLoading: isCreating }] = useCreateSizeMutation();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: DEFAULT_SIZE_VALUES,
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!dialogOpen) {
      form.reset(DEFAULT_SIZE_VALUES);
    }
  }, [dialogOpen, form]);

  const onSubmit = async (values: SizeFormValues) => {
    const formattedSize = values.size.trim().toUpperCase();

    await handleAsyncMutation(
      () => createSize({ size: formattedSize }).unwrap(),
      {
        successMessage: `Size "${formattedSize}" created successfully.`,
        errorMessage: "Unable to create size",
        errorDescription: "An error occurred while creating the size.",
        onSuccess: () => {
          form.reset(DEFAULT_SIZE_VALUES);
          setDialogOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger !== null && (
        <DialogTrigger>
          {trigger ?? (
            <Button>
              <Plus className="size-4" />
              Add Size
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Size</DialogTitle>
          <DialogDescription>
            Enter a size code or number (e.g. S, M, L, XL, 38, 40, 42). String
            values will automatically be saved in uppercase.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. XL or 42"
                      autoFocus
                      autoComplete="off"
                      onChange={(e) => {
                        // Automatically convert any text entered to uppercase
                        field.onChange(e.target.value.toUpperCase());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create Size
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
