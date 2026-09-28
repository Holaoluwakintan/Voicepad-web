# VoicePad Web — Landing Page & Preview Studio

The official web frontend for [VoicePad](https://voicepad.app) — an AI voice notes and transcription studio.

## 🚀 Overview

- **Web Preview Studio**: Live browser transcription with a 10-minute preview cap.
- **Conversion Funnel**: Direct Android APK download buttons for unlimited recording and offline usage.
- **Monetization**: Google AdSense slots integrated with responsive layout.
- **Auth & Cloud Sync**: Powered by Supabase for saved notes and history.

## 🛠️ Environment Variables

Copy `.env.example` to `.env` or set these in your **Vercel Project Settings**:

```env
# URL of the VoicePad transcription server (Render)
VITE_TRANSCRIPTION_API_URL=https://voicepad-transcription.onrender.com

# Direct link to the Android APK release
VITE_APK_DOWNLOAD_URL=https://github.com/Holaoluwakintan/voicepad/releases/latest/download/voicepad.apk

# Optional Supabase credentials for user sign-in and note sync
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional Google AdSense client and slot
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT=1234567890
```

## 📦 Development & Build

```bash
# Install dependencies
npm install

# Run locally in development mode
npm run dev

# Production build
npm run build
```

## 🌐 Deploy to Vercel

1. Import this repository into Vercel.
2. The root `vercel.json` will automatically configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
3. Add the environment variables above in your Vercel Dashboard.
