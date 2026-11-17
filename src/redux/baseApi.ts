import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "USER",
    "PRODUCT",
    "CATEGORY",
    "SALES",
    "CUSTOMER",
    "REFUND",
    "SIZE",
    "EXPENSE",
    "EXPENSE_CATEGORY",
    "SALARY",
    "COUPON",
    "COURIER_ACCOUNT",
    "ORDER",
  ],
  keepUnusedDataFor: 60 * 60,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  endpoints: () => ({}),
});
