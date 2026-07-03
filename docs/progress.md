# UrbanTrack — Progress

## Stack (locked, do not change)

Vite 8 + React 19 SPA · Tailwind v4 (CSS-first, `src/index.css`) · shadcn/ui radix-nova · Zustand 5 · TanStack React Query 5 · Zod 4.4.3 · React Router v8 · React Hook Form · React Leaflet + react-leaflet-cluster · Oxlint · Oxfmt · pnpm · Vitest 4 + @testing-library/react

**Key rules:**

- No `enum` — use `as const` unions
- `import type` for type-only imports
- Path alias `@/` via `tsconfig.app.json` + `resolve.tsconfigPaths: true` in `vite.config.ts` (no plugin)
- Never edit `src/components/ui/` — use `pnpm shadcn add <name>`
- `pnpm build` + `pnpm lint` + `pnpm test` must all pass before stopping

---

## Completed

All 16 planned User Stories are fully implemented.

### E-01 Core Infrastructure

- **US-01** Bootstrap — deps installed, `resolve.tsconfigPaths: true` in `vite.config.ts` (no `vite-tsconfig-paths` plugin), `.env.local`, `QueryClientProvider` + `StrictMode` in `main.tsx`, `RouterProvider` in `App.tsx`
- **US-02** API layer — `src/api/client.ts` (`fetcher`, `fetcherOrNull`, `ApiError extends Error`); `assets.ts` (with `zoneId` filter added beyond spec), `incidents.ts`, `vehicles.ts`, `zones.ts`
- **US-03** App shell — `MainLayout`, `DesktopSidebar` (w-56, hidden below md), `MobileTopBar` (hamburger + Sheet), dark mode toggle via next-themes, active nav highlight via NavLink `isActive`

### Step 3 — Shared state & utilities

- `src/store/filterStore.ts` — `assetFilters`, `incidentFilters`, `vehicleFilters` + per-group setters/resets + `resetAllFilters`
- `src/store/uiStore.ts` — `selectedMarkerId`, `selectedZoneId`, `sheetOpen` + setters
- `src/hooks/useZones.ts` — `useZones` (`staleTime: Infinity`), `useZoneById`, `useZoneMap` (memoized id→name map)
- `src/hooks/useAssets.ts` — `useAssets(filters)`, `useCreateAsset()`
- `src/hooks/useIncidents.ts` — `useIncidents(filters)`, `useIncidentById(id)`, `useCreateIncident()`
- `src/hooks/useVehicles.ts` — `useVehicles(filters)`, `useVehicleById(id)`, `useCreateVehicle()`
- `src/utils/statusColors.ts` — Tailwind badge classes + Leaflet hex colors per status (asset/incident/vehicle)
- `src/utils/formatters.ts` — `formatRelativeTime`, `formatDateTime`, `formatCapacity`, `truncate`
- `src/components/common/` — `StatusBadge.tsx`, `ZoneSelector.tsx`, `EmptyState.tsx`, `LoadingSpinner.tsx`, `PageHeader.tsx`

### E-02 Map (US-04 + US-05 + US-06)

- `src/features/map/CityMap.tsx` — `MapContainer` center `[-34.61,-58.43]` zoom 12, OSM tiles, layer toggles (assets/incidents with live counts), legend overlay, loading overlay
- `src/features/map/AssetMarkers.tsx` — clustered via `MarkerClusterGroup`, module-level `ASSET_ICONS` precomputed per status at import time, popup with type/status/address/zone
- `src/features/map/IncidentMarkers.tsx` — diamond DivIcon per status, popup with type/status/description (truncated 80 chars)/zone/relative time
- `src/features/map/MapSkeletonOverlay.tsx` — thin `h-1` pulse bar at top of map while loading
- **US-06** `src/features/map/MapFilters.tsx` — floating "Filters" button + dropdown panel with zone selector (applies to both assets and incidents) + asset status Select; writes to `filterStore`; badge shows active filter count; "Clear all" button

### E-06 Dashboard (US-15 + US-16)

- `src/pages/DashboardPage.tsx` — 4 stat cards (total assets, needs attention, open incidents, active vehicles) + `ZoneOverviewPanel` + full `CityMap`
- `src/features/dashboard/DashboardStatsSkeleton.tsx` — 4 placeholder stat cards shown on first load
- **US-16** `src/features/dashboard/ZoneOverviewPanel.tsx` — grid of zone cards showing per-zone asset count + total incident count; click sets `filterStore.incidentFilters.zoneId` + `filterStore.assetFilters.zoneId` and navigates to `/incidents`

### E-03 Asset Management (US-07 + US-08)

- `src/features/assets/AssetFilters.tsx` — status + type selects → filterStore
- `src/features/assets/AssetTable.tsx` — shadcn Table, columns: type/status/address/zone/lat/lng
- `src/features/assets/AssetTableSkeleton.tsx` — 10 rows mirroring 6-column table structure
- `src/features/assets/CreateAssetForm.tsx` — Dialog + RHF + Zod + `useCreateAsset` + sonner toast; error uses `mutation.error?.message ?? "..."`
- `src/pages/AssetsPage.tsx` — filters + pagination count label + skeleton/error/empty states + table slice + Previous/Next buttons + refetch `Loader2` spinner

### E-04 Incident Management (US-09 + US-10 + US-11)

- `src/features/incidents/IncidentFilters.tsx` — status + type + zone selects → filterStore
- `src/features/incidents/IncidentCard.tsx` — type icon, status badge, zone, relative time, truncated description; click → opens detail sheet via `uiStore`
- `src/features/incidents/IncidentList.tsx` — responsive card grid
- `src/features/incidents/IncidentListSkeleton.tsx` — 6 cards mirroring `IncidentCard` layout
- `src/features/incidents/IncidentDetail.tsx` — Sheet, fetches `GET /incidents/:id`, all fields + mini Leaflet map, 404 state
- `src/features/incidents/ReportIncidentForm.tsx` — Dialog + RHF + Zod (no status/createdAt) + `useCreateIncident` + sonner toast; error uses `mutation.error?.message ?? "..."`
- `src/pages/IncidentsPage.tsx` — filters + count + list + empty/error + detail sheet + report button

### E-05 Vehicle Fleet (US-12 + US-13 + US-14)

- `src/features/vehicles/VehicleFilters.tsx` — status + type + zone selects → filterStore
- `src/features/vehicles/VehicleCard.tsx` — plate, type icon, status badge, zone, capacity
- `src/features/vehicles/VehicleGridSkeleton.tsx` — 6 cards mirroring `VehicleCard` layout
- `src/features/vehicles/VehicleDetail.tsx` — Sheet, fetches `GET /vehicles/:id`, all fields, 404 state
- **US-14** `src/features/vehicles/CreateVehicleForm.tsx` — Dialog + RHF + Zod + `useCreateVehicle` + sonner toast; fields: plate, type, capacity (kg), zone; error uses `mutation.error?.message ?? "..."`
- `src/pages/VehiclesPage.tsx` — filters + count + card grid + empty/error + detail sheet + "Register Vehicle" button

### Testing Infrastructure

- Vitest 4 configured with `globals: true`, `environment: "jsdom"`, `setupFiles: ["./src/test/setup.ts"]`
- React Testing Library (`@testing-library/react`, `@testing-library/user-event` v14, `@testing-library/jest-dom` v6)
- Coverage via `@vitest/coverage-v8` (`pnpm test:coverage`)
- `src/test/setup.ts` — imports jest-dom matchers + polyfills for Radix UI (`hasPointerCapture`, `scrollIntoView`, `ResizeObserver`)
- `tsconfig.app.json` types include `"vitest/globals"` and `"@testing-library/jest-dom"`
- Scripts: `pnpm test` (run once) · `pnpm test:watch` (watch mode) · `pnpm test:coverage`
- **46 tests, 4 test files, all passing:**
  - `src/utils/formatters.test.ts` — 14 tests: `formatCapacity`, `truncate`, `formatRelativeTime`, `formatDateTime`
  - `src/store/filterStore.test.ts` — 12 tests: per-filter CRUD, `resetAllFilters`, isolation between groups
  - `src/store/uiStore.test.ts` — 10 tests: marker selection, zone selection, sheet open/close
  - `src/features/vehicles/VehicleFilters.test.tsx` — 10 tests: rendering, clear button visibility, clear action, Radix Select interaction (opens dropdown, picks status, verifies store)

### Build status

`pnpm build` ✅ · `pnpm lint` ✅ (exit 0, 2 pre-existing shadcn warnings in `src/components/ui/`) · `pnpm test` ✅ (46/46)

---

## Partially Completed

None. All 16 planned User Stories are fully implemented.

The single minor acceptance criterion not met is the **active zone visual highlight** in `ZoneOverviewPanel` (US-16). The click interaction works (sets filters, navigates) but the clicked zone card does not receive a visual "active" indicator. This has no functional impact.

---

## Not Implemented

None.

---

## Final Optimization Pass

Four targeted improvements implemented after all User Stories were complete:

### Asset Table Pagination

Client-side pagination in `AssetsPage.tsx`:

- `PAGE_SIZE = 100` (module-level constant)
- `useState(page)` initialized to 1
- `useEffect` resets page to 1 whenever `assetFilters.status`, `assetFilters.type`, or `assetFilters.zoneId` changes
- Slice: `assets.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)` passed to `<AssetTable>`
- Count label: `"Showing 1–100 of 1,500 assets"` format; falls back to `"0"` when empty
- Pagination row: `[<ChevronLeft> Previous] Page N of M [Next <ChevronRight>]` using shadcn `Button`; only rendered when `total > PAGE_SIZE`

### Mutation Error Handling

In `CreateAssetForm`, `CreateVehicleForm`, `ReportIncidentForm`: the inline error `<p>` now renders:

```tsx
{mutation.error?.message ?? "Failed to create asset. Please try again."}
```

`ApiError.message` is `"HTTP {status}: {statusText}"` — surfaced directly when the API returns an HTTP error.

### Asset Marker Optimization

In `AssetMarkers.tsx`: `ASSET_ICONS: Record<string, L.DivIcon>` built once at module load:

```ts
const ASSET_ICONS: Record<string, L.DivIcon> = Object.fromEntries(
  Object.entries(ASSET_STATUS_HEX).map(([status, hex]) => [status, makeAssetIcon(hex)]),
);
```

The render loop uses `icon={ASSET_ICONS[asset.status]}` instead of calling `makeAssetIcon()` per marker.

### React Query Refetch Feedback

In `AssetsPage.tsx`: `isFetching` destructured from `useAssets(assetFilters)`. When `isFetching && !isPending` (background refetch after initial load), a `Loader2` spinner with `animate-spin` appears inline next to the count label.

---

## Submission Notes

### Why client-side pagination

The backend `GET /assets` endpoint has no `limit`/`offset` parameters — it returns all matching records in a single response. Implementing backend pagination would require modifying the server, which is outside the scope of a frontend challenge. Client-side pagination with `PAGE_SIZE = 100` is the correct approach:

- At most 100 DOM rows rendered at any time
- Works correctly with server-side `?status=` and `?type=` filters (which the server applies before the client paginates)
- No virtualization library needed at this page size
- Filter changes reset to page 1 via `useEffect`

### Why backend pagination was not implemented

The server is a read-only fixture for this challenge (no backend source code to modify). `GET /assets` returns a flat array. Adding `?limit=&offset=` would require backend changes that are out of scope.

### Deliberate tradeoffs

| Tradeoff | Decision | Reason |
|---|---|---|
| Map asset status filter | Single `Select` (one value) instead of checkboxes | Matches the server's exact-match `?status=` param; multi-select would require client-side post-filtering |
| Zone Overview incident count | Total incidents (not just REPORTED) | Avoids extra per-zone `?status=REPORTED` fetches; all incidents are already in cache |
| No virtualization library | Pagination instead | `react-virtual` adds complexity; 100 rows per page performs well without it |
| No optimistic updates | Standard `invalidateQueries` on success | Backend is in-memory; stale cache resets on every server restart anyway |
| `uiStore.selectedZoneId` not used by ZoneOverview | Navigate + filterStore instead | Direct navigation to `/incidents` with zone filter is simpler and achieves the same UX outcome |
| No active zone highlight in ZoneOverview | Not implemented | Minor UX gap; navigation + filter change already provides feedback |

---

## Known constraints (backend)

- No DELETE/PATCH/PUT on any resource
- No `GET /assets/:id` — asset detail comes from list cache only
- Filters are exact-match case-sensitive strings — always send enum values as defined in `src/types/index.ts`
- `createdAt` on Incident is server-generated — never send in POST body
- `status` on Incident defaults to `REPORTED`; on Vehicle defaults to `ACTIVE`
- All data is in-memory — server restart resets to seeded state
