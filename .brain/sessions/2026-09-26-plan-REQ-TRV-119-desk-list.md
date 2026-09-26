# Plan — Slice 18 add-on: desk list

Covers REQ-TRV-119@v1 and REQ-TRV-120@v1. Branch `feat/trv-tour-desk`.
CHG-0007. These tests are the plan. The application follows them.

## Tests the application must satisfy

- `@covers REQ-TRV-119@v1`
  - Search region named **Search and filter Trips**
  - Field **Search Trips**
  - Group named **Filters** with Country, Destination, Travel style, Currency, Minimum budget, Maximum budget, Minimum Days, Maximum Days
  - Trip **table** and **New Trip** on Your Trips when a Trip exists
- `@covers REQ-TRV-120@v1`
  - Draft row names **Generate Plan**
  - Planned row names **Adjust**

Keep: **Your Trips**, **New Trip**, **Clear filters**, table rows, existing search e2e.

Not this change: maps, weather, flights, hotels, booking, Consultant.
