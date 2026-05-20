# SwingMatch — Agent Portal & Dashboard

This file is the **single source of truth** for any AI agent (Gemini, Claude, Cursor, Codex, Copilot, or others) entering this repository. Read this file first to understand the workspace navigation and coordination protocols.

---

## 🎯 Project Identity & Tech Stack

**SwingMatch** is an AI-powered tennis coaching mobile app built with **Expo 52 (React Native)** and **TypeScript**. It uses **Google Gemini** as the agentic brain for swing biomechanics analysis, drill recommendations, and coaching assistant tasks.

* **Platform:** iOS + Android (Expo / React Native)
* **AI Engine:** Google Gemini (`@google/generative-ai`)
* **Navigation:** Expo Router v4 (file-based tab navigation)
* **Auth:** Google OAuth via `expo-auth-session`
* **Storage:** SQLite via `expo-sqlite`
* **Bundle ID:** `com.artcenter.swingmatch`
* **Target Audience:** Strictly tennis coaching, swing analysis, and training drills.

---

## 🧭 Workspace Navigation Map

To avoid duplicate or stale documentation, we maintain a modular set of guides. Follow these links for specific technical rules:

* **🚀 [Onboarding & Architecture Guide](file:///d:/My_Projects/SwingMatch/docs/AGENT_ONBOARDING.md)**: Deep dive into the agentic loop, file ownership table, feature flags, DB setup, and common anti-patterns.
* **🎨 [Design System Spec](file:///d:/My_Projects/SwingMatch/design/DESIGN.md)**: Instagram-style dark mode theme rules (Background `#111111`, Accent Lime `#84CC16`, Inter font, border elevations, and motion transitions).
* **🛠️ [Adding Gemini Tools](file:///d:/My_Projects/SwingMatch/docs/ADD_A_TOOL.md)**: Step-by-step tutorial on registering new native tools into the agent capability pool.
* **⚙️ [Project Customization Guide](file:///d:/My_Projects/SwingMatch/docs/CUSTOMISE.md)**: Checklist for initializing brand configurations and configuring dev environments.

---

## 🤝 Workspace Logging & Handoff Protocol

We enforce an isolated **planning-with-files** and **diary** pattern to track work without cluttering git history. All active developer logs and session files live inside the git-ignored `.agent/` directory:

### Active Planning & Tracking Files
1. **[Active Task Plan](file:///d:/My_Projects/SwingMatch/.agent/plans/task_plan.md)**: The current phase-by-phase todo list and task statuses (`todo`, `in_progress`, `complete`).
2. **[Active Research/Findings](file:///d:/My_Projects/SwingMatch/.agent/plans/findings.md)**: The document capturing API responses, database layout tests, and general research.
3. **[Chronological Session Logs](file:///d:/My_Projects/SwingMatch/.agent/logs/session_log.md)**: High-level log history summarizing modifications, commits, and recommendations for incoming agents.

### Handoff Rules (CRITICAL)
Before completing your session, you **must**:
1. Update `task_plan.md` to reflect all completed and pending tasks.
2. Log any major research discoveries in `findings.md`.
3. Append a summary of all code modifications, achievements, and future recommendations to `session_log.md`.
4. Commit or stash all changes — **never leave uncommitted breaking changes in the workspace.**

---

## 💻 Essential Commands Reference

* Start Dev Server: `npx expo start`
* Run Type Checker: `npm run type-check` (runs `tsc --noEmit` validation)
* Run Linter: `npm run lint`
