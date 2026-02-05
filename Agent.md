# Agent Guide

## Project Overview
Maintenance Fault Identification web app. Users upload an image, click **Analyze**, and receive an AI-generated fault description in a text area (editable) plus confidence and optional parameters.

## Current MVP Goal
Build a simple end-to-end flow:
- Upload image
- Analyze with vision model (GPT-4 Vision or better)
- Return `summary` and `confidence`
- Display results in UI


## Working Agreements
- Keep the first version lean; avoid building data models (assets, locations, SRs) for now.
- Prefer clear, maintainable code over premature optimization.
- Add minimal guardrails: validation, error handling, logging.

## Expected Outputs
- Web UI with upload, preview, analyze, result text area, and confidence display.
- Backend API that accepts an image and returns structured analysis.
- Add .ds_store file in .gitignore

## Reference
- Plan: `Plans.md`

## Tech Stack and Versions
- Frontend: React 18 (Vite) + JavaScript
- Backend: Python 3.11 + FastAPI
- AI: OpenAI GPT-4 Vision or newer (image + text input)
- Storage: Local temp file handling for MVP (no persistent storage)
