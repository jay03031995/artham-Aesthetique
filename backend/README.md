# Artham Aesthetique Backend

FastAPI backend for appointment, callback, and newsletter endpoints.

## Render

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

Environment variables:

```env
SANITY_PROJECT_ID=3goot0bo
SANITY_DATASET=production
SANITY_TOKEN=<sanity-write-token>
CORS_ORIGINS=*
```

Check deployment:

```txt
/api/sanity/status
```
