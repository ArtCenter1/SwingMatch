## 🏗️ System Overview

SwingMatch is a mobile-first platform combining AI video analysis and community-driven match play for amateur tennis players. The core architecture supports real-time coaching feedback, player matchmaking, and video-centric social interaction.

The system is structured around **three major feature domains**:

### 1. AI-Powered Video Analysis & Simulation

- Mobile video capture with AR-based framing  
- Pose tracking and biomechanical analysis (GPU backend)  
- Simulation rendering pipeline with likeness control using **ComfyUI**  
- Pro stroke comparison tools: side-by-side, overlay, ghost mode  

### 2. User Engagement & Community Features

- Social feed for sharing results, drills, and match highlights  
- Geo-located matchmaking with skill-level filters  
- Progress tracking with tags, milestones, and gamification (badges, streaks)  
- **In-app chat** using a simplified messaging layer (e.g., Firebase, Stream)

### 3. Core Platform Services

- Scalable backend APIs (Auth, Upload, Match, Feed)  
- Event-based video ingestion and AI job routing  
- Admin tooling, moderation, feature toggles (via **n8n**)  
- Privacy-first architecture with encrypted content and user visibility controls

**Deployment Highlights**  
- Monorepo codebase with CI/CD  
- GPU autoscaling for AI jobs  
- Modular, low-latency infrastructure with privacy by design

---

## 🧽 Frontend Architecture

Built with **React Native** and tested via **Expo Go**, SwingMatch’s mobile client balances high-performance video workflows with social and analytical features.

### Navigation & Layout

- Bottom Tab Bar: Home | Library | Record | **AI Lab** | Match  
- **Record Tab** becomes a Floating Action Button (FAB) during capture process  
- Navigation powered by React Navigation stack

### Record & AR Module

- Expo Go used for prototyping with 2D UI overlays  
- **Native AR features** (court alignment, motion tracking) deferred to custom dev client or EAS builds  
- Capture UI includes countdown, AR framing, tagging, trimming, save/share modal

### AI Lab

- Stroke simulation preview  
- Pro comparison overlays (ghost, split, side-by-side)  
- Drill suggestion integration  
- Designed for extensible AI experiences

### Social & Matchmaking

- Video feed with like/comment  
- Player map + DM + match history  
- Referral and QR-based onboarding flows  
- Lightweight in-app chat replacing Matrix-style federation

### UI System

- Token-based design (colors, spacing, typography)  
- Light/dark mode  
- Smooth transitions + gesture support  
- Componentized per screen for modular delivery

---

## 🔌 Backend & API Architecture

SwingMatch’s backend supports scalable APIs, asynchronous AI workloads, and personalized user experiences.

### Core Services

- **User & Auth**: OAuth + email login, referral/QR onboarding, onboarding prefs  
- **Media Service**: Signed uploads, video metadata, job triggers  
- **AI Dispatcher**: Queue-based GPU job router for analysis, simulation  
- **Social Engine**: Feed, geo-matchmaking, DM  
- **Progress Tracker**: Session logs, streaks, badges  
- **Admin Panel**: Abuse reports, feature flags, content controls using **n8n**

### Infrastructure Highlights

- Cloud-native (GCP/AWS), rate-limited API Gateway  
- PostgreSQL + PostGIS, Redis for caching  
- Blob storage + optional vector DB for AI  
- Event-driven services using **RabbitMQ** or **Kafka**  
- Model-aware endpoints for simulation rendering

---

## 🧠 AI Runtime & Model Deployment

SwingMatch runs containerized AI workloads with a focus on modularity, rollback safety, and rapid improvement.

### Runtime Flow

1. User video triggers AI job  
2. Dispatcher assigns job to GPU  
3. Model runs → Output stored → Metadata updated  
4. Drill links added in post-processing

### Model Management

- Semantic versioning  
- Canary deploys for staged rollout  
- Confidence scoring for simulation feedback  
- Auto-retries on failure

### Infrastructure

- GPU-optimized containers  
- Model registry (custom or 3rd party)  
- QA tools for output review  
- Telemetry on latency and model error

---

## 🔐 Privacy, Security & Compliance

- AES-256 encryption (storage), TLS 1.2+ (transit)  
- Opt-in sharing, visibility controls  
- Session tokens with refresh  
- Content moderation workflows  
- Safe mode for youth (visibility + content restrictions)  
- Secrets managed via vault systems  
- Policy-based CI/CD access and staging controls  
- AI transparency: confidence scores + manual reprocessing

---

## 🚀 Deployment Strategy & DevOps

### Monorepo

- Unified repo for mobile + backend + AI  
- Shared schemas and utilities  
- Atomic commits for multi-layer updates

### CI/CD

- PR-triggered testing, linting, snapshot checks  
- EAS build for mobile  
- Dockerized backend + AI services  
- Canary flags for backend APIs and models

### Environments

| Env     | Purpose         | Notes                        |
|---------|------------------|------------------------------|
| `dev`   | Daily builds     | Open access, low GPU caps    |
| `staging` | QA + demo     | Production mirror            |
| `prod`  | Live users       | Rate-limited AI + logging    |

### Tooling

- Expo CLI, `eas.json` for environments  
- Terraform / Pulumi for infra as code  
- Grafana / Prometheus / Datadog for ops  
- Crash reporting: Sentry / Firebase  
- Device testing via BrowserStack / emulator farm

---

## 🌐 Experimental Feature: AI Subtitle Enhancer for YouTube Lessons

To serve a global audience, SwingMatch supports automated transcription and translation of YouTube drill videos.

### Pipeline:
1. `n8n` detects new YouTube video link
2. If no subtitles: Whisper ASR generates transcript
3. Translates to Simplified Chinese (OpenAI or DeepL)
4. Stores `.vtt` subtitle sidecar (e.g. `video_id.zh.vtt`)
5. Native in-app subtitle display

### Notes:
- MVP scope: Chinese only
- Runs as async batch job
- Subtitles marked as "AI-generated"

