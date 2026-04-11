---
description: Build a new feature or module for DSM. Covers research, planning, data map, audit, implementation, CI gate, PR, and memory update.
---

# Feature Skill

Use this skill for: new template additions, new editor controls, new export formats, new UI components, or any capability that doesn't exist yet.

---

## Step 1: Research

- [ ] Check `memory/project_context.md` for prior decisions about this feature area
- [ ] Search the codebase for similar patterns (similar components, hooks, export logic)
- [ ] Read `docs/data-maps/THEME_DATA_MAP.md` — identify if new tokens or entities are needed
- [ ] Identify if the feature adds new design tokens (must be added to the data map first)

---

## Step 2: Plan

Use `EnterPlanMode` to design the implementation before writing any code.

The plan must cover:
- Which files to create or modify
- Any new TypeScript types needed (and how they extend `Theme`)
- Any new design tokens to add to the data map
- How the new feature is exposed in the UI (component tree, routing if any)
- How the user discovers the feature (button, tab, tooltip, etc.)
- Accessibility: keyboard interaction, ARIA labels, focus management
- Export impact: does this feature add new tokens to the export output?
- **Security threat model**: what are the attack surfaces? (See checklist below)

**Security Threat Model — answer these before coding:**
1. What data does this feature read or write? Is any of it user-generated content that could be rendered or exported?
2. Does this feature accept user text input? What's the worst string a malicious user could submit? (e.g., CSS injection via a color field, prompt injection via a font family name in the exported Markdown)
3. Does this feature make any network requests? DSM is offline-first — flag any fetch/XHR and get approval before adding it.
4. Could this feature be abused? (e.g., an export that generates a file large enough to crash the browser tab, a loop that overwhelms the renderer)
5. Does the feature download a file? Verify: the filename is hardcoded (not user-derived), the content is bounded in size, and the Blob type is correct (`text/plain`).
6. If this feature fails, what's the blast radius? (For DSM: local only — no server-side data, no other users affected. But a crash or frozen tab is still a bad user experience.)

---

## Step 3: Update the Data Map (MANDATORY)

**No map, no code.**

- [ ] If the feature adds new design tokens: add them to `docs/data-maps/THEME_DATA_MAP.md` Section 1 (Entity Schema)
- [ ] If the feature adds new export fields: add the field names to the export naming table in Section 1, and update Section 2 (Data Flow)
- [ ] If the feature adds new components: add them to Section 3 (Frontend Consumers)
- [ ] Update `docs/data-maps/INDEX.md` if a new data map is needed

---

## Step 4: Audit the Plan (MANDATORY)

Invoke `/quality-audit` in **plan mode** on the planned architecture.

Focus on:
- Pass 1 (Security) — any XSS risk if rendering user-tweaked values? Sanitize inputs.
- Pass 2 (Data Integrity) — do all new token types have the right TypeScript constraints?
- Pass 4 (Accessibility) — does the planned UI have keyboard support and ARIA labels?

Fix any CRITICAL or HIGH findings in the plan before proceeding to implementation.

---

## Step 5: Implement

DSM is 100% client-side. No backend. No external API calls.

Frontend checklist:
- [ ] New TypeScript types added to `src/types/theme.ts` — must match the data map exactly
- [ ] New template data added to `src/data/templates.ts` (if adding a template)
- [ ] Export utility updated in `src/utils/export.ts` — all three formats (MD, JSON, CSS) in sync
- [ ] New component created in `src/components/` with keyboard accessibility
- [ ] CSS custom properties added to `src/styles/global.css` (if new tokens)
- [ ] `useTheme` hook updated in `src/hooks/useTheme.ts` if state shape changes
- [ ] No hardcoded design values outside of `src/data/templates.ts`
- [ ] No `any` types — strict TypeScript throughout
- [ ] No inline styles for design tokens — use CSS custom properties

---

## Step 6: Quality Audit — Post-Implementation (MANDATORY)

Invoke `/quality-audit` in **implementation mode** on the actual written code.

For a full feature, run all applicable passes:
- Pass 1 (Security) — check for XSS in any rendered user input
- Pass 2 (Data Integrity) — verify export token names match data map exactly
- Pass 4 (Accessibility) — WCAG contrast, keyboard nav, ARIA
- Pass 5 (Framework Patterns) — hooks, memoization, no N+1, cleanup

Fix ALL CRITICAL and HIGH findings before PR.

---

## Step 7: CI Gate + PR (MANDATORY)

Invoke `/pr`.

---

## Step 8: Update Memory + Data Map

- [ ] Finalize `docs/data-maps/THEME_DATA_MAP.md` with anything discovered during implementation
- [ ] Cross-check ALL modified fields against the data map — every token name must be consistent
- [ ] Update `memory/project_context.md` under "Journey History" with a brief entry about what was added

---

## Important Notes

- **Vanilla CSS only** — do not introduce Tailwind, CSS Modules, or styled-components
- **Export consistency** — any new token must appear in all three export formats in the same PR
- **No backend** — if a feature idea requires server-side logic, flag it to the human before proceeding; it is out of scope for v1
- **Template defaults must be accessible** — run contrast check on any new template before adding it
