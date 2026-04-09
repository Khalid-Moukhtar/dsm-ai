# DSM (Design System Maker) — Domain Summary

> Last updated: 2026-04-09

## What This Product Does

DSM is a zero-configuration, 100% client-side web tool that lets AI developers and vibe coders instantly visualize "best practice" UI design system templates — exploring combinations of colors, typography, spacing, and border radius — then export the chosen configuration as an AI-friendly text file to guide their AI agent when building the actual application interface.

## Core Workflow

1. Developer opens DSM in the browser (no sign-up, no configuration)
2. Developer browses a gallery of pre-built design system templates (e.g., "Modern SaaS", "Clean Corporate", "Dark Mode", "Glassmorphism")
3. Developer clicks a template to load it into a live preview panel
4. Developer optionally tweaks values (primary color, font size, border radius, etc.)
5. Developer clicks "Export" and selects a format (Markdown, JSON, or CSS)
6. Browser downloads the file — ready to paste into an AI agent prompt or project

## Business Model

Open source (MIT License). Free to use. Community-contribution model.
No monetization in v1. Potential future: hosted service with community-submitted templates.

## Key Business Rules

1. **Zero configuration on open**: The tool must render a usable template gallery immediately — no onboarding, no login, no setup wizard.
2. **Export must be AI-readable**: The primary format is Markdown (design_rules.md). Field names use snake_case for maximum AI agent compatibility.
3. **Safe defaults**: All built-in templates must use color combinations that pass WCAG AA contrast (4.5:1 for body text, 3:1 for large text). Contrast warnings are shown but do not block export.
4. **No backend, no data persistence**: The app operates entirely in the browser. Nothing is stored server-side. State resets on tab close.
5. **Client-side only**: Export is a file download triggered by the browser. No uploading, no API calls.
6. **Multiple export formats**: All three formats (Markdown, JSON, CSS) must stay in sync — the same token values, different syntax.

## Compliance & Legal

None identified. No user data collected. No accounts. No cookies beyond session state.

## Multi-Country / Multi-Language

Single language: English only. CSS/JSON/Markdown formats are syntax-universal.
No currency, date, or timezone logic required.

## Integrations

None. The app is fully self-contained and works offline.

## Open Questions

- [ ] Should templates be user-submittable in v1, or only built-in? — affects: data map (static vs. dynamic source), architecture scope
- [ ] Should the export include a preview image/screenshot, or text only? — affects: export complexity
