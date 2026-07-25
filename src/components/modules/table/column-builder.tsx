
/**
 * column-builder.tsx
 *
 * A single, reusable column builder for TanStack Table + shadcn/ui.
 * Pages describe WHAT they want; this file handles HOW it renders.
 *
 *   const columns = createColumns<Product>({
 *     resource: "product",
 *     columns: [
 *       column("name"),
 *       column.currency("price"),
 *       column.status("status"),
 *       column.actions([
 *         action.view({ onClick: handleView }),
 *         action.edit({ can: "update", onClick: handleEdit }),
 *         action.delete({ can: "delete", onClick: handleDelete }),
 *       ]),
 *     ],
 *   })
 *
 * Extensibility: to add a new column type (avatar, image, badge, boolean…)
 * add its literal to `ColumnType` and register a renderer in `renderers`.
 * Nothing else in the file needs to change.
 */

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { MoreHorizontal, Pencil, Trash2, Eye, Copy, Archive, ImageOff, TriangleAlert } from "lucide-react"
import type {
    Action,
    Resource,
} from "@/types/permissions/permissions.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { Avatar, AvatarFallback, AvatarImage, StatusBadge } from "@/components/ui"
import { Can } from "@/components/shared/permissions/Can"
import { cn } from "@/lib/utils"


// Import YOUR app's real CASL union types here. Defaulting the generics to
// these (instead of `string`) is what makes `can`/`resource` type-safe
// against <Can I a> with no casts. Adjust the import path/names to match
// your ability definition.

/* --------------------------------------------------------------------- */
/* Internal utilities                                                    */
/* --------------------------------------------------------------------- */

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function formatCurrency(value: unknown, currency = "USD"): string {
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(n)) return "-"
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n)
}

function formatNumber(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(n)) return "-"
  return new Intl.NumberFormat("en-US").format(n)
}

function formatDate(value: unknown): string {
  if (!value) return "-"
  const date = value instanceof Date ? value : new Date(value as string)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date)
}

/** Resolves a boolean-or-callback prop (used by `hidden` / `disabled`). */
function resolveFlag<T>(value: boolean | ((row: T) => boolean) | undefined, row: T): boolean {
  return typeof value === "function" ? value(row) : !!value
}

/** Supports dot-path keys ("customer.name") in addition to plain keys. */
function getValueByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part]
    return undefined
  }, obj)
}

/* --------------------------------------------------------------------- */
/* Types                                                                 */
/* --------------------------------------------------------------------- */

type Align = "left" | "center" | "right"

interface BaseColumnOptions<T> {
  label?: string
  sortable?: boolean
  hideable?: boolean
  width?: number
  align?: Align
  formatter?: (value: unknown, row: T) => React.ReactNode
  render?: (row: T) => React.ReactNode
}

interface CurrencyColumnOptions<T> extends BaseColumnOptions<T> {
  currency?: string
}

interface ImageColumnOptions<T> extends BaseColumnOptions<T> {
  size?: number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  fallback?: string;
}


// Add new column types here as you extend the builder (e.g. "avatar" | "badge").
type ColumnType = "text" | "currency" | "number" | "date" | "status" | "image"

interface DataColumnConfig<T> {
  kind: "data"
  type: ColumnType
  key: keyof T & string
  options:
  | BaseColumnOptions<T>
  | CurrencyColumnOptions<T>
  | ImageColumnOptions<T>;
}

interface ActionsColumnConfig<T, TAction extends string> {
  kind: "actions"
  actions: ActionConfig<T, TAction>[]
}

type ColumnConfig<T, TAction extends string> = DataColumnConfig<T> | ActionsColumnConfig<T, TAction>

type ActionVariant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
type ActionType = "view" | "edit" | "delete" | "duplicate" | "archive" | "custom"

interface ActionConfig<T, TAction extends string> {
  type: ActionType
  label: string
  icon: LucideIcon
  variant: ActionVariant
  onClick: (row: T) => void
  /** Permission required to see this action. Omit to show it to everyone. */
  can?: TAction
  confirm?: boolean
  confirmTitle?: string
  confirmDescription?: string
  hidden?: boolean | ((row: T) => boolean)
  disabled?: boolean | ((row: T) => boolean)
}

/**
 * Called before a `confirm: true` action fires. Return (or resolve to)
 * `true` to proceed. The default implementation is a plain `window.confirm`
 * placeholder — pass your own to plug in a real dialog, with zero changes
 * to page code or action configs.
 */
type ConfirmHandler<T, TAction extends string> = (params: {
  action: ActionConfig<T, TAction>
  row: T
}) => boolean | Promise<boolean>

interface CreateColumnsConfig<T, TAction extends string = Action, TResource extends string = Resource> {
  /** Omit for pages with no permission-gated actions. */
  resource?: TResource
  columns: ColumnConfig<T, TAction>[]
  /** Injectable confirm flow — see `ConfirmHandler`. */
  confirm?: ConfirmHandler<T, TAction>
}

/* --------------------------------------------------------------------- */
/* column() + variants                                                   */
/* --------------------------------------------------------------------- */

// function makeDataColumn<T>(type: ColumnType) {
//   return (key: keyof T & string, options: BaseColumnOptions<T> = {}): DataColumnConfig<T> => ({
//     kind: "data",
//     type,
//     key,
//     options,
//   })
// }


function makeDataColumn<
  T,
  TOptions extends BaseColumnOptions<T> = BaseColumnOptions<T>,
>(type: ColumnType) {
  return (
    key: keyof T & string,
    options: TOptions = {} as TOptions,
  ): DataColumnConfig<T> => ({
    kind: "data",
    type,
    key,
    options,
  })
}

function baseColumn<T>(key: keyof T & string, options?: BaseColumnOptions<T>): DataColumnConfig<T> {
  return makeDataColumn<T>("text")(key, options)
}

function actionsColumn<T, TAction extends string = Action>(
  actions: ActionConfig<T, TAction>[],
): ActionsColumnConfig<T, TAction> {
  return { kind: "actions", actions }
}

// export const column = Object.assign(baseColumn, {
//   currency: <T,>(key: keyof T & string, options?: CurrencyColumnOptions<T>) =>
//     makeDataColumn<T>("currency")(key, options),
//   number: <T,>(key: keyof T & string, options?: BaseColumnOptions<T>) => makeDataColumn<T>("number")(key, options),
//   date: <T,>(key: keyof T & string, options?: BaseColumnOptions<T>) => makeDataColumn<T>("date")(key, options),
//   status: <T,>(key: keyof T & string, options?: BaseColumnOptions<T>) => makeDataColumn<T>("status")(key, options),
//   actions: actionsColumn,
// })

export const column = Object.assign(baseColumn, {
  currency: <T,>(
    key: keyof T & string,
    options?: CurrencyColumnOptions<T>,
  ) => makeDataColumn<T, CurrencyColumnOptions<T>>("currency")(key, options),

  number: <T,>(
    key: keyof T & string,
    options?: BaseColumnOptions<T>,
  ) => makeDataColumn<T, BaseColumnOptions<T>>("number")(key, options),

  date: <T,>(
    key: keyof T & string,
    options?: BaseColumnOptions<T>,
  ) => makeDataColumn<T, BaseColumnOptions<T>>("date")(key, options),

  status: <T,>(
    key: keyof T & string,
    options?: BaseColumnOptions<T>,
  ) => makeDataColumn<T, BaseColumnOptions<T>>("status")(key, options),

  image: <T,>(
    key: keyof T & string,
    options?: ImageColumnOptions<T>,
  ) => makeDataColumn<T, ImageColumnOptions<T>>("image")(key, options),

  actions: actionsColumn,
})

/* --------------------------------------------------------------------- */
/* action() presets                                                      */
/* --------------------------------------------------------------------- */

interface ActionPresetOptions<T, TAction extends string> {
  label?: string
  icon?: LucideIcon
  variant?: ActionVariant
  onClick: (row: T) => void
  can?: TAction
  confirm?: boolean
  confirmTitle?: string
  confirmDescription?: string
  hidden?: boolean | ((row: T) => boolean)
  disabled?: boolean | ((row: T) => boolean)
}

function makeAction<TAction extends string>(
  type: ActionType,
  defaults: { label: string; icon: LucideIcon; variant: ActionVariant; confirm?: boolean },
) {
  return <T,>(options: ActionPresetOptions<T, TAction>): ActionConfig<T, TAction> => ({
    type,
    label: options.label ?? defaults.label,
    icon: options.icon ?? defaults.icon,
    variant: options.variant ?? defaults.variant,
    onClick: options.onClick,
    can: options.can,
    confirm: options.confirm ?? defaults.confirm ?? false,
    confirmTitle: options.confirmTitle,
    confirmDescription: options.confirmDescription,
    hidden: options.hidden,
    disabled: options.disabled,
  })
}

export const action = {
  view: makeAction<Action>("view", { label: "View", icon: Eye, variant: "ghost" }),
  edit: makeAction<Action>("edit", { label: "Edit", icon: Pencil, variant: "ghost" }),
  delete: makeAction<Action>("delete", {
    label: "Delete",
    icon: Trash2,
    variant: "destructive",
    confirm: true,
  }),
  duplicate: makeAction<Action>("duplicate", { label: "Duplicate", icon: Copy, variant: "ghost" }),
  archive: makeAction<Action>("archive", { label: "Archive", icon: Archive, variant: "ghost" }),
  custom: <T,>(
    options: ActionPresetOptions<T, Action> & { label: string; icon: LucideIcon },
  ): ActionConfig<T, Action> => ({
    type: "custom",
    label: options.label,
    icon: options.icon,
    variant: options.variant ?? "ghost",
    onClick: options.onClick,
    can: options.can,
    confirm: options.confirm ?? false,
    confirmTitle: options.confirmTitle,
    confirmDescription: options.confirmDescription,
    hidden: options.hidden,
    disabled: options.disabled,
  }),
}

/* --------------------------------------------------------------------- */
/* Renderer map — the extensibility point for new column types           */
/* --------------------------------------------------------------------- */

interface RendererContext<T> {
  value: unknown;
  row: T;
  options:
    | BaseColumnOptions<T>
    | CurrencyColumnOptions<T>
    | ImageColumnOptions<T>;
}

const renderers: Record<
  ColumnType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx: RendererContext<any>) => React.ReactNode
> = {
  text: ({ value }) => (
    <>{value == null || value === "" ? "-" : String(value)}</>
  ),

  currency: ({ value, options }) => (
    <>
      {formatCurrency(
        value,
        (options as CurrencyColumnOptions<unknown>).currency
      )}
    </>
  ),

  number: ({ value }) => <>{formatNumber(value)}</>,

  date: ({ value }) => <>{formatDate(value)}</>,

  status: ({ value }) => <StatusBadge value={value as string} />,

  image: ({ value, options }) => {
    const imageOptions = options as ImageColumnOptions<unknown>;

    const size = imageOptions.size ?? 40;

    const rounded = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    const src =
      typeof value === "string" && value.length > 0
        ? value
        : imageOptions.fallback;

    return (
      <Avatar
        className={cn(
          rounded[imageOptions.rounded ?? "none"],
          "border"
        )}
        style={{
          width: size,
          height: size,
        }}
      >
        <AvatarImage src={src} />
        <AvatarFallback>
  <ImageOff className="h-4 w-4" />
</AvatarFallback>
      </Avatar>
    );
  },
};

/* --------------------------------------------------------------------- */
/* Internal: RowActionsMenu (not exported)                               */
/* --------------------------------------------------------------------- */

// eslint-disable-next-line react-refresh/only-export-components
function RowActionsMenu<T, TAction extends string, TResource extends string>({
  row,
  actions,
  resource,
  confirmHandler,
}: {
  row: T
  actions: ActionConfig<T, TAction>[]
  resource?: TResource
  confirmHandler?: ConfirmHandler<T, TAction>
}) {
  const [pendingAction, setPendingAction] = React.useState<ActionConfig<T, TAction> | null>(null)
  const visibleActions = actions.filter((act) => !resolveFlag(act.hidden, row))

  const trigger = async (act: ActionConfig<T, TAction>) => {
    if (act.confirm) {
      if (confirmHandler) {
        const confirmed = await confirmHandler({ action: act, row })
        if (!confirmed) return
      } else {
        setPendingAction(act)
        return
      }
    }
    act.onClick(row)
  }

  if (visibleActions.length === 0) return null

  return (
    <>
    <DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 flex  justify-end" />}>
    <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 " />
  </DropdownMenuTrigger>


     
      <DropdownMenuContent align="end">
        {visibleActions.map((act, index) => {
          const Icon = act.icon
          const isDisabled = resolveFlag(act.disabled, row)

          const item = (
            <DropdownMenuItem
              key={index}
              disabled={isDisabled}
              onClick={() => !isDisabled && trigger(act)}
              className={act.variant === "destructive" ? "text-destructive focus:text-destructive" : undefined}
            >
              <Icon className="mr-2 h-4 w-4" />
              {act.label}
            </DropdownMenuItem>
          )

          if (!act.can) return item
          if (!resource) return item // no resource configured -> can't scope permission, render as-is

          return (
            <Can I={act.can as Action} a={resource as Resource} key={index}>
              {item}
            </Can>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500">
              <TriangleAlert className="h-6 w-6" />
            </div>
            <AlertDialogTitle>
              {pendingAction?.confirmTitle ?? "Delete this item?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.confirmDescription ?? "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={() => {
                const actionToConfirm = pendingAction
                setPendingAction(null)
                actionToConfirm?.onClick(row)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/* --------------------------------------------------------------------- */
/* createColumns()                                                       */
/* --------------------------------------------------------------------- */







export function createColumns<T, TAction extends string = Action, TResource extends string = Resource>(
  config: CreateColumnsConfig<T, TAction, TResource>,
): ColumnDef<T>[] {
  const { resource, columns, confirm } = config

  return columns.map((col): ColumnDef<T> => {
    if (col.kind === "actions") {
      return {
        id: "actions",
        header: () => (
  <div className="flex justify-center">
    Actions
  </div>
),
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <RowActionsMenu
            row={row.original}
            actions={col.actions}
            resource={resource}
            confirmHandler={confirm}
          />
        ),
      }
    }

    const { key, type, options } = col
    const label = options.label ?? humanize(key)
    const sortable = options.sortable ?? false
    const hideable = options.hideable ?? true
    const align: Align = options.align ?? (type === "currency" || type === "number" ? "right" : "left")
    const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
    const renderCell = renderers[type]


    return {
      id: key,
      accessorFn: (row) => getValueByPath(row, key),
      enableSorting: sortable,
      enableHiding: hideable,
      size: options.width ,
      header: ({ column: c }) =>
        sortable ? (
          <DataTableColumnHeader column={c} title={label} className={alignClass} />
        ) : (
          <div className={alignClass}>{label}</div>
        ),
    cell: ({ row, getValue }) => {
  const original = row.original;

  let value = getValue();

  // Transform the value first
  if (options.formatter) {
    value = options.formatter(value, original);
  }

  // Full custom render always wins
  if (options.render) {
    return (
      <div className={alignClass}>
        {options.render(original)}
      </div>
    );
  }

  // Default renderer receives the transformed value
  return (
    <div className={alignClass}>
      {renderCell({
        value,
        row: original,
        options,
      })}
    </div>
  );
},
    }
  })
}

