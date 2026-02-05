# Maintenance Fault Identification Web App Plan (MVP)

## Scope (MVP)
Single-page web app that lets a user upload an image, click **Analyze**, and receive an AI-generated fault description in a text area (editable), plus a confidence value and optional key parameters.

## Plan
1. Define core UX: single-page flow with image upload, preview, **Analyze** button, loading state, and result panel with SR Summary + confidence.
2. Choose stack + architecture: lightweight frontend + minimal backend API that accepts image, calls GPT‑4 Vision (or newer), and returns structured output.
3. Implement frontend: upload component, preview, analyze action, result textarea (editable), and confidence display.
4. Implement backend: image validation, size limits, secure file handling, call to vision model, parse response into `summary` + `confidence`.
5. Add guardrails: input validation, error states, retries, and basic logging.
6. Quick QA: test with sample industrial images, tune prompt for consistent fault descriptions and reliable confidence.

## Deliverable
A working MVP where users can upload an image and receive a structured fault summary and confidence from a vision-capable AI model.

# Maintenance Fault Identification Flutter App Plan (Android)

## Summary
Build a new Flutter Android app under `flutter_app` that lets users pick or capture an image, upload it to the existing FastAPI `/analyze` endpoint, and display the returned defect summary, confidence, and parameters (tags). The UI mirrors the current web flow: image preview, analyze button, loading/error states.

## Scope
- New Flutter app only. Backend remains unchanged.
- Android only target (no iOS/web build steps).
- Uses hosted backend by default.

## App Structure and Flow
1. Home screen
   - Header + short instruction text.
   - Image preview area.
   - Two buttons: `Pick from Gallery`, `Take Photo`.
   - `Analyze` button disabled until an image is selected.
   - Result area showing:
     - Summary string
     - Confidence (formatted percent, or "N/A" if null)
     - Parameters list as chips or comma-separated text
2. Networking
   - Multipart `POST` to `/analyze`
   - Field name `image`
   - Content type based on file extension
3. UX/State
   - Loading spinner during upload/analyze
   - Error banner/inline message on failure
   - Clear result when selecting a new image

## Key Files to Add
- `flutter_app/pubspec.yaml` with dependencies
- `flutter_app/lib/main.dart` (single-screen app for simplicity)
- `flutter_app/lib/api_client.dart` (optional helper to keep networking separate)
- `flutter_app/android/app/src/main/AndroidManifest.xml` permissions

## Dependencies
- `image_picker` for camera/gallery
- `http` for multipart upload
- `mime` or simple file extension mapping (if needed) to set content type

## Backend Integration
- Default base URL: `https://backend-production-008fd.up.railway.app`
- Endpoint: `/analyze`
- Response JSON:
  - `summary: String`
  - `confidence: double | null`
  - `parameters: List<String>`

## Permissions (Android)
- Camera access for capturing photos
- Read media/images permission for gallery
- If supporting Android 13+:
  - `READ_MEDIA_IMAGES`
- For older versions:
  - `READ_EXTERNAL_STORAGE` (if needed)

## Validation Rules
- If possible, check file size client-side (limit 8 MB)
- Accept jpg/png/webp; display friendly error if unknown format

## Error Handling
- Network failure -> "Unable to reach server"
- 4xx/5xx -> show backend error message
- JSON parsing failure -> show raw response in fallback error

## Important Changes to Public APIs/Interfaces/Types
- No backend changes.
- Flutter app exposes no public API.
- New Dart model for response:
  - `DefectResult { summary, confidence, parameters }`

## Test Cases and Scenarios
1. Pick image from gallery -> Analyze -> show summary/confidence/tags
2. Take photo -> Analyze -> show summary/confidence/tags
3. No image selected -> Analyze disabled
4. Backend unavailable -> error displayed
5. Unsupported image type -> error displayed
6. Large file (>8 MB) -> error displayed client-side or backend error shown
7. Response with `confidence: null` -> UI shows "N/A"

## Assumptions and Defaults
- App lives at `flutter_app/`
- Backend default URL is the Railway production URL
- Android only build target
- No offline mode or caching
- Simple single-screen app, no navigation
