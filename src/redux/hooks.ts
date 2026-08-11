import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Export all RTK Query API hooks and endpoints
export * from "./features/auth/auth.api";
export * from "./features/category/category.api";
export * from "./features/customer/customer.api";
export * from "./features/product/product.api";
export * from "./features/refund/refund.api";
export * from "./features/sales/sales.api";
export * from "./features/user/user.api";
