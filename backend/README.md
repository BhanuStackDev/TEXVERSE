# TEXVERSE API

FastAPI backend for the TEXVERSE B2B textile marketplace.

## Local

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/docs`

For local development SQLite is used automatically. For production set `DATABASE_URL` to PostgreSQL and a strong `SECRET_KEY`.

## TEX AI

`POST /ai/procure` powers the procurement copilot. It uses the marketplace database to rank products by fabric category, budget, quantity, MOQ, stock and supplier verification. No external AI key is required for the current grounded procurement engine.
