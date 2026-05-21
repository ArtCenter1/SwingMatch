# 🎾 SwingMatch

> AI-powered tennis coaching — swing analysis, drill recommendations, and personalised training plans.

**SwingMatch** uses Google Gemini AI to analyse tennis swing biomechanics from video, recommend targeted drills, and help you track your progress — all on your phone.

---

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Expo](https://img.shields.io/badge/expo-52-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Bundle](https://img.shields.io/badge/bundle-com.artcenter.swingmatch-84CC16)

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Swing Analysis** | Record or upload a video — Gemini analyses grip, stance, swing path, and follow-through |
| **Drill Recommendations** | Automatically searches YouTube for drills tailored to fix identified errors |
| **Personal Library** | Save analyses, notes, and reference videos to your local SQLite database |
| **Agentic Coach** | Ask natural-language questions about technique, rules, or training plans |
| **Google Sign-In** | Optional OAuth with persistent encrypted sessions |
| **Camera & Gallery** | Record in-app or pick existing videos for analysis |

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

### 3. Configure features

Open **`src/config/features.ts`** to toggle features on/off.

### 4. Run on your phone

```bash
npx expo start
```

Scan the QR code with **Expo Go**. That's it.

---

## 🔑 API Keys

| Key | Required For | How to Get |
|---|---|---|
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Google Sign-In | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application) |
| `EXPO_PUBLIC_GEMINI_API_KEY` | All AI features | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `EXPO_PUBLIC_YOUTUBE_API_KEY` | YouTube drill search | [Google Cloud Console](https://console.cloud.google.com) → Enable YouTube Data API v3 → Credentials → Create API Key |

Add all keys to `.env` after copying from `.env.example`.

---

## 🗂️ Project Structure

```
swingmatch/
│
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout — AuthProvider + AuthGuard
│   ├── auth/
│   │   └── login.tsx             # Google Sign-In screen
│   └── (app)/                    # Protected screens (require login)
│       ├── _layout.tsx           # Bottom tab navigator
│       ├── index.tsx             # 💬 Chat screen (main interface)
│       ├── camera.tsx            # 📷 Camera + video recording
│       ├── library.tsx           # 📚 Saved analyses & drills
│       └── settings.tsx          # ⚙️ Settings + feature overview
│
├── src/
│   ├── config/
│   │   ├── features.ts           # Feature flags — START HERE
│   │   └── env.ts                # Typed, validated env vars
│   │
│   ├── services/
│   │   ├── agent.service.ts      # Gemini agent + agentic tool loop
│   │   ├── auth.service.ts       # Google OAuth + SecureStore + refresh
│   │   └── camera.service.ts     # Recording, photo, frame extraction
│   │
│   ├── tools/
│   │   └── tool.registry.ts      # All agent tools registered here
│   │
│   ├── hooks/
│   │   └── useAgent.ts           # React hook — messages, sendMessage, vision
│   │
│   ├── lib/
│   │   └── auth.context.tsx      # Auth React context + useAuth()
│   │
│   ├── db/
│   │   └── db.service.ts         # SQLite: library items, chat history, settings
│   │
│   └── components/
│       ├── chat/
│       │   └── AgentChat.tsx     # Chat bubble UI + tool activity + video cards
│       └── shared/
│           └── AuthGuard.tsx     # Route protection component
│
├── docs/
│   ├── AGENT_INSTRUCTIONS.md     # 🤖 AI agent onboarding guide
│   ├── ADD_A_TOOL.md             # How to add a new Gemini tool
│   └── CUSTOMISE.md              # Customisation guide
│
├── .env.example                  # Copy to .env and fill in keys
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎛️ Feature Flags

Every feature is controlled by **`src/config/features.ts`**:

```ts
export const FEATURES = {
  googleAuth: true,        // Google Sign-In
  persistentLogin: true,   // Survive app restarts
  tokenAutoRefresh: true,  // Auto-refresh OAuth tokens
  authGuard: true,         // Block screens without login

  gemini: true,            // Master switch for AI
  geminiToolCalling: true, // Agentic tool use
  geminiVision: true,      // Video / image analysis

  tools: {
    youtubeSearch: true,   // Find drills on YouTube
    webSearch: false,      // General web search
    saveToLibrary: true,   // Save to local DB
    getFromLibrary: true,  // Retrieve saved items
    getCurrentTime: true,  // Date/time context
  },

  camera: true,
  mediaLibrary: true,
  videoFrameExtraction: true,
  localDatabase: true,
  chatUI: true,
  showAgentActivity: true,
  bottomTabs: true,
  multiModelSwitch: false,
}
```

Set a flag to `false` and the feature is completely disabled — no code to delete, no imports to chase down.

---

## 🤖 Using the Coach AI

Drop the `useAgent` hook into any screen:

```tsx
import { useAgent } from '../src/hooks/useAgent';
import { AgentChat } from '../src/components/chat/AgentChat';

export default function ChatScreen() {
  const agent = useAgent({
    config: {
      systemPrompt: `You are an expert tennis coach.
        - Analyse swing videos for grip, stance, swing path, and follow-through.
        - Search YouTube for drills targeting specific errors.
        - Save analyses and drills to the user's library.
        - Be encouraging but technically precise.`,
      temperature: 0.7,
    },
  });

  return (
    <AgentChat
      {...agent}
      assistantName="Coach AI"
      placeholder="Ask about your technique..."
    />
  );
}
```

The agent automatically analyses videos, searches YouTube for drills, and saves results — no extra wiring needed.

---

## 🛠️ Architecture

- **AI Engine:** Google Gemini (`@google/generative-ai`) handles swing analysis, tool orchestration, and natural conversation.
- **Navigation:** Expo Router v4 with file-based routing and bottom tab navigation.
- **Storage:** SQLite via `expo-sqlite` for chat history, saved analyses, and user preferences.
- **Auth:** Google OAuth via `expo-auth-session` with encrypted token persistence via `expo-secure-store`.
- **Media:** `expo-image-picker` for camera and gallery access; `expo-file-system` for video frame extraction.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `expo` ~52 | Core SDK |
| `expo-router` ~4 | File-based navigation |
| `@google/generative-ai` | Gemini AI client |
| `expo-auth-session` | Google OAuth |
| `expo-secure-store` | Encrypted session storage |
| `expo-sqlite` | Local database |
| `expo-image-picker` | Camera + gallery |
| `expo-file-system` | Read files as base64 |
| `expo-web-browser` | OAuth browser session |
| `nanoid` | Unique IDs |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use in personal and commercial projects.

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev) — the AI engine powering swing analysis
- [Expo](https://expo.dev) — cross-platform React Native framework

---

<p align="center">Built for tennis players who want to improve, one swing at a time.</p>