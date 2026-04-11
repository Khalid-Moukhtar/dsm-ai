---
description: Fix a bug, audit finding, or security issue in DSM. Covers data map check, FE fix, quality audit, CI gate, PR, and memory update.
---

# Bugfix Skill

Use this skill for: fixing broken behavior, resolving quality audit findings, patching accessibility issues, or correcting export output errors.

---

## Step 1: Check the Data Map

Read `docs/data-maps/THEME_DATA_MAP.md` BEFORE touching any source code.

- [ ] Identify which entity or field is affected by the bug
- [ ] If the bug reveals a data map inaccuracy: update the data map FIRST (what it SHOULD be), then fix the code to match
- [ ] Note any export field names involved — they must stay in sync across MD/JSON/CSS formats

---

## Step 2: Reproduce the Bug

- [ ] Identify the exact failure: error message, wrong output, wrong UI state, or wrong export content
- [ ] Trace backward: what called what? Where did the data go wrong?
- [ ] Find the FIRST place it went wrong — that is the root cause. Fix that.

---

## Step 3: Implement the Fix

DSM has no backend. All fixes are client-side only.

- [ ] Fix the root cause (not the symptom)
- [ ] If a design token was misspelled in the export: fix in `src/utils/export.ts` AND verify all three formats (MD, JSON, CSS) are consistent
- [ ] If a type is wrong: fix in `src/types/theme.ts` AND ensure `src/data/templates.ts` template data still matches
- [ ] If a CSS variable is wrong: fix the variable name in `src/styles/global.css` AND in `src/utils/export.ts` CSS format output

---

## Step 4: Quality Audit (MANDATORY)

Invoke `/quality-audit` in **implementation mode** on the changed files.

For a bugfix, typically run:
- Pass 1 (Security) — always
- Pass 2 (Data Integrity) — always — verify export field names match the data map
- Pass 4 (Accessibility) — if any UI component was changed
- Pass 5 (Framework Patterns) — if any hook or component was changed

Fix all CRITICAL and HIGH findings before proceeding.

---

## Step 5: CI Gate + PR (MANDATORY)

Invoke `/pr`.

---

## Step 6: Update Memory + Data Map

- [ ] If the fix changed any documented field, status, or export format: update `docs/data-maps/THEME_DATA_MAP.md`
- [ ] If the bug revealed a systemic pattern: add a rule to `CLAUDE.md` under Critical Patterns
- [ ] Update `memory/project_context.md` under "Resolved Bugs" with: symptom, root cause, fix, rule added (yes/no)

---

## Important Notes

- **No backend** — never introduce server-side logic to fix a client-side bug
- **Export consistency** — any change to a token name must be applied in all three export formats (MD, JSON, CSS) in the same commit
- **Windows TSC** — on Windows, run `pnpm exec tsc --noEmit` as a background task with `dangerouslyDisableSandbox: true` for reliable exit codes
