# Privacy Policy

**Effective date**: 2026-04-12
**Project**: motif — https://github.com/Khalid-Moukhtar/motif

---

## What motif collects

motif collects **anonymous, aggregated usage events** to understand how the tool is used.
No personal data is collected at any point.

### Events collected

| Event | When | Properties |
|-------|------|-----------|
| `layout_select` | User picks a layout type | layout name (e.g. `"saas"`) |
| `variant_select` | User picks a style variant | variant name (e.g. `"stripe"`) |
| `color_mode_toggle` | User toggles Light / Dark | mode (`"light"` or `"dark"`) |
| `export_copy` | User copies export to clipboard | format (e.g. `"markdown"`) |
| `export_download` | User downloads export file | format (e.g. `"json"`) |
| `share_copy` | User copies shareable URL | — |
| `randomize` | User clicks Randomize | — |
| `tutorial_skip` | User skips the onboarding tour | step number skipped at |
| `tutorial_complete` | User finishes the onboarding tour | — |
| Page view | Page loaded | — |

### What is NOT collected

- Names, email addresses, or any account information (there are no accounts)
- IP addresses — discarded server-side before storage (PostHog "Discard client IP data" is enabled)
- Cookies — none set, none read
- Persistent identifiers — `persistence: 'memory'` means any session ID resets on tab close
- Keystroke or form data
- Device fingerprints (autocapture is disabled)
- The content of exported files

---

## Who processes the data

Usage events are sent to **PostHog EU** (PostHog, Inc.), hosted on infrastructure in
**Frankfurt, Germany (AWS eu-central-1)**.

- PostHog privacy policy: https://posthog.com/privacy
- PostHog EU data region: events never leave the EU

---

## Legal basis (GDPR)

**Legitimate interest** (GDPR Art. 6(1)(f)): understanding aggregate usage patterns of a
free, open-source tool to improve it — with no impact on individual users given the
fully anonymous nature of collection (no IP, no cookies, no persistent ID).

No consent mechanism is required under GDPR or the German TTDSG because no data is
stored on or read from the user's device (no cookies, no localStorage, no indexedDB).

---

## Data retention

PostHog default retention: **1 year** from event capture.

---

## Your rights

Because no personal data is collected and no individual can be identified from the data,
standard GDPR data subject rights (access, rectification, erasure, portability) have no
practical application — there is no record that can be linked to you.

If you have questions, open an issue on GitHub:
https://github.com/Khalid-Moukhtar/motif/issues

---

## Changes

Material changes to this policy will be reflected in the effective date above and noted
in the project changelog.
