# Security Policy

## Scope

motif is a 100% client-side web tool with no backend, no user accounts, no server-side storage,
and no PII collection. There is no authentication layer and no network requests beyond Google
Fonts CDN (typography preview only).

## Known attack surfaces

| Surface | Mitigation |
|---------|------------|
| CSS injection via color/spacing token inputs | All token values are validated in `TokenEditor` before entering state. Hex colors, spacing, radius, font-size, and font-family each have strict allowlists/regexes. Invalid values are rejected and reverted. |
| Prompt injection via fontFamily in Markdown export | `safeFontFamily()` in export.ts validates font-family values against an allowlist before interpolating into MD/CSS exports. Newlines are explicitly blocked (literal `[ ]` space, not `\s`). Fallback: `system-ui`. |
| CSS export injection | Same `safeFontFamily()` validation applied to CSS export. JSON export uses `JSON.stringify()` which handles escaping natively. |

## Reporting

If you discover a security issue, please open a
[GitHub Issue](https://github.com/Khalid-Moukhtar/motif/issues) with the label `security`.
For sensitive disclosures, use GitHub's private vulnerability reporting feature
(Security tab -> Report a vulnerability).

Please do not open public issues for unconfirmed vulnerabilities.
