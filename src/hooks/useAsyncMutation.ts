import { useState, useCallback } from "react";
import {
  handleAsyncMutation,
  type AsyncMutationOptions,
  type AsyncMutationResult,
} from "@/utils/asyncHandler";

/**
 * React hook to handle async data mutations (RTK Query unwrap, API calls, custom promises)
 * with built-in loading state (`isLoading`), automated `try-catch`, error extraction, and toast notifications.
 *
 * ============================================================================
 * USE CASE SCENARIOS & EXAMPLES
 * ============================================================================
 *
 * --- SCENARIO 1: Simple Action (e.g. Delete Item) ---
 * ```tsx
 * const { execute, isLoading } = useAsyncMutation();
 * const [deleteProduct] = useDeleteProductMutation();
 *
 * const handleDelete = async (productId: string) => {
 *   await execute(
 *     () => deleteProduct(productId).unwrap(),
 *     {
 *       successMessage: "Product deleted successfully",
 *       errorMessage: "Failed to delete product",
 *     }
 *   );
 * };
 * ```
 *
 * --- SCENARIO 2: Form Submission (Create or Edit with Modal/Dialog Close) ---
 * ```tsx
 * const { execute, isLoading } = useAsyncMutation();
 * const [createCategory] = useCreateCategoryMutation();
 *
 * const onSubmit = async (formData: CategoryFormValues) => {
 *   const { success } = await execute(
 *     () => createCategory(formData).unwrap(),
 *     {
 *       successMessage: "Category created!",
 *       onSuccess: (data) => {
 *         setModalOpen(false);
 *         resetForm();
 *       },
 *       onError: (error, message) => {
 *         if (message.toLowerCase().includes("slug")) {
 *           form.setError("slug", { message });
 *         }
 *       },
 *     }
 *   );
 * };
 * ```
 *
 * --- SCENARIO 3: Async Task with Loading Toast Indicator ---
 * ```tsx
 * const { execute, isLoading } = useAsyncMutation();
 *
 * const handleExportPDF = async () => {
 *   await execute(
 *     () => generatePdfReportApi(),
 *     {
 *       loadingMessage: "Generating PDF report, please wait...",
 *       successMessage: "PDF report downloaded!",
 *     }
 *   );
 * };
 * ```
 *
 * --- SCENARIO 4: Dynamic Success Message based on API Response ---
 * ```tsx
 * const { execute } = useAsyncMutation();
 *
 * const handleSync = async () => {
 *   await execute(
 *     () => syncInventoryApi().unwrap(),
 *     {
 *       // Receive response data inside successMessage callback function
 *       successMessage: (res) => `Synced ${res.totalItems} items successfully!`,
 *     }
 *   );
 * };
 * ```
 */
export function useAsyncMutation<T = any>(defaultOptions: AsyncMutationOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (
      asyncFn: () => Promise<T>,
      overrideOptions: AsyncMutationOptions<T> = {}
    ): Promise<AsyncMutationResult<T>> => {
      setIsLoading(true);
      const mergedOptions = { ...defaultOptions, ...overrideOptions };
      try {
        return await handleAsyncMutation(asyncFn, mergedOptions);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultOptions]
  );

  return { execute, isLoading };
}
