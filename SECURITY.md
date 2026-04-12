# Security Policy

## Scope

motif is a 100% client-side web tool with no backend, no user accounts, and no PII collection.
There is no authentication layer. Network requests are limited to two trusted external services:
Google Fonts CDN (typography preview) and PostHog EU (anonymous usage analytics).

## Known attack surfaces

| Surface | Mitigation |
|---------|------------|
| CSS injection via color/spacing token inputs | All token values are validated in `TokenEditor` before entering state. Hex colors, spacing, radius, font-size, and font-family each have strict allowlists/regexes. Invalid values are rejected and reverted. |
| Prompt injection via fontFamily in Markdown export | `safeFontFamily()` in export.ts validates font-family values against an allowlist before interpolating into MD/CSS exports. Newlines are explicitly blocked (literal `[ ]` space, not `\s`). Fallback: `system-ui`. |
| CSS export injection | Same `safeFontFamily()` validation applied to CSS export. JSON export uses `JSON.stringify()` which handles escaping natively. |
| Analytics data leakage | PostHog is configured with `autocapture: false`, `persistence: 'memory'`, and IP discard enabled. Only explicitly named events are captured via typed wrappers in `src/utils/analytics.ts`. No user input reaches PostHog. |

## Reporting

If you discover a security issue, please open a
[GitHub Issue](https://github.com/Khalid-Moukhtar/motif/issues) with the label `security`.
For sensitive disclosures, use GitHub's private vulnerability reporting feature
(Security tab -> Report a vulnerability).

Please do not open public issues for unconfirmed vulnerabilities.
