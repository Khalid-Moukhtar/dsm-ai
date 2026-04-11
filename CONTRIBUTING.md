# Contributing to motif

Thanks for your interest in contributing.

## Workflow

All contributions follow the same process:

1. **Fork** the repository
2. **Branch** off main: use a descriptive branch name (e.g. `feat/new-variant`, `fix/export-bug`)
3. **Implement** following the project conventions in CLAUDE.md
4. **Run the full CI gate locally** before opening a PR:
   - `pnpm exec tsc --noEmit` -- 0 errors
   - `pnpm run lint` -- 0 warnings
   - `pnpm run build` -- Vite build passes
   - `pnpm audit --audit-level=high` -- no HIGH/CRITICAL CVEs
   - Run relevant tests: `pnpm exec vitest run src/utils/export.test.ts`
5. **Open a PR** using the template in `.github/PULL_REQUEST_TEMPLATE.md` -- fill in every section
6. **CI must pass** -- the PR template check, type check, lint, build, and tests are all required

## Key constraints

- **Vanilla CSS only** -- no Tailwind, no CSS-in-JS, no styled-components
- **No backend** -- 100% client-side; any feature requiring a server is out of scope
- **Non-designer controls** -- sliders, presets, and dropdowns only for non-color tokens (no raw CSS inputs)
- **pnpm** -- never npm or yarn
- **Export integrity** -- any new design token must appear in all 5 export formats in the same PR
- **Token count** -- the JSON export has exactly 44 tokens; the `toHaveLength(44)` test in export.test.ts enforces this

## Questions

Open an issue before starting large changes to discuss the approach.
