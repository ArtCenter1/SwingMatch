# SwingMatch Agent Onboarding Guide

Welcome! This guide is written specifically for AI agents (Gemini, Claude, Cursor, Copilot, etc.) and developers working on the **SwingMatch** codebase. 

Please read this onboarding guide carefully before modifying any code. It captures the core architectural paradigms, development guidelines, file layouts, and key patterns of the project.

---

## 🏗️ Architecture Overview

SwingMatch is built as a feature-flagged agentic application using **Expo 52 (React Native)** and **TypeScript**. 

### The Agentic Loop
The Gemini AI agent operates on a tool-calling loop where it can dynamically discover and invoke local native tools:

```
User Message
     ↓
useAgent Hook (src/hooks/useAgent.ts)
     ↓
agentService.sendMessage() (src/services/agent.service.ts)
     ↓
Gemini API 🌟 ←→ Tool Call Registry (src/tools/tool.registry.ts)
     ↓
AgentChat Component (src/components/chat/AgentChat.tsx)
     ↓
User UI (Renders messages + tool run animations)
```

---

## 🎨 Design System

Before writing any UI code, consult the full design specification at [DESIGN.md](file:///d:/My_Projects/SwingMatch/design/DESIGN.md).

### Core UI Rules
* **Theme:** Dark grey (`#111111` background), content-first, Instagram-inspired layouts.
* **Accent:** Lime green `#84CC16` (tennis brand color). Use sparingly (max 2 elements per screen).
* **Typography:** Inter / `-apple-system`. Limit to maximum 3 typography sizes per screen.
* **Elevation:** Do not use box shadows. Elevate elements using clean border contrast.
* **Motion:** Opacity and transforms only. Standard transitions: 200ms enter, 140ms exit.
* **Design Tokens:** Always import tokens from [src/design/tokens.ts](file:///d:/My_Projects/SwingMatch/src/design/tokens.ts) when styling. Do not hardcode ad-hoc colors.

---

## 📂 Repository Structure

```
SwingMatch/
├── app/                        # Expo Router file-based screens
│   ├── _layout.tsx             # Root Layout: AuthProvider + AuthGuard
│   ├── auth/login.tsx          # Google Sign-in screen
│   └── (app)/                  # Protected screens (login required)
│       ├── _layout.tsx         # Bottom tab navigation layout
│       ├── index.tsx           # Chat / AI Coach (main workspace screen)
│       ├── camera.tsx          # Camera capture, swing recorder, and vision analysis
│       ├── library.tsx         # Saved swing analyses & drills library
│       └── settings.tsx        # App settings & credentials configuration
│
├── src/                        # Main Application Code
│   ├── config/
│   │   ├── features.ts         # Feature flags control (Google Auth, Gemini, SQLite, etc.)
│   │   └── env.ts              # Typed system environment variables validation
│   ├── services/
│   │   ├── agent.service.ts    # Gemini agent core interface + tool calling execution loop
│   │   ├── auth.service.ts     # Google OAuth handler + SecureStore persistence
│   │   ├── camera.service.ts   # Device recording, thumbnail generation, & photo helpers
│   │   └── api-key.service.ts  # secure hardware-backed key manager (expo-secure-store)
│   ├── tools/
│   │   └── tool.registry.ts    # All local native tools declared for Gemini
│   ├── hooks/
│   │   └── useAgent.ts         # React hook: manages message queue and vision states
│   ├── lib/
│   │   └── auth.context.tsx    # User auth React Context
│   ├── db/
│   │   └── db.service.ts       # SQLite client schema definitions & queries
│   ├── components/
│   │   ├── chat/AgentChat.tsx  # Chat bubbles and activity indicator overlay components
│   │   └── shared/
│   │       ├── AuthGuard.tsx   # Screen route interceptor
│   │       └── ApiKeySetup.tsx # Secure onboarding BYOK prompt
│   └── design/
│       ├── tokens.ts           # Shared UI styling variables
│       └── index.ts            # Design module exporter
│
├── design/
│   └── DESIGN.md               # Canonical brand color and layout specifications
│
├── docs/
│   ├── AGENT_ONBOARDING.md     # ← This file
│   ├── ADD_A_TOOL.md           # Visual guide to adding Gemini tools
│   └── CUSTOMISE.md            # Initialization customization checklist
│
└── .agent/                     # Git-ignored developer/agent workspace files
```

---

## ⚡ File Ownership Rules

To prevent regressions and maintain stability, respect this file access hierarchy:

| Directory/File Path | Modification Rule |
| :--- | :--- |
| `src/config/features.ts` | Edit freely to toggle system features. |
| `src/config/env.ts` | Modify only when adding new environment variable validations. |
| `src/tools/tool.registry.ts` | Edit freely when adding, modifying, or removing tools. |
| `app/(app)/index.tsx` | Modify system prompting, assistant parameters, and UI features. |
| `app/(app)/camera.tsx` | Modify image capture mechanics and vision prompting. |
| `app/auth/login.tsx` | Modify text content and splash branding. |
| `src/services/*.ts` | Modify only when adding core service capabilities (e.g., SQLite hooks). |
| `src/components/**` | Edit layout styles freely; avoid changing functional prop definitions. |
| `src/hooks/useAgent.ts` | stable core – **do not edit** unless fixing a hook API bug. |
| `src/lib/auth.context.tsx` | stable core – **do not edit**. |
| `src/db/db.service.ts` | Create tables within `createTables()` only; add queries below. |

---

## 🛠️ Key Coding Patterns

### 1. Feature Flags (`src/config/features.ts`)
Always wrap optional paths or tools in feature flag conditions to allow offline testing and runtime configuration:
```typescript
import { FEATURES } from '../config/features';

if (FEATURES.tools.saveToLibrary) {
  // execute tool registry hooks
}
```

### 2. Adding a Gemini Tool
All tools are defined in `src/tools/tool.registry.ts`. Follow this pattern (see [docs/ADD_A_TOOL.md](file:///d:/My_Projects/SwingMatch/docs/ADD_A_TOOL.md) for full details):
1. **Flag:** Add the tool to features object in `features.ts`.
2. **Handler:** Write an async handler returning a `Promise<string>` (always return a JSON string, catch errors internally).
3. **Declaration:** Define the schema declaration using `SchemaType` properties.
4. **Register:** Add the declaration and handler inside `buildToolRegistry()` matching the feature check.

### 3. Screen Setup (Expo Router)
Adding a screen in `app/(app)/[name].tsx` registers it in the Router automatically. Custom hooks can bind the agent context:
```tsx
import { useAgent } from '../../src/hooks/useAgent';

export default function CustomScreen() {
  const agent = useAgent({ config: { systemPrompt: '...' } });
  // build dark grey layout
}
```

### 4. Database Setup (SQLite)
Add initialization scripts inside `createTables()` in `src/db/db.service.ts`:
```typescript
await this.db.execAsync(`
  CREATE TABLE IF NOT EXISTS swing_data (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    stroke     TEXT NOT NULL,
    score      INTEGER NOT NULL
  );
`);
```

### 5. Environment Variables
Copy variables into `.env` following `.env.example`. Access variables only via `ENV` properties from `src/config/env.ts` (which validates schemas on startup) — **never read `process.env` directly in components.**

---

## 🚨 Common Mistakes & Anti-Patterns to Avoid

* ❌ **Hardcoded API Keys:** Never fall back to a hardcoded developer API key. SwingMatch runs on a Bring-Your-Own-Key (BYOK) model. Users must verify their own key via `ApiKeySetup` stored securely in SecureStore.
* ❌ **Box Shadows:** Do not add shadows for element depth. Use contrasting borders as specified by [DESIGN.md](file:///d:/My_Projects/SwingMatch/design/DESIGN.md).
* ❌ **Component State Pollution:** Keep screen component logic separated. Put reusable UI in `src/components/` and agent configurations in page screens.
* ❌ **Unhandled Tool Errors:** Tool handlers must never throw exceptions. Catch all errors and return a JSON string: `JSON.stringify({ error: 'Failed to execute query' })`.

---

## 💻 Commands & Development Checklist

```bash
npm install            # Install app dependencies
npx expo start         # Boot dev server (opens QR code)
npx expo start --ios   # Launch simulator on macOS
npx expo start --android # Launch emulator on Windows/macOS
npm run type-check     # Run TypeScript type safety validations (tsc --noEmit)
npm run lint           # Run linter configurations
```

### Git Commits & Branch Naming
* **Branches:** Use prefixes like `feat/`, `fix/`, `design/`, or `docs/`.
* **Commits:** Follow conventional formatting `type(scope): description` (e.g., `feat(auth): enable Google sign-in pkce redirection`).
