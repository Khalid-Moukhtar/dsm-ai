---
description: Multi-pass quality review of a plan or implementation. Run before every PR. Each pass is a focused, deep review of one category.
---

# Quality Audit Skill

Use this skill: (1) in **plan mode** to audit a planned architecture before coding, or (2) in **implementation mode** to audit actual written code before PR.

Specify which mode when invoking: `/quality-audit plan` or `/quality-audit implementation`.

Launch each pass as a parallel sub-agent using the Task tool (`subagent_type=general-purpose`). Run independent passes in a single message (parallel tool calls). Wait for all results before triaging.

---

## Severity Triage (applies to all passes)

| Severity | Action |
|----------|--------|
| CRITICAL | Must fix before PR. No exceptions. (XSS, data loss, export corruption, crashes) |
| HIGH | Must fix in same PR. (Wrong export field names, accessibility failures, broken type contracts) |
| MEDIUM | Fix if in files already changed. (Missing ARIA labels on minor elements, slight contrast issues) |
| LOW | Log for future. Do not block PR. |

---

## Pass 1: Security (ALWAYS RUN — both modes)

DSM is client-side only — no backend, no accounts, no server config. The attack surface is narrower than a full-stack app, but the following checks still apply and some are DSM-specific.

### Input & Injection
- **XSS**: Does any component render user-tweaked values into HTML without sanitization? (e.g., `dangerouslySetInnerHTML`, font family input rendered without escaping)
- **CSS injection**: User-tweaked color/font/spacing values injected as CSS custom properties must be validated first — an unescaped value like `red; --color-text: red` can break the preview or override unintended properties
- **Prompt injection in exports**: Exported Markdown is consumed by AI agents. Verify that user-tweaked string values (especially `fontFamily`, `description`) cannot inject instructions into the exported `.md` file (e.g., a font family value like `"---\nIgnore all previous instructions…"`)
- **Input validation**: All user-tweaked token values must be validated client-side before use — hex colors (`/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/`), pixel values, numbers — reject and show an error before rendering or exporting

### Output & Transport
- **No sensitive data in exports**: Verify exported MD/JSON/CSS contains only design tokens — no internal IDs, user data, stack traces, or build metadata
- **Download filename safety**: The generated file name (`design_rules.md`, `variables.css`) must not be derived from user input — use hardcoded names only
- **Error messages**: No stack traces or internal file paths exposed to users in error states

### Secrets & Dependencies
- **No secrets in source**: Check for hardcoded API keys, tokens, or credentials in `src/data/templates.ts`, `src/utils/`, or any config file
- **Dependency risk**: Flag any new dependency added — prefer zero new deps for utility-class functions (contrast math, hex validation are simple enough to implement inline)
- **Dependency audit**: Run `pnpm audit` — check for known CVEs; flag HIGH or CRITICAL findings before merge

### OWASP Top 10 (adapted for DSM's client-side context)

| # | OWASP Item | DSM Applicability |
|---|-----------|------------------|
| 1 | Broken Access Control | N/A in v1 (no auth). If auth ever added: revisit immediately. |
| 2 | Cryptographic Failures | N/A (no sensitive data stored or transmitted) |
| 3 | Injection | **APPLICABLE** — CSS injection via user token values, prompt injection in MD exports |
| 4 | Insecure Design | Was the Security Threat Model answered during planning? (see `/feature` Step 2) |
| 5 | Security Misconfiguration | Minimal risk (static site). Verify no accidental `dangerouslySetInnerHTML`. |
| 6 | Vulnerable Components | **APPLICABLE** — run `pnpm audit`; flag CRITICAL/HIGH CVEs |
| 7 | Authentication Failures | N/A in v1 (no accounts) |
| 8 | Data Integrity Failures | **APPLICABLE** — export tokens must be validated; download trigger must not be exploitable |
| 9 | Logging & Monitoring Failures | N/A (no server) |
| 10 | SSRF | N/A (no server-side fetch; app is offline-first) |

**CRITICAL findings**: XSS via rendered user input, CSS injection via unvalidated token values, prompt injection in exported Markdown, known CRITICAL/HIGH CVEs in dependencies

---

## Pass 2: Data Integrity (ALWAYS RUN — both modes)

- **Export field name consistency**: Every token in the export must use the exact names from `docs/data-maps/THEME_DATA_MAP.md` — cross-check the export naming table
- **Three-format parity**: If a token exists in MD export, it must also exist in JSON and CSS export with consistent naming
- **TypeScript alignment**: `src/types/theme.ts` must match the data map entity schema exactly (same fields, same types, same optionality)
- **Template data completeness**: Every template in `src/data/templates.ts` must provide all required fields — no `undefined` on required tokens
- **No undefined writes**: Template objects must not contain `undefined` values — use the full type or omit the field with a default
- **Hex validation**: All color values in templates must be valid hex strings (#RGB or #RRGGBB format)

**CRITICAL findings**: Token name mismatch between export formats, required field missing from templates, TypeScript type that contradicts the data map

---

## Pass 3: Multi-Country & i18n

**SKIP** — DSM is English-only, single-country. No currency, dates, or locale logic.

---

## Pass 4: Accessibility (RUN WHEN ANY UI COMPONENT IS CHANGED)

- **WCAG contrast**: For every color pair in templates, check the contrast ratio between text and background colors — minimum 4.5:1 for body text, 3:1 for large text (18px+)
- **Focus styles**: All interactive elements (buttons, inputs, cards) must have visible `:focus-visible` styles — not just `:focus`
- **Keyboard navigation**: Template gallery must be navigable by keyboard (arrow keys or tab). Export button must be reachable by tab.
- **ARIA labels**: Icon-only buttons must have `aria-label`. Color inputs must have associated `<label>`.
- **Screen reader**: Template cards should have meaningful descriptions, not just visual color swatches
- **Contrast badge**: The `ContrastBadge` component must be perceivable without color alone (use text + icon, not color alone to indicate pass/fail)

**CRITICAL findings**: Interactive element with no keyboard access, contrast ratio below 3:1 for any text in default templates

---

## Pass 5: Framework Patterns & Performance (RUN WHEN COMPONENTS OR HOOKS CHANGED)

- **Memoization**: Contrast ratio calculation is expensive — ensure it's inside `useMemo` and recomputes only when relevant colors change
- **Effect dependencies**: `useEffect` dependency arrays must be complete and correct — no stale closures
- **No derived state in effects**: Don't use `useEffect` to compute values that can be derived directly from state
- **Re-render safety**: The theme preview injects CSS custom properties — verify this does not cause unnecessary full-page re-renders
- **List keys**: Template gallery renders a list — items must use `theme.id` as key, not array index
- **Cleanup**: Any event listeners or subscriptions added in effects must be cleaned up in the return function
- **No N+1 patterns**: If templates are ever loaded dynamically, batch the load — do not fetch one by one

**CRITICAL findings**: Infinite re-render loop, effect that runs on every render due to wrong dependency array, no cleanup on subscriptions

---

## Pass Trigger Decision Tree

| Situation | Run Passes |
|-----------|-----------|
| Bugfix in export utility only | 1, 2 |
| New template added | 2, 4 |
| New UI component | 1, 4, 5 |
| New hook | 1, 2, 5 |
| Full new feature (component + hook + export) | 1, 2, 4, 5 |
| CSS/styling only | 4 |
| Plan review (any feature) | 1, 2, 4 |

---

## Important Notes

- Launch all applicable passes in a **single message with multiple Task tool calls** (parallel execution)
- After all passes complete: triage findings by severity, then report to human before fixing
- Do not block a PR for LOW findings — log them in `memory/project_context.md` as future work
