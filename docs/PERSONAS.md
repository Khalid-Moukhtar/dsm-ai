# DSM (Design System Maker) — Personas & Permissions

> Last updated: 2026-04-09

## Roles

| Role | Description | Default Access Level |
|------|-------------|---------------------|
| Developer | Vibe Coder or AI Developer using DSM to pick and export a design system | Full access to all tool functionality |

There is no authentication. DSM is a public, unauthenticated, single-role tool.
All visitors are treated as "Developer" with identical access.

## Capability Matrix

| Capability | Developer |
|-----------|-----------|
| Browse template gallery | ✅ |
| Load a template into preview | ✅ |
| Tweak design token values | ✅ |
| See live preview of changes | ✅ |
| Export as Markdown | ✅ |
| Export as JSON | ✅ |
| Export as CSS | ✅ |
| Reset to template defaults | ✅ |

## Role Relationships

Single role — no hierarchy, no reporting lines, no approval chains.

## Delegated Permissions

Not applicable — no authentication, no user accounts.

## Access Control Rules

No server-side access control required (no backend).

Client-side rules:
1. **Export is always allowed**: Even if contrast warnings are present, export is never blocked. The user is informed but in control.
2. **No data leaves the browser**: The tool makes no network requests after initial page load.
