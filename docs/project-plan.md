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

| Field  | Type   | Notes                                             |
| ------ | ------ | ------------------------------------------------- |
| `id`   | string | `"1"` – `"5"`                                     |
| `name` | string | Microcentro, Palermo, Recoleta, Belgrano, Caballito |

### UrbanAsset

Urban infrastructure items with geographic coordinates. 1,500 records seeded at startup, all within Buenos Aires lat/lng bounds.

| Field     | Type                                              | Notes                                         |
| --------- | ------------------------------------------------- | --------------------------------------------- |
| `id`      | string                                            | Sequential on seed; `Date.now()` on POST      |
| `type`    | `"BIN" \| "CONTAINER" \| "BENCH"`                 | —                                             |
| `status`  | `"OK" \| "DAMAGED" \| "FULL" \| "OUT_OF_SERVICE"` | 70% OK, 15% FULL, 10% DAMAGED, 5% OOS (seed) |
| `lat`     | number                                            | Buenos Aires bounds (-34.705 to -34.526)      |
| `lng`     | number                                            | Buenos Aires bounds (-58.531 to -58.335)      |
| `address` | string                                            | Street address                                |
| `zoneId`  | string                                            | FK → Zone.id (no server-side enforcement)     |

### Incident

City events requiring operational response. 40 records seeded, covering all type/status combinations.

| Field         | Type                                          | Notes                                     |
| ------------- | --------------------------------------------- | ----------------------------------------- |
| `id`          | string                                        | —                                         |
| `type`        | `"OVERFLOW" \| "DAMAGE" \| "LITTERING" \| "OTHER"` | —                                    |
| `status`      | `"REPORTED" \| "IN_PROGRESS" \| "RESOLVED"`   | Defaults to `REPORTED` on POST            |
| `description` | string                                        | —                                         |
| `lat`         | number                                        | Buenos Aires bounds                       |
| `lng`         | number                                        | Buenos Aires bounds                       |
| `zoneId`      | string                                        | FK → Zone.id                              |
| `createdAt`   | string                                        | ISO 8601, **server-generated** on POST    |

### Vehicle

Collection fleet. 10 records seeded.

| Field      | Type                                               | Notes                             |
| ---------- | -------------------------------------------------- | --------------------------------- |
| `id`       | string                                             | —                                 |
| `plate`    | string                                             | —                                 |
| `type`     | `"TRUCK" \| "VAN" \| "PICKUP"`                     | —                                 |
| `status`   | `"ACTIVE" \| "MAINTENANCE" \| "OUT_OF_SERVICE"`    | Defaults to `ACTIVE` on POST      |
| `capacity` | number                                             | Kilograms, must be positive       |
| `zoneId`   | string                                             | FK → Zone.id                      |

## Entity Relationships

```
Zone (1) ──< UrbanAsset (N)   via zoneId
Zone (1) ──< Incident   (N)   via zoneId
Zone (1) ──< Vehicle    (N)   via zoneId
```

No enforced referential integrity on the server. A POST with a non-existent `zoneId` succeeds.

## Endpoints

| #  | Method | Path             | Query Params                   | Body Fields                             | Success Response  |
| -- | ------ | ---------------- | ------------------------------ | --------------------------------------- | ----------------- |
| 1  | GET    | `/assets`        | `?status`, `?type`             | —                                       | `UrbanAsset[]` 200 |
| 2  | POST   | `/assets`        | —                              | `type, status, lat, lng, address, zoneId` | `UrbanAsset` 201 |
| 3  | GET    | `/zones`         | —                              | —                                       | `Zone[]` 200      |
| 4  | GET    | `/zones/:id`     | —                              | —                                       | `Zone` 200 / 404  |
| 5  | GET    | `/incidents`     | `?status`, `?type`, `?zoneId`  | —                                       | `Incident[]` 200  |
| 6  | GET    | `/incidents/:id` | —                              | —                                       | `Incident` 200 / 404 |
| 7  | POST   | `/incidents`     | —                              | `type, description, lat, lng, zoneId, [status]` | `Incident` 201 |
| 8  | GET    | `/vehicles`      | `?status`, `?type`, `?zoneId`  | —                                       | `Vehicle[]` 200   |
| 9  | GET    | `/vehicles/:id`  | —                              | —                                       | `Vehicle` 200 / 404 |
| 10 | POST   | `/vehicles`      | —                              | `plate, type, capacity, zoneId, [status]` | `Vehicle` 201   |

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

| Layer          | Tool                          | Status                                           |
| -------------- | ----------------------------- | ------------------------------------------------ |
| Bundler        | Vite 8                        | Installed                                        |
| Framework      | React 19                      | Installed                                        |
| Styling        | Tailwind CSS v4 (CSS-first)   | Installed — tokens in `src/index.css`            |
| Components     | shadcn/ui (radix-nova)        | Installed — 11 primitives available              |
| State          | Zustand 5                     | Installed                                        |
| Data fetching  | TanStack React Query 5        | Installed                                        |
| Validation     | Zod 4 (pinned to 4.4.3)       | Installed                                        |
| Routing        | React Router v7               | **Not installed — needs `pnpm add react-router`** |
| Forms          | React Hook Form               | **Not installed — needs install**                |
| Maps           | React Leaflet + Leaflet       | **Not installed — needs install**                |
| Path aliases   | vite-tsconfig-paths           | **Not installed — `@/` is broken in Vite today** |

## Critical Setup Items Before Feature Work

1. **Fix broken path aliases** (`@/` compiles in TypeScript but Vite cannot bundle them):
   Install `vite-tsconfig-paths` and add its plugin to `vite.config.ts`, or manually add `resolve.alias` entries. Without this, every import using `@/` will fail at build time.

2. **Install missing libraries**:
   ```bash
   pnpm add react-router react-hook-form react-leaflet leaflet @types/leaflet vite-tsconfig-paths
   ```

3. **No TypeScript `enum`** (`erasableSyntaxOnly: true`):
   Use `as const` objects with union types. Example:
   ```ts
   export const AssetStatus = {
     OK: "OK",
     DAMAGED: "DAMAGED",
     FULL: "FULL",
     OUT_OF_SERVICE: "OUT_OF_SERVICE",
   } as const;
   export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];
   ```

4. **Type-only imports** (`verbatimModuleSyntax: true`):
   All type-only imports must use `import type { ... }`.

5. **Unused params** (`noUnusedParameters: true`):
   Prefix intentionally unused callback params with `_`.

## Directory Layout

```
src/
├── main.tsx                       # entry — QueryClientProvider + RouterProvider → <App />
├── App.tsx                        # root — RouterProvider with route config
├── index.css                      # Tailwind @import + CSS theme tokens (do not add tailwind.config.ts)
├── lib/
│   └── utils.ts                   # cn() helper (already exists)
├── types/
│   └── index.ts                   # Zone, UrbanAsset, Incident, Vehicle types (no enum)
├── api/
│   ├── client.ts                  # base fetcher — throws on non-2xx, reads VITE_API_URL
│   ├── assets.ts                  # getAssets(), createAsset()
│   ├── incidents.ts               # getIncidents(), getIncidentById(), createIncident()
│   ├── vehicles.ts                # getVehicles(), getVehicleById(), createVehicle()
│   └── zones.ts                   # getZones(), getZoneById()
├── hooks/
│   ├── useAssets.ts               # useQuery wrapper — accepts filter params
│   ├── useIncidents.ts            # useQuery + useMutation wrappers
│   ├── useVehicles.ts             # useQuery + useMutation wrappers
│   └── useZones.ts                # useQuery — staleTime: Infinity (zones never change)
├── store/
│   ├── filterStore.ts             # Zustand: { assetFilters, incidentFilters, vehicleFilters }
│   └── uiStore.ts                 # Zustand: { selectedMarkerId, selectedZoneId, sheetOpen }
├── utils/
│   ├── statusColors.ts            # status → Tailwind CSS class mappings
│   └── formatters.ts              # date → relative string, capacity → "5,000 kg"
├── components/
│   ├── ui/                        # shadcn-generated — do not edit directly
│   └── common/
│       ├── StatusBadge.tsx        # wraps shadcn Badge with status color logic
│       ├── ZoneSelector.tsx       # select populated from useZones(), used app-wide
│       ├── LoadingSpinner.tsx     # centered spinner for page-level loading
│       └── EmptyState.tsx         # icon + message for zero-results states
├── features/
│   ├── layout/
│   │   ├── MainLayout.tsx         # persistent sidebar + main content area
│   │   └── Sidebar.tsx            # nav links: Dashboard / Assets / Incidents / Vehicles
│   ├── map/
│   │   ├── CityMap.tsx            # MapContainer centered on Buenos Aires
│   │   ├── AssetMarkers.tsx       # renders asset markers from query data, clustered
│   │   ├── IncidentMarkers.tsx    # renders incident markers, distinct icon
│   │   └── MarkerPopup.tsx        # popup content for both marker types
│   ├── assets/
│   │   ├── AssetFilters.tsx       # status + type selects → filterStore.assetFilters
│   │   ├── AssetTable.tsx         # shadcn Table with all asset columns
│   │   └── CreateAssetForm.tsx    # Dialog + React Hook Form + Zod + useMutation
│   ├── incidents/
│   │   ├── IncidentFilters.tsx    # status + type + zoneId → filterStore.incidentFilters
│   │   ├── IncidentList.tsx       # card grid
│   │   ├── IncidentCard.tsx       # single card with type icon, status badge, relative time
│   │   ├── IncidentDetail.tsx     # Sheet with full detail + mini-map
│   │   └── ReportIncidentForm.tsx # Dialog + React Hook Form + Zod + useMutation
│   └── vehicles/
│       ├── VehicleFilters.tsx     # status + type + zoneId → filterStore.vehicleFilters
│       ├── VehicleList.tsx        # card list
│       └── VehicleDetail.tsx      # Sheet via GET /vehicles/:id
├── pages/
│   ├── DashboardPage.tsx          # stats cards + full city map
│   ├── AssetsPage.tsx             # AssetFilters + AssetTable + CreateAssetForm trigger
│   ├── IncidentsPage.tsx          # IncidentFilters + IncidentList + ReportIncidentForm trigger
│   └── VehiclesPage.tsx           # VehicleFilters + VehicleList
└── routes/
    └── index.tsx                  # React Router route config
```

## State Management Strategy

| State Category     | Tool               | Rationale                                                           |
| ------------------ | ------------------ | ------------------------------------------------------------------- |
| Server data        | TanStack React Query | Caching, background refetch, mutation lifecycle, loading/error states |
| Filter values      | Zustand `filterStore` | Drive both UI controls and React Query `queryKey`; shared across map + list views |
| UI / ephemeral     | Zustand `uiStore`  | Selected marker, open sheet — isolated from data queries           |
| Zone lookup        | React Query cache  | `staleTime: Infinity` — zones never change; fetched once, reused everywhere |

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
          (map layer updates)            (list updates)
```

Both views consume the same query — one fetch, two visual representations, zero duplication.

---

# Epics

| ID   | Title                   | Description                                                             |
| ---- | ----------------------- | ----------------------------------------------------------------------- |
| E-01 | Core Infrastructure     | Routing, providers, API layer, TypeScript types, path alias fix         |
| E-02 | Map Experience          | Interactive Leaflet map centered on BA showing assets and incidents     |
| E-03 | Asset Management        | List, filter, and create urban assets                                   |
| E-04 | Incident Management     | List, filter, view details, and report new incidents                    |
| E-05 | Vehicle Fleet           | List, filter, and view collection vehicles                              |
| E-06 | Dashboard & UX Polish   | Summary stats, zone overview, dark mode, empty/loading/error states     |

---

# User Stories

---

## Epic E-01: Core Infrastructure

---

### US-01 — Project Bootstrap

**Description**
Set up the application foundation: install missing libraries, fix broken path aliases, configure React Query provider and React Router, create the `.env.local` file, and define all TypeScript types that mirror the server's entities.

**Acceptance Criteria**
- `pnpm add react-router react-hook-form react-leaflet leaflet @types/leaflet vite-tsconfig-paths` completes without error.
- `vite-tsconfig-paths` plugin is added to `vite.config.ts`; `@/` imports resolve correctly at Vite bundle time.
- `QueryClientProvider` wraps the app root in `main.tsx`.
- `RouterProvider` with at least stub routes for `/`, `/assets`, `/incidents`, `/vehicles` renders without error.
- `src/types/index.ts` exports `Zone`, `UrbanAsset`, `Incident`, `Vehicle` interfaces with no TypeScript `enum` — use `as const` union literals.
- `.env.local` defines `VITE_API_URL=http://localhost:3000`.
- `pnpm build` passes with zero TypeScript errors.

**Priority**: P0
**Estimated Effort**: 45 min
**Dependencies**: None

---

### US-02 — API Client Layer

**Description**
Implement a typed fetch client and one function per endpoint. Each function maps 1:1 to a real server route, accepts typed filter parameters, and returns validated response types. The base client reads `VITE_API_URL` from environment and throws on non-2xx responses.

**Acceptance Criteria**
- `src/api/client.ts` exports a `fetcher<T>(path, options?)` function that reads `import.meta.env.VITE_API_URL`, throws a typed error on non-2xx, and returns `T`.
- `getAssets({ status?, type? })` calls `GET /assets` with only the params that are defined (no empty `?status=` strings).
- `createAsset(data)` calls `POST /assets` and returns `UrbanAsset`.
- `getZones()` calls `GET /zones`.
- `getZoneById(id)` calls `GET /zones/:id`; returns `Zone | null` on 404 (does not throw).
- `getIncidents({ status?, type?, zoneId? })` calls `GET /incidents`.
- `getIncidentById(id)` calls `GET /incidents/:id`; returns `Incident | null` on 404.
- `createIncident(data)` calls `POST /incidents`.
- `getVehicles({ status?, type?, zoneId? })` calls `GET /vehicles`.
- `getVehicleById(id)` calls `GET /vehicles/:id`; returns `Vehicle | null` on 404.
- `createVehicle(data)` calls `POST /vehicles`.
- All type-only imports use `import type`.

**Priority**: P0
**Estimated Effort**: 30 min
**Dependencies**: US-01

---

### US-03 — App Shell & Navigation

**Description**
Create the persistent application shell used by every page: a sidebar with navigation links and a header containing the app name and a dark mode toggle. All page content is rendered inside the shell's main area.

**Acceptance Criteria**
- Sidebar renders on all routes with links to: Dashboard (`/`), Assets (`/assets`), Incidents (`/incidents`), Vehicles (`/vehicles`).
- Active route link is visually highlighted (distinct color or font weight).
- Dark mode toggle switches the `dark` CSS class via `next-themes` (already installed); both modes are visually coherent with the existing token system in `src/index.css`.
- On narrow viewports (< 768px) the sidebar collapses or is replaced by a mobile menu using shadcn `Sheet`.
- Shell layout uses Tailwind CSS only — no inline styles.

**Priority**: P0
**Estimated Effort**: 45 min
**Dependencies**: US-01

---

## Epic E-02: Map Experience

---

### US-04 — Asset Map with Color-Coded Markers

**Description**
The centerpiece of the product: an interactive Leaflet map centered on Buenos Aires, displaying all 1,500 assets as color-coded clustered markers. This is the highest-impact single feature — it combines React Leaflet, React Query data, and Zustand filter state in one view.

**Acceptance Criteria**
- Map renders using `react-leaflet` at center `[-34.61, -58.43]` (Buenos Aires), zoom level 12.
- OpenStreetMap tile layer loads correctly.
- Markers are fetched from `GET /assets` via React Query.
- Marker color reflects asset status: green = OK, yellow = FULL, orange = DAMAGED, red = OUT\_OF\_SERVICE.
- Markers are clustered (using `react-leaflet-cluster` or equivalent) — the browser must not render 1,500 individual DOM nodes simultaneously.
- Clicking a marker opens a Leaflet popup showing: type, status (with color), address, and zone name (resolved from `useZones()` cache).
- A loading spinner overlays the map while the assets query is in `pending` state.
- Map is responsive and fills its container.

**Priority**: P0
**Estimated Effort**: 90 min
**Dependencies**: US-01, US-02

---

### US-05 — Incident Markers on Map

**Description**
Overlay incident markers on the same map as assets. Incidents use a visually distinct icon and color scheme. Both layers can be toggled independently.

**Acceptance Criteria**
- Incident markers are fetched from `GET /incidents` and rendered on the same `MapContainer` as assets.
- Incidents use a different icon shape or symbol to distinguish them from asset markers.
- Incident marker color reflects status: red = REPORTED, amber = IN\_PROGRESS, green = RESOLVED.
- Clicking an incident marker opens a popup showing: type, status badge, description (truncated to 80 characters with ellipsis), and `createdAt` formatted as a relative time string (e.g. "3 hours ago").
- A map legend (fixed overlay on the map) explains the color system for both assets and incidents.
- "Assets" and "Incidents" layer toggle checkboxes allow hiding either layer independently.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-04

---

### US-06 — Map Filter Controls

**Description**
Add filter controls overlaid on the map so operators can narrow what is shown without navigating away. Filter state is shared with the list pages via Zustand.

**Acceptance Criteria**
- A Zone dropdown (from `useZones()`) filters both asset and incident markers simultaneously when a zone is selected.
- Asset status checkboxes (OK, DAMAGED, FULL, OUT\_OF\_SERVICE) toggle asset marker visibility by status group.
- Filter controls are rendered as an overlay panel on the map (not below it).
- Filter state is written to Zustand `filterStore` — changing filters on the map also changes the active filters on the Assets and Incidents list pages.
- A "Clear filters" button resets all filters to their default (unfiltered) state.
- Marker count for each visible layer is shown (e.g. "847 assets · 12 incidents").

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-04, US-05

---

## Epic E-03: Asset Management

---

### US-07 — Asset List with Filters

**Description**
A tabular list view of all assets, filterable by status and type via server-side query params. Demonstrates React Query with parameterized query keys and Zustand-driven filter state.

**Acceptance Criteria**
- shadcn `Table` renders assets returned by `GET /assets`.
- Columns: Type, Status (StatusBadge), Address, Zone name (from `useZones()` cache), Lat, Lng.
- Status filter (shadcn `Select`) and Type filter (`Select`) are wired to `filterStore.assetFilters`.
- Changing a filter causes `useAssets()` to re-fetch with the new params (filter values are part of the React Query `queryKey`).
- A skeleton loading state is shown on first load and on filter change while the query is pending.
- An empty state component is shown when no assets match the active filters.
- A count label above the table updates to reflect the current result set (e.g. "Showing 3 of 1,500 assets").

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-02, US-03

---

### US-08 — Create Asset Form

**Description**
A form to register a new urban asset via `POST /assets`, accessed from the Assets page. Demonstrates `useMutation`, React Hook Form with Zod resolver, and sonner toast feedback.

**Acceptance Criteria**
- A "New Asset" button in the Assets page header opens a shadcn `Dialog`.
- Form fields: Type (Select), Status (Select), Address (Input), Zone (Select — populated from `useZones()`), Lat (number Input), Lng (number Input).
- Client-side Zod schema mirrors the server schema exactly: all fields required; type and status values match server enum casing; lat/lng are numbers.
- React Hook Form manages state; `@hookform/resolvers/zod` handles Zod integration.
- Submit button is disabled and shows a spinner while the mutation is pending.
- On success: dialog closes, a sonner toast says "Asset created", and the assets list query is invalidated so the new item appears.
- On server 400 (Zod validation error): the raw error is caught and displayed as a generic form-level error message.
- Dialog can be closed by clicking outside it or pressing ESC, discarding the form.

**Priority**: P1
**Estimated Effort**: 60 min
**Dependencies**: US-07

---

## Epic E-04: Incident Management

---

### US-09 — Incident List with Filters

**Description**
A card-based list of all incidents, filterable by status, type, and zone. Three simultaneous filters showcase multi-dimensional Zustand + React Query integration.

**Acceptance Criteria**
- Cards render from `GET /incidents` data. Each card shows: type icon (lucide), status badge, truncated description, zone name, relative `createdAt`.
- Filter controls: Status (Select), Type (Select), Zone (Select from `useZones()`).
- All three filters can be applied simultaneously; filter values are combined into a single React Query `queryKey`.
- Filter state lives in Zustand `filterStore.incidentFilters`.
- Loading skeleton shown while pending; empty state shown when no results.
- Incident count shown in page header (e.g. "14 incidents").

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-02, US-03

---

### US-10 — Incident Detail Panel

**Description**
Clicking an incident card opens a slide-in `Sheet` panel with full details fetched via `GET /incidents/:id`. Demonstrates a secondary query layered on top of a list query.

**Acceptance Criteria**
- Clicking any incident card opens a shadcn `Sheet` from the right.
- The sheet fetches `GET /incidents/:id` via a separate React Query `useQuery` (query key: `["incidents", id]`).
- Sheet displays all fields: type, status badge, full description, lat/lng coordinates, zone name (from `useZones()` cache), `createdAt` formatted as a full date/time string.
- A non-interactive mini-map (small Leaflet instance, no zoom controls) shows a single marker at the incident's coordinates.
- Sheet has an explicit close button; pressing ESC also closes it.
- Loading state shown while the detail query is pending.
- If the server returns 404, the sheet displays "Incident not found" with a descriptive message.

**Priority**: P1
**Estimated Effort**: 60 min
**Dependencies**: US-09

---

### US-11 — Report Incident Form

**Description**
A form to report a new incident via `POST /incidents`. The most UX-critical mutation in the app — demonstrates correct handling of server-side defaults (`status`, `createdAt`) and geo-coordinate input.

**Acceptance Criteria**
- A "Report Incident" button in the Incidents page header opens a shadcn `Dialog`.
- Form fields: Type (Select), Description (Textarea), Zone (Select from `useZones()`), Lat (number Input), Lng (number Input).
- `status` field is intentionally absent — the server defaults it to `REPORTED`.
- `createdAt` is intentionally absent — it is server-generated and must not be sent.
- Zod schema: type is required enum, description is required string (min 1 char), lat/lng are required numbers, zoneId is required string.
- React Hook Form + Zod resolver manages validation.
- On success: dialog closes, sonner toast "Incident reported", incidents list query is invalidated.
- On error: a form-level error message is displayed.
- Submit button disabled and loading during pending mutation.

**Priority**: P0
**Estimated Effort**: 60 min
**Dependencies**: US-09

---

## Epic E-05: Vehicle Fleet

---

### US-12 — Vehicle List with Filters

**Description**
A list view of the vehicle fleet, filterable by status, type, and zone, following the same React Query + Zustand pattern established by Assets and Incidents.

**Acceptance Criteria**
- Cards (or table rows) render from `GET /vehicles`. Each card shows: plate, type icon, status badge, capacity formatted as "5,000 kg", zone name.
- Filter controls: Status (Select), Type (Select), Zone (Select).
- Filter state in Zustand `filterStore.vehicleFilters`.
- React Query query key includes all active filters.
- Loading skeleton and empty state handled.

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-02, US-03

---

### US-13 — Vehicle Detail Sheet

**Description**
Clicking a vehicle opens a detail sheet fetched via `GET /vehicles/:id`, mirroring the pattern from Incident Detail.

**Acceptance Criteria**
- shadcn `Sheet` shows all vehicle fields: plate, type, status badge, capacity, zone name.
- Fetched via `GET /vehicles/:id` with its own `useQuery`.
- Loading and 404 error states handled.
- Close button and ESC key dismiss the sheet.

**Priority**: P2
**Estimated Effort**: 30 min
**Dependencies**: US-12

---

### US-14 — Register Vehicle Form

**Description**
A form to register a new vehicle via `POST /vehicles`, following the pattern from Create Asset.

**Acceptance Criteria**
- Dialog opened from a "Register Vehicle" button.
- Fields: Plate (Input), Type (Select), Capacity (number Input), Zone (Select).
- `status` field is absent — server defaults to `ACTIVE`.
- Zod schema: plate required string, type required enum, capacity required positive number, zoneId required string.
- On success: toast, vehicle list query invalidated.
- On error: form-level error message.

**Priority**: P2
**Estimated Effort**: 45 min
**Dependencies**: US-12

---

## Epic E-06: Dashboard & UX Polish

---

### US-15 — Dashboard Stats Cards

**Description**
A dashboard page with summary stat cards that give an at-a-glance view of the city hygiene operation. All cards fetch data in parallel via React Query.

**Acceptance Criteria**
- Four stat cards, each with a count, label, and lucide icon:
  1. Total assets (length of `GET /assets` response — no filter).
  2. Assets needing attention (`DAMAGED` + `FULL` + `OUT_OF_SERVICE` — derived from full asset list in cache).
  3. Open incidents (length of `GET /incidents?status=REPORTED`).
  4. Active vehicles (length of `GET /vehicles?status=ACTIVE`).
- All four underlying queries run in parallel (`useQueries` or four independent `useQuery` calls).
- Cards show a skeleton while loading.
- The full city map (US-04 + US-05) renders below the stat cards.

**Priority**: P1
**Estimated Effort**: 45 min
**Dependencies**: US-04, US-05

---

### US-16 — Zone Overview Panel

**Description**
A collapsible panel listing all 5 zones with live asset and open-incident counts per zone. Clicking a zone sets it as the active filter across all views.

**Acceptance Criteria**
- Panel shows each zone name with: asset count (from cached `GET /assets` filtered by `zoneId`) and open incident count (from cached `GET /incidents?status=REPORTED&zoneId=`).
- Clicking a zone writes it to `uiStore.selectedZoneId` and sets it as the active zone filter in `filterStore`.
- Active zone is visually highlighted.
- Panel collapses on mobile.

**Priority**: P2
**Estimated Effort**: 45 min
**Dependencies**: US-15

---

# Recommended MVP

The following 8 stories form the minimum deliverable for a 1-day technical challenge. Together they demonstrate React, TypeScript, React Query, Zustand, and UX skills across all key interaction patterns.

| Story | Feature                         | Key Skills Demonstrated                                 |
| ----- | ------------------------------- | ------------------------------------------------------- |
| US-01 | Project bootstrap               | TypeScript config, Vite setup, architecture decisions   |
| US-02 | API client layer                | TypeScript generics, fetch patterns, Zod-free typing    |
| US-03 | App shell & navigation          | shadcn, Tailwind v4, React Router, dark mode            |
| US-04 | Asset map with colored markers  | React Leaflet, React Query, Zustand, clustering         |
| US-05 | Incident markers on map         | Multi-layer map, popup UX, relative date formatting     |
| US-07 | Asset list with filters         | React Query keys, Zustand filter state, shadcn Table    |
| US-09 | Incident list with filters      | Multi-filter state, card UX, React Query caching        |
| US-11 | Report incident form            | React Hook Form, Zod, `useMutation`, toast feedback     |

**Estimated total: ~7.5 hours.** Intentionally leaves ~30 minutes buffer for debugging and final polish.

---

# Nice To Have

Stories to implement if time permits, ordered by impact-to-effort ratio:

| Rank | Story | Feature                     | Value                                              |
| ---- | ----- | --------------------------- | -------------------------------------------------- |
| 1    | US-15 | Dashboard stats cards       | Strong first impression; parallel React Query demo |
| 2    | US-06 | Map filter controls         | Connects Zustand store across map + list views     |
| 3    | US-08 | Create asset form           | Second mutation pattern; form reuse opportunity    |
| 4    | US-10 | Incident detail panel       | Demonstrates `GET /incidents/:id`; mini-map bonus  |
| 5    | US-12 | Vehicle list with filters   | Completes all three resource sections              |
| 6    | US-13 | Vehicle detail sheet        | Demonstrates `GET /vehicles/:id`                   |
| 7    | US-14 | Register vehicle form       | Third mutation, minimal extra effort               |
| 8    | US-16 | Zone overview panel         | Cross-entity zone filtering; high UX coherence     |

---

# Implementation Order

Optimized for a single developer: each step produces a visible, working result and unblocks the next step.

## Step 1 — Foundation (45 min)

Install missing dependencies, fix path aliases, configure providers, define types, and create the API layer.

```bash
pnpm add react-router react-hook-form react-leaflet leaflet @types/leaflet vite-tsconfig-paths
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

Files to create or modify:
- `vite.config.ts` — add `tsconfigPaths()` plugin
- `src/types/index.ts` — all entity types (no `enum`)
- `src/api/client.ts` — base fetcher reading `import.meta.env.VITE_API_URL`
- `src/api/assets.ts`, `incidents.ts`, `vehicles.ts`, `zones.ts`
- `src/main.tsx` — wrap with `QueryClientProvider` + `RouterProvider`

**Checkpoint**: `pnpm build` passes with zero errors.

---

## Step 2 — App Shell (30 min)

Create the layout so every subsequent page has a home.

Files to create:
- `src/routes/index.tsx` — routes: `/`, `/assets`, `/incidents`, `/vehicles`
- `src/features/layout/MainLayout.tsx` + `Sidebar.tsx`
- `src/pages/DashboardPage.tsx`, `AssetsPage.tsx`, `IncidentsPage.tsx`, `VehiclesPage.tsx` (stub content only)
- Update `src/App.tsx`

**Checkpoint**: All four routes render without error; sidebar navigation works.

---

## Step 3 — Zustand Stores + React Query Hooks (20 min)

Define all shared state before building components that consume it.

Files to create:
- `src/store/filterStore.ts` — `assetFilters`, `incidentFilters`, `vehicleFilters`
- `src/store/uiStore.ts` — `selectedMarkerId`, `selectedZoneId`, `sheetOpen`
- `src/hooks/useZones.ts` — `staleTime: Infinity`
- `src/hooks/useAssets.ts`, `useIncidents.ts`, `useVehicles.ts`
- `src/utils/statusColors.ts`, `formatters.ts`
- `src/components/common/StatusBadge.tsx`, `ZoneSelector.tsx`, `EmptyState.tsx`

---

## Step 4 — Asset Map (90 min)

The centerpiece. Do this while energy is highest.

Files to create:
- `src/features/map/CityMap.tsx` — `MapContainer` + OSM tiles
- `src/features/map/AssetMarkers.tsx` — clustered, color-coded markers
- `src/features/map/IncidentMarkers.tsx` — distinct icon, status colors
- `src/features/map/MarkerPopup.tsx`
- Update `src/pages/DashboardPage.tsx`

**Checkpoint**: Map loads, 1,500 asset markers are visible and clustered, clicking a marker shows a popup.

---

## Step 5 — Asset List Page (60 min)

Files to create:
- `src/features/assets/AssetFilters.tsx`
- `src/features/assets/AssetTable.tsx`
- Update `src/pages/AssetsPage.tsx`

**Checkpoint**: Filter by status and type works; count label updates; empty state renders.

---

## Step 6 — Incident List + Report Form (75 min)

Files to create:
- `src/features/incidents/IncidentFilters.tsx`
- `src/features/incidents/IncidentList.tsx` + `IncidentCard.tsx`
- `src/features/incidents/ReportIncidentForm.tsx`
- Update `src/pages/IncidentsPage.tsx`

**Checkpoint**: Three-filter incident list works; Report form submits and shows toast; new incident appears in list.

---

## Step 7 — Polish & Verification (30 min)

- Add `pnpm shadcn add skeleton` and replace raw `div` loaders with Skeleton components.
- Test dark mode toggle on all pages.
- Run `pnpm build` — fix any TypeScript errors.
- Run `pnpm lint` — fix any Oxlint warnings.
- Run `pnpm fmt` — let Oxfmt sort imports.
- Verify the app works against the live server at `http://localhost:3000`.

---

# Risks and Assumptions

| #    | Type       | Description                                                                                   | Mitigation                                                                                   |
| ---- | ---------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| R-01 | Risk       | **In-memory server resets** on restart — all POST'd data is lost.                             | React Query cache shows new items until the next full reload. Document this in the README.   |
| R-02 | Risk       | **1,500 asset markers** will freeze the browser without clustering.                           | Install `react-leaflet-cluster` in Step 4. If incompatible with React 19, use CSS-based opacity zoom-hiding as fallback. |
| R-03 | Risk       | **No `GET /assets/:id`** — individual asset fetch is impossible.                              | Asset detail information is sourced from the already-cached list query. No dedicated detail page for assets. |
| R-04 | Risk       | **Broken `@/` path aliases** crash the Vite build.                                           | Fixed in Step 1 before any imports are written. Non-negotiable first action.                 |
| R-05 | Risk       | **Exact-match, case-sensitive filtering** — wrong casing returns 0 results silently.          | API functions send values exactly as defined in `src/types/index.ts` `as const` objects.     |
| R-06 | Risk       | **`react-leaflet-cluster`** may have peer dependency conflicts with React 19.                | Verify at install time. Fallback: hide markers at zoom levels below a threshold.             |
| R-07 | Assumption | The server is running at `http://localhost:3000` throughout development.                      | `api/client.ts` reads `import.meta.env.VITE_API_URL`; `.env.local` sets this value.         |
| R-08 | Assumption | No authentication is required or simulated.                                                   | No auth layer is implemented. All API calls are unauthenticated.                             |
| R-09 | Assumption | `zoneId` values are always `"1"`–`"5"`. Zone selects are populated from `GET /zones`.        | Zone selector uses live API data, not hardcoded strings, to be resilient to future changes.  |
| R-10 | Assumption | The challenge evaluator will run both the frontend (`pnpm dev`) and server side by side.      | README must include both start commands and the required Node/pnpm versions.                 |
| R-11 | Assumption | Tailwind CSS v4 CSS-first setup requires no `tailwind.config.ts`.                            | Do not create that file. All tokens stay in `src/index.css` under `@theme inline { ... }`.  |
| R-12 | Assumption | shadcn `radix-nova` style components already installed (badge, button, card, dialog, dropdown-menu, input, label, select, sheet, sonner, table) are sufficient for MVP. | Add additional components via `pnpm shadcn add <name>` only if needed.                      |
