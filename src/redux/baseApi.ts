import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER", "PRODUCT", "CATEGORY", "SALES"],
  keepUnusedDataFor: 60 * 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

