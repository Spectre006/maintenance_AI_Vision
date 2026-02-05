import base64
import json
import os
from typing import Optional

from dotenv import load_dotenv

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

MAX_FILE_SIZE = 8 * 1024 * 1024
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
load_dotenv()

MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1")

app = FastAPI(title="Maintenance Fault Identification")

default_origins = ["http://localhost:5173", "http://localhost:3000"]
env_origins = os.getenv("FRONTEND_ORIGINS", "")
legacy_origin = os.getenv("RAILWAY_FRONTEND_ORIGIN", "")

origin_list = []
for origin_value in [env_origins, legacy_origin]:
    if origin_value:
        origin_list.extend(
            [origin.strip() for origin in origin_value.split(",") if origin.strip()]
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_prompt() -> str:
    return (
        "You are a maintenance fault analyst. Review the image and produce a short "
        "service request summary. Respond ONLY with valid JSON using this schema: "
        "{\"summary\": string, \"confidence\": number between 0 and 1, "
        "\"parameters\": [string, ...]}. "
        "Keep the summary concise, factual, and specific about visible issues. "
        "If you are unsure, lower confidence and state the uncertainty."
    )


def extract_json(text: str) -> Optional[dict]:
    if not text:
        return None
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    if image.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type.")

    contents = await image.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Image exceeds 8 MB limit.")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing OPENAI_API_KEY.")

    encoded = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{image.content_type};base64,{encoded}"

    client = OpenAI(api_key=api_key)

    try:
        response = client.responses.create(
            model=MODEL,
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": build_prompt()},
                        {"type": "input_image", "image_url": data_url},
                    ],
                }
            ],
        )
        output_text = getattr(response, "output_text", "")
    except AttributeError:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": build_prompt()},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                }
            ],
        )
        output_text = response.choices[0].message.content or ""
    payload = extract_json(output_text)

    if not payload:
        payload = {
            "summary": output_text.strip() or "Unable to generate summary.",
            "confidence": None,
            "parameters": [],
        }

    return payload
