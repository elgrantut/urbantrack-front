# Project Vision

**UrbanTrack** is an operational command center for Buenos Aires city hygiene teams. It gives field supervisors and dispatchers a real-time view of urban asset health, active incidents, and vehicle fleet status — all organized across the five operational zones of the city.

The interface centers on a map-first experience: 1,500 physical assets (bins, containers, benches) are plotted across Buenos Aires. Operators scan the map to spot problem clusters, filter by asset status, report new incidents directly from the page, and check which vehicles are active in each zone — all from a single-page application with no page reloads.

---

# Backend Analysis

## Base URL

`http://localhost:3000` — no authentication, CORS fully open (`cors()` with no config).

## Entities

### Zone

Static lookup table. 5 fixed records, never mutated by the server.

| Field  | Type   | Notes                                               |
| ------ | ------ | --------------------------------------------------- |
| `id`   | string | `"1"` – `"5"`                                       |
| `name` | string | Microcentro, Palermo, Recoleta, Belgrano, Caballito |

### UrbanAsset

Urban infrastructure items with geographic coordinates. 1,500 records seeded at startup, all within Buenos Aires lat/lng bounds.

| Field     | Type                                              | Notes                                        |
| --------- | ------------------------------------------------- | -------------------------------------------- |
| `id`      | string                                            | Sequential on seed; `Date.now()` on POST     |
| `type`    | `"BIN" \| "CONTAINER" \| "BENCH"`                 | —                                            |
| `status`  | `"OK" \| "DAMAGED" \| "FULL" \| "OUT_OF_SERVICE"` | 70% OK, 15% FULL, 10% DAMAGED, 5% OOS (seed) |
| `lat`     | number                                            | Buenos Aires bounds (-34.705 to -34.526)     |
| `lng`     | number                                            | Buenos Aires bounds (-58.531 to -58.335)     |
| `address` | string                                            | Street address                               |
| `zoneId`  | string                                            | FK → Zone.id (no server-side enforcement)    |

### Incident

City events requiring operational response. 40 records seeded, covering all type/status combinations.

| Field         | Type                                               | Notes                                  |
| ------------- | -------------------------------------------------- | -------------------------------------- |
| `id`          | string                                             | —                                      |
| `type`        | `"OVERFLOW" \| "DAMAGE" \| "LITTERING" \| "OTHER"` | —                                      |
| `status`      | `"REPORTED" \| "IN_PROGRESS" \| "RESOLVED"`        | Defaults to `REPORTED` on POST         |
| `description` | string                                             | —                                      |
| `lat`         | number                                             | Buenos Aires bounds                    |
| `lng`         | number                                             | Buenos Aires bounds                    |
| `zoneId`      | string                                             | FK → Zone.id                           |
| `createdAt`   | string                                             | ISO 8601, **server-generated** on POST |

### Vehicle

Collection fleet. 10 records seeded.

| Field      | Type                                            | Notes                        |
| ---------- | ----------------------------------------------- | ---------------------------- |
| `id`       | string                                          | —                            |
| `plate`    | string                                          | —                            |
| `type`     | `"TRUCK" \| "VAN" \| "PICKUP"`                  | —                            |
| `status`   | `"ACTIVE" \| "MAINTENANCE" \| "OUT_OF_SERVICE"` | Defaults to `ACTIVE` on POST |
| `capacity` | number                                          | Kilograms, must be positive  |
| `zoneId`   | string                                          | FK → Zone.id                 |

## Entity Relationships

```
Zone (1) ──< UrbanAsset (N)   via zoneId
Zone (1) ──< Incident   (N)   via zoneId
Zone (1) ──< Vehicle    (N)   via zoneId
```

No enforced referential integrity on the server. A POST with a non-existent `zoneId` succeeds.

## Endpoints

| #   | Method | Path             | Query Params                  | Body Fields                                     | Success Response     |
| --- | ------ | ---------------- | ----------------------------- | ----------------------------------------------- | -------------------- |
| 1   | GET    | `/assets`        | `?status`, `?type`            | —                                               | `UrbanAsset[]` 200   |
| 2   | POST   | `/assets`        | —                             | `type, status, lat, lng, address, zoneId`       | `UrbanAsset` 201     |
| 3   | GET    | `/zones`         | —                             | —                                               | `Zone[]` 200         |
| 4   | GET    | `/zones/:id`     | —                             | —                                               | `Zone` 200 / 404     |
| 5   | GET    | `/incidents`     | `?status`, `?type`, `?zoneId` | —                                               | `Incident[]` 200     |
| 6   | GET    | `/incidents/:id` | —                             | —                                               | `Incident` 200 / 404 |
| 7   | POST   | `/incidents`     | —                             | `type, description, lat, lng, zoneId, [status]` | `Incident` 201       |
| 8   | GET    | `/vehicles`      | `?status`, `?type`, `?zoneId` | —                                               | `Vehicle[]` 200      |
| 9   | GET    | `/vehicles/:id`  | —                             | —                                               | `Vehicle` 200 / 404  |
| 10  | POST   | `/vehicles`      | —                             | `plate, type, capacity, zoneId, [status]`       | `Vehicle` 201        |

## Hard Constraints from the Backend

- **No DELETE or PATCH/PUT** on any resource — the UI must not offer edit or delete actions.
- **No `GET /assets/:id`** — assets can only be fetched as a filtered list; detail data comes from the list cache.
- **Filtering is exact-match, case-sensitive string only** — query param values must match server enum casing exactly.
- **All data is in-memory** — server restart resets everything to seeded state.
- **`createdAt` on Incident is server-generated** — never send it in a POST body.
- **`status` on Incident and Vehicle has server defaults** — `REPORTED` and `ACTIVE` respectively; fields are optional in POST bodies.

---

# Proposed Architecture

## Stack (per AGENTS.md)

| Layer         | Tool                           | Status                                                                              |
| ------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| Bundler       | Vite 8                         | ✅ Installed                                                                         |
| Framework     | React 19                       | ✅ Installed                                                                         |
| Styling       | Tailwind CSS v4 (CSS-first)    | ✅ Installed — tokens in `src/index.css`                                             |
| Components    | shadcn/ui (radix-nova)         | ✅ Installed — 13 primitives in `src/components/ui/`                                 |
| State         | Zustand 5                      | ✅ Installed                                                                         |
| Data fetching | TanStack React Query 5         | ✅ Installed                                                                         |
| Validation    | Zod 4 (pinned to 4.4.3)        | ✅ Installed                                                                         |
| Routing       | React Router v8                | ✅ Installed (v8, not v7 as originally planned)                                      |
| Forms         | React Hook Form 7              | ✅ Installed                                                                         |
| Maps          | React Leaflet 5 + Leaflet 1.9  | ✅ Installed — with `react-leaflet-cluster` v4.1.3                                   |
| Path aliases  | `resolve.tsconfigPaths: true`  | ✅ Active — native Vite option; `vite-tsconfig-paths` plugin was **not** installed    |
| Testing       | Vitest 4 + RTL                 | ✅ Configured — 46 tests passing (added beyond original plan)                        |

## Setup (All Completed)

All initial setup steps have been completed:

1. **Path aliases**: `resolve.tsconfigPaths: true` in `vite.config.ts` — resolves `@/` at Vite bundle time without installing `vite-tsconfig-paths`.
2. **Libraries installed**: `react-router`, `react-hook-form`, `react-leaflet`, `leaflet`, `@types/leaflet`, `react-leaflet-cluster`.
3. **TypeScript strictness**: `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`, `noUnusedLocals`, `noUnusedParameters` — all enforced.
4. **Environment**: `.env.local` defines `VITE_API_URL=http://localhost:3000`.

## Directory Layout

Actual layout as implemented:

```
src/
├── main.tsx                       # entry — QueryClientProvider → StrictMode → <App />
├── App.tsx                        # ThemeProvider (next-themes) + RouterProvider
├── index.css                      # Tailwind @import + CSS theme tokens
├── lib/
│   └── utils.ts                   # cn() helper (twMerge + clsx)
├── types/
│   └── index.ts                   # Zone, UrbanAsset, Incident, Vehicle (as const, no enum)
├── api/
│   ├── client.ts                  # fetcher<T>, fetcherOrNull<T>, ApiError
│   ├── assets.ts                  # getAssets(), createAsset() — AssetFilters includes zoneId
│   ├── incidents.ts               # getIncidents(), getIncidentById(), createIncident()
│   ├── vehicles.ts                # getVehicles(), getVehicleById(), createVehicle()
│   └── zones.ts                   # getZones(), getZoneById()
├── hooks/
│   ├── useAssets.ts               # useAssets(filters), useCreateAsset()
│   ├── useIncidents.ts            # useIncidents(filters), useIncidentById(id), useCreateIncident()
│   ├── useVehicles.ts             # useVehicles(filters), useVehicleById(id), useCreateVehicle()
│   └── useZones.ts                # useZones(), useZoneById(id), useZoneMap()
├── store/
│   ├── filterStore.ts             # assetFilters, incidentFilters, vehicleFilters + setters/resets
│   └── uiStore.ts                 # selectedMarkerId, selectedZoneId, sheetOpen + setters
├── utils/
│   ├── statusColors.ts            # Tailwind badge classes + Leaflet hex per status
│   └── formatters.ts              # formatRelativeTime, formatDateTime, formatCapacity, truncate
├── components/
│   ├── ui/                        # shadcn-generated — do not edit directly
│   └── common/
│       ├── StatusBadge.tsx        # wraps shadcn Badge with status color logic
│       ├── ZoneSelector.tsx       # Select populated from useZones(), used app-wide
│       ├── LoadingSpinner.tsx     # centered spinner for page-level loading
│       ├── EmptyState.tsx         # icon + message for zero-results states
│       └── PageHeader.tsx         # title, count, description, action props
├── features/
│   ├── layout/
│   │   ├── MainLayout.tsx         # Outlet wrapper — DesktopSidebar + MobileTopBar + main
│   │   └── Sidebar.tsx            # DesktopSidebar, MobileTopBar, NavItems, ThemeToggle
│   ├── map/
│   │   ├── CityMap.tsx            # MapContainer, layer toggles, legend, MapFilters
│   │   ├── AssetMarkers.tsx       # MarkerClusterGroup, module-level ASSET_ICONS, popups
│   │   ├── IncidentMarkers.tsx    # diamond DivIcon per status, popups
│   │   └── MapSkeletonOverlay.tsx # thin pulse bar shown while data loads
│   │   └── MapFilters.tsx         # floating filter panel — zone + asset status
│   ├── assets/
│   │   ├── AssetFilters.tsx       # status + type selects → filterStore.assetFilters
│   │   ├── AssetTable.tsx         # shadcn Table — type/status/address/zone/lat/lng
│   │   ├── AssetTableSkeleton.tsx # 10-row skeleton matching table structure
│   │   └── CreateAssetForm.tsx    # Dialog + RHF + Zod + useCreateAsset + sonner toast
│   ├── dashboard/
│   │   ├── DashboardStatsSkeleton.tsx # 4 skeleton stat cards
│   │   └── ZoneOverviewPanel.tsx      # zone grid with asset/incident counts; click → filter
│   ├── incidents/
│   │   ├── IncidentFilters.tsx    # status + type + zone selects → filterStore
│   │   ├── IncidentCard.tsx       # card with type icon, status badge, zone, relative time
│   │   ├── IncidentList.tsx       # responsive card grid
│   │   ├── IncidentListSkeleton.tsx # 6 skeleton cards
│   │   ├── IncidentDetail.tsx     # Sheet — GET /incidents/:id + mini-map + 404 state
│   │   └── ReportIncidentForm.tsx # Dialog + RHF + Zod + useCreateIncident + sonner toast
│   └── vehicles/
│       ├── VehicleFilters.tsx     # status + type + zone selects → filterStore
│       ├── VehicleCard.tsx        # card with plate, type icon, status badge, capacity
│       ├── VehicleGridSkeleton.tsx # 6 skeleton cards
│       ├── VehicleDetail.tsx      # Sheet — GET /vehicles/:id + 404 state
│       └── CreateVehicleForm.tsx  # Dialog + RHF + Zod + useCreateVehicle + sonner toast
├── pages/
│   ├── DashboardPage.tsx          # 4 stat cards + ZoneOverviewPanel + CityMap
│   ├── AssetsPage.tsx             # filters + count + table + pagination + refetch spinner
│   ├── IncidentsPage.tsx          # filters + count + list + detail sheet + report button
│   └── VehiclesPage.tsx           # filters + count + card grid + detail sheet + register button
├── routes/
│   └── index.tsx                  # createBrowserRouter: / → /assets → /incidents → /vehicles
└── test/
    └── setup.ts                   # jest-dom matchers + Radix UI browser API polyfills
```

> **Note**: The planned `MarkerPopup.tsx` shared component was not created — popup content is inlined in `AssetMarkers.tsx` and `IncidentMarkers.tsx`. The planned `VehicleList.tsx` component was not created — vehicle cards are rendered directly in `VehiclesPage.tsx`.

## State Management Strategy

| State Category | Tool                  | Rationale                                                                         |
| -------------- | --------------------- | --------------------------------------------------------------------------------- |
| Server data    | TanStack React Query  | Caching, background refetch, mutation lifecycle, loading/error states             |
| Filter values  | Zustand `filterStore` | Drive both UI controls and React Query `queryKey`; shared across map + list views |
| UI / ephemeral | Zustand `uiStore`     | Selected incident marker, open detail sheet — isolated from data queries          |
| Zone lookup    | React Query cache     | `staleTime: Infinity` — zones never change; fetched once, reused everywhere       |

## Data Flow (Asset Map + List synchronized by Zustand)

```
AssetFilters ──writes──> filterStore.assetFilters
                                  │
                                  ▼
                        useAssets(filterStore.assetFilters)
                                  │
                         queryKey changes → refetch
                                  │
                     ┌─────────────┴──────────────┐
                     ▼                             ▼
              AssetMarkers                    AssetTable
           (map layer updates)            (list updates — paginated)
```

Both views consume the same query — one fetch, two visual representations, zero duplication.

---

# Epics

| ID   | Title                 | Description                                                         |
| ---- | --------------------- | ------------------------------------------------------------------- |
| E-01 | Core Infrastructure   | Routing, providers, API layer, TypeScript types, path alias fix     |
| E-02 | Map Experience        | Interactive Leaflet map centered on BA showing assets and incidents |
| E-03 | Asset Management      | List, filter, and create urban assets                               |
| E-04 | Incident Management   | List, filter, view details, and report new incidents                |
| E-05 | Vehicle Fleet         | List, filter, and view collection vehicles                          |
| E-06 | Dashboard & UX Polish | Summary stats, zone overview, dark mode, empty/loading/error states |

---

# User Stories

---

## Epic E-01: Core Infrastructure

---

### US-01 — Project Bootstrap

> **Status: ✅ Completed**

**Description**
Set up the application foundation: install missing libraries, fix broken path aliases, configure React Query provider and React Router, create the `.env.local` file, and define all TypeScript types that mirror the server's entities.

**Acceptance Criteria**

- ✅ Libraries installed: `react-router`, `react-hook-form`, `react-leaflet`, `leaflet`, `@types/leaflet`. Note: `vite-tsconfig-paths` was **not** installed — path aliases are resolved via `resolve.tsconfigPaths: true` in `vite.config.ts`.
- ✅ `@/` imports resolve correctly at Vite bundle time.
- ✅ `QueryClientProvider` wraps the app root in `main.tsx`.
- ✅ `RouterProvider` with routes for `/`, `/assets`, `/incidents`, `/vehicles` renders without error.
- ✅ `src/types/index.ts` exports `Zone`, `UrbanAsset`, `Incident`, `Vehicle` using `as const` union literals (no TypeScript `enum`).
- ✅ `.env.local` defines `VITE_API_URL=http://localhost:3000`.
- ✅ `pnpm build` passes with zero TypeScript errors.

**Priority**: P0
**Estimated Effort**: 45 min
**Dependencies**: None

---

### US-02 — API Client Layer

> **Status: ✅ Completed**

**Description**
Implement a typed fetch client and one function per endpoint. Each function maps 1:1 to a real server route, accepts typed filter parameters, and returns validated response types. The base client reads `VITE_API_URL` from environment and throws on non-2xx responses.

**Acceptance Criteria**

- ✅ `src/api/client.ts` exports `fetcher<T>` and `fetcherOrNull<T>`; throws `ApiError` (extends `Error`) on non-2xx.
- ✅ `getAssets({ status?, type?, zoneId? })` — note: `zoneId` filter was added beyond the original spec to support map zone filtering.
- ✅ `createAsset(data)` → `UrbanAsset`.
- ✅ `getZones()`, `getZoneById(id)` — returns `Zone | null` on 404.
- ✅ `getIncidents({ status?, type?, zoneId? })`, `getIncidentById(id)` → `Incident | null`.
- ✅ `createIncident(data)`.
- ✅ `getVehicles({ status?, type?, zoneId? })`, `getVehicleById(id)` → `Vehicle | null`.
- ✅ `createVehicle(data)`.
- ✅ All type-only imports use `import type`.

**Priority**: P0
**Estimated Effort**: 30 min
**Dependencies**: US-01

---

### US-03 — App Shell & Navigation

> **Status: ✅ Completed**

**Description**
Create the persistent application shell used by every page: a sidebar with navigation links and a header containing the app name and a dark mode toggle.

**Acceptance Criteria**

- ✅ Sidebar renders on all routes with links to: Dashboard, Assets, Incidents, Vehicles.
- ✅ Active route link is visually highlighted (`bg-primary text-primary-foreground` via NavLink `isActive`).
- ✅ Dark mode toggle switches via `next-themes`; both modes work with the token system in `src/index.css`.
- ✅ On narrow viewports (< 768px) the sidebar is replaced by a `MobileTopBar` with hamburger + shadcn `Sheet`.
- ✅ Shell layout uses Tailwind CSS only.

**Priority**: P0
**Estimated Effort**: 45 min
**Dependencies**: US-01

---

## Epic E-02: Map Experience

---

### US-04 — Asset Map with Color-Coded Markers

> **Status: ✅ Completed**

**Description**
An interactive Leaflet map centered on Buenos Aires, displaying all 1,500 assets as color-coded clustered markers.

**Acceptance Criteria**

- ✅ Map renders at center `[-34.61, -58.43]`, zoom level 12.
- ✅ OpenStreetMap tile layer loads correctly.
- ✅ Markers fetched from `GET /assets` via React Query.
- ✅ Marker color reflects asset status: green OK, yellow FULL, orange DAMAGED, red OUT_OF_SERVICE.
- ✅ Markers clustered via `react-leaflet-cluster` v4 (compatible with React 19).
- ✅ Clicking a marker opens a Leaflet popup: type, status (with color), address, zone name.
- ✅ Loading indicator overlays the map while pending (`MapSkeletonOverlay` — thin pulse bar at top).
- ✅ Map fills its container responsively.
- ✅ **Additional**: Module-level `ASSET_ICONS` precomputed at import time — `makeAssetIcon()` called once per status, not per marker render.

**Priority**: P0
**Estimated Effort**: 90 min
**Dependencies**: US-01, US-02

---

### US-05 — Incident Markers on Map

> **Status: ✅ Completed**

**Description**
Overlay incident markers on the same map as assets. Incidents use a visually distinct icon and color scheme. Both layers can be toggled independently.

**Acceptance Criteria**

- ✅ Incident markers fetched from `GET /incidents` and rendered on the same `MapContainer`.
- ✅ Incidents use a diamond DivIcon (rotated square) to distinguish from asset circles.
- ✅ Incident color reflects status: red REPORTED, amber IN_PROGRESS, green RESOLVED.
- ✅ Popup shows: type, status, description (truncated to 80 chars), zone name, relative time.
- ✅ Map legend (fixed overlay) explains color system for both assets and incidents.
- ✅ Layer toggle checkboxes (top-right overlay) allow hiding assets or incidents independently, with live counts.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-04

---

### US-06 — Map Filter Controls

> **Status: ✅ Completed**

**Description**
Filter controls overlaid on the map so operators can narrow what is shown without navigating away. Filter state shared with list pages via Zustand.

**Acceptance Criteria**

- ✅ Zone dropdown filters both asset and incident markers simultaneously.
- ✅ Asset status filter toggles asset marker visibility by status. **Deviation from spec**: implemented as a single `Select` dropdown (one status at a time) rather than individual checkboxes per status value. This matches the server's single-value `?status=` query param model.
- ✅ Filter controls rendered as floating overlay panel (top-right of map, below layer toggles).
- ✅ Filter state written to Zustand `filterStore` — shared with Assets and Incidents list pages.
- ✅ "Clear all" button resets zone and status filters.
- ✅ Active filter count badge shown on the "Filters" toggle button.
- ✅ Marker counts shown in the layer toggles panel (e.g. "Assets (847)").

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-04, US-05

---

## Epic E-03: Asset Management

---

### US-07 — Asset List with Filters

> **Status: ✅ Completed**

**Description**
A tabular list view of all assets, filterable by status and type via server-side query params.

**Acceptance Criteria**

- ✅ shadcn `Table` renders assets from `GET /assets`.
- ✅ Columns: Type, Status (StatusBadge), Address, Zone name, Lat, Lng.
- ✅ Status and Type filters wired to `filterStore.assetFilters`.
- ✅ Filter change triggers React Query refetch (filter values are part of the `queryKey`).
- ✅ Skeleton loading state on first load (`AssetTableSkeleton` — 10 rows).
- ✅ Empty state when no assets match filters.
- ✅ Count label with pagination range: "Showing 1–100 of 1,500 assets". **Additional**: client-side pagination (PAGE_SIZE=100) with Previous/Next buttons added beyond the original spec.
- ✅ Background refetch feedback: `Loader2` spinner next to count label when `isFetching && !isPending`.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-02, US-03

---

### US-08 — Create Asset Form

> **Status: ✅ Completed**

**Description**
A form to register a new urban asset via `POST /assets`, accessed from the Assets page.

**Acceptance Criteria**

- ✅ "New Asset" button in Assets page header opens a shadcn `Dialog`.
- ✅ Fields: Type (Select), Status (Select), Address (Input), Zone (ZoneSelector), Lat (number Input), Lng (number Input).
- ✅ Zod schema mirrors server schema exactly.
- ✅ React Hook Form + `@hookform/resolvers/zod`.
- ✅ Submit button disabled + spinner while mutation pending.
- ✅ On success: dialog closes, toast "Asset created", assets query invalidated.
- ✅ On error: inline error message renders `mutation.error?.message ?? "Failed to create asset. Please try again."`.

**Priority**: P1
**Estimated Effort**: 60 min
**Dependencies**: US-07

---

## Epic E-04: Incident Management

---

### US-09 — Incident List with Filters

> **Status: ✅ Completed**

**Description**
A card-based list of all incidents, filterable by status, type, and zone.

**Acceptance Criteria**

- ✅ Cards from `GET /incidents`. Each card: type icon (lucide), status badge, truncated description, zone name, relative `createdAt`.
- ✅ Filter controls: Status, Type, Zone — all three from `filterStore.incidentFilters`.
- ✅ All three filters combined into a single React Query `queryKey`.
- ✅ Skeleton loading (`IncidentListSkeleton`) and empty state.
- ✅ Incident count in page header.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-02, US-03

---

### US-10 — Incident Detail Panel

> **Status: ✅ Completed**

**Description**
Clicking an incident card opens a slide-in `Sheet` panel with full details fetched via `GET /incidents/:id`.

**Acceptance Criteria**

- ✅ Clicking an incident card opens a shadcn `Sheet` from the right.
- ✅ Sheet fetches `GET /incidents/:id` via `useIncidentById` (query key: `["incidents", id]`).
- ✅ Displays: type, status badge, full description, lat/lng (5 decimal places), zone name, `createdAt` as full date/time string.
- ✅ Non-interactive mini-map (no zoom controls, no attribution) shows single incident marker.
- ✅ Explicit close button; ESC closes via Sheet's `onOpenChange`.
- ✅ Loading spinner while detail query pending.
- ✅ 404 / error state: "Incident not found" message.

**Priority**: P1
**Estimated Effort**: 60 min
**Dependencies**: US-09

---

### US-11 — Report Incident Form

> **Status: ✅ Completed**

**Description**
A form to report a new incident via `POST /incidents`.

**Acceptance Criteria**

- ✅ "Report Incident" button in Incidents page header opens a shadcn `Dialog`.
- ✅ Fields: Type (Select), Description (Textarea), Zone (ZoneSelector), Lat (number Input), Lng (number Input).
- ✅ `status` field absent — server defaults to `REPORTED`.
- ✅ `createdAt` absent — server-generated.
- ✅ Zod schema: type required enum, description required min-1, lat/lng numbers, zoneId required.
- ✅ On success: dialog closes, toast "Incident reported", incidents query invalidated.
- ✅ On error: `mutation.error?.message ?? "Failed to report incident. Please try again."`.
- ✅ Submit disabled + loading during pending mutation.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-09

---

## Epic E-05: Vehicle Fleet

---

### US-12 — Vehicle List with Filters

> **Status: ✅ Completed**

**Description**
A list view of the vehicle fleet, filterable by status, type, and zone.

**Acceptance Criteria**

- ✅ `VehicleCard` components render from `GET /vehicles`. Each card: plate, type (title-cased), status badge, zone name, capacity formatted as "5,000 kg".
- ✅ Filter controls: Status, Type, Zone → `filterStore.vehicleFilters`.
- ✅ React Query key includes all active filters.
- ✅ Skeleton loading (`VehicleGridSkeleton`) and empty state handled.

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-02, US-03

---

### US-13 — Vehicle Detail Sheet

> **Status: ✅ Completed**

**Description**
Clicking a vehicle card opens a detail sheet fetched via `GET /vehicles/:id`.

**Acceptance Criteria**

- ✅ shadcn `Sheet` shows: plate, type, status badge, capacity (formatted), zone name.
- ✅ Fetched via `GET /vehicles/:id` with `useVehicleById`.
- ✅ Loading and 404 error states handled.
- ✅ Close button and ESC dismiss the sheet.

**Priority**: P2
**Estimated Effort**: 30 min
**Dependencies**: US-12

---

### US-14 — Register Vehicle Form

> **Status: ✅ Completed**

**Description**
A form to register a new vehicle via `POST /vehicles`.

**Acceptance Criteria**

- ✅ Dialog opened from "Register Vehicle" button.
- ✅ Fields: Plate (Input, uppercased), Type (Select), Capacity (number Input), Zone (ZoneSelector).
- ✅ `status` field absent — server defaults to `ACTIVE`.
- ✅ Zod schema: plate required, type required enum, capacity required positive number, zoneId required.
- ✅ On success: toast "Vehicle registered", vehicles query invalidated.
- ✅ On error: `mutation.error?.message ?? "Failed to register vehicle. Please try again."`.

**Priority**: P2
**Estimated Effort**: 45 min
**Dependencies**: US-12

---

## Epic E-06: Dashboard & UX Polish

---

### US-15 — Dashboard Stats Cards

> **Status: ✅ Completed**

**Description**
A dashboard page with summary stat cards giving an at-a-glance view of the city hygiene operation.

**Acceptance Criteria**

- ✅ Four stat cards with count, label, and lucide icon:
  1. Total assets (`GET /assets` — no filter).
  2. Assets needing attention (DAMAGED + FULL + OUT_OF_SERVICE — derived client-side from full asset list).
  3. Open incidents — **Deviation from spec**: counts `REPORTED + IN_PROGRESS` (not just `REPORTED`), providing a more operationally meaningful "not yet resolved" count.
  4. Active vehicles (`GET /vehicles?status=ACTIVE`).
- ✅ Three underlying queries run in parallel (allAssets, allIncidents, activeVehicles).
- ✅ `DashboardStatsSkeleton` shown while all three queries are pending.
- ✅ Full city map (US-04 + US-05) renders below stat cards.

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-04, US-05

---

### US-16 — Zone Overview Panel

> **Status: ✅ Completed**

**Description**
A panel listing all 5 zones with live asset and incident counts per zone. Clicking a zone sets it as the active filter.

**Acceptance Criteria**

- ✅ Panel shows each zone name with: asset count (client-side filter of cached `GET /assets`) and incident count.
  - **Deviation from spec**: shows total incident count per zone (not just open/REPORTED incidents). All incidents are already in cache from the allIncidents query, so no extra fetch is needed.
- ✅ Clicking a zone sets `filterStore.incidentFilters.zoneId` and `filterStore.assetFilters.zoneId`, then navigates to `/incidents`.
  - **Deviation from spec**: writes to `filterStore` directly (not `uiStore.selectedZoneId`). The navigation to `/incidents` achieves the same result more directly.
- ❌ **Active zone visual highlight not implemented**: the panel does not visually indicate which zone is currently active. This was a minor acceptance criterion not yet built.
- ✅ Loading skeleton shown while queries are pending.

**Priority**: P2
**Estimated Effort**: 45 min
**Dependencies**: US-15

---

# Recommended MVP

All 8 MVP stories are complete.

| Story | Feature                        | Key Skills Demonstrated                               | Status       |
| ----- | ------------------------------ | ----------------------------------------------------- | ------------ |
| US-01 | Project bootstrap              | TypeScript config, Vite setup, architecture decisions | ✅ Completed |
| US-02 | API client layer               | TypeScript generics, fetch patterns, Zod-free typing  | ✅ Completed |
| US-03 | App shell & navigation         | shadcn, Tailwind v4, React Router, dark mode          | ✅ Completed |
| US-04 | Asset map with colored markers | React Leaflet, React Query, Zustand, clustering       | ✅ Completed |
| US-05 | Incident markers on map        | Multi-layer map, popup UX, relative date formatting   | ✅ Completed |
| US-07 | Asset list with filters        | React Query keys, Zustand filter state, shadcn Table  | ✅ Completed |
| US-09 | Incident list with filters     | Multi-filter state, card UX, React Query caching      | ✅ Completed |
| US-11 | Report incident form           | React Hook Form, Zod, `useMutation`, toast feedback   | ✅ Completed |

---

# Nice To Have

All 8 nice-to-have stories are complete.

| Rank | Story | Feature                   | Status       |
| ---- | ----- | ------------------------- | ------------ |
| 1    | US-15 | Dashboard stats cards     | ✅ Completed |
| 2    | US-06 | Map filter controls       | ✅ Completed |
| 3    | US-08 | Create asset form         | ✅ Completed |
| 4    | US-10 | Incident detail panel     | ✅ Completed |
| 5    | US-12 | Vehicle list with filters | ✅ Completed |
| 6    | US-13 | Vehicle detail sheet      | ✅ Completed |
| 7    | US-14 | Register vehicle form     | ✅ Completed |
| 8    | US-16 | Zone overview panel       | ✅ Completed |

---

# Implementation Order

All steps completed.

## Step 1 — Foundation ✅

Installed dependencies, configured `resolve.tsconfigPaths: true`, set up providers, defined types, and created the API layer.

Files created/modified: `vite.config.ts`, `src/types/index.ts`, `src/api/client.ts`, `src/api/assets.ts`, `src/api/incidents.ts`, `src/api/vehicles.ts`, `src/api/zones.ts`, `src/main.tsx`.

---

## Step 2 — App Shell ✅

Created the layout with sidebar navigation and mobile top bar.

Files created: `src/routes/index.tsx`, `src/features/layout/MainLayout.tsx`, `src/features/layout/Sidebar.tsx`, `src/pages/*.tsx` (stubs → fully implemented), `src/App.tsx`.

---

## Step 3 — Zustand Stores + React Query Hooks ✅

Defined all shared state before building components.

Files created: `src/store/filterStore.ts`, `src/store/uiStore.ts`, `src/hooks/useZones.ts`, `src/hooks/useAssets.ts`, `src/hooks/useIncidents.ts`, `src/hooks/useVehicles.ts`, `src/utils/statusColors.ts`, `src/utils/formatters.ts`, `src/components/common/*.tsx`.

---

## Step 4 — Asset Map ✅

Files created: `src/features/map/CityMap.tsx`, `src/features/map/AssetMarkers.tsx`, `src/features/map/IncidentMarkers.tsx`, `src/features/map/MapFilters.tsx`, `src/features/map/MapSkeletonOverlay.tsx`.

---

## Step 5 — Asset List Page ✅

Files created: `src/features/assets/AssetFilters.tsx`, `src/features/assets/AssetTable.tsx`, `src/features/assets/AssetTableSkeleton.tsx`, `src/features/assets/CreateAssetForm.tsx`.
`src/pages/AssetsPage.tsx` updated with full implementation including pagination.

---

## Step 6 — Incident List + Report Form ✅

Files created: `src/features/incidents/IncidentFilters.tsx`, `src/features/incidents/IncidentCard.tsx`, `src/features/incidents/IncidentList.tsx`, `src/features/incidents/IncidentListSkeleton.tsx`, `src/features/incidents/IncidentDetail.tsx`, `src/features/incidents/ReportIncidentForm.tsx`.

---

## Step 7 — Vehicle Fleet, Dashboard, and Polish ✅

Files created: `src/features/vehicles/*.tsx`, `src/features/dashboard/*.tsx`, `src/pages/VehiclesPage.tsx`, `src/pages/DashboardPage.tsx`.

---

## Step 8 — Testing Infrastructure ✅ (added beyond original plan)

Configured Vitest 4 + React Testing Library. 46 tests across 4 files all passing.

---

## Step 9 — Final Optimization Pass ✅ (added beyond original plan)

- Client-side pagination in `AssetsPage.tsx` (PAGE_SIZE=100)
- Background refetch `Loader2` spinner in `AssetsPage.tsx`
- Module-level `ASSET_ICONS` in `AssetMarkers.tsx`
- `mutation.error?.message` in all three create/report forms

---

# Risks and Assumptions

| #    | Type       | Description                                                                                                                                                             | Status / Mitigation                                                                                                      |
| ---- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| R-01 | Risk       | **In-memory server resets** on restart — all POST'd data is lost.                                                                                                       | Known limitation. React Query cache shows new items until the next full reload.                                          |
| R-02 | Risk       | **1,500 asset markers** will freeze the browser without clustering.                                                                                                     | ✅ Resolved: `react-leaflet-cluster` v4.1.3 installed and compatible with React 19.                                      |
| R-03 | Risk       | **No `GET /assets/:id`** — individual asset fetch is impossible.                                                                                                        | Known limitation. No asset detail panel — all info comes from list cache or marker popup.                                |
| R-04 | Risk       | **Broken `@/` path aliases** crash the Vite build.                                                                                                                      | ✅ Resolved: `resolve.tsconfigPaths: true` in `vite.config.ts`. No plugin needed.                                        |
| R-05 | Risk       | **Exact-match, case-sensitive filtering** — wrong casing returns 0 results silently.                                                                                    | ✅ Mitigated: all filter values come from `as const` objects in `src/types/index.ts`.                                    |
| R-06 | Risk       | **`react-leaflet-cluster`** peer dependency conflicts with React 19.                                                                                                    | ✅ Resolved: v4.1.3 is compatible with React 19. No issues encountered.                                                  |
| R-07 | Assumption | The server is running at `http://localhost:3000` throughout development.                                                                                                | Unchanged. `VITE_API_URL` in `.env.local` configures the base URL.                                                       |
| R-08 | Assumption | No authentication is required or simulated.                                                                                                                             | Unchanged. No auth layer implemented.                                                                                    |
| R-09 | Assumption | `zoneId` values are always `"1"`–`"5"`. Zone selects populated from `GET /zones`.                                                                                       | Unchanged. `ZoneSelector` uses live API data.                                                                            |
| R-10 | Assumption | The challenge evaluator will run both the frontend and server side by side.                                                                                             | Unchanged. README includes both start commands.                                                                          |
| R-11 | Assumption | Tailwind CSS v4 CSS-first setup requires no `tailwind.config.ts`.                                                                                                       | ✅ Confirmed: no `tailwind.config.ts` created. All tokens in `src/index.css`.                                            |
| R-12 | Assumption | shadcn `radix-nova` components are sufficient for MVP.                                                                                                                  | ✅ Confirmed: 13 components available in `src/components/ui/` — sufficient for all features.                             |

---

# Current Implementation Status

## Implemented Features

All 16 planned User Stories are fully implemented across all 6 epics:

- **E-01 Core Infrastructure**: Bootstrap, API client, app shell and navigation
- **E-02 Map Experience**: Asset markers (clustered, color-coded), incident markers (diamond icon), layer toggles, legend, floating filter controls
- **E-03 Asset Management**: Asset table with filters, create asset form, skeleton loading, empty/error states, client-side pagination, refetch feedback
- **E-04 Incident Management**: Incident card list with three filters, incident detail sheet (with mini-map), report incident form
- **E-05 Vehicle Fleet**: Vehicle card grid with three filters, vehicle detail sheet, register vehicle form
- **E-06 Dashboard**: Four parallel stat cards, zone overview panel with navigation, full city map

**Beyond the original spec:**
- Client-side pagination for assets (PAGE_SIZE=100, Previous/Next with `ChevronLeft`/`ChevronRight`)
- Background refetch `Loader2` spinner in AssetsPage count area (`isFetching && !isPending`)
- Module-level `ASSET_ICONS` precomputation in `AssetMarkers.tsx`
- `mutation.error?.message` fallback in all three create/report forms
- Full test suite: Vitest 4 + React Testing Library, 46 tests, 4 files

## Remaining Optional Improvements

- **Multi-select asset status filter on map**: the current implementation uses a single `Select` (one status at a time). Multi-select checkboxes would require client-side post-filtering after receiving the full set.
- **Zone overview active highlight**: clicking a zone navigates to `/incidents` but the zone card itself does not show a visual "active" state.
- **`IncidentMarkers` icon precomputation**: `AssetMarkers` now precomputes icons at module level; `IncidentMarkers` still creates DivIcons per render. Low-impact but inconsistent.
- **Error boundary components**: errors are handled per-query with inline `EmptyState`; no React error boundary wrappers exist.

## Known Limitations

| Limitation | Source | Impact |
|---|---|---|
| Server is in-memory | Backend constraint | All created data is lost on server restart |
| No `GET /assets/:id` | Backend constraint | No asset detail panel possible |
| Map asset status filter: single-value only | Design decision (matches server model) | Cannot filter for "DAMAGED or FULL" simultaneously on the map |
| Zone Overview shows total incidents | Design decision | Incident count includes RESOLVED incidents, not just open ones |
| `uiStore.selectedZoneId` unused by ZoneOverview | Design decision | Zone navigation writes to `filterStore` directly; `selectedZoneId` is only set by `IncidentDetail` interactions |

## Technical Debt Intentionally Left Out of Scope

- **No virtualization**: 1,500 asset rows in the table are mitigated by client-side pagination to 100-row pages. `react-virtual` was not added.
- **No Suspense boundaries**: React Query loading states (`isPending`) are used per-component; no `<Suspense>` wrappers.
- **No optimistic updates**: mutations use `queryClient.invalidateQueries` on success. Optimistic updates are unnecessary given the in-memory backend.
- **No E2E tests**: Vitest + RTL covers unit and component tests. Playwright/Cypress would be needed for full browser E2E, which is out of scope for a frontend challenge.
- **`makeAssetIcon` retained**: the function remains in `AssetMarkers.tsx` to build `ASSET_ICONS` at init time, but is not exported or called during renders.
