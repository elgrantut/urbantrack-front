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

### E-02 Map (US-04 + US-05)
- `src/features/map/CityMap.tsx` — MapContainer center `[-34.61,-58.43]` zoom 12, OSM tiles, layer toggles (assets/incidents), count display, legend overlay, loading overlay
- `src/features/map/AssetMarkers.tsx` — clustered via `MarkerClusterGroup`, colored circle DivIcon per status, popup with type/status/address/zone
- `src/features/map/IncidentMarkers.tsx` — diamond DivIcon per status, popup with type/status/description (truncated 80 chars)/zone/relative time

### E-06 Dashboard (US-15 partial)
- `src/pages/DashboardPage.tsx` — 4 stat cards (total assets, needs attention, open incidents, active vehicles) + full `CityMap`

### E-03 Asset Management (US-07 + US-08)
- `src/features/assets/AssetFilters.tsx` — status + type selects → filterStore
- `src/features/assets/AssetTable.tsx` — shadcn Table, columns: type/status/address/zone/lat/lng
- `src/features/assets/CreateAssetForm.tsx` — Dialog + RHF + Zod + `useCreateAsset` + sonner toast
- `src/pages/AssetsPage.tsx` — filters + count label + table + empty/error states + "New Asset" dialog

### E-04 Incident Management (US-09 + US-10 + US-11)
- `src/features/incidents/IncidentFilters.tsx` — status + type + zone selects → filterStore
- `src/features/incidents/IncidentCard.tsx` — type icon, status badge, zone, relative time, truncated description; click → opens detail sheet
- `src/features/incidents/IncidentList.tsx` — responsive card grid
- `src/features/incidents/IncidentDetail.tsx` — Sheet, fetches `GET /incidents/:id`, full fields + mini Leaflet map, 404 state
- `src/features/incidents/ReportIncidentForm.tsx` — Dialog + RHF + Zod (no status/createdAt) + `useCreateIncident` + sonner toast
- `src/pages/IncidentsPage.tsx` — filters + count + list + empty/error + detail sheet + report button

### E-05 Vehicle Fleet (US-12 + US-13)
- `src/features/vehicles/VehicleFilters.tsx` — status + type + zone selects → filterStore
- `src/features/vehicles/VehicleCard.tsx` — plate, type icon, status badge, zone, capacity
- `src/features/vehicles/VehicleDetail.tsx` — Sheet, fetches `GET /vehicles/:id`, all fields, 404 state
- `src/pages/VehiclesPage.tsx` — filters + count + card grid + empty/error + detail sheet

### Build status
`pnpm build` ✅ · `pnpm lint` ✅ (exit 0, 2 expected shadcn warnings) · `pnpm fmt` ✅

---

## Not Yet Implemented

| Story | Feature | Notes |
|-------|---------|-------|
| US-06 | Map filter controls overlay | Zone dropdown + asset status checkboxes on map; writes to filterStore |
| US-14 | Register Vehicle form | Dialog + RHF + Zod + `useCreateVehicle` — same pattern as CreateAssetForm |
| US-16 | Zone overview panel | Per-zone asset/incident counts; click sets active zone filter |
| — | Skeleton loading states | `pnpm shadcn add skeleton`; replace `LoadingSpinner` on list/table views |
| — | `docs/progress.md` status update | Update after each session |

---

## Known constraints (backend)
- No DELETE/PATCH/PUT on any resource
- No `GET /assets/:id` — asset detail comes from list cache only
- Filters are exact-match case-sensitive strings — always send enum values as defined in `src/types/index.ts`
- `createdAt` on Incident is server-generated — never send in POST body
- `status` on Incident defaults to `REPORTED`; on Vehicle defaults to `ACTIVE`
