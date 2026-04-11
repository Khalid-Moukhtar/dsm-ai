# DSM (Design System Maker) — Domain Summary

> Last updated: 2026-04-09

## North Star

> **"DSM is the fastest path for non-designers to go from 'I want something that looks like [X]' to a complete, AI-ready design system — in under 60 seconds, no design knowledge required."**

The exported file is the handoff to an AI coding agent. Everything in DSM must serve this: fast visualization, safe defaults, one-click export.

---

## What This Product Does

DSM is a **published web tool** (hosted online, always-on) that lets **non-designers, vibe coders, and builders** browse realistic app and website layout previews — each fully styled with a live design system — then tweak the design tokens until the vibe feels right, and export the result as a design system file.

The exported file is the **handoff to an AI coding agent**. It contains all design tokens in a structured, AI-readable format, with a framing instruction that tells the agent to apply the tokens consistently across all UI components. The user pastes this file into Claude, Cursor, or any other coding agent to give it a visual contract before it builds the actual application UI.

**The product solves one specific problem**: a developer starting a new project has no design background, no idea what they want it to look like, and no time to learn design tools. DSM lets them pick something that looks good and export it in 60 seconds.

---

## Non-Designer UX Mandate

> This is a hard product constraint, not a preference. Every design and engineering decision must be evaluated against it.

**The user does not know design vocabulary.** They do not know what "letter spacing", "line height", or "border radius" mean. They cannot evaluate whether "16px" is too large or too small. They cannot reason about "0.5rem" spacing.

**Implication for every UI decision:**
- Controls must be visual and semantic, not raw value inputs
- Labels must describe the effect, not the token name
- Sliders and presets beat text fields for any non-color token
- When in doubt: show the result, not the parameter

Specific rules:
- Font family → curated dropdown of named font stacks (e.g., "Inter — Clean & Modern", "Playfair — Elegant & Editorial")
- Font sizes → single "Text Scale" slider: Compact / Normal / Spacious / Large
- Font weights → three toggle buttons: Regular · Medium · Bold
- Line height → slider: Tight / Normal / Relaxed
- Letter spacing → slider: Tight / Normal / Wide
- Spacing → single "Density" slider: Compact / Normal / Spacious / Airy
- Border radius → 4 visual buttons with corner icon: Sharp / Subtle / Rounded / Pill
- Colors → color picker + hex input (this one is universally understood)

---

## Template Hierarchy

DSM templates have exactly **two levels of user choice**, plus a mode toggle:

```
Level 1 — Layout Type (what you're building, 8 options)
  ↓ user selects one layout

Level 2 — Style Variant (brand-inspired vibe, dropdown, 5-8 options)
  ↓ user selects one variant

Mode Toggle — Light ↔ Dark (not a separate hierarchy level)
  ↓ toggles color palette within the selected variant
```

### Level 1: Layout Types (8)

| Layout | Description |
|--------|-------------|
| SaaS Dashboard | Sidebar nav, stat cards, tables, charts — the canonical SaaS product UI |
| Startup Landing | Hero, features, pricing, CTA — every product needs one |
| Blog / Editorial | Article list, reading view, sidebar — content marketing + personal writing |
| E-commerce Store | Product grid, product detail, cart — selling physical or digital goods |
| Portfolio / Agency | Work showcase, about, contact — personal sites, creative agencies |
| Documentation | Sidebar nav, content area, code blocks — dev portals, help centers |
| Community / Social | Feed, profiles, posts — Discord/Reddit/forum clones |
| Mobile App UI | Narrow card layout, bottom nav — Instagram/TikTok-style apps |

### Level 2: Style Variants (brand-inspired)

Each variant defines a complete design system: colors (light + dark palette), typography, spacing, and border radius. Variants are layout-agnostic — any variant can be applied to any layout type.

| Variant | Brand feel | Inspiration |
|---------|-----------|-------------|
| Stripe | Clean, trustworthy, minimal | Stripe.com |
| Linear | Dark, ultra-minimal, developer | Linear.app |
| Notion | Warm, readable, content-focused | Notion.so |
| Vercel | Extreme contrast, precision | Vercel.com |
| Airbnb | Warm, rounded, consumer | Airbnb.com |
| Apple | Premium, white-space, minimal | Apple.com |
| Spotify | Vibrant, music, bold green | Spotify.com |
| Shopify | Clean commerce, trustworthy green | Shopify.com |
| GitHub | Developer-first, precise, minimal | GitHub.com |

All variants are layout-agnostic. A `custom` variant is also available for users who generate a palette from a seed color.

### Mode Toggle: Light ↔ Dark

Dark mode is **not** a third hierarchy level. It is a binary toggle that applies to the selected variant. Every variant ships with two pre-authored color palettes: one light, one dark. The toggle switches between them. Typography, spacing, and radius are unchanged by the toggle.

**What dark mode is NOT**: a separate layout. "Dark Mode" is not a template category. A SaaS dashboard with dark colors is still a SaaS dashboard.

---

## Core Workflow

1. User opens DSM in the browser — no sign-up, no configuration, no onboarding
2. User selects a **layout type** (what they're building)
3. User selects a **style variant** from the dropdown (brand-inspired vibe)
4. User optionally toggles **Light ↔ Dark** mode
5. A polished, realistic mockup renders using the selected layout + variant tokens
6. User switches between pages within the layout (e.g., Dashboard → Users → Settings) to see the full context
7. User tweaks tokens using semantic controls (sliders, dropdowns, presets)
8. Live preview updates instantly
9. User clicks Export → selects format (MD / JSON / CSS) → downloads file
10. File is pasted into an AI coding agent as a design contract

---

## Business Model

Open source (MIT License). Free to use. Community-contribution model.
No monetization in v1. Potential future: hosted service with community-submitted templates.

---

## Key Business Rules

1. **Zero configuration on open**: The tool must render a usable template gallery immediately — no onboarding, no login, no setup wizard.
2. **Realistic layout previews**: Layouts must render as polished, recognizable app/website mockups — not abstract color swatches. Users must be able to visualize a real application.
3. **Non-designer first**: Every control must be understandable without design vocabulary. See the Non-Designer UX Mandate above.
4. **The export is the AI handoff**: The primary format is Markdown (`design_rules.md`). It includes an AI-agent framing header and snake_case field names. It must be immediately usable as a prompt without editing.
5. **Safe defaults**: All built-in templates must use color combinations that pass WCAG AA contrast. Contrast warnings shown in token editor but do not block export.
6. **No backend, no data persistence**: The app operates entirely in the browser. Nothing stored server-side. State resets on tab close.
7. **Client-side only**: Export is a file download triggered by the browser. No uploading, no server API calls.
8. **Multiple export formats**: All three formats (MD, JSON, CSS) must stay in sync.
9. **Built-in templates only (v1)**: Templates are hardcoded. No user-submitted templates in v1.
10. **Text export only**: No screenshots, no images.
11. **Google Fonts**: Google Fonts CDN is used for typography. The tool is online-first; offline functionality is not a requirement.

---

## Compliance & Legal

None identified. No user data collected. No accounts. No cookies beyond session state.

## Multi-Country / Multi-Language

Single language: English only. CSS/JSON/Markdown formats are syntax-universal.

## Integrations

Google Fonts CDN — for web font loading in layout previews and exported font stacks.
No other external dependencies at runtime.
