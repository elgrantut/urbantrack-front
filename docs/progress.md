# UrbanTrack — Progress

## Stack (locked, do not change)

Vite 8 + React 19 SPA · Tailwind v4 (CSS-first, `src/index.css`) · shadcn/ui radix-nova · Zustand 5 · TanStack React Query 5 · Zod 4.4.3 · React Router v8 · React Hook Form · React Leaflet + react-leaflet-cluster · Oxlint · Oxfmt · pnpm

**Key rules:**

- No `enum` — use `as const` unions
- `import type` for type-only imports
- Path alias `@/` via `tsconfig.app.json` + `resolve.tsconfigPaths: true` in vite.config (no plugin)
- Never edit `src/components/ui/` — use `pnpm shadcn add <name>`
- `pnpm build` + `pnpm lint` must pass before stopping

---

## Completed

### E-01 Core Infrastructure

- **US-01** Bootstrap — deps installed, path aliases fixed, `.env.local`, `QueryClientProvider` in `main.tsx`
- **US-02** API layer — `src/api/client.ts` (`fetcher`, `fetcherOrNull`, `ApiError`), `assets.ts`, `incidents.ts`, `vehicles.ts`, `zones.ts`
- **US-03** App shell — `MainLayout`, `DesktopSidebar` (w-56, hidden md), `MobileTopBar` (Sheet, hamburger), dark mode toggle via next-themes, active nav highlight

### Step 3 — Shared state & utilities

- `src/store/filterStore.ts` — `assetFilters`, `incidentFilters`, `vehicleFilters` + setters + resets
- `src/store/uiStore.ts` — `selectedMarkerId`, `selectedZoneId`, `sheetOpen` + setters
- `src/hooks/useZones.ts` — `staleTime: Infinity`, `useZoneById`
- `src/hooks/useAssets.ts` — `useAssets(filters)`, `useCreateAsset()`
- `src/hooks/useIncidents.ts` — `useIncidents(filters)`, `useIncidentById(id)`, `useCreateIncident()`
- `src/hooks/useVehicles.ts` — `useVehicles(filters)`, `useVehicleById(id)`, `useCreateVehicle()`
- `src/utils/statusColors.ts` — Tailwind badge classes + Leaflet hex per status (asset/incident/vehicle)
- `src/utils/formatters.ts` — `formatRelativeTime`, `formatDateTime`, `formatCapacity`, `truncate`
- `src/components/common/StatusBadge.tsx`, `ZoneSelector.tsx`, `EmptyState.tsx`, `LoadingSpinner.tsx`
- `src/components/common/PageHeader.tsx` — `title`, `count`, `description`, `action` props

### E-02 Map (US-04 + US-05 + US-06)

- `src/features/map/CityMap.tsx` — MapContainer center `[-34.61,-58.43]` zoom 12, OSM tiles, layer toggles (assets/incidents), count display, legend overlay, loading overlay
- `src/features/map/AssetMarkers.tsx` — clustered via `MarkerClusterGroup`, colored circle DivIcon per status, popup with type/status/address/zone
- `src/features/map/IncidentMarkers.tsx` — diamond DivIcon per status, popup with type/status/description (truncated 80 chars)/zone/relative time
- `src/features/map/MapSkeletonOverlay.tsx` — thin `h-1` pulse bar at top of map
- **US-06** `src/features/map/MapFilters.tsx` — floating "Filters" button + dropdown panel with zone selector (applies to both assets and incidents) + asset status select; writes to `filterStore`; badge shows active filter count

### E-06 Dashboard (US-15 + US-16)

- `src/pages/DashboardPage.tsx` — 4 stat cards (total assets, needs attention, open incidents, active vehicles) + `ZoneOverviewPanel` + full `CityMap`
- `src/features/dashboard/DashboardStatsSkeleton.tsx` — 4 placeholder stat cards shown on first load
- **US-16** `src/features/dashboard/ZoneOverviewPanel.tsx` — grid of zone cards showing per-zone asset + incident counts; click navigates to `/incidents` filtered by that zone (sets `incidentFilters.zoneId` + `assetFilters.zoneId` in store)

### E-03 Asset Management (US-07 + US-08)

- `src/features/assets/AssetFilters.tsx` — status + type selects → filterStore
- `src/features/assets/AssetTable.tsx` — shadcn Table, columns: type/status/address/zone/lat/lng
- `src/features/assets/AssetTableSkeleton.tsx` — 10 rows mirroring 6-column table structure
- `src/features/assets/CreateAssetForm.tsx` — Dialog + RHF + Zod + `useCreateAsset` + sonner toast
- `src/pages/AssetsPage.tsx` — filters + count label + table + empty/error states + "New Asset" dialog
- `src/api/assets.ts` — `AssetFilters` now includes `zoneId?: string` (used by map overlay)

### E-04 Incident Management (US-09 + US-10 + US-11)

- `src/features/incidents/IncidentFilters.tsx` — status + type + zone selects → filterStore
- `src/features/incidents/IncidentCard.tsx` — type icon, status badge, zone, relative time, truncated description; click → opens detail sheet
- `src/features/incidents/IncidentList.tsx` — responsive card grid
- `src/features/incidents/IncidentListSkeleton.tsx` — 6 cards mirroring `IncidentCard` layout
- `src/features/incidents/IncidentDetail.tsx` — Sheet, fetches `GET /incidents/:id`, full fields + mini Leaflet map, 404 state
- `src/features/incidents/ReportIncidentForm.tsx` — Dialog + RHF + Zod (no status/createdAt) + `useCreateIncident` + sonner toast
- `src/pages/IncidentsPage.tsx` — filters + count + list + empty/error + detail sheet + report button

### E-05 Vehicle Fleet (US-12 + US-13 + US-14)

- `src/features/vehicles/VehicleFilters.tsx` — status + type + zone selects → filterStore
- `src/features/vehicles/VehicleCard.tsx` — plate, type icon, status badge, zone, capacity
- `src/features/vehicles/VehicleGridSkeleton.tsx` — 6 cards mirroring `VehicleCard` layout
- `src/features/vehicles/VehicleDetail.tsx` — Sheet, fetches `GET /vehicles/:id`, all fields, 404 state
- **US-14** `src/features/vehicles/CreateVehicleForm.tsx` — Dialog + RHF + Zod + `useCreateVehicle` + sonner toast; fields: plate, type, capacity (kg), zone
- `src/pages/VehiclesPage.tsx` — filters + count + card grid + empty/error + detail sheet + "Register Vehicle" button

### Testing Infrastructure

- Vitest 4 configured with `globals: true`, `environment: "jsdom"`, `setupFiles: ["./src/test/setup.ts"]`
- React Testing Library (`@testing-library/react`, `@testing-library/user-event` v14, `@testing-library/jest-dom` v6)
- Coverage via `@vitest/coverage-v8` (`pnpm test:coverage`)
- `src/test/setup.ts` — imports jest-dom matchers + polyfills for Radix UI (`hasPointerCapture`, `scrollIntoView`, `ResizeObserver`)
- `tsconfig.app.json` types extended with `"vitest/globals"` and `"@testing-library/jest-dom"`
- Scripts: `pnpm test` (run once) · `pnpm test:watch` (watch mode) · `pnpm test:coverage`
- **46 tests, 4 test files, all passing:**
  - `src/utils/formatters.test.ts` — 14 tests: `formatCapacity`, `truncate`, `formatRelativeTime`, `formatDateTime`
  - `src/store/filterStore.test.ts` — 12 tests: per-filter CRUD, `resetAllFilters`, isolation between groups
  - `src/store/uiStore.test.ts` — 10 tests: marker selection, zone selection, sheet open/close
  - `src/features/vehicles/VehicleFilters.test.tsx` — 10 tests: rendering, clear button visibility, clear action, Radix Select interaction (opens dropdown, picks status, verifies store)

### Build status

`pnpm build` ✅ · `pnpm lint` ✅ (exit 0, 2 expected shadcn warnings) · `pnpm test` ✅ (46/46)

---

## Not Yet Implemented / In Progress

No remaining items.

---

## Known constraints (backend)

- No DELETE/PATCH/PUT on any resource
- No `GET /assets/:id` — asset detail comes from list cache only
- Filters are exact-match case-sensitive strings — always send enum values as defined in `src/types/index.ts`
- `createdAt` on Incident is server-generated — never send in POST body
- `status` on Incident defaults to `REPORTED`; on Vehicle defaults to `ACTIVE`
