# DSM (Design System Maker) — AI Agent Instructions

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
9. **No backend** — this is 100% client-side. Never introduce server-side logic or external API calls.
10. **Export format integrity** — ALL export formats (MD, JSON, CSS) must match the Data Map field names exactly

## Canonical Workflows

| Task type | Skill |
|-----------|-------|
| Bug fix, audit finding, security patch | `/bugfix` |
| New feature, new module | `/feature` |
| Quality review (plan or code) | `/quality-audit` |
| CI gate + PR creation | `/pr` |

**Rule**: Every task follows a skill. Do not improvise.
**Rule**: Read the Data Map FIRST — `docs/data-maps/THEME_DATA_MAP.md` — before touching source code.
**Rule**: There is NO backend. Every feature must work purely in the browser.

## Common Implementation Checklist

Before marking any task done, verify:
- [ ] No TypeScript errors (`pnpm exec tsc --noEmit` exits 0)
- [ ] No lint warnings (`pnpm run lint` exits 0 with --max-warnings 0)
- [ ] Vite build succeeds (`pnpm run build` exits 0)
- [ ] Export output tested — generated MD/JSON/CSS is valid and matches Data Map field names
- [ ] Color contrast: all template defaults meet WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] No hardcoded design values outside of `src/data/templates.ts`
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
| New template added | Update `THEME_DATA_MAP.md` + `docs/DOMAIN.md` (Business Rules) |
| New route or page | Update `docs/INDEX.md` routing table |
| Bug fix revealing a systemic pattern | Add to CLAUDE.md Critical Patterns + `memory/project_context.md` |

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
- **Security Threat Model is mandatory for every new feature** — answer the 6 questions in `/feature` Step 2 before writing code. Document answers in the plan.
- **CSS injection risk**: User-tweaked token values (colors, font families, sizes) injected as CSS custom properties MUST be validated before use. An unescaped value like `red; --color-text: red` breaks the preview. Always validate hex format (`/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/`) before applying.
- **Prompt injection risk in exports**: DSM exports Markdown consumed by AI agents. String tokens (especially `fontFamily`, template `description`) must not be user-free-text that could inject instructions. Validate or sanitize any user-supplied string before it appears in the MD export.
- **Download filename**: NEVER derive the download filename from user input. Use hardcoded names only (`design_rules.md`, `design_tokens.json`, `variables.css`).
- **Dependency discipline**: Prefer zero new dependencies for utility functions (hex validation, contrast math are simple enough inline). When adding any dependency, run `pnpm audit` and check for CRITICAL/HIGH CVEs before merge.
- **No network requests**: DSM is offline-first. Any `fetch()`, `XMLHttpRequest`, or external URL reference is a flag — get explicit approval before adding it.

### Build & Config
- **Two separate config files**: `vite.config.ts` imports from `'vite'`; `vitest.config.ts` imports from `'vitest/config'`. Never merge them — `vitest/config` ships Vite 5 internally and causes type conflicts with Vite 6.
- **tsconfig.json includes `src/` only** — config files (`vite.config.ts`, `vitest.config.ts`) are excluded from `tsc --noEmit` to avoid cross-version type conflicts.
- **esbuild build scripts**: `package.json` must include `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` — required for Vite to function after a fresh `pnpm install`.
- **Export token count**: the JSON export produces exactly **38 tokens** (13 colors + 12 typography + 7 spacing + 6 radius).

### Component Patterns
- **No prop drilling beyond 2 levels** — lift state to a React context if needed
- **`useCallback`/`useMemo`** for expensive computations (e.g., contrast ratio calculations)
- **No effects for derived state** — compute from existing state directly

## Project Structure

```
dsm-ai/
├── CLAUDE.md                         # AI constitution (this file)
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
│   └── skills/                       # Executable AI workflows
│       ├── bugfix/SKILL.md
│       ├── feature/SKILL.md
│       ├── pr/SKILL.md
│       └── quality-audit/SKILL.md
├── .github/
│   ├── workflows/ci.yml              # CI pipeline
│   └── PULL_REQUEST_TEMPLATE.md     # PR quality checklist
├── memory/
│   └── project_context.md           # Persistent AI memory
├── src/
│   ├── main.tsx                      # App entry point
│   ├── App.tsx                       # Root component
│   ├── types/
│   │   └── theme.ts                  # TypeScript types (must match Data Map)
│   ├── data/
│   │   └── templates.ts              # Built-in design system templates
│   ├── components/                   # React UI components
│   ├── hooks/                        # Custom React hooks
│   ├── utils/
│   │   └── export.ts                 # MD/JSON/CSS export utilities
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
- **No external API calls**: The app works fully offline. No fetching remote data at runtime.
- **Community contributors**: This is open source. Do not merge PRs that bypass the skill workflows or skip CI.
- **Contrast checker**: Do not use third-party contrast libraries unless vetted — the calculation is simple enough to implement inline (WCAG formula uses relative luminance).
