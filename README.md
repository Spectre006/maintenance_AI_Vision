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

Open `http://localhost:5173` in your browser.

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

## Notes
- Images must be JPG/PNG/WEBP and under 8 MB.
- The backend attempts `responses.create` first, then falls back to `chat.completions` if needed.
