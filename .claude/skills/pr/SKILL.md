---
description: Run the full CI gate locally and create a pull request. Every PR must pass this before merge.
---

# PR Skill

Use this skill after implementation and quality audit are complete. This is the final gate before merge.

---

## Step 1: TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] Must exit 0 with zero errors
- [ ] Fix all type errors before continuing

> **Windows note**: On Windows, TSC may give unreliable exit codes as a foreground task. Run with `dangerouslyDisableSandbox: true` in the Bash tool for reliable results.

---

## Step 2: Lint

```bash
pnpm run lint
```

- [ ] Must exit 0 with zero warnings (zero-warning policy — `--max-warnings 0`)
- [ ] Fix all lint issues before continuing

---

## Step 3: Build

```bash
pnpm run build
```

- [ ] Vite build must complete successfully (exit 0)
- [ ] Check for any build-time errors not caught by TSC

---

## Step 4: Targeted Tests

Run ONLY test files relevant to the changed code. NEVER run the full test suite.

```bash
pnpm exec vitest run src/utils/export.test.ts
# or
pnpm exec vitest run src/hooks/useTheme.test.ts
```

- [ ] Run only the specific test file(s) for changed modules
- [ ] Check for NEW failures only — pre-existing failures in unrelated files are not blockers

---

## Step 5: Cleanup

- [ ] No dead code or unused imports
- [ ] No `console.log` debug statements
- [ ] No unresolved TODO/FIXME (create a GitHub issue if needed)
- [ ] No secrets, API keys, or credentials in code
- [ ] No `.env` files staged

---

## Step 6: Documentation Sync

Check the Documentation Sync Trigger Table in `CLAUDE.md`. For each change type, verify the doc is updated:

- [ ] New design token → `THEME_DATA_MAP.md` Section 1 updated
- [ ] New export field → `THEME_DATA_MAP.md` export naming table updated
- [ ] New component → `THEME_DATA_MAP.md` Section 3 updated
- [ ] Systemic bug pattern → `CLAUDE.md` Critical Patterns + `memory/project_context.md` updated

---

## Step 7: Commit + Push + Create PR

1. Stage specific files by name — NEVER `git add -A` or `git add .`
2. Commit with conventional commit message:

```bash
git commit -m "$(cat <<'EOF'
fix(export): correct snake_case field names in CSS export format

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

3. Push:
```bash
git push -u origin [branch-name]
```

4. Create PR using `gh pr create` with this body format:

```markdown
## Summary
- [What changed and why — 1-3 bullet points]

## Changes
- `src/[file]`: [what changed]

## Data Map Updates
- [Which section of THEME_DATA_MAP.md was updated, or "N/A — no data changes"]

## Test Plan
- [x] TSC — 0 errors
- [x] Lint — 0 warnings
- [x] Build — Vite build passes
- [x] [Specific test file] — X/X tests pass
- [x] Quality audit: [passes run] — all PASS
```

---

## Important Notes

- **NEVER push to main** — always use a feature/fix branch
- **NEVER use `git add -A`** — stage only the files you intentionally changed
- **NEVER skip the build check** — Vite build catches things TSC misses
- **NEVER amend a previous commit** — if a pre-commit hook fails, fix and create a NEW commit
