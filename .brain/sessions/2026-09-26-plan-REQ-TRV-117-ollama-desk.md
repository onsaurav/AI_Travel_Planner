# Plan — Slice 18 add-on: Ollama + four desk steps

Covers REQ-TRV-117@v1 and REQ-TRV-118@v1. Same branch `feat/trv-tour-desk`.
Recorded as CHG-0006. This is the followable desk, not another essay.

## Desk job (do this)

```
1. Trip        New Trip — name, Destination, dates
2. Itinerary   Generate Plan  →  day-by-day itinerary (Draft becomes Planned)
3. Adjust      Chat beside the itinerary — ask, preview, Accept
4. Hand over   Print itinerary or Share
```

Admin still shows Draft vs Planned counts.

## Live Chat (Ollama)

```
1. Install Ollama and start it (listens on 127.0.0.1:11434)
2. ollama pull llama3.2
3. In .env: AI_PROVIDER=ollama, OLLAMA_BASE_URL=http://127.0.0.1:11434, AI_MODEL=llama3.2
4. Restart: npx tsx --env-file=.env src/server/main.ts
5. Open a Trip → Generate Plan → Chat
```

Without Ollama running, Generate Plan and Chat show the existing unavailable message.

**Not this change:** maps, weather, flights, hotels, booking, Consultant.

Keep region name **Chat**, buttons **Send**, **Generate Plan**, **Print itinerary**.

## Tests

- `@covers REQ-TRV-117@v1` — Ollama adapter posts `/api/chat`; streams; failures are AiUnavailableError; config needs model + base URL, no key
- `@covers REQ-TRV-118@v1` — unit step names and current step; e2e list named Desk job
