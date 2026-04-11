# motif

**Pick a design system vibe. Export design tokens for your AI coding agent.**

motif is a zero-configuration web tool for vibe coders and AI developers. Pick a layout context and a brand-inspired style, adjust colors and typography until it feels right, then export a complete design token file you can hand directly to Claude, Cursor, or any AI coding agent.

---

## What it does

1. **Pick a layout** -- Choose what you are building: SaaS app, landing page, blog, portfolio, e-commerce, docs, community, or mobile.
2. **Pick a style** -- 10 brand-inspired presets: Stripe, Linear, Notion, Vercel, Airbnb, Apple, Spotify, Shopify, GitHub, or a blank custom canvas.
3. **Customize** -- Adjust colors with a live preview. Fonts, spacing, and border radius use semantic sliders -- no raw CSS knowledge required.
4. **Export + paste** -- Download as Markdown, JSON, CSS custom properties, or Tailwind config. Paste it into your AI agent. Done.

---

## Quickstart

    git clone https://github.com/Khalid-Moukhtar/motif.git
    cd motif
    pnpm install
    pnpm dev

Open http://localhost:5173

> Requires Node.js 20+ and pnpm.

---

## Tech stack

- **Frontend**: Vite 6 + React 18 + TypeScript
- **Styling**: Vanilla CSS with CSS custom properties
- **Testing**: Vitest v3 (47 tests)
- **Package manager**: pnpm
- **No backend** -- 100% client-side, no API keys, no accounts

---

## Export formats

| Format | File | Use case |
|--------|------|----------|
| Markdown | design_rules.md | Paste into Claude, Cursor, or any AI agent |
| JSON | design_tokens.json | Design tools, code generators |
| CSS | variables.css | Drop into any stylesheet |
| Tailwind v3 | tailwind.config.js | Tailwind CSS v3 projects |
| Tailwind v4 | theme.css | Tailwind CSS v4 projects |

---

## Contributing

See CONTRIBUTING.md for the workflow. All PRs must pass the full CI gate (type check, lint, build, tests) before merge.

---

## License

MIT -- see LICENSE.
