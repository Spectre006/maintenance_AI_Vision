# Maintenance Fault Identification

A lean MVP web app that accepts an industrial asset image, analyzes it with a vision-capable AI model, and returns an editable fault summary (SR Summary) with confidence and parameters.

## Features
- Image upload with preview
- One-click analysis
- AI-generated SR Summary (editable)
- Confidence score and tags

## Tech Stack
- Frontend: HTML/CSS/JavaScript
- Backend: Python 3.11 + FastAPI
- AI: OpenAI GPT‑4 Vision or newer

## Setup

### 1) Create and activate venv
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2) Install dependencies
```bash
pip install -r requirements.txt
```

### 3) Configure environment
Create `.env` in the repo root:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1
```

### 4) Run backend
```bash
uvicorn backend.main:app --reload --port 8000
```

### 5) Run frontend
```bash
cd frontend
python -m http.server 5173
```

Open `http://localhost:5173` in your browser if installed in local.
Open 'https://frontend-production-fde4.up.railway.app/' for installed in Railway.

## API
`POST /analyze`
- Request: `multipart/form-data` with `image` field
- Response:
```json
{
  "summary": "string",
  "confidence": 0.0,
  "parameters": ["string"]
}
```

## Integration
The backend is a standard HTTP API and can be called from any client (web, mobile, or server-to-server).

### Endpoint
`POST http://<server-host>:8000/analyze` 
`POST https://backend-production-008fd.up.railway.app/analyze`

### Parameters
- `image` (required): binary file via `multipart/form-data`. Allowed types: JPG/PNG/WEBP. Max size: 8 MB.

### Expected Output
```json
{
  "summary": "Short fault description based on visible evidence in the image.",
  "confidence": 0.0,
  "parameters": ["Optional tags or observed indicators"]
}
```

## Notes
- Images must be JPG/PNG/WEBP and under 8 MB.
