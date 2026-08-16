/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import type { ApiError } from "@/types/shared";

export interface AsyncMutationOptions<T = any> {
  /** Custom success message string or a function receiving the response data */
  successMessage?: string | ((data: T) => string);
  successDescription?: string;
  /** Custom error fallback message if error response doesn't contain a message */
  errorMessage?: string;
  errorDescription?: string;
  /** Optional loading message to display while the promise is pending */
  loadingMessage?: string;
  /** Callback fired on successful execution */
  onSuccess?: (data: T) => void | Promise<void>;
  /** Callback fired when an error occurs */
  onError?: (error: unknown, message: string) => void | Promise<void>;
  /** Callback fired after completion regardless of outcome */
  onFinally?: () => void;
  /** Whether to display a toast on success (default: true if message is available) */
  showSuccessToast?: boolean;

  /** Whether to display a toast on error (default: true) */
  showErrorToast?: boolean;
}

export interface AsyncMutationResult<T> {
  data?: T;
  error?: unknown;
  success: boolean;
}

/**
 * Parses and extracts a user-friendly error message from various error formats
 * (API response, RTK Query unwrap error, Error instance, or string).
 */
export function getErrorMessage(error: unknown, defaultMessage = "Something went wrong"): string {
  if (!error) return defaultMessage;

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  const apiErr = error as ApiError;
  if (apiErr?.data?.message && typeof apiErr.data.message === "string") {
    return apiErr.data.message;
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, any>;
    if (typeof errObj.message === "string" && errObj.message.trim()) {
      return errObj.message;
    }
    if (typeof errObj.data === "string" && errObj.data.trim()) {
      return errObj.data;
    }
  }

  return defaultMessage;
}

/**
 * Reusable utility function that executes an async data mutation with automated
 * try-catch error handling, toast notifications, and callbacks.
 *
 * @example
 * ```ts
 * const { data, success } = await handleAsyncMutation(
 *   () => deleteCategory(id).unwrap(),
 *   { successMessage: "Category deleted successfully" }
 * );
 * ```
 */
export async function handleAsyncMutation<T = any>(
  asyncFn: () => Promise<T>,
  options: AsyncMutationOptions<T> = {}
): Promise<AsyncMutationResult<T>> {
  const {
    successMessage,
    successDescription = "Additional details about the successful operation.",
    errorMessage = "Operation failed",
    errorDescription = "Additional details about the error.",
    loadingMessage,
    onSuccess,
    onError,
    onFinally,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  let toastId: string | number | undefined;
  if (loadingMessage) {
    toastId = toast.loading(loadingMessage);
  }

  try {
    const data = await asyncFn();

    let msgToDisplay: string | undefined;
    if (typeof successMessage === "function") {
      msgToDisplay = successMessage(data);
    } else if (successMessage) {
      msgToDisplay = successMessage;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      msgToDisplay = (data as { message: string }).message;
    }

    if (toastId !== undefined) {
      if (msgToDisplay && showSuccessToast) {
        toast.success(msgToDisplay, {
          description: successDescription,
          id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } else if (msgToDisplay && showSuccessToast) {
      toast.success(msgToDisplay);
    }

    if (onSuccess) {
      await onSuccess(data);
    }

    return { data, success: true };
  } catch (error) {
    const extractedMessage = getErrorMessage(error, errorMessage);

    if (toastId !== undefined) {
      if (showErrorToast) {
        toast.error(extractedMessage, {description: errorDescription, id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } else if (showErrorToast) {
      toast.error(extractedMessage );
    }

    if (onError) {
      await onError(error, extractedMessage);
    }

    return { error, success: false };
  } finally {
    if (onFinally) {
      onFinally();
    }
  }
}

/**
 * Higher-order function that wraps an async action function with try-catch and toast notifications.
 *
 * @example
 * ```ts
 * const handleDelete = withToast(
 *   (categoryId: string) => deleteCategory(categoryId).unwrap(),
 *   { successMessage: "Category deleted" }
 * );
 * ```
 */
export function withToast<Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  options?: AsyncMutationOptions<Return> | ((...args: Args) => AsyncMutationOptions<Return>)
) {
  return async (...args: Args): Promise<AsyncMutationResult<Return>> => {
    const opts = typeof options === "function" ? options(...args) : options;
    return handleAsyncMutation(() => fn(...args), opts);
  };
}
