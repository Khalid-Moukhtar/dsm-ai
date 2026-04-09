## Summary

<!-- 1-3 bullet points: what changed and why -->

-
-

## Changes

<!-- List files changed and what changed in each -->

- `src/`:

## Data Map Updates

<!-- Which section of docs/data-maps/THEME_DATA_MAP.md was updated? Or "N/A — no data changes" -->

-

---

## Quality Checklist

### CI Gate
- [ ] `pnpm exec tsc --noEmit` — 0 errors
- [ ] `pnpm run lint` — 0 warnings
- [ ] `pnpm run build` — Vite build passes
- [ ] Targeted tests pass (list file paths below)

**Tests run**:
```
pnpm exec vitest run src/[specific-test-file].test.ts
```

### Quality Audit Passes
- [ ] Pass 1 — Security: no XSS, no secrets, input validation verified
- [ ] Pass 2 — Data Integrity: export field names match THEME_DATA_MAP.md exactly (all 3 formats in sync)
- [ ] Pass 4 — Accessibility: contrast ≥4.5:1, keyboard nav works, ARIA labels present (if UI changed)
- [ ] Pass 5 — Framework Patterns: hooks correct, memoization used, no N+1, cleanup in effects (if components changed)

### Code Quality
- [ ] No dead code or unused imports
- [ ] No `console.log` debug statements
- [ ] No hardcoded design values outside `src/data/templates.ts`
- [ ] No `any` types
- [ ] Vanilla CSS only — no Tailwind, no CSS-in-JS
- [ ] No backend logic introduced

### Documentation Sync
- [ ] `THEME_DATA_MAP.md` updated if new tokens or export fields were added
- [ ] `CLAUDE.md` updated if a new critical pattern was discovered
- [ ] `memory/project_context.md` updated if a systemic bug was fixed

---

> This PR follows the [DSM AI Operating System](../CLAUDE.md) workflow.
