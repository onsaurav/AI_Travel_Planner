# Plan — Slice 17 Business product

Covers REQ-TRV-106@v1 … 111@v1. All `agreed`. Branch `feat/trv-business-product`.
Gate: slices 1–16 Done before `/tdd`, unless you pass `--force` to plan only.

This is the product a travel desk uses. Not a restyle note. Tests carry `@covers`.

---

## What must be true

- **106** Your Trips is a workspace: heading, New Trip always visible, each Trip is a block (name, Destination, dates, status), empty state with New Trip.
- **107** A saved Plan is one region per Day; activities inside; recommendation notice above.
- **108** Admin home: each function is a named control; metrics on the same page.
- **109** Log in and Register show the words AI Travel Planner.
- **110** Print itinerary on a Trip with a Plan; print view has Day headings and Activity titles; no map.
- **111** Admin dashboard shows count of Draft Trips and Planned Trips.

---

## Approach

Keep APIs for 106–110 except **111**: add a small read on the admin metrics payload (or `GET /api/admin/metrics`) for `tripsByStatus.draft` and `tripsByStatus.planned`.

UI only plus that count:

| File | Change |
|---|---|
| `src/web/pages/TripsPage.tsx` | Toolbar + empty state |
| `src/web/components/TripTable.tsx` | Each Trip is a block; keep the name as a link. If you drop `<tr>`, update `e2e/trips.spec.ts` |
| `src/web/components/PlanDisplay.tsx` | Day = `section` / region with the existing day heading |
| `src/web/pages/admin/AdminDashboardPage.tsx` | Function tiles + Draft/Planned counts |
| `src/web/pages/LoginPage.tsx`, `RegisterPage.tsx` | Visible “AI Travel Planner” |
| `src/web/pages/TripPage.tsx` | Print itinerary (print CSS or `window.print` on a print region) |
| `src/web/styles.css` | Workspace, day cards, admin tiles |
| Admin metrics API + tests | 111 |

No maps. No booking. No Consultant.

---

## Test skeleton

- `@covers REQ-TRV-106@v1` — e2e: heading, New Trip, trip block fields, empty state
- `@covers REQ-TRV-107@v1` — e2e/unit: Day regions, notice
- `@covers REQ-TRV-108@v1` — e2e: each admin function control + metrics
- `@covers REQ-TRV-109@v1` — e2e: login and register show AI Travel Planner
- `@covers REQ-TRV-110@v1` — e2e: Print itinerary; print region has days and titles
- `@covers REQ-TRV-111@v1` — API + e2e: 1 Draft and 1 Planned shown

---

## Decisions this forces

None that need an ADR. Print is CSS + a button, not a calendar (REQ-TRV-085).

---

## Then

`/tdd REQ-TRV-106 REQ-TRV-107 REQ-TRV-108 REQ-TRV-109 REQ-TRV-110 REQ-TRV-111`

If an earlier slice is not Done, `/close-slice` those ids first, or say so.
