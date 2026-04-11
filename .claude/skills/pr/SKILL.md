---
description: Run the full CI gate locally and create a pull request. Every PR must pass this before merge.
disable-model-invocation: true
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

## Step 5: Security Audit

```bash
pnpm audit --audit-level=high
```

- [ ] Must exit 0 — no HIGH or CRITICAL CVEs
- [ ] If a vulnerability is found: update the dependency, do not bypass

---

## Step 6: Cleanup

- [ ] No dead code or unused imports
- [ ] No `console.log` debug statements
- [ ] No unresolved TODO/FIXME (create a GitHub issue if needed)
- [ ] No secrets, API keys, or credentials in code
- [ ] No `.env` files staged

---

## Step 7: Documentation Sync (Hard Gate)

This is a **hard gate**, not a box-check. `CLAUDE.md` and `THEME_DATA_MAP.md` describe what the code *should* look like. This step verifies they still match what the code *actually* looks like. Drift is caught and fixed in THIS PR — not a follow-up, not "next session."

> **Why this step has teeth.** During fast iteration (renames, refactors, feature bursts) code moves faster than docs. The PR boundary is the one moment where we force the catch-up. If drift crosses a PR boundary it persists indefinitely and becomes a future bug source.

### 7a. List the docs to check

Every document that describes any part of the code you touched:

- `CLAUDE.md` → project-structure section (file paths, component list, layout list, util list); Build & Config token-count claim; Security section trust-boundary filename
- `docs/data-maps/THEME_DATA_MAP.md` → entity schemas, field counts, export format list, frontend consumer list
- `memory/project_context.md` → decisions log (if a new architectural decision was made this PR)

### 7b. Verify each doc against reality

Open the doc alongside the code. Do **not** trust memory. Confirm with tools:

- **File paths** → do the files still exist at those paths? Run `Glob src/components/**/*.tsx` and `Glob src/utils/*.ts` and check each entry against the CLAUDE.md project-structure list.
- **Named components** → does every component listed in CLAUDE.md still exist under that exact filename?
- **Numeric claims** → token count in CLAUDE.md Build & Config must match `toHaveLength()` in `src/utils/export.test.ts`; variant count (currently 10) must match `STYLE_VARIANTS` array in `src/data/variants.ts`; layout count (currently 8) must match `IMPLEMENTED` map in `src/components/LayoutPreview.tsx`; export format count (currently 5) must match `FORMATS` array in `src/components/ExportPreview.tsx`.
- **Lists** → every layout in `src/components/layouts/` listed in CLAUDE.md? Every new util listed?
- **Field names** → `ColorPalette` fields in `src/types/theme.ts` match the token table in `THEME_DATA_MAP.md`?
- **Bug fix pattern** → if this PR fixes a systemic issue, is the prevention rule written into `CLAUDE.md` Critical Patterns AND `memory/project_context.md`?

### 7c. Fix drift in this PR

When drift is found:
1. Decide which side is correct. `THEME_DATA_MAP.md` records *intent* — usually code should match it; if the product changed deliberately, the data map is stale and must be rewritten first.
2. Update the wrong side.
3. Stage the fix in this PR. Never promise a follow-up.

### 7d. Capture recurring drift as a rule

If the same class of drift has appeared in at least two PRs (e.g., file renames not synced to CLAUDE.md, token counts going stale), add a one-line prevention rule to the Critical Patterns section of `CLAUDE.md` following the mistake-pipeline format: Rule / Why / Where / Check.

### Hard rule

**Every PR must include an explicit doc-sync statement in the PR body**, one of:

- "Doc sync: verified `CLAUDE.md` project structure and `THEME_DATA_MAP.md` — no updates needed."
- "Doc sync: updated `CLAUDE.md` [section] and/or `THEME_DATA_MAP.md` [section] because [reason]."

Silence is not allowed. The PR body's "Data Map Updates" section is where this statement lives.

---

## Step 8: Commit + Push + Create PR

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

4. Create PR using `gh pr create` with the body copied exactly from `.github/PULL_REQUEST_TEMPLATE.md` — do NOT write a body from scratch or from memory. Fill in every section. All Quality Checklist checkboxes must be explicitly checked (`[x]`) or left unchecked (`[ ]`) with a reason.

> **Why this is explicit:** in PR #6 the template was bypassed by writing a body from memory. The CI check (`pr-template-check.yml`) will now block merges with missing sections, but the correct behaviour is to never reach that failure — read the template first.

5. If you need to amend a PR description after creation, **first check the PR is still open**:

```bash
gh pr view <number> --json state -q .state
# Must output "OPEN" — if MERGED or CLOSED, stop. Never edit a merged/closed PR.
```

---

## Important Notes

- **NEVER push to main** — always use a feature/fix branch
- **NEVER use `git add -A`** — stage only the files you intentionally changed
- **NEVER skip the build check** — Vite build catches things TSC misses
- **NEVER amend a previous commit** — if a pre-commit hook fails, fix and create a NEW commit
- **NEVER edit a merged or closed PR** — check state before `gh pr edit`
- **NEVER write a PR body from scratch** — always copy from `.github/PULL_REQUEST_TEMPLATE.md`
