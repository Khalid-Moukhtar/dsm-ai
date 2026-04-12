# motif — AI Agent Contributor Guide

> **Claude Code users**: this file is excluded from Claude Code context via `.claudeignore`.
> Claude Code reads `CLAUDE.md` instead — that file has full architectural detail.

motif is a zero-configuration design token tool. Pick a layout context and brand-inspired style,
adjust tokens, export a complete design token file for use with AI coding agents.

**Stack**: Vite 6 + React 18 + TypeScript + Vanilla CSS. No backend. Two allowed external services: Google Fonts CDN (typography) and PostHog EU analytics (eu.i.posthog.com). No others.

---

## Key constraints — read before writing any code

- **Vanilla CSS only** — no Tailwind, no CSS-in-JS, no styled-components
- **No backend** — 100% client-side. Any feature requiring a server is out of scope.
- **pnpm only** — never npm or yarn
- **Non-designer controls** — sliders, presets, dropdowns only for non-color tokens. Never raw CSS inputs.
- **Export integrity** — any new design token must appear in all 5 export formats (MD/JSON/CSS/TW v3/TW v4)
- **Token count** — JSON export has exactly 44 tokens. `toHaveLength(44)` in `src/utils/export.test.ts` enforces this.
- **Token naming** — CSS vars: `--color-primary` (kebab) | JS fields: `colorPrimary` (camelCase) | MD export: `color_primary` (snake_case)

## Data contract

Read `docs/data-maps/THEME_DATA_MAP.md` before touching any token-related code.
The Data Map is the contract — when code doesn't match it, the code is wrong.

## CI gate (must pass before opening a PR)

Run from the repo root (all commands must exit 0):

```bash
pnpm exec tsc --noEmit
pnpm exec eslint . --max-warnings 0
node node_modules/vite/bin/vite.js build
pnpm audit --audit-level=high
pnpm exec vitest run src/utils/export.test.ts
pnpm exec vitest run src/utils/palette.test.ts
```

## Contribution workflow

See `CONTRIBUTING.md` for the full PR process. Open an issue before starting large changes.
