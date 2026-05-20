# SwingMatch Development Commands & Conventions

This file provides a quick reference for development commands and conventions used in this project. For the full Agent Portal and design systems, see **[AGENTS.md](file:///d:/My_Projects/SwingMatch/AGENTS.md)** and **[docs/AGENT_ONBOARDING.md](file:///d:/My_Projects/SwingMatch/docs/AGENT_ONBOARDING.md)**.

---

## 💻 Essential Commands

* **Install dependencies:** `npm install`
* **Start developer server:** `npx expo start`
* **Start iOS Simulator:** `npx expo start --ios`
* **Start Android Emulator:** `npx expo start --android`
* **Run TypeScript type checks:** `npm run type-check` (runs `tsc --noEmit` validation)
* **Run Linter:** `npm run lint`

---

## 🛠️ Code Conventions & Style

* **Language Target:** TypeScript (Strict mode enabled, ESNext target).
* **Styling Rules:** Vanilla CSS design tokens from [src/design/tokens.ts](file:///d:/My_Projects/SwingMatch/src/design/tokens.ts). Under no circumstances should box shadows be used (use border contrasts for elevations). Accent colors are limited to Lime Green `#84CC16` (tennis branding).
* **State & Env Vars:** Access configurations only via the dynamic `ENV` client in [src/config/env.ts](file:///d:/My_Projects/SwingMatch/src/config/env.ts). Never reference raw `process.env` keys directly in layout components.
* **Agent Context:** Active task logs, errors, and progress session telemetry are written dynamically to the git-ignored `.agent/` folder:
  * Check active tasks in [task_plan.md](file:///d:/My_Projects/SwingMatch/.agent/plans/task_plan.md).
  * Read session summaries in [session_log.md](file:///d:/My_Projects/SwingMatch/.agent/logs/session_log.md).
* **Git Branching:** Prefix branches with `feat/`, `fix/`, `design/`, or `docs/`. Format commits as `type(scope): description`.
