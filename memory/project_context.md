# DSM — Key Learnings & Project Memory

## Package Manager: pnpm (MANDATORY)
**ALWAYS use `pnpm`** — never npm, yarn, or bun.

## Project Status
- **Stage**: Feature-complete v1 — all 8 layouts, 6 variants, shadow tokens, Tailwind export, Google Fonts loading, secondary foreground controls, SystemTokensView, export (MD/JSON/CSS/Tailwind)
- **In flight**: Deploy to production (Vercel or GitHub Pages)
- **Deploy**: CI/CD via GitHub Actions (host TBD — Vercel or GitHub Pages are candidates)
- **Live URL**: Not yet deployed
- **Tier**: 2 (Ship-Fast) — client-side tool, no backend

## Stack
- Framework: Vite + React 18 + TypeScript
- Styling: Vanilla CSS with CSS custom properties
- Fonts: Google Fonts CDN (tool is online-first)
- Testing: Vitest
- Linting: ESLint with zero-warning policy (`--max-warnings 0`)

## What This Product Does
DSM (Design System Maker) is a design system picker for **non-designers and vibe coders**. Users pick a layout type (what they're building), then pick a brand-inspired style variant, then toggle light/dark mode. The result renders as a polished, realistic layout mockup. Users tweak tokens using semantic controls (sliders, presets — never raw CSS values) until the vibe is right, then export to MD/JSON/CSS. The exported file is pasted into an AI coding agent as a design contract. Published online — Google Fonts supported.

## Non-Designer UX Mandate (HARD CONSTRAINT)
The user does not know design vocabulary. Controls must be:
- **Colors**: color picker + hex (universally understood — keep as-is)
- **Font family**: curated dropdown of named stacks
- **Font sizes**: single "Text Scale" slider (Compact/Normal/Spacious/Large)
- **Font weights**: three toggle buttons (Regular · Medium · Bold)
- **Line height**: slider (Tight/Normal/Relaxed)
- **Letter spacing**: slider (Tight/Normal/Wide)
- **Spacing**: single "Density" slider (Compact/Normal/Spacious/Airy)
- **Border radius**: 4 visual corner-preview buttons (Sharp/Subtle/Rounded/Pill)
**NEVER use freeform text inputs for any non-color token.**

## Template Hierarchy (CANONICAL — DO NOT DEVIATE)
```
Level 1: Layout Type (8 options — what you're building)
  ↓
Level 2: Style Variant (5+ options — brand-inspired vibe, shown as dropdown)
  ↓
Mode Toggle: Light ↔ Dark (not a hierarchy level — a toggle on the selected variant)
```

### Layout Types (8):
saas | landing | blog | ecommerce | portfolio | docs | community | mobile

### Style Variants (brand-inspired, shown as cards — NOT a dropdown):
stripe | linear | notion | vercel | airbnb | custom

Each variant defines: complete light color palette + complete dark color palette + typography + spacing + border radius + shadows.

### What is NOT a layout type:
- "Dark Mode" — this is a mode toggle, not a layout
- "Glassmorphism" — this is a style variant, not a layout
- "Crypto company" — this is a Startup Landing layout with dark colors + gradient variant

## CALL BS Rule
If any product decision, requirement, or code direction is wrong or incoherent, say so immediately. Do not implement something known to be wrong. This has the same weight as "never guess."

## Key Directives (Never Forget)
1. **Non-Designer First**: Controls must be visual and semantic. See Non-Designer UX Mandate.
2. **Template Hierarchy**: Layout Type → Variant → Light/Dark toggle. Three axes. See above.
3. **AI-Friendly Export**: Primary format is Markdown. Snake_case field names. AI-agent framing header.
4. **Call BS**: Wrong directions get challenged immediately, not implemented.
5. **Online-First**: Google Fonts CDN is fine. Not offline-first.
6. **Open Source & Extensible**: MIT License.

## Decisions Log

### 2026-04-10 — Shadow tokens, Tailwind export, Google Fonts, secondary foreground
**Decision**: Implemented all 4 approved features.
**Key choices**:
- Shadows: preset-only (Flat/Subtle/Elevated/Dramatic) — non-designer mandate, no freeform CSS
- Tailwind: v3 only (module.exports format); fontFamily splits on comma and strips quotes per token (do NOT use safeFontFamily() here)
- Font loading: hardcoded 5-font allowlist in LayoutPreview, id-guarded (gsf-{FontName}), no useEffect cleanup
- safeFontFamily() updated to strip quotes before allowlist check — fixes "Space Grotesk"/"DM Sans"/"Playfair Display" export bug
- Token count: 38 → 42 (added 4 shadow tokens)

### 2026-04-10 — Token Visualization: SystemTokensView
**Decision**: Added "Tokens" tab in LayoutPreview showing all semantic tokens in actual UI context.
**Key patterns** (Carbon, Material 3, USWDS research):
- Spacing: proportional bars where `width: var(--spacing-{token})` — updates live when Density slider moves
- Typography: spec strip (size · weight) beside sample text; body row has **two lines** to show line-height
- Letter spacing: uppercase ABCDEF sample — caps make tracking perceptible
- Weights: same glyph (Ag) at all 3 weights side-by-side
- Error/Success/Warning: shown as alert boxes with colored left-border (never visible in happy-path layouts)
**Note**: SystemTokensView receives `theme` prop for spec values AND uses CSS vars for live visual updates.

### 2026-04-09 — Package Manager: pnpm
**Decision**: Use pnpm
**Why**: Fast installs, strict dependency resolution, disk-efficient

### 2026-04-09 — Styling: Vanilla CSS
**Decision**: Vanilla CSS with CSS custom properties
**Why**: Demonstrates design tokens directly; the CSS export format IS the runtime format

### 2026-04-09 — No Backend
**Decision**: 100% client-side, no server
**Why**: Tool only generates a text file download. Zero server needed.

### 2026-04-09 — layoutType field
**Decision**: `layoutType` on Theme determines which layout component renders. NOT exported.
**Current values**: 'saas' | 'blog' | 'landing' | 'portfolio' (expanding to 8)

### 2026-04-09 — Online-First / Google Fonts
**Decision**: Tool is published online. Google Fonts CDN is allowed.
**Supersedes**: Earlier "offline-first" assumption, which was wrong.

### 2026-04-09 — Template hierarchy redesign
**Decision**: Templates have two user-choice levels (layout + variant) plus a mode toggle.
**Supersedes**: Original flat `category: 'modern' | 'corporate' | 'dark' | 'glassmorphism'` which mixed layout and style axes incoherently.

## Resolved Bugs

### 2026-04-09 — vitest/config vs vite type conflict
**Symptom**: `tsc --noEmit` failed with `Plugin<any>` incompatibility
**Root cause**: `vitest/config` bundles Vite 5; project uses Vite 6
**Fix**: Split `vite.config.ts` (from `'vite'`) and `vitest.config.ts` (from `'vitest/config'`)

### 2026-04-09 — esbuild build scripts blocked by pnpm
**Fix**: Added `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` to `package.json`

### 2026-04-09 — fontFamily allowlist used \s (matches \n — injection vector)
**Fix**: Changed allowlist to `/^[a-zA-Z0-9 ,\-_.']+$/` — literal space `[ ]`, NOT `\s`

### 2026-04-09 — vitest 2.x shipped vite 5 internally (2 moderate CVEs)
**Fix**: Upgraded vitest to v3 which ships vite 6 natively. All 14 tests passing.

## Open Questions
- Deploy host: Vercel (auto-deploy from GitHub) or GitHub Pages?

## Closed Decisions
- Variants built-in only in v1 (stripe/linear/notion/vercel/airbnb/custom)
- All 8 layout types implemented: saas/landing/blog/ecommerce/portfolio/docs/community/mobile
- Export is text-only (no screenshots)
- Markdown export has attribution header; JSON, CSS, Tailwind are format-pure
- layoutType, variant, colorMode excluded from all export formats (UI metadata only)
- SystemTokensView: uses CSS vars for live visuals + theme prop for spec value labels
- Spacing visualization: proportional bars (`width: var(--spacing-{token})`), not static
- Typography visualization: two-line body text (line-height visible), weight comparison, uppercase tracking
- Shadow tokens: 4 levels (sm/md/lg/xl), preset-only (Flat/Subtle/Elevated/Dramatic), no freeform input
- Tailwind export: v3 format (module.exports), fontFamily uses sans key, strips quotes from font names
- Font loading: id-guarded useEffect in LayoutPreview, 5-font Google Fonts allowlist, no cleanup (prevents FOUT)
- safeFontFamily() fix: strips surrounding quotes from each font token before allowlist check — "Space Grotesk" etc. now export correctly in MD and CSS
- secondaryForeground: now has ColorRow in Brand group + ContrastBadge in WCAG summary
- JSON token count: 42 (was 38) — 13 colors + 12 typography + 7 spacing + 6 radius + 4 shadows
