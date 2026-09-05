# POLY

**POLY — Agentic Workspace** is a chat-first web interface for an autonomous software agent powered by the Google Antigravity SDK.

## Architecture

- `frontend/` — Next.js chat interface
- `backend/` — FastAPI service running the Antigravity agent
- Browser → FastAPI → Antigravity Agent

## Local development

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_AGENT_URL` if the backend is not running at `http://localhost:8000`.

> Never expose agent credentials in the frontend. Configure Antigravity/Gemini authentication on the backend/runtime.
