# TEX AI Procurement Copilot

TEX AI is the procurement-assistance layer of TEXVERSE. The current implementation is intentionally production-safe without requiring an external LLM API key: it ranks the live marketplace catalog from the FastAPI database using the buyer's fabric, quantity, budget, MOQ and supplier requirements.

## Supported intents

- Natural-language fabric search
- Supplier ranking and comparison
- Budget-aware matching
- MOQ and stock checks
- Material-value calculations
- RFQ draft generation
- Session context passed from the frontend
- Graceful offline state when the API is unavailable

## Endpoint

`POST /ai/procure`

Request:

```json
{
  "message": "5,000m cotton under ₹500/m with MOQ below 1,000m",
  "history": []
}
```

The response contains `intent`, `title`, `message`, procurement `details`, ranked `products`, suggested `actions`, and a commercial disclaimer.

## Next production layer

For a fully generative copilot, an LLM provider can be added behind the same `/ai/procure` contract. The marketplace ranking should remain server-side so supplier/product facts are grounded in TEXVERSE database records.
