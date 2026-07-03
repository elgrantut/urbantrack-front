# UrbanTrack

A single-page application for Buenos Aires city hygiene operations teams. Provides views of urban asset health, active incident tracking, and vehicle fleet management across 5 operational city zones.

Connects to a local Express REST API (`http://localhost:3000`). No authentication required.

---

## Features

**Dashboard (`/`)**
- Four stat cards: total assets, assets needing attention (DAMAGED + FULL + OUT_OF_SERVICE), open incidents (REPORTED + IN_PROGRESS), active vehicles
- Zone overview panel — per-zone asset and incident counts; clicking a zone navigates to `/incidents` pre-filtered by that zone
- Interactive city map with asset and incident layers

**Map**
- 1,500 asset markers clustered via `react-leaflet-cluster`, color-coded by status (green/yellow/orange/red)
- Incident markers using a distinct diamond icon, color-coded by status
- Independent layer toggles (assets / incidents) with live counts
- Floating filter panel: zone filter (applies to both layers) + asset status filter
- Color legend
- Loading overlay while data is pending

**Assets (`/assets`)**
- Full asset table (type, status, address, zone, coordinates) backed by `GET /assets`
- Status and type server-side filters
- Client-side pagination: 100 rows per page with Previous/Next navigation
- Count label showing current page range ("Showing 1–100 of 1,500 assets")
- Background refetch indicator next to count when a stale refetch is in flight
- "New Asset" dialog: type, status, address, zone, lat/lng — React Hook Form + Zod + toast on success

**Incidents (`/incidents`)**
- Card grid with type icon, status badge, zone, relative time, and truncated description
- Three independent filters: status, type, zone
- Clicking a card opens a detail Sheet fetched via `GET /incidents/:id`, showing all fields plus a non-interactive mini-map at the incident's coordinates
- "Report Incident" dialog: type, description, zone, lat/lng — `status` and `createdAt` intentionally absent (server-managed)

**Vehicles (`/vehicles`)**
- Card grid with plate, type icon, status badge, zone, and capacity
- Three independent filters: status, type, zone
- Clicking a card opens a detail Sheet fetched via `GET /vehicles/:id`
- "Register Vehicle" dialog: plate, type, capacity, zone

**Cross-cutting**
- Dark / light / system theme via `next-themes`
- Mobile layout: hamburger button + slide-in Sheet replaces sidebar below 768px
- Skeleton loading states for all async data
- Per-query empty and error states

---

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Bundler | Vite | 8 |
| Framework | React | 19 |
| Language | TypeScript | ~6.0 |
| Styling | Tailwind CSS (CSS-first, no config file) | v4 |
| Components | shadcn/ui (radix-nova) | — |
| State | Zustand | 5 |
| Data fetching | TanStack React Query | 5 |
| Routing | React Router | 8 |
| Forms | React Hook Form | 7 |
| Validation | Zod | 4.4.3 |
| Maps | React Leaflet + react-leaflet-cluster | 5 / 4 |
| Linter | Oxlint | — |
| Formatter | Oxfmt | — |
| Tests | Vitest + React Testing Library | 4 / 16 |
| Package manager | pnpm | — |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm (`npm install -g pnpm`)
- The backend server (see below)

### Start the backend

```bash
cd server
pnpm install
pnpm dev        # tsx watch — listens on :3000
```

### Start the frontend

```bash
cd frontend
pnpm install
pnpm dev        # localhost:5173
```

`.env.local` is already present and pre-configured:

```
VITE_API_URL=http://localhost:3000
```

---

## Available Scripts

```bash
pnpm dev           # Vite dev server with HMR (localhost:5173)
pnpm build         # tsc -b && vite build (typecheck runs first)
pnpm preview       # Serve the production build locally
pnpm lint          # Oxlint
pnpm fmt           # Oxfmt — rewrites files and sorts imports
pnpm fmt:check     # Oxfmt dry-run (no writes)
pnpm test          # Vitest single pass
pnpm test:watch    # Vitest watch mode
pnpm test:coverage # Coverage report via @vitest/coverage-v8
```

---

## Architecture

### Directory structure

```
src/
├── api/           # Typed API functions — fetcher<T>, fetcherOrNull<T>, ApiError
├── hooks/         # React Query wrappers: useAssets, useIncidents, useVehicles, useZones
├── store/         # Zustand: filterStore (query params), uiStore (selected marker, sheet state)
├── types/         # Entity interfaces; enums replaced by `as const` unions
├── utils/         # statusColors.ts, formatters.ts
├── features/      # Feature-sliced components: layout, map, assets, incidents, vehicles, dashboard
├── components/    # Shared: StatusBadge, ZoneSelector, EmptyState, PageHeader; shadcn/ui primitives
├── pages/         # DashboardPage, AssetsPage, IncidentsPage, VehiclesPage
└── routes/        # createBrowserRouter config
```

### State management

Two Zustand stores:

**`filterStore`** — `assetFilters`, `incidentFilters`, `vehicleFilters` with per-group setters and resets. Filter objects are spread directly into React Query `queryKey` arrays, so any filter change triggers the right refetch. The same filter values power both the map overlays and the list pages — one source of truth.

**`uiStore`** — ephemeral UI state: `selectedMarkerId`, `sheetOpen`, `selectedZoneId`. Used by `IncidentDetail` to know which incident Sheet to open.

Server data is owned entirely by React Query. Zones use `staleTime: Infinity`. All other queries use 1-minute stale time with 1 retry.

### Data flow example (map ↔ asset list)

```
AssetFilters component
  → writes filterStore.assetFilters
  → queryKey: ["assets", assetFilters] changes → GET /assets refetch
  → AssetMarkers (map)  +  AssetTable (list, paginated)  both update
```

### TypeScript configuration

- `erasableSyntaxOnly: true` — no `enum`, no `namespace`
- `verbatimModuleSyntax: true` — type-only imports use `import type`
- `noUnusedLocals` / `noUnusedParameters`
- Path alias `@/` resolved via `resolve.tsconfigPaths: true` in `vite.config.ts` — no additional plugin

---

## Testing

46 tests across 4 files, all passing.

```bash
pnpm test
```

| File | Tests | Covers |
|---|---|---|
| `src/utils/formatters.test.ts` | 14 | `formatCapacity`, `truncate`, `formatRelativeTime`, `formatDateTime` |
| `src/store/filterStore.test.ts` | 12 | Per-filter setters, resets, `resetAllFilters`, store isolation |
| `src/store/uiStore.test.ts` | 10 | Marker selection, zone selection, sheet open/close |
| `src/features/vehicles/VehicleFilters.test.tsx` | 10 | Render, clear button, Radix Select interaction, store writes |

Coverage excludes generated shadcn primitives (`src/components/ui/`), `main.tsx`, `App.tsx`, and the route config.

---

## Technical Decisions

**Client-side pagination for assets**
`GET /assets` returns a flat array with no `limit`/`offset` support. Modifying the backend is out of scope. Slicing to 100 rows per page keeps the rendered DOM manageable without adding a virtualization library. A `useEffect` resets the page to 1 whenever any filter changes.

**Single-select asset status filter on the map**
The backend accepts a single `?status=` value (exact-match string). A multi-select UI would require either multiple concurrent requests or full client-side post-filtering after receiving the full unfiltered set. A `Select` dropdown matches the server's filter model correctly.

**Zone overview shows total incident count, not open-only**
Per-zone open-incident counts would require 5 additional `GET /incidents?status=REPORTED&zoneId=N` fetches per Dashboard render. All incidents are already in the React Query cache from the Dashboard query; client-side counting adds no network cost.

**`resolve.tsconfigPaths: true` instead of `vite-tsconfig-paths` plugin**
Vite 8 resolves TypeScript path aliases natively when `resolve.tsconfigPaths: true` is set. No plugin was installed.

**Asset marker icons precomputed at module level**
`ASSET_ICONS: Record<AssetStatus, L.DivIcon>` is built once when `AssetMarkers.tsx` is imported. The render loop for up to 1,500 markers reads from this map rather than calling `L.divIcon()` per marker per render cycle.

**No optimistic updates**
The backend is in-memory. A server restart resets all state, making an optimistic cache inconsistent on reconnect. Standard `queryClient.invalidateQueries` on mutation success is appropriate here.

---

## Known Limitations

| Limitation | Source |
|---|---|
| No asset detail panel | Backend has no `GET /assets/:id` endpoint |
| No edit or delete on any resource | Backend exposes no PUT/PATCH/DELETE |
| All created data is lost on server restart | Backend stores data in-memory |
| Map asset status filter: one status at a time | Backend `?status=` accepts a single value |
| Zone overview shows total incidents per zone (not open-only) | Deliberate tradeoff — see above |
| Zone overview does not highlight the active zone after click | Not implemented |

---

## Submission Notes

This is a frontend-only submission. The backend server was not modified.

All four API resources are used across the full read + mutation lifecycle:
- Three `POST` mutations (create asset, report incident, register vehicle) with React Hook Form + Zod validation and toast feedback
- Detail views for incidents and vehicles via `GET /incidents/:id` and `GET /vehicles/:id`
- Parameterized `queryKey` arrays for all list queries — filter changes trigger server refetches automatically
- Zustand `filterStore` synchronizes filter state between the map and list pages

**Build status**: `pnpm build` ✅ · `pnpm lint` ✅ · `pnpm test` ✅ (46/46)
