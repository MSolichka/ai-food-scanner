# AI Food Recognition

Web application for recognizing food from photos and text descriptions. Powered by Google Gemini — estimates macronutrients, lists ingredients, and generates personalized meal insights.

## Features

- Upload a food photo (drag & drop, click, or paste from clipboard)
- Describe your meal in text, or combine photo + text
- Get macronutrient breakdown (calories, protein, carbs, fat)
- Auto language detection — responds in Ukrainian if the text contains Cyrillic letters, otherwise in English (photo only → Ukrainian)

> **v1 note:** the API also returns an ingredient list with individual macros and meal insights (reinforcement + suggestion), but the UI hides them, as well as the EN/UK language switcher. To show them, search for `hidden in v1` in `frontend/src/App.tsx` and `frontend/src/components/MealResult.tsx` and uncomment the blocks.

## Tech stack

- **Backend** — Python, FastAPI, PydanticAI, Google Gemini
- **Frontend** — React, TypeScript, Vite, Mantine UI, Framer Motion

## Origin of the code

This project is based on an earlier project, the repository `ai-food-recognition`
(<https://github.com/Victoria1807/ai-food-recognition>), whose commit history lists
Ostap Pankevych as the author. The backend was refactored for this thesis project:
modules were split, classes, functions and variables were renamed, and the system
prompt was reworded. The public API (`POST /estimate-macros`) and the overall logic
are the same as in the original. Responses of the reworded prompt differ slightly
from the original in some numeric values.

The instructions below are for macOS and Linux.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Git | any | [git-scm.com](https://git-scm.com/) |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Node.js | **20.19+** or **22.12+** (npm is bundled) | [nodejs.org](https://nodejs.org/) |

You do **not** need to install Python yourself: `uv sync` downloads Python 3.13 automatically (version is pinned in `.python-version`).

After installing uv, **restart the terminal**, then check:

```bash
git --version
uv --version
node --version   # must print v20.19+ or v22.12+; older Node breaks the frontend
```

You also need a Google Gemini API key: [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## Get the code

```bash
git clone <repo-url>
cd ai-food-recognition
```

Run all backend commands below from this folder (the project root).

---

## Backend

### 1. Install dependencies

```bash
uv sync
```

This downloads Python 3.13 if needed, creates the `.venv` virtual environment, and installs all dependencies. You don't need to activate `.venv` — `uv run` does it for you.

### 2. Configure environment

Copy the example file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:

```env
GOOGLE_API_KEY=your-google-api-key-here
GOOGLE_MODEL_NAME=gemini-3.1-flash-lite
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | yes | Gemini API key. Without it the backend crashes on start. |
| `GOOGLE_MODEL_NAME` | no | Gemini model, default `gemini-3.1-flash-lite`. [List of models](https://ai.google.dev/gemini-api/docs/models) |

Rules:
- `.env` must be in the project root, next to `pyproject.toml`.
- No quotes and no spaces around `=`.
- Never commit `.env` (it is already in `.gitignore`).
- Changes in `.env` are applied only after the backend is restarted.

### 3. Run

```bash
uv run uvicorn app.main:app --reload
```

Start it from the project root, otherwise `.env` is not found. When it works, the terminal shows:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Backend runs at **http://localhost:8000**

Interactive API docs (you can send requests right from the browser, via **Try it out**): **http://localhost:8000/docs**

### 4. Check that it works

```bash
curl -X POST http://localhost:8000/estimate-macros \
  -H "Content-Type: application/json" \
  -d '{"content": [{"text": "grilled chicken breast with steamed broccoli"}]}'
```

This makes a real request to Gemini, so it takes a few seconds and uses your API quota.

---

## API

`POST /estimate-macros`

**Request** — `content` is a list of one or more items of these types:

| Item | Example |
|------|---------|
| Text | `{"text": "two eggs and toast"}` |
| Image by URL | `{"image_url": "https://example.com/dish.jpg"}` |
| Image as base64 | `{"image_base64": "<base64>", "media_type": "image/jpeg"}` (`media_type`: `image/jpeg` or `image/webp`) |

**Response `200`** (values below are illustrative):

```json
{
  "title": "Grilled chicken with broccoli",
  "description": "…",
  "estimated_grams": 350,
  "macros_in_grams": { "carbs": 12, "proteins": 45, "fats": 10 },
  "ingredients": [
    { "name": "Chicken breast", "protein_g": 40, "carbs_g": 0, "fat_g": 6, "weight_g": 200 }
  ],
  "meal_insights": [
    { "type": "reinforcement", "body": "…" },
    { "type": "suggestion", "body": "…" }
  ]
}
```

**Errors:** `422` — no food detected in the input; `500` — backend or Gemini error (invalid key, quota exceeded, no internet) — details are in the backend terminal.

---

## Frontend

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Run

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**. If this port is busy, Vite picks the next free one — check the address in the terminal.

> The frontend proxies all `/api/*` requests to the backend at `localhost:8000` (see `frontend/vite.config.ts`), so both must be running simultaneously. The backend has no CORS configuration, so the frontend works only through this proxy; for deployment you need a reverse proxy that does the same.

Other commands (run in `frontend/`):

| Command | What it does |
|---------|--------------|
| `npm run build` | Type-check and build the production bundle into `frontend/dist/` |
| `npm run lint` | Run ESLint |

---

## Running both together

Open two terminal windows:

**Terminal 1 — backend** (project root):
```bash
uv run uvicorn app.main:app --reload
```

**Terminal 2 — frontend:**
```bash
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser. Stop either server with `Ctrl+C`.

---

## Troubleshooting

| Problem | Cause and fix |
|---------|---------------|
| `uv: command not found` | Restart the terminal. If it still fails, add the folder printed by the uv installer to `PATH`. |
| `ValidationError ... GOOGLE_API_KEY Field required` | `.env` is missing, has no `GOOGLE_API_KEY`, or the backend was started not from the project root. |
| `Address already in use` (port 8000) | Another process uses the port. Stop it (`lsof -i :8000` shows which), or run the backend with `--port 8001` and change `target` in `frontend/vite.config.ts` to the same port. |
| Vite complains about the Node.js version | Install Node.js 20.19+ or 22.12+. |
| `.env` changed but nothing happened | Restart the backend. |
| Frontend shows "Request failed" | Backend is not running, or Gemini failed (invalid key, quota, no internet). Check the backend terminal. |
| Frontend shows "No food detected" | The model found no food in the photo or text. Try another photo or a clearer description. |

---

## Project structure

```
ai-food-recognition/
├── app/
│   ├── main.py          # FastAPI app and endpoint
│   ├── agent.py         # Gemini client (GeminiClient) built on PydanticAI
│   ├── meal_service.py  # Language choice and response assembly
│   ├── model_output.py  # Structure the language model must return
│   ├── prompt.py        # System prompt sections and build_system_prompt()
│   ├── schemas.py       # Request/response models
│   └── settings.py      # Configuration via environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageDropzone.tsx   # Photo upload with preview
│   │   │   ├── MealTextInput.tsx   # Text description input
│   │   │   └── MealResult.tsx      # Result display
│   │   ├── App.tsx               # Main page
│   │   ├── api.ts                # Backend API client
│   │   ├── LanguageContext.tsx   # Current UI language
│   │   ├── translations.ts       # UI texts (EN/UK)
│   │   ├── index.css             # Global styles
│   │   └── main.tsx              # Mantine theme setup
│   ├── vite.config.ts   # Vite config and /api proxy
│   └── package.json
├── .env.example         # Template for .env
├── .python-version      # Python version used by uv
├── pyproject.toml       # Backend dependencies
├── uv.lock              # Locked backend dependency versions
└── README.md
```
