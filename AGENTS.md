# AGENTS.md

## Stack

**Vite + React 19 SPA** — not Next.js. No SSR, no server components, no API routes.

| Layer | Tool |
|---|---|
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config.*`) |
| Components | shadcn/ui (radix-nova style) |
| State | Zustand |
| Data fetching | TanStack React Query |
| Validation | Zod 4 (exact pin) |
| Linter | Oxlint (not ESLint) |
| Formatter | Oxfmt (not Prettier) |
| Package manager | pnpm |

## Commands

```bash
pnpm dev          # dev server (localhost:5173)
pnpm build        # tsc -b && vite build  (typecheck runs first)
pnpm preview      # serve production build locally
pnpm lint         # oxlint
pnpm fmt          # oxfmt (rewrites files)
pnpm fmt:check    # oxfmt --check (CI-safe)
```

**No `test` script.** Vitest is installed but not yet configured; no test files exist.
To run tests once they're added: `pnpm exec vitest run <path>`.

Typecheck without building: `pnpm exec tsc -b --noEmit`.

## Critical Quirks

### Path aliases
`@/*`, `@actions/*`, `@components/*` are defined in `tsconfig.app.json` (`paths`) and resolved by Vite via `resolve.tsconfigPaths: true` in `vite.config.ts`. No extra plugin is needed. Do **not** install `vite-tsconfig-paths`.

### Tailwind v4 — no config file
All design tokens live in `src/index.css` inside `@theme inline { ... }` blocks. Do not create `tailwind.config.ts`.

### shadcn components are generated — do not edit manually
Files in `src/components/ui/` are CLI-generated. To add a component:
```bash
pnpm shadcn add <component-name>
```
To modify a component, regenerate it or extend it from outside the `ui/` directory.

### Oxfmt sorts imports
Import ordering is handled by the formatter, not a lint rule. Running `pnpm fmt` will reorder imports. Do not add import-order rules to `.oxlintrc.json`.

### TypeScript strictness
- `erasableSyntaxOnly: true` — no `enum`, no `namespace`, no legacy decorators
- `verbatimModuleSyntax: true` — type-only imports must use `import type`
- `noUnusedLocals` / `noUnusedParameters` — prefix intentionally unused params with `_`

## Directory Layout

```
src/
├── main.tsx              # entry: QueryClientProvider → <App />
├── App.tsx               # ThemeProvider + RouterProvider
├── index.css             # global styles + Tailwind @import + CSS theme tokens
├── lib/utils.ts          # cn() helper (twMerge + clsx)
├── types/index.ts        # entity types: Zone, UrbanAsset, Incident, Vehicle (no enum — as const)
├── api/
│   ├── client.ts         # fetcher<T>, fetcherOrNull<T>, ApiError
│   ├── assets.ts         # getAssets, createAsset
│   ├── incidents.ts      # getIncidents, getIncidentById, createIncident
│   ├── vehicles.ts       # getVehicles, getVehicleById, createVehicle
│   └── zones.ts          # getZones, getZoneById
├── routes/index.tsx      # createBrowserRouter — /, /assets, /incidents, /vehicles
├── pages/                # DashboardPage, AssetsPage, IncidentsPage, VehiclesPage
├── features/
│   └── layout/           # MainLayout, DesktopSidebar, MobileTopBar
└── components/ui/        # shadcn-generated primitives (do not edit)
```

Planned directories (not yet created): `src/features/` (map, assets, incidents, vehicles subtrees), `src/hooks/`, `src/store/`, `src/utils/`.

## Environment Variables

`.env.local` defines `VITE_API_URL=http://localhost:3000`. Vite env vars must be prefixed `VITE_` to reach client code.

## No CI / No Pre-commit Hooks

No GitHub Actions workflows, no Husky, no Lefthook, no lint-staged.
