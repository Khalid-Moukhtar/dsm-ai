## Summary

<!-- 1-3 bullet points: what changed and why -->

-
-

## Changes

<!-- List files changed and what changed in each -->

- `src/`:

## Data Map Updates

<!-- Explicit statement required — one of:
  "Doc sync: verified CLAUDE.md project structure and THEME_DATA_MAP.md — no updates needed."
  "Doc sync: updated CLAUDE.md [section] and/or THEME_DATA_MAP.md [section] because [reason]."
Silence is not allowed. -->

-

---

## Quality Checklist

### CI Gate
- [ ] `pnpm exec tsc --noEmit` — 0 errors
- [ ] `pnpm run lint` — 0 warnings
- [ ] `pnpm run build` — Vite build passes
- [ ] `pnpm audit --audit-level=high` — no HIGH/CRITICAL CVEs
- [ ] Targeted tests pass (list file paths below)

**Tests run**:
```
pnpm exec vitest run src/[specific-test-file].test.ts
```

### Quality Audit Passes
- [ ] Pass 1 — Security: no XSS, no secrets, input validation verified
- [ ] Pass 2 — Data Integrity: export field names match THEME_DATA_MAP.md exactly (all formats in sync)
- [ ] Pass 3 — UX / Design Integrity: semantic controls only (sliders/dropdowns, no raw CSS inputs added); token naming consistent (kebab CSS, camelCase JS, snake_case MD); no hardcoded design values outside variants.ts
- [ ] Pass 4 — Accessibility: contrast ≥4.5:1, keyboard nav works, ARIA labels present (if UI changed)
- [ ] Pass 5 — Framework Patterns: hooks correct, memoization used, no N+1, cleanup in effects (if components changed)

### Code Quality
- [ ] No dead code or unused imports
- [ ] No `console.log` debug statements
- [ ] No hardcoded design values outside `src/data/variants.ts`
- [ ] No `any` types
- [ ] Vanilla CSS only — no Tailwind, no CSS-in-JS
- [ ] No backend logic introduced

### Documentation Sync (Hard Gate)
<!-- Must pass before merge. -->
- [ ] File paths in CLAUDE.md project-structure verified against `Glob src/components/**/*.tsx` and `Glob src/utils/*.ts`
- [ ] Numeric claims verified: token count matches `toHaveLength()` in export.test.ts; variant count matches `STYLE_VARIANTS.length`; layout count matches `IMPLEMENTED` map; format count matches `FORMATS` array
- [ ] Field names in `ColorPalette` (theme.ts) match token table in THEME_DATA_MAP.md
- [ ] Explicit doc-sync statement written in "Data Map Updates" section above

---

> This PR follows the [motif](../CLAUDE.md) contribution guidelines.
