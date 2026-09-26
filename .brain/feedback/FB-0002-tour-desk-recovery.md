# FB-0002 — Chat dead, no desk job, product still unusable

- **Received:** 2026-09-26
- **From:** Kartik Chandra Biswas (delivery)
- **Channel:** development session
- **About:** AI chat, product design, business flow
- **Disposition:** raised as CHG-0005

## What they said

AI chat is not working. The design is ugly. The business flow is not
clear — what this is, and what to do next, is nothing. Recover it and
make it good for a tour-managing company.

## What we think it means

Three failures, not one:

1. **Chat.** The box exists only after a Plan is saved, at the bottom
   of a long page (after budget, share, feedback, versions). In the
   running app it needs `AI_PROVIDER=anthropic` plus `AI_API_KEY` and
   `AI_MODEL` in `.env`. Tests use a scripted AI. A desk that has no
   Plan, or no key, or never scrolls to Chat, correctly concludes it
   is broken.
2. **Flow.** Draft vs Planned is a badge. Nobody is told the job:
   create Trip → generate Plan → adjust in Chat → print or share.
3. **Look.** Screens still read as stacked homework, not a desk.

Still out: maps, weather, flights, hotels, booking, Consultant
(REQ-TRV-079, 082–090). A tour company uses this as an internal
itinerary desk, not a booking engine.

## What was done

CHG-0005. REQ-TRV-112 to 116. Slice 18 `feat/trv-tour-desk`.
