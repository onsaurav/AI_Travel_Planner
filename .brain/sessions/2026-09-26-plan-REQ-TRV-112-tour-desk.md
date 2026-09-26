# Plan — Slice 18 Tour desk

Covers REQ-TRV-112@v1 … 116@v1. Branch `feat/trv-tour-desk`.
This is the recovery plan. It is also in slices.yaml and CHG-0005.

## Diagnosis (why it feels dead)

| Symptom | Actual cause |
|---|---|
| Chat not working | Box only appears **after Generate Plan**. It is last on the page (after budget, share, feedback, versions). Live app needs `AI_API_KEY` + `AI_MODEL` in `.env`. Tests use a scripted AI (`NODE_ENV=test`). |
| Ugly | Controls stacked with no job frame. Admin was a raw list (slice 17 started the console). |
| What do I do? | Draft vs Planned is a badge only. No next action. |

**Not this slice:** maps, weather, flights, hotels, booking, Consultant.

**Operations (you, not a REQ):** in `.env` set `AI_PROVIDER=anthropic`, `AI_API_KEY`, `AI_MODEL`, and the two cost fields. Restart the server. Without a key, Generate Plan and Chat return “The AI planner is unavailable…”.

## Desk job (what a tour company does here)

```
1. New Trip          → Draft
2. Generate Plan     → Planned (day-by-day itinerary)
3. Chat              → ask / preview a change / Accept
4. Print or Share    → hand to the Traveler
Admin sees Draft vs Planned counts.
```

## What we build

1. **112** Trip page shows one next-job sentence (Draft: generate Plan; Planned: adjust or print).
2. **113 / 116** Chat moves up to sit under the itinerary. Print stays on the Plan toolbar. Share/feedback/versions stay below.
3. **114** Empty Chat explains: question or change; change is previewed first.
4. **115** Draft: Generate Plan visible, no Chat (already true; keep it and make the button the desk action).

Keep region accessible name **Chat**, button **Send**, **Generate Plan**, **Print itinerary**.

## Tests

- `@covers REQ-TRV-112@v1` — unit + e2e next-job text
- `@covers REQ-TRV-113@v1` — e2e Chat visible on Planned Trip
- `@covers REQ-TRV-114@v1` — e2e empty Chat helper text
- `@covers REQ-TRV-115@v1` — e2e Draft has Generate Plan, no Chat
- `@covers REQ-TRV-116@v1` — e2e Print + Chat both visible

Then `/close-slice` those ids.
