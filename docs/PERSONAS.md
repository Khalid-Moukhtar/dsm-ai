# motif — Personas & Permissions

> Last updated: 2026-04-12

## Roles

| Role | Description | Default Access Level |
|------|-------------|---------------------|
| Builder | Vibe coder, builder, or non-designer starting a new app who needs a visual design system to hand to their AI coding agent. No design background. Needs to see realistic layouts to know what they want. | Full access to all tool functionality |

There is no authentication. motif is a public, unauthenticated, single-role tool.
All visitors are treated as "Developer" with identical access.

## Capability Matrix

| Capability | Builder |
|-----------|---------|
| Browse template gallery | ✅ |
| Load a template into preview | ✅ |
| Tweak design token values | ✅ |
| See live preview of changes | ✅ |
| Export as Markdown | ✅ |
| Export as JSON | ✅ |
| Export as CSS | ✅ |
| Export as Tailwind v3 | ✅ |
| Export as Tailwind v4 | ✅ |
| Copy shareable URL | ✅ |
| Reset to template defaults | ✅ |

## Role Relationships

Single role — no hierarchy, no reporting lines, no approval chains.

## Delegated Permissions

Not applicable — no authentication, no user accounts.

## Access Control Rules

No server-side access control required (no backend).

Client-side rules:
1. **Export is always allowed**: Even if contrast warnings are present, export is never blocked. The user is informed but in control.
2. **Anonymous analytics only**: Usage events (layout picked, export format used, etc.) are sent to PostHog EU after page load. No personal data is included. See [PRIVACY.md](../PRIVACY.md).
