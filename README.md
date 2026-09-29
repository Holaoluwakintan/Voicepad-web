# 🎙️ VoicePad Web

VoicePad Web is a modern, standalone web application for recording voice notes, converting speech to text with AI, generating smart summaries & action items, and syncing notes to the cloud.

---

## ⚡ Quick Start

### 1. Install Dependencies
Run from the repository root:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```
*(Or simply run `npm run install:all`)*

### 2. Configure Environment (`.env`)
The `.env` file at the root contains the API keys and configurations:
- **Groq API Keys**: `GROQ_API_KEY`, `GROQ_API_KEY_1` (for Whisper transcription & LLM summaries)
- **Deepgram API Keys**: `DEEPGRAM_API_KEY`, `DEEPGRAM_API_KEY_1` (automatic cascading fallback for audio transcription)
- **Supabase Keys**: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (for user sign-in & private note history)
- **Metrics Token**: `METRICS_TOKEN` (secures Prometheus metrics at `/metrics?token=...`)

### 3. Run Locally
To run both backend server (port `8787`) and frontend Vite client (port `5173`) concurrently:
```bash
npm run dev
```

Or run individually:
- **Server only**: `npm run dev:server` (or `cd server && npm start`)
- **Client only**: `npm run dev:client` (or `cd client && npm run dev`)

Visit the web app in your browser: [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Architecture & Features

### 1. Frontend (`/client`)
- Built with **React 19**, **Vite 6**, and **TypeScript**.
- **Decomposed Architecture**: Monolithic `Home.tsx` broken down into modular components:
  - `components/Navbar.tsx`
  - `components/HeroSection.tsx`
  - `components/studio/StudioWorkspace.tsx`
  - `components/studio/RecordCard.tsx`
  - `components/studio/TranscriptResult.tsx`
  - `components/studio/AISummary.tsx`
  - `components/studio/NoteHistory.tsx`
  - `components/sections/` (`HowItWorks`, `Features`, `UseCases`, `Pricing`, `FAQ`, `Footer`)
- **Client-Side Routing**: Powered by `wouter` with dedicated pages for `/` (Home), `/privacy` (Privacy Policy), `/terms` (Terms of Service), and a fallback 404 page.
- **Error Boundary**: Catches runtime errors gracefully to prevent white-screen crashes.

### 2. Backend Server (`/server`)
- Built with **Express 5** and **Node.js (ESM)**.
- **Multi-Key Fallback Pooling**:
  - Automatically iterates through configured Groq API keys and models (`whisper-large-v3-turbo` → `whisper-large-v3`).
  - If Groq keys are exhausted or rate-limited, immediately cascades to Deepgram Nova-2 (`DEEPGRAM_API_KEY` pool).
  - Summarization cascades from Groq LLMs (`gpt-oss-120b`, `llama-3.3-70b-versatile`, etc.) to Google Gemini.
- **Enterprise Reliability**:
  - Prometheus metrics enabled with token authentication (`/metrics?token=...`).
  - IP and User-level rate limiting with automated memory garbage collection.
  - Idempotency middleware preventing duplicate transcriptions.
  - Pino structured JSON logging.
  - Safe Gemini API key handling via `x-goog-api-key` headers (no keys exposed in URLs).

---

## 🚀 Production Deployment

### Client (e.g. Vercel)
Build the production bundle:
```bash
cd client
npm run build
```
Deploy the resulting `client/dist` directory. Set `VITE_TRANSCRIPTION_API_URL` to your production server URL.

### Server (e.g. Render / Railway)
Set the root directory to `server` with start command `npm start`. Configure your environment variables in the host dashboard.
