# motif — AI Agent Instructions

> Auto-loaded at session start. Read before touching any code.
> Domain: `docs/DOMAIN.md` | Personas: `docs/PERSONAS.md` | Data maps: `docs/data-maps/`

## Critical Rules

1. **NEVER deploy from local** — CI/CD only
2. **NEVER commit to main** — branch → PR → CI → merge
3. **NEVER guess or assume** — search codebase first, ask human when in doubt
4. **ALWAYS surface best practices** — state cost AND cheaper alternative
5. **Full local CI BEFORE any PR** — 0 errors, 0 warnings, NO EXCEPTIONS
6. **Use pnpm** — never npm, yarn, or bun
7. **NEVER run the full test suite** — run only specific test files by exact path
8. **Vanilla CSS only** — no CSS-in-JS, no Tailwind, no styled-components
9. **No backend** — this is 100% client-side. Never introduce server-side logic or external API calls. Two allowed exceptions: Google Fonts CDN (typography) and PostHog EU analytics (eu.i.posthog.com). No other external requests.
10. **Export format integrity** — ALL export formats (MD, JSON, CSS) must match the Data Map field names exactly
11. **CALL BS** — if a product decision, architectural choice, or requirement is wrong, incoherent, or will lead the product in the wrong direction, say so directly and immediately. Do not implement something you know is wrong just because it was requested. Explain the issue, propose the correct alternative. This is a standing rule with the same weight as "never guess."
12. **Non-designer mandate** — EVERY UI control for non-color tokens must use semantic controls (sliders, presets, dropdowns), not raw CSS value inputs. Non-designers do not know what "16px", "1.5", or "0em" mean. See docs/DOMAIN.md "Non-Designer UX Mandate" for the full spec. Never revert to freeform text inputs for spacing, radius, or typography tokens.
13. **Google Fonts allowed** — the tool is online-first. Google Fonts CDN may be used for typography in layout previews and as exported font stacks in templates. No other external runtime dependencies (except PostHog — see rule 9).
14. **Analytics via PostHog only** — `src/utils/analytics.ts` contains all event tracking. Call the typed wrappers there; never call `posthog.capture()` directly elsewhere. PostHog config: EU cloud, `persistence: 'memory'` (no cookies), `autocapture: false`. The public project token in `main.tsx` is write-only and safe to commit. "Discard client IP data" is enabled in PostHog project settings.
14. **NEVER edit a merged or closed PR** — `gh pr edit` on a merged PR is a no-op at best and misleading at worst. Before any `gh pr edit <number>`, verify state: `gh pr view <number> --json state -q .state`. If the output is `MERGED` or `CLOSED`, stop. Do not edit.
15. **Read the Data Map first** — before touching any token-related source code, read `docs/data-maps/THEME_DATA_MAP.md`. The Data Map is the contract.

## Common Implementation Checklist

Before marking any task done, verify:
- [ ] No TypeScript errors (`pnpm exec tsc --noEmit` exits 0)
- [ ] No lint warnings (`pnpm run lint` exits 0 with --max-warnings 0)
- [ ] Vite build succeeds (`pnpm run build` exits 0)
- [ ] `pnpm audit` — no CRITICAL or HIGH CVEs
- [ ] Export output tested — generated MD/JSON/CSS is valid and matches Data Map field names
- [ ] Color contrast: all template defaults meet WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] No hardcoded design values outside of `src/data/variants.ts`
- [ ] New interactive elements have keyboard accessibility (tab, enter, escape)
- [ ] No dead code, unused imports, or debug statements
- [ ] Data map updated if new tokens or export fields were added

## The Contract Rule

> The Data Map is the **contract**. When code doesn't match the Data Map, the code is wrong.
> When fixing a bug: update the Data Map FIRST (what it SHOULD be), then fix the code to match.

## Documentation Sync — Trigger Table

| Change Type | Update Required |
|-------------|----------------|
| New design token added | Update `THEME_DATA_MAP.md` Section 1 (Entity Schema) |
| New export format or field | Update `THEME_DATA_MAP.md` Section 2 (Data Flow) + Section 3 (Frontend Consumers) |
| New variant or layout type added | Update `THEME_DATA_MAP.md` + `docs/DOMAIN.md` (Business Rules) |
| New route or page | Update `docs/INDEX.md` routing table |
| Bug fix revealing a systemic pattern | Add to CLAUDE.md Critical Patterns |

## Critical Patterns

### CSS & Token Handling
- **NEVER use inline styles for design tokens** — all tokens live as CSS custom properties (e.g., `--color-primary`)
- **CSS custom properties are the source of truth at runtime** — the JS Theme object mirrors them for export logic
- **Token naming**: CSS vars use kebab-case (`--color-primary`), JS/TS fields use camelCase (`colorPrimary`), export MD uses snake_case (`color_primary`)

### Export Integrity
- **Markdown export**: use exact snake_case field names from the Data Map (e.g., `color_primary`, `font_size_base`)
- **JSON export**: use `JSON.stringify(tokens, null, 2)` — never hand-write JSON strings
- **CSS export**: output `:root { --[token-name]: [value]; }` format — token names must match the CSS var names in the app

### TypeScript
- **Strict mode is non-negotiable** — `"strict": true` in tsconfig.json, no exceptions
- **No `any` types** — use `unknown` and narrow it if you need escape hatches
- **Theme types MUST match the Data Map exactly** — field names, types, and optionality must align

### Accessibility
- **Every template**: must provide a `primaryForeground` color that passes WCAG AA (4.5:1) against `primary`
- **Interactive elements**: all buttons and controls must have visible `:focus-visible` styles
- **Contrast warnings**: show a badge on the preview, but do not block export

### Security
- **Security Threat Model is mandatory for every new feature** — document the threat model before writing code: (1) what user input reaches the DOM, (2) how it's validated, (3) whether it appears in exports, (4) injection vectors, (5) download filename derivation, (6) any new network requests.
- **React does NOT sanitize CSS custom property values.** Values in `style={{ '--color-primary': val }}` go verbatim to the DOM. The `TokenEditor` validation layer is the SOLE defense. Treat it as mandatory, not optional UX.
- **CSS injection risk — validation rules by token type**:
  - Hex colors: `/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/` — reject and keep last valid on failure
  - Spacing / radius / font-size: `/^\d+(\.\d+)?(px|rem|em|%)$/` — reject on failure
  - Font weight: `/^\d{3}$/` — reject on failure
  - Line height: `/^\d+(\.\d+)?$/` — reject on failure
  - Letter spacing: `/^-?\d+(\.\d+)?(px|em|rem)$/` — reject on failure
  - **Font family — allowlist ONLY**: `/^[a-zA-Z0-9 ,\-_.']+$/` max 100 chars. Use literal space `[ ]`, NOT `\s` — `\s` matches `\n` which is an injection vector. Do NOT use a strip list (misses `@`, `(`, `)`, `/`, `*`). Reject and revert on failure.
- **Initial variant values are the trust boundary.** Variant values in `variants.ts` bypass `TokenEditor` validation. Every string in `variants.ts` must be manually verified as clean. The file has a security comment to this effect.
- **Prompt injection risk in exports**: motif exports Markdown consumed by AI agents. `fontFamily` (user-editable) must pass the allowlist before appearing in MD or CSS exports. Fall back to `'system-ui'` if it fails at export time. `JSON.stringify` handles escaping for JSON — no additional sanitization needed there.
- **Color picker `onChange` MUST be debounced**: Use `useRef` to hold the `setTimeout` timer (80ms). Clear in `useEffect` cleanup to prevent post-unmount state updates. Do NOT call `updateSection` on every color picker pixel — use debounce or `startTransition`.
- **Download filename**: NEVER derive the download filename from user input. Use hardcoded names only (`design_rules.md`, `design_tokens.json`, `variables.css`, `tailwind.config.js`, `theme.css`).
- **Dependency discipline**: Prefer zero new dependencies for utility functions (hex validation, contrast math are simple enough inline). When adding any dependency, run `pnpm audit` and check for CRITICAL/HIGH CVEs before merge.
- **No network requests**: motif is offline-first. Any `fetch()`, `XMLHttpRequest`, or external URL reference is a flag — get explicit approval before adding it.

### Build & Config
- **Two separate config files**: `vite.config.ts` imports from `'vite'`; `vitest.config.ts` imports from `'vitest/config'`. Never merge them — `vitest/config` ships Vite 5 internally and causes type conflicts with Vite 6.
- **tsconfig.json includes `src/` only** — config files (`vite.config.ts`, `vitest.config.ts`) are excluded from `tsc --noEmit` to avoid cross-version type conflicts.
- **esbuild build scripts**: `package.json` must include `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` — required for Vite to function after a fresh `pnpm install`.
- **Export token count**: the JSON export produces exactly **44 tokens** (15 colors + 12 typography + 7 spacing + 6 radius + 4 shadows). Verified by `toHaveLength(44)` in `src/utils/export.test.ts`.

### Documentation Drift Prevention
- **Rule**: After any PR that renames a file, adds a component, changes token counts, or adds an export format — verify `CLAUDE.md`'s project-structure section and every numeric claim in Critical Patterns against the live code. Fix drift in the SAME PR. Never promise a follow-up.
- **Why**: Fast iteration during gap-closure-v2 and the UI redesign left CLAUDE.md with 10 stale references (wrong filenames, missing components, wrong token count, missing layouts) that persisted across multiple sessions before being caught.
- **Where**: `CLAUDE.md` (project-structure section; Build & Config token-count claim); `docs/data-maps/THEME_DATA_MAP.md` (entity schemas, field counts, export format list)
- **Check**: `Glob src/components/**/*.tsx` vs component list; `Glob src/utils/*.ts` vs utils list; token count in Build & Config must match `toHaveLength()` assertion in `src/utils/export.test.ts`; variant count must match `STYLE_VARIANTS.length` in `src/data/variants.ts`; layout count must match `IMPLEMENTED` map in `src/components/LayoutPreview.tsx`.

### Component Patterns
- **No prop drilling beyond 2 levels** — lift state to a React context if needed
- **`useCallback`/`useMemo`** for expensive computations (e.g., contrast ratio calculations)
- **No effects for derived state** — compute from existing state directly
- **`TokenEditor` must NOT call `useTheme()` directly** — it receives `theme` and `updateSection` as props from `App`. Calling `useTheme()` inside `TokenEditor` would create isolated state disconnected from `LayoutPreview`.
- **Tab state is always local** — `LayoutPreview` page tabs and `ExportPreview` format tabs use local `useState`. Never lift tab state to `App`.

## Project Structure

```
motif/
├── CLAUDE.md                         # AI constitution (this file)
├── AGENTS.md                         # AI agent contributor guide (Claude Code ignores via .claudeignore)
├── README.md                         # Project overview and quickstart
├── LICENSE                           # MIT License
├── CONTRIBUTING.md                   # Contributor workflow and constraints
├── SECURITY.md                       # Security policy and known surfaces
├── .claudeignore                     # Files excluded from AI context
├── llms.txt                          # Machine-readable project summary
├── docs/
│   ├── INDEX.md                      # Central doc navigation
│   ├── DOMAIN.md                     # Business domain & business rules
│   ├── PERSONAS.md                   # User personas
│   └── data-maps/
│       ├── INDEX.md                  # Data map index
│       └── THEME_DATA_MAP.md         # Core data contract
├── .claude/
│   └── settings.json                 # Local machine settings (gitignored)
├── .github/
│   ├── workflows/ci.yml              # CI pipeline
│   └── PULL_REQUEST_TEMPLATE.md     # PR quality checklist
├── memory/
│   └── MEMORY.md                     # Active session memory (gitignored, local only)
├── src/
│   ├── main.tsx                      # App entry point
│   ├── App.tsx                       # Root component
│   ├── types/
│   │   └── theme.ts                  # TypeScript types (must match Data Map)
│   ├── data/
│   │   └── variants.ts               # 10 style variant definitions (SECURITY: values are trust boundary)
│   ├── components/
│   │   ├── LayoutGallery.tsx         # 8 layout type selector cards (dark sidebar)
│   │   ├── LayoutPreview.tsx         # CSS var injector + layout/components/tokens view dispatcher
│   │   ├── TokenEditor.tsx           # Token editor (validation, debounce, WCAG contrast, palette gen UI)
│   │   ├── ExportPreview.tsx         # 5-format export preview (MD/JSON/CSS/TW v3/TW v4) + copy/download
│   │   ├── ShareButton.tsx           # Copy shareable URL button (base64 hash state)
│   │   ├── ComponentsView.tsx        # Component gallery: buttons/inputs/cards/badges/alerts/focus demo
│   │   ├── SystemTokensView.tsx      # Raw token display: colors/typography/spacing/radius/shadows
│   │   └── layouts/
│   │       ├── SaasLayout.tsx        # SaaS dashboard mockup (tabIndex={-1} on all interactive elements)
│   │       ├── BlogLayout.tsx        # Blog/content site mockup
│   │       ├── LandingLayout.tsx     # Landing page mockup
│   │       ├── PortfolioLayout.tsx   # Portfolio site mockup
│   │       ├── EcommerceLayout.tsx   # E-commerce store mockup
│   │       ├── DocsLayout.tsx        # Documentation site mockup
│   │       ├── CommunityLayout.tsx   # Community/forum mockup
│   │       └── MobileLayout.tsx      # Mobile app frame mockup
│   ├── hooks/
│   │   └── useTheme.ts               # Theme state (layoutType + variant + colorMode + overrides); URL hash sharing
│   ├── utils/
│   │   ├── contrast.ts               # WCAG 2.1 contrast math
│   │   ├── export.ts                 # 5-format export: MD/JSON/CSS/TW v3/TW v4 (44 tokens)
│   │   ├── export.test.ts            # 26 export tests; toHaveLength(44) is the token-count contract
│   │   ├── palette.ts                # OKLCH palette generator — zero deps; generatePalette(seedHex)
│   │   └── palette.test.ts           # 21 palette tests: WCAG AA, hex validation, determinism, edge cases
│   └── styles/
│       └── global.css                # Global CSS + CSS custom properties
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Warnings

- **No server**: Any feature requiring a backend server is out of scope. Export = client-side file download only.
- **Google Fonts is the only allowed external CDN**: Any other `fetch()`, `XMLHttpRequest`, or external URL reference needs explicit approval.
- **Community contributors**: This is open source. Do not merge PRs that skip CI (type check, lint, build, tests must all pass).
- **Contrast checker**: Do not use third-party contrast libraries unless vetted — the calculation is simple enough to implement inline (WCAG formula uses relative luminance).
- **Template hierarchy**: Layout type ≠ color scheme. "Dark mode" is a toggle, not a template. "Glassmorphism" is a style variant, not a layout. Never conflate these axes. See docs/DOMAIN.md for the canonical template hierarchy.
- **Non-designer controls**: Never add freeform text inputs for spacing, radius, typography, or any non-color token. The user cannot evaluate raw CSS values. Use sliders, steppers, and presets. See docs/DOMAIN.md Non-Designer UX Mandate.
