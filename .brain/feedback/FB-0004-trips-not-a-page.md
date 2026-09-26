# FB-0004 — Your Trips is not a page

- **Received:** 2026-09-26
- **From:** Kartik Chandra Biswas (delivery)
- **Channel:** development session
- **About:** Your Trips screen, SDLC trace
- **Disposition:** raised as CHG-0007

## What they said

The screen is ugly. A plan for tests that the application will follow,
recorded SDLC-wise, so there is a trace. Not another restyle with no id.

## What we think it means

1. **Your Trips** must be a desk list: the Trip table is the page.
   Search stays, as a toolbar with a Filters group.
2. Each row names the next job (Generate Plan or Adjust).
3. The plan is the tests (`@covers REQ-TRV-119@v1`, `@covers REQ-TRV-120@v1`).

Still out: maps, weather, flights, hotels, booking, Consultant.

## What was done

CHG-0007. REQ-TRV-119 and REQ-TRV-120. Added to slice 18 `feat/trv-tour-desk`.
