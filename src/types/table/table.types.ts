// types.ts
import "@tanstack/react-table"


declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string
    className?: string
  }
}
