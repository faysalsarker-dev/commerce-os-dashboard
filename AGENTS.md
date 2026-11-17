# AGENTS.md

Lean reference for this repo. Trust this file for paths, contracts, and
conventions instead of re-reading source — only open files when a task needs
details genuinely not covered here.

## Stack

React 19 · TypeScript 6 (strict) · Vite 8 · React Router · Tailwind CSS 4 ·
shadcn-style UI · Redux Toolkit + RTK Query · Axios · React Hook Form · Zod ·
TanStack Table · Recharts · Framer Motion · Lucide · Sonner · Socket.IO ·
date-fns.

`@/` → `src/`. No test script exists yet.

## Scripts

`dev` `build` `typecheck` `lint` `preview` — standard. `format` writes files
(Prettier) — only run when formatting is the task. Don't add a dependency if
an existing tool already covers it.

## Source map

```text
src/app/layout/        App + auth layouts
src/app/pages/         Route screens, by feature
src/app/router/        Route registry + generators
src/components/blocks/   App-shell / dashboard building blocks
src/components/common/   Small cross-feature components
src/components/modules/  filter/, table/, form/ — the config-driven systems
src/components/shared/   PageContainer, PageHeader, FilterBar, permissions
src/components/ui/       shadcn primitives — compose, don't reimplement
src/hooks/              Cross-feature hooks (incl. useFilter)
src/lib/                API clients, permissions, formatting utils
src/modules/            Standalone feature modules (e.g. social inbox)
src/redux/baseApi.ts   Shared RTK Query setup
src/redux/features/    Per-feature endpoints
src/types/data-types/  Domain types by feature
src/types/filter|form|table/  Shared UI contracts
src/types/validations/ Zod schemas by feature
```

Feature code stays in its feature folder. Shared dirs only for genuinely
reused code.

## Page shell (barrel: `@/components/shared/common`)

- `PageContainer` — page surface/spacing.
- `PageHeader` — title/description + `actions` or default "Add {title}"
  (`onClick`); `noAction` to hide it.
- `FilterBar` — pairs with `useFilter` + `@/components/modules/filter`
  factories.
- `@/components/modules/table` — `DataTable`, column builder.
- `@/components/modules/form` — entity form pages/dialogs/sheets.

Search these before writing a new component.

## Config-driven list page — reference implementation

**User list = canonical example:**
`src/app/pages/user/user.config.ts` (config) +
`src/app/pages/user/AllUser.tsx` (wiring).

Build a new list page the same way:

1. `src/app/pages/<feature>/<feature>.config.ts` exports feature-named
   configs — e.g. `<FEATURE>_PAGE_CONFIG`, `<FEATURE>_FILTER_CONFIG`,
   `create<Feature>TableColumns`.
2. **Page config** → title/description only (consumed by `PageHeader`).
3. **Filter config** → `search` / `select` / `multiSelect` / `dateRange` /
   `numberRange` from `@/components/modules/filter`. Filter `name`s must match
   API query params. `getDefaultValues(FILTER_CONFIG)` → initial values.
4. **Column factory** → `column` / `action` / `createColumns` from
   `@/components/modules/table/column-builder`, typed to the domain row.
   Accept `onOpen`/`onEdit`/`onDelete` as args — no side effects in the
   config file itself.
5. **Page component** (wiring only):
   - `useFilter({ defaultValues: getDefaultValues(FILTER_CONFIG), syncToUrl: true, ... })`
   - columns via `useMemo`, callbacks via `useNavigate`/mutation hooks
   - RTK Query list hook called with `filter.queryParams`
   - render `PageContainer` → `PageHeader` → `FilterBar` → `DataTable`
     (pass `filter.tableState`, `filter.onTableStateChange`, response data +
     metadata)
   - dialog/selection state + CRUD handlers live in the page
6. Register routes in `src/app/router/config/routes.config.ts` (detail/create
   routes usually `isVisible: false`).
7. Wire real feature API module, domain types, validation schema — never copy
   another feature's filter names/response shape blindly.

**Not every screen fits this pattern.** `CreateUser.tsx` is a bespoke
multi-section form (`src/components/modules/user/create/`) and does **not**
consume `userFormConfig` from `user.config.ts` — don't assume it does.
`UserDetails.tsx` composes detail modules directly. For a complex custom flow:
reusable sections → feature module; form state/submission → the page.

## Entity forms

`src/components/modules/form/` (config types: `src/types/form/form.types.ts`).
Config = typed field array keyed to RHF paths. Field kinds: text, textarea,
number, password, select/multiselect, switch/checkbox, radio, color, date,
relation, image upload.

- Zod schema + typed form values = source of truth.
- `EntityFormPage` for full-page create/edit; dialog/sheet variant for
  modal/side-panel.
- Relation fields take an RTK Query hook + label/value key mapping.
- Request bodies: follow the feature's existing `buildRequestBody` /
  `src/utils/buildFormData.ts` pattern — don't invent a new serialization.
- Extend the shared form engine only for genuinely reusable behavior.

## Routing

Registry: `src/app/router/config/routes.config.ts` (`RouteConfig` entries →
route + sidebar generators). Add path, component, page/resource key, icon
(if navigable), visibility. Contract: `src/types/routes/route.types.ts`.

## API / types / permissions

- Endpoints: `src/redux/features/<feature>/` via shared `baseApi` + RTK Query.
  Export hooks from the feature module; consume in screens.
- Domain types: `src/types/data-types/<feature>/`. Shared contracts:
  `src/types/`.
- Validation: `src/types/validations/<feature>/`; derive form types from
  schema where that's the local pattern.
- Permissions: `src/lib/permissions/`, `src/components/shared/permissions/` —
  don't duplicate checks or bypass permission-aware UI.
- Match existing invalidation tags, loading states, error/toast handling, and
  request/response shape for the neighboring feature.

## Conventions

- Focused diffs only. Check `git status` first; don't revert others' changes.
- `@/` alias, `import type` for type-only imports.
- Screens = orchestration; config/contracts/side-effects live in their
  established homes.
- Match nearby formatting/naming — no drive-by reformatting.
- After changes: run the smallest relevant check (`typecheck` / `lint` /
  `build`) and report failures plainly.