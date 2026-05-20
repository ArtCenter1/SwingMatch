# SwingMatch Design System

> Category: Sports & Fitness
> AI-powered tennis coaching app. Instagram-inspired dark UI, content-first layout, tennis lime accent. Optimised for mobile (iOS/Android via Expo React Native).

---

## 1. Visual Theme & Atmosphere

Dark, minimal, content-first. The interface recedes so that swing videos, AI analysis text, and drill cards can breathe.
Inspired by Instagram dark mode: almost-black backgrounds, dark-grey surfaces, clean dividers.
Energy comes from a single tennis-lime accent and confident, generous whitespace — never from decoration.

Mood: **focused coach** — calm, authoritative, instantly readable under bright court-side lighting.

---

## 2. Color Palette & Roles

### Base
| Token | Hex | Role |
|---|---|---|
| `background` | `#111111` | Root screen background |
| `surface` | `#1A1A1A` | Cards, panels, modals |
| `surface-raised` | `#222222` | Input fields, secondary panels, bottom sheets |
| `border` | `#2A2A2A` | Dividers, card borders, input outlines |
| `border-subtle` | `#1F1F1F` | Hairline separators within lists |

### Text
| Token | Hex | Role |
|---|---|---|
| `text-primary` | `#F5F5F5` | Headlines, body copy |
| `text-secondary` | `#A0A0A0` | Captions, timestamps, labels, placeholders |
| `text-tertiary` | `#606060` | Disabled, ghost labels |
| `text-inverse` | `#111111` | Text on lime accent fills |

### Accent
| Token | Hex | Role |
|---|---|---|
| `accent` | `#84CC16` | Primary CTAs, active tab indicator, progress, links |
| `accent-muted` | `#4D7A0A` | Pressed state, secondary accent surfaces |
| `accent-subtle` | `#84CC1614` | Tinted chip backgrounds, selected state fills |

### Semantic
| Token | Hex | Role |
|---|---|---|
| `success` | `#22C55E` | Score improvements, correct form indicators |
| `warning` | `#F59E0B` | Technique cautions, form warnings |
| `danger` | `#EF4444` | Errors, critical form issues |
| `info` | `#3B82F6` | Info tooltips, YouTube link badges |

### Rules
- Never use pure `#000000` for backgrounds or `#FFFFFF` for fills.
- The lime accent appears on **at most two** interactive elements per screen.
- Semantic colours are for feedback states only — never decorative.

---

## 3. Typography Rules

### Font Stack
- **Primary:** `'Inter', -apple-system, 'SF Pro Display', system-ui, sans-serif`
- **Mono:** `'JetBrains Mono', 'Courier New', monospace` — for data values, scores, frame timestamps

### Scale (React Native `sp` / logical pixels)
| Name | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `display` | 32 | 700 | 1.15 | Screen title heroes |
| `heading-1` | 24 | 700 | 1.2 | Section headers |
| `heading-2` | 20 | 600 | 1.25 | Card titles, tab labels |
| `heading-3` | 17 | 600 | 1.3 | Sub-section headers |
| `body` | 15 | 400 | 1.5 | AI analysis text, descriptions |
| `body-strong` | 15 | 600 | 1.5 | Key phrases, drill names |
| `caption` | 13 | 400 | 1.4 | Timestamps, metadata |
| `label` | 12 | 500 | 1.3 | Chips, badges, nav labels |
| `mono` | 13 | 400 | 1.4 | Scores, statistics, frame data |

### Rules
- Letter-spacing: `-0.3px` on `display`; `0` everywhere else.
- All headings sentence-case. Title case only for brand names (SwingMatch, YouTube).
- No more than **3 type sizes** visible simultaneously on one screen.

---

## 4. Component Stylings

### Buttons
```
Primary:   background=#84CC16, text=#111111, radius=10, paddingV=13, paddingH=20, weight=600
Secondary: background=transparent, border=1px #2A2A2A, text=#F5F5F5, same radii
Ghost:     background=transparent, no border, text=#84CC16, paddingH=8
Danger:    background=#EF444420, text=#EF4444, border=1px #EF4444
```
- Min touch target: 44×44pt.
- Pressed state: `opacity: 0.8`, scale `0.97` (spring animation).
- Loading state: replace label with a small spinner, same size.

### Cards
```
background: #1A1A1A
border: 1px solid #2A2A2A
borderRadius: 14
padding: 16
gap: 12 (between internal rows)
```
- No box shadow. Elevation is communicated by border only (Instagram-style).
- Video preview cards: full-bleed media, metadata below.

### Video / Camera Overlay
```
Background: rgba(0,0,0,0.6) blur overlay on video feed
Controls:   white icons, 28pt, 44pt touch targets
Record button: 72pt circle, white ring + #84CC16 fill while recording
```

### Inputs & Text Fields
```
background: #222222
borderRadius: 10
border: 1px solid #2A2A2A
paddingV: 13, paddingH: 16
color: #F5F5F5
placeholderColor: #606060
focusBorder: #84CC16
font: body (15pt, 400)
```

### Chat Bubbles (AI Agent)
```
User:      background=#84CC1614, border=1px #84CC1630, radius=18 (TL=4)
Assistant: background=#222222, border=1px #2A2A2A, radius=18 (TR=4)
Tool chip: background=#1A1A1A, border=1px #2A2A2A, radius=8, caption font
```

### Bottom Tab Bar
```
background: #111111
borderTop: 1px solid #1F1F1F
height: 83 (includes safe area)
iconSize: 24
activeColor: #84CC16
inactiveColor: #606060
labelFont: label (12pt, 500)
activeTabIndicator: 2px lime bar above icon
```
Instagram-style: icons prominent, labels small below, minimal chrome.

### Analysis Score Badge
```
Excellent (85-100): #22C55E background tint
Good (65-84):       #84CC16 background tint
Needs Work (<65):   #F59E0B background tint
Critical (<40):     #EF4444 background tint
shape: pill, paddingH=10, paddingV=4, label font
```

### Drill Cards (Library)
```
Thumbnail: 56×56, radius=8, #222222 background
Title: body-strong
Subtitle: caption, text-secondary
Difficulty chip: pill with semantic colour
```

---

## 5. Layout Principles

- **Content-first:** media (video, camera) always gets maximum screen space. UI chrome is minimal.
- **Safe areas:** respect iOS/Android safe area insets on all screens. Content never bleeds under nav bars.
- **Spacing unit:** 4pt base grid. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48.
- **Screen padding:** 16pt horizontal. Lists may bleed to edges with separators.
- **Section gap:** 32pt between major sections, 16pt between minor rows.
- **List items:** 72pt min height (single-line: 56pt). Aligned to 16pt left margin.
- **No modals for primary actions.** Use bottom sheets (drag indicator, 8pt top radius: 24pt).
- **Headers:** sticky, `#111111` + bottom hairline border. Title centred (Instagram-style) on feed; left-aligned on detail screens.

---

## 6. Depth & Elevation

Three levels — **no traditional box shadows**. Depth is border + background contrast only.

| Level | Use | Visual |
|---|---|---|
| **0 — Flat** | Screen background, separators | `#111111` |
| **1 — Raised** | Cards, inputs, secondary panels | `#1A1A1A` + `#2A2A2A` border |
| **2 — Floating** | Bottom sheets, modals, tooltips | `#222222` + `#2A2A2A` border + `rgba(0,0,0,0.6)` backdrop |

- Camera recording overlay: `rgba(0,0,0,0.6)` only.
- No neumorphism. No glassmorphism.

---

## 7. Do's and Don'ts

### ✅ Do
- Content (video, analysis) fills the screen — UI wraps it.
- One lime accent CTA per primary action per screen.
- Use Instagram-style bottom sheets for secondary actions.
- Keep the tab bar always visible on primary screens.
- Show AI "thinking" state with a subtle pulsing lime dot.
- Use motion purposefully: slide-up for sheets, cross-fade for content.

### ❌ Don't
- Don't use gradients on backgrounds. Flat dark surfaces only.
- Don't use card shadows — use border contrast instead.
- Don't place lime accent on more than 2 elements per screen.
- Don't centre body text. Left-align always.
- Don't stack more than 3 type sizes on one screen.
- Don't use decorative icons — functional icons only (SF Symbols / Ionicons style).
- Don't animate layout (avoid width/height animation). Animate opacity and transform only.

---

## 8. Responsive Behavior

This is a **mobile-first** (iOS/Android) app. All layout specifications are in logical pixels (pt/dp).

| Breakpoint | Screen Width | Adaptation |
|---|---|---|
| Small phone | < 375pt | Reduce heading to 20pt. Reduce card padding to 12pt. |
| Standard | 375–430pt | Default specifications above. |
| Large phone | > 430pt | Cards may use a 2-column grid in Library screen. |
| Tablet (future) | > 768pt | Split-pane: feed on left, detail on right. |

- Landscape on phone: camera screen only. All other screens lock to portrait.
- Dynamic Type: respect `accessibilityFontScale`. Use `sp` units in React Native.

---

## 9. Agent Prompt Guide

When generating SwingMatch UI or components, apply these rules:

**Identity check:** Confirm you've read this file. The app is a **dark-themed tennis AI coaching app** with Instagram-inspired layout.

**Palette:** Use only the tokens in Section 2. Do not invent hex values. If a colour isn't defined, use the nearest existing token and add a `// TODO: token needed` comment.

**Layout first:** Start with the largest visual element (video player, camera feed, or analysis text) and build chrome around it — not the other way around.

**Accent discipline:** Lime (`#84CC16`) for the single most important interactive element on screen. Everything else is white text on dark grey.

**Motion:** Only `opacity` and `transform`. Duration: enter 200ms, exit 140ms. Easing: `cubic-bezier(0.23, 1, 0.32, 1)`.

**Component naming:** Follow the existing Expo/React Native project: screen files in `app/(app)/`, reusable components in `src/components/`. Design tokens from `src/design/tokens.ts`.

**AI responses in chat:** Avoid walls of text. Structure analysis as: **Shot identified → What's good → Errors found → Drill to fix**. Use `body` for main text, `body-strong` for the error/drill name, `caption` for metadata.
