# FB-0003 — Recovery plan not followable; use Ollama

- **Received:** 2026-09-26
- **From:** Kartik Chandra Biswas (delivery)
- **Channel:** development session
- **About:** Desk flow, product design, live Chat
- **Disposition:** raised as CHG-0006

## What they said

The last recovery was another unusable plan. Make it followable and
proper. Change the design and the business flow. Use Ollama for chat.

## What we think it means

1. **Followable.** A desk person must see four named steps and do them
   in order: Trip → Itinerary → Adjust → Hand over.
2. **Live Chat.** The running app talks to local Ollama, not a missing
   Anthropic key. Same Chat box, same Generate Plan button.
3. **Still out.** Maps, weather, flights, hotels, booking, Consultant
   (REQ-TRV-079, 082–090).

## What was done

CHG-0006. REQ-TRV-117 and REQ-TRV-118. Added to slice 18 `feat/trv-tour-desk`.
