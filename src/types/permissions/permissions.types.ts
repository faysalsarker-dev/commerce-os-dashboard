// src/types/permissions.ts

export type Role = "admin" | "seller" | "moderator";

export type Permission =
  | "product:create"
  | "product:edit"
  | "product:delete"
  | "product:view"
  | "order:view"
  | "order:create"
  | "order:refund"
  | "order:cancel"
  | "inventory:view"
  | "inventory:adjust"
  | "user:manage"
  | "user:view"
  | "report:view"
  | "report:export"
  | "settings:manage";
